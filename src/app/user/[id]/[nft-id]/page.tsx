import { Button } from "@/components/ui/button";
import Image from "next/image";
import {useAccount,useWriteContract,useReadContract} from 'wagmi'
import {
  contractAddress,
  contractAbi,
} from "@/abi/CollaborativeNFTMarketplace";
const NftItemPage = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[18px] font-medium leading-[22px] text-[#212020]">
          Own this piece
        </span>
        <Button className="flex gap-1 rounded-[22px] bg-[#2F2F2F] px-[25px] font-lato text-[12px] font-bold leading-[14px]">
          <Image
            alt="cartIcon"
            src={`/icons/cart.svg`}
            width={15}
            height={15}
          />
          Buy | 0.005ETH
        </Button>
      </div>
      <div className="flex aspect-[635/339] items-end rounded-[8px] bg-[url('/dummy_images/nft_image.jpeg')] bg-cover bg-center max-md:aspect-[351/307]">
        <div className="flex flex-col gap-2 px-[12px] pb-[22px]">
          <span className="font-lato text-[14px] font-bold leading-[17px] text-white">
            0.005 ETH
          </span>
          <span className="text-[14px] font-semibold leading-[17px] text-white max-md:text-[12px] max-md:leading-[14px]">
            A stunning piece that captures the peacefulness of a tranquil ocean
            under a cloudless sky. Gentle waves ripple across the surface,
            reflecting hues of deep blue and soft turquoise. The play of light
            on the water’s surface creates a mesmerizing contrast, evoking a
            sense of calm and contemplation. This artwork invites the viewer to
            immerse themselves in the beauty of nature’s simplicity, making it
            perfect for creating a serene atmosphere in any space
          </span>
        </div>
      </div>
    </div>
  );
};

export default NftItemPage;
