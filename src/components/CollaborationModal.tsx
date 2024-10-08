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
import { useRef, useState } from "react";
import Image from "next/image";
type CollaborationModalProps = {
  modal: boolean;
  setModal: (open: boolean) => void;
};
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const formSchema = z.object({
  art: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ["image/png"].includes(file.type),
      "Only .png files are allowed.",
    ),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  sellingPrice: z.number().min(0, "Selling price must be 0 or greater"),
  collaborators: z
    .number()
    .int()
    .min(1, "At least one collaborator is required"),
  firstCollaborator: z
    .string()
    .min(1, "First collaborator address is required"),
  secondCollaborator: z
    .string()
    .min(1, "Second collaborator address is required"),
});

const CollaborationModal = ({ modal, setModal }: CollaborationModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      sellingPrice: 0,
      collaborators: 2,
      firstCollaborator: "",
      secondCollaborator: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
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
            <Image alt="close" src={"icons/close.svg"} width={24} height={24} />
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
                  <FormItem className="flex flex-1 flex-col gap-1 space-y-0">
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
                        src={"icons/upload.svg"}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex flex-1 shrink-0 flex-col gap-1 space-y-0">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-1 shrink-0 flex-col gap-1 space-y-0">
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-[2fr,1fr] gap-3">
              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem className="flex flex-1 shrink-0 flex-col gap-1 space-y-0">
                    <FormLabel className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                      Selling Price
                    </FormLabel>
                    <FormControl>
                      <div className="flex h-[42px] items-center justify-between rounded-[4px] border border-[#E9E9E9]">
                        <div className="font-outfit relative ml-[12px] flex h-[30px] w-[30px] items-center justify-center rounded-[4px] bg-[#030303] text-[16px] font-semibold text-white">
                          <Image
                            width={10}
                            height={10}
                            alt="base-icon"
                            src={"icons/base-icon.svg"}
                            className="absolute right-[-5px] top-[-4px]"
                          />
                          E
                        </div>
                        <div className="font-outfit mr-[12px] flex items-center gap-2">
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
                              src={"icons/arrows.svg"}
                              alt="arrows"
                            />
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collaborators"
                render={({ field }) => (
                  <FormItem className="flex flex-1 shrink-0 flex-col gap-1 space-y-0">
                    <FormLabel className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                      No of Collaborators
                    </FormLabel>
                    <FormControl>
                      <Input
                        min={0}
                        className="h-[42px] rounded-[4px] border border-[#E9E9E9]"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstCollaborator"
                render={({ field }) => (
                  <FormItem className="flex flex-1 shrink-0 flex-col gap-1 space-y-0">
                    <FormLabel className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                      1st
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[42px] rounded-[4px] border border-[#E9E9E9]"
                        placeholder="ehdudkessd....ddj"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secondCollaborator"
                render={({ field }) => (
                  <FormItem className="flex flex-1 shrink-0 flex-col gap-1 space-y-0">
                    <FormLabel className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                      2nd
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[42px] rounded-[4px] border border-[#E9E9E9]"
                        placeholder="ehdudkessd....ddj"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
