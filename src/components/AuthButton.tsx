"use client";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { sepolia,baseSepolia } from "viem/chains";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
const AuthButton = () => {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected, address } = useAccount();
  return (
    <>
      {isConnected ? (
        <div className="flex items-center gap-3 rounded-[34px] bg-white p-[4.5px]">
          <div className="flex flex-1 items-stretch gap-[20px] overflow-hidden">
            <Avatar className="ml-[10px] h-[28px] w-[28px] font-outfit">
              <AvatarImage />
              <Link href={`/user/1`}>
                <AvatarFallback>🐶</AvatarFallback>
              </Link>
            </Avatar>
            <div className="my-[2px] w-[1px] bg-[#040404]/40"></div>
            <div className="flex items-center">
              <span className="font-outfit text-[16px] leading-[20px] text-[#040404]/40">
                {address?.slice(0, 4) + "..." + address?.slice(-4)}
              </span>
            </div>
          </div>
          <Button
            onClick={async () => {
              try {
                await disconnectAsync();
                return toast.success(`Logged Out`);
              } catch (error) {
                console.log({ error });
                if (
                  error &&
                  typeof error === "object" &&
                  "message" in error &&
                  typeof error.message === "string"
                ) {
                  return toast.error(error.message);
                }
                return toast.error("Something went wrong");
              }
            }}
            className="h-auto w-[89px] rounded-[30px] bg-[#F2295F] text-[14px] font-medium leading-[17px]"
          >
            Log Out
          </Button>
        </div>
      ) : (
        <Button
          onClick={async () => {
            try {
              await connectAsync({
                chainId: baseSepolia.id,
                connector: injected(),
              });
              return toast.success(`Logged In`);
            } catch (error) {
              console.log({ error });
              if (
                error &&
                typeof error === "object" &&
                "message" in error &&
                typeof error.message === "string"
              ) {
                return toast.error(error.message);
              }
              return toast.error("Something went wrong");
            }
          }}
          className="h-auto min-w-[126px] rounded-[30px] bg-[#F2295F] px-[21px] py-[10px] font-lato text-[12px] font-bold leading-[14px] text-white"
        >
          Login
        </Button>
      )}
    </>
  );
};

export default AuthButton;
