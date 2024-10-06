import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

type NFTCardProps = {};

const NFTCard = ({}: NFTCardProps) => {
  return (
    <Card className="flex-1">
      <CardContent className="relative flex aspect-[203/225] flex-col justify-between overflow-hidden rounded-[8px] p-0 max-md:aspect-[351/263]">
        <Image
          alt="ntf_image"
          src={"/dummy_images/nft_image.jpeg"}
          fill
          className="ob object-cover object-center"
        />
        <div className="relative flex justify-end p-2">
          <Link href={"/user/0xc/wqe"}>
            <Button className="h-auto gap-1 rounded-[15px] bg-[#2F2F2F] px-[8px] py-[4px] font-lato font-bold">
              <Image
                alt="cartIcon"
                src={`/icons/cart.svg`}
                width={15}
                height={15}
              />{" "}
              Buy
            </Button>
          </Link>
        </div>
        <div className="relative flex flex-col gap-2 bg-custom-gradient px-[12px] pb-[10px] pt-[6px] text-white">
          <Link href={"/user/0xc"}>
            <div className="flex items-center gap-[12px] font-lato">
              <Avatar className="h-[28px] w-[28px] shrink-0">
                <AvatarImage src="/dummy_images/nft_icon.png" alt="logo" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate text-[14px] font-normal leading-[17px]">
                xeddhdueraasaddadad0908asa08sa0s
              </span>
            </div>
          </Link>
          <p className="font-lato text-[12px] font-bold leading-[14px]">
            0.005 ETH
          </p>
          <p className="text-[12px] leading-[15px]">
            Let’s the make out the best projects of the mons{" "}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTCard;
