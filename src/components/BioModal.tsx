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
import Image from "next/image";

import { toast } from "sonner";
import { getUser, updateUser } from "@/actions/auth";
import { useAccount } from "wagmi";
import { getQueryClient } from "@/lib/reactQuery";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
type BioModalProps = {
  modal: boolean;
  setModal: (open: boolean) => void;
};
const formSchema = z.object({
  name: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Title is required"),
  bio: z.string().min(1, "Description is required"),
  styles: z.array(z.string().min(1)).optional(),
  style: z.string().optional(),
});

const BioModal = ({ modal, setModal }: BioModalProps) => {
  const queryClient = getQueryClient();
  const { address } = useAccount();
  const { data: userData } = useQuery({
    queryKey: ["user", address],
    queryFn: () => getUser({ wallet: address! }),
    enabled: !!address,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      styles: [],
      style: "",
      type: "",
    },
  });

  useEffect(() => {
    form.setValue("bio", userData?.data?.bio ?? "");
    form.setValue("name", userData?.data?.name ?? "");
    form.setValue("styles", userData?.data?.styles ?? []);
    form.setValue("type", userData?.data?.artist_type ?? "");
  }, [userData]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });
    try {
      if (!address) return toast.error("Please login");
      const { data, error } = await updateUser({
        bio: values.bio,
        name: values.name,
        type: values.type,
        styles: values.styles ?? [],
        wallet: address,
      });
      if (error) throw error;
      form.reset();
      setModal(false);
      queryClient.invalidateQueries({ queryKey: ["user", address] });
      if (data) return toast.success("Bio updated");
    } catch (error) {
      console.log({ error });
      toast.error((error as any).message);
    }
  }

  return (
    <Dialog open={modal} onOpenChange={setModal}>
      <DialogContent className="flex max-w-[440px] flex-col gap-0 rounded-[15px] px-[26px] pb-[50px] pt-[12px]">
        <DialogTitle className="sr-only">My Bio</DialogTitle>
        <DialogDescription className="sr-only">My Bio</DialogDescription>
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
          My Bio
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 items-center gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="relative flex flex-1 shrink-0 flex-col gap-1 space-y-0">
                    <FormLabel className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="h-[42px] rounded-[4px] border border-[#E9E9E9]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="absolute bottom-[-18px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="relative flex flex-1 shrink-0 flex-col gap-1 space-y-0">
                    <FormLabel className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                      Type of artist
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
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
              name="bio"
              render={({ field }) => (
                <FormItem className="relative flex flex-1 shrink-0 flex-col gap-1 space-y-0">
                  <FormLabel className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                    About yourself
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Let collaborate and i make the best out of your work.my name is John Doe"
                      className="min-h-[66px] resize-none rounded-[4px] border border-[#E9E9E9]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="absolute bottom-[-18px]" />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-1">
              <span className="font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                Your style
              </span>
              <div className="flex h-[78px] flex-wrap items-baseline gap-1 overflow-auto rounded-[4px] border border-[#E9E9E9] px-[12px] py-[10px] shadow-sm">
                {form.watch("styles")?.map((style, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`styles.${index}`}
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="sr-only font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                          Style Item
                        </FormLabel>
                        <FormControl className="!m-0">
                          <div>
                            <Input
                              placeholder="Style"
                              className="sr-only h-[33px] w-auto rounded-[4px] border-0 border-[#E9E9E9] shadow-none focus-visible:ring-transparent"
                              {...field}
                            />
                            <div className="flex items-center gap-1 rounded-[27px] bg-[#F6F6F6] p-[7.5px] text-[12px] font-normal leading-[18px]">
                              <span>{style}</span>
                              <Image
                                onClick={() => {
                                  form.setValue(
                                    "styles",
                                    form
                                      .getValues("styles")
                                      ?.filter(
                                        (_, styleIndex) => styleIndex !== index,
                                      ),
                                  );
                                }}
                                className="cursor-pointer"
                                src={"/icons/tag-close.svg"}
                                alt="tag-close"
                                width={14}
                                height={15}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="absolute bottom-[-18px]" />
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem className="relative flex items-center space-y-0">
                      <FormLabel className="sr-only font-outfit text-[12px] font-medium leading-[16px] text-[#606778]">
                        Style
                      </FormLabel>
                      <FormControl>
                        <Input
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              form.setValue("styles", [
                                ...(form.getValues("styles") ?? []),
                                form.getValues("style") ?? "",
                              ]);
                              form.setValue("style", "");
                            }
                          }}
                          placeholder="Style"
                          className="h-auto w-[15ch] rounded-[4px] border-0 border-[#E9E9E9] p-0 shadow-none focus-visible:ring-transparent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="absolute bottom-[-18px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mx-auto h-auto w-[160px] rounded-[34px] bg-[#F2295F] py-[11.5px]"
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BioModal;
