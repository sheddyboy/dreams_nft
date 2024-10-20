"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { PinataSDK } from "pinata-web3";
import { NFTMetadata } from "../new-types";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount,
  useReadContract,
  //useTransactionReceipt,
} from "wagmi";
import {
  contractAbi,
  contractAddress,
} from "../abi/CollaborativeNFTMarketplace";
import { Address, isAddress } from "viem";
import { toast } from "sonner";
import { parseUnits } from "ethers";
import { Separator } from "./ui/separator";
type CollaborationModalProps = {
  modal: boolean;
  setModal: (open: boolean) => void;
};
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const formSchema = z
  .object({
    art: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
      .refine(
        (file) => ["image/png"].includes(file.type),
        "Only .png files are allowed.",
      ),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    sellingPrice: z.number().gt(0, "Selling price must be 0 or greater"),
    user: z.object({
      address: z.string().refine((val) => isAddress(val), {
        message: "Invalid Ethereum address",
      }),
      percentage: z.number().min(0),
    }),
    numOfCollaborators: z
      .number()
      .int()
      .min(1, "At least one collaborator is required")
      .max(3, "Maximum of 3 collaborators"),
    collaborators: z.array(
      z.object({
        address: z.string().refine((val) => isAddress(val), {
          message: "Invalid Ethereum address",
        }),
        percentage: z.number().min(0),
      }),
    ),
  })
  .refine(
    ({ user, collaborators }) => {
      console.log("Validating percentages:", { user, collaborators });
      console.log("hiii");
      const totalPercentage =
        user.percentage +
        collaborators.reduce(
          (acc, collaborator) => acc + collaborator.percentage,
          0,
        );
      console.log({ totalPercentage });
      return totalPercentage === 100;
    },
    {
      message: "Total % of user and collaborators must = 100%",
      path: ["user.address"],
    },
  );

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
});
const CollaborationModal = ({ modal, setModal }: CollaborationModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isConnected, address } = useAccount();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      sellingPrice: 0,
      user: { percentage: 50 },
      numOfCollaborators: 1,
      collaborators: [{ percentage: 50 }, { percentage: 0 }, { percentage: 0 }],
    },
  });

  //check for transaction success
  useEffect(() => {
    if (isTransactionLoading) {
      toast.success(`Minting In Progress`);
    }
    if (isTransactionSuccess) {
      toast.success(`Minted Successfully`);
    }
  }, [isTransactionLoading, isTransactionSuccess]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isConnected) {
      toast.error("Please connect your wallet");
      throw new Error("Wallet is not connected!");
    }
    try {
      const IpfsHash = await uploadFileToPinata(file);
      toast("File is being uploaded");
      //const IpfsHash = "QmWBFKSEqasLWa2ackDBFPuN8Xtj1B7zobBv9q762Z9n2X";
      const metadata: NFTMetadata = {
        name: values.title,
        description: values.description,
        image: `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${IpfsHash}`,
      };

      const metaUpload = await uploadMetaDataToPinata(metadata);
      //const metaUpload = "QmbtUcWosm7Q4b5DQtcEDE5YCHQLC6WkmPjQGVDqotZuvt";
      console.log("metadata is being uploaded");

      await writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "createNFT",
        args: [
          BigInt(1),
          parseUnits(values.sellingPrice.toString(), "ether"),
          metadata.image,
          metaUpload,
          [
            form.getValues("user.address"),
            ...form.getValues("collaborators").map(({ address }) => address),
          ],
          [
            BigInt(form.getValues("user.percentage")),
            ...form
              .getValues("collaborators")
              .map(({ percentage }) => BigInt(percentage)),
          ],
        ],
      });
    } catch (error) {
      console.error({ error });
      toast.error("Submit failed");
    }
    console.log(values);
  }

  const uploadFileToPinata = async (file: File | null): Promise<string> => {
    if (file == null) {
      throw new Error("File is null");
    }
    const content = new Blob([await file.arrayBuffer()], { type: file.type });
    const fileName = `${Date.now()}-${file.name}`;
    const fileToUpload = new File([content], fileName, { type: file.type });
    const upload = await pinata.upload.file(fileToUpload);
    return upload.IpfsHash;
  };

  const uploadMetaDataToPinata = async (data: NFTMetadata): Promise<string> => {
    const upload = await pinata.upload.json(data);
    return upload.IpfsHash;
  };
  return (
    <Dialog open={modal} onOpenChange={setModal}>
      <DialogContent className="flex flex-col gap-0 rounded-[15px] px-[26px] pb-[50px] pt-[12px]">
        <DialogTitle className="sr-only">Create Collaboration</DialogTitle>
        <DialogDescription className="sr-only">
          Create Collaboration
        </DialogDescription>
        <div className="flex justify-end">
          <Button
            className="h-auto p-0"
            variant={"link"}
            onClick={() => setModal(false)}
          >
            <Image
              alt="close"
              src={"/icons/close.svg"}
              width={24}
              height={24}
            />
          </Button>
        </div>
        <p className="mb-[9px] text-[22px] font-medium leading-[27px] text-[#12141A]">
          Create Collaboration
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 items-center gap-3">
              <FormField
                control={form.control}
                name="art"
                render={({ field }) => (
                  <FormItem className="relative flex flex-1 flex-col gap-1 space-y-0">
                    <FormLabel className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                      Upload Art
                    </FormLabel>
                    <Button
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                      type="button"
                      variant={"link"}
                      className="flex h-[42px] justify-start gap-[6px] rounded-[4px] border border-[#E9E9E9] bg-white px-[25px] hover:no-underline"
                    >
                      <Image
                        alt="upload"
                        src={"/icons/upload.svg"}
                        width={26}
                        height={26}
                      />
                      <span className="flex-1 truncate text-start">
                        {file ? file.name : "Max upload size 5MB"}
                      </span>
                    </Button>
                    <FormControl>
                      <Input
                        className="hidden"
                        type="file"
                        ref={fileInputRef}
                        disabled={field.disabled}
                        name={field.name}
                        onBlur={field.onBlur}
                        accept="image/png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                            field.onChange(file);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="absolute bottom-[-18px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="relative flex flex-1 shrink-0 flex-col gap-1 space-y-0">
                    <FormLabel className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mandikiss"
                        className="h-[42px] rounded-[4px] border border-[#E9E9E9]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="absolute bottom-[-18px]" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="relative flex flex-1 shrink-0 flex-col gap-1 space-y-0">
                  <FormLabel className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="first of its kind"
                      className="min-h-[66px] resize-none rounded-[4px] border border-[#E9E9E9]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="absolute bottom-[-18px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellingPrice"
              render={({ field }) => (
                <FormItem className="relative flex flex-1 shrink-0 flex-col gap-1 space-y-0">
                  <FormLabel className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                    Selling Price
                  </FormLabel>
                  <FormControl>
                    <div className="flex h-[42px] items-center justify-between rounded-[4px] border border-[#E9E9E9]">
                      <div className="relative ml-[12px] flex h-[30px] w-[30px] items-center justify-center rounded-[4px] bg-[#030303] font-outfit text-[16px] font-semibold text-white">
                        <Image
                          width={10}
                          height={10}
                          alt="base-icon"
                          src={"/icons/base-icon.svg"}
                          className="absolute right-[-5px] top-[-4px]"
                        />
                        E
                      </div>
                      <div className="mr-[12px] flex items-center gap-2 font-outfit">
                        <div className="flex flex-col items-end text-[#3C3B3B]">
                          <div className="flex items-center gap-1 text-[12px] font-semibold leading-[20px]">
                            <Input
                              min={0}
                              step={0.01}
                              className="no-arrows h-auto w-[4ch] rounded-none border-none p-0 text-end shadow-none focus-visible:ring-transparent"
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                            <span>ETH</span>
                          </div>
                          <span className="text-[10px] font-normal leading-[20px]">
                            0.00 USDC
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant={"link"}
                          className="h-auto rounded-[16px] bg-[#EE1D5C] p-0 px-[2px] py-[5px]"
                        >
                          <Image
                            width={13}
                            height={18}
                            src={"/icons/arrows.svg"}
                            alt="arrows"
                          />
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="absolute bottom-[-18px]" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-[2fr,1fr] gap-3">
              <div className="relative flex items-end">
                <FormField
                  control={form.control}
                  name="user.address"
                  render={({ field }) => (
                    <FormItem className="relative flex flex-1 shrink-0 flex-col gap-1 space-y-0">
                      <FormLabel className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                        Your address
                      </FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="h-[42px] rounded-[4px] border border-[#E9E9E9] pr-[75px] text-[12px] leading-[20px] placeholder:text-[#7B8499]"
                            placeholder="ehdudkessd....ddj"
                            {...field}
                          />
                          <Separator
                            orientation="vertical"
                            className="relative left-[-60px] my-auto h-[23px] bg-[#AAAAAA]"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="absolute bottom-[-18px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user.percentage"
                  render={({ field }) => (
                    <FormItem className="absolute right-[12px] flex flex-col gap-1 space-y-0">
                      <FormLabel className="sr-only font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                        Percentage
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center font-outfit text-[12px] font-semibold leading-[20px] text-[#7B8499]">
                          <Input
                            min={0}
                            max={100}
                            className="no-arrows h-[42px] w-[3ch] border-0 p-0 text-end shadow-none focus-visible:ring-transparent"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                          <span>%</span>
                        </div>
                      </FormControl>
                      <FormMessage className="absolute bottom-[-18px]" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="numOfCollaborators"
                render={({ field }) => (
                  <FormItem className="relative flex flex-1 shrink-0 flex-col gap-1 space-y-0">
                    <FormLabel className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                      No of Collaborators
                    </FormLabel>
                    <FormControl>
                      <Input
                        min={1}
                        max={3}
                        className="h-[42px] rounded-[4px] border border-[#E9E9E9]"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage className="absolute bottom-[-18px]" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              {Array.from({
                length: form.watch("numOfCollaborators"),
              }).map((_, index) => (
                <div className="relative flex items-end" key={index}>
                  <FormField
                    control={form.control}
                    name={`collaborators.${index}.address`}
                    render={({ field }) => (
                      <FormItem className="relative flex flex-1 shrink-0 flex-col gap-1 space-y-0">
                        <FormLabel className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                          {`Collaborator ${index + 1} `}
                        </FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Input
                              className="h-[42px] rounded-[4px] border border-[#E9E9E9] pr-[75px] text-[12px] leading-[20px] placeholder:text-[#7B8499]"
                              placeholder="ehdudkessd....ddj"
                              {...field}
                            />
                            <Separator
                              orientation="vertical"
                              className="relative left-[-60px] my-auto h-[23px] bg-[#AAAAAA]"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="absolute bottom-[-18px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`collaborators.${index}.percentage`}
                    render={({ field }) => (
                      <FormItem className="absolute right-[12px] flex flex-col gap-1 space-y-0">
                        <FormLabel className="sr-only font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                          Percentage
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center font-outfit text-[12px] font-semibold leading-[20px] text-[#7B8499]">
                            <Input
                              min={0}
                              max={100}
                              className="no-arrows h-[42px] w-[3ch] border-0 p-0 text-end shadow-none focus-visible:ring-transparent"
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                            <span>%</span>
                          </div>
                        </FormControl>
                        <FormMessage className="absolute bottom-[-18px]" />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
            <Button
              type="submit"
              className="mx-auto h-auto w-[160px] rounded-[34px] bg-[#F2295F] py-[11.5px]"
            >
              Mint NFT
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationModal;
