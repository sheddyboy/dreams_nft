"use client";
import { Button } from "@/components/ui/button";
import {useParams} from 'next/navigation'
import Image from "next/image";
import { createPublicClient, http, parseAbi } from "viem";
import { baseSepolia } from "viem/chains";
import {
  contractAddress,
  contractAbi,
} from "@/abi/CollaborativeNFTMarketplace";
import { NFT } from "../../../../new-types";
import { formatEther, parseUnits } from "ethers";
import { useNFTDetails } from "../../../../lib/nftHook";
import { useEffect, useState } from "react";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount
} from "wagmi";
import { toast } from "sonner";
const NftItemPage = () => {
  const params = useParams();
  const [nftData, setNftData] = useState(null);
  const [tokenId, settokenId] = useState("")
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [meta, setMeta] = useState("");
   const { writeContract, data: hash } = useWriteContract();
   const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
     useWaitForTransactionReceipt({
       hash,
     });
  useEffect(() => {
    const id = params.nftid;
    settokenId(id as string);
    
    const fetchNFTData = async () => {
      const client = createPublicClient({
        chain: baseSepolia,
        transport: http(
          `https://base-sepolia.g.alchemy.com/v2/rEYE-8dcbVFNNd5dlyvS1tLywyh-fOGf`,
        ),
      });

      try {
        const data = await client.readContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: "nftDetails",
          args: [BigInt(id as string)],
        });
        console.log(data);
        
        let processedImageUrl = data[5];
        // if (processedImageUrl.startsWith("ipfs://")) {
        //   processedImageUrl = processedImageUrl.replace(
        //     "ipfs://",
        //     "https://gateway.pinata.cloud/ipfs/",
        //   );
        // }

        setNftData(data as any);
        setPrice(formatEther(data[2]).toString());
        let metadata=data[6];
        setImageUrl(processedImageUrl);
      } catch (error) {
        console.error("Error fetching NFT data:", error);
      }
    };

    fetchNFTData();
  }, []);
   async function Buy() {
       await writeContract({
         address: contractAddress,
         abi: contractAbi,
         functionName: "mintToken",
         args: [BigInt(1), BigInt(1)],
         value: parseUnits(price, "ether"),
       });
   }
     useEffect(() => {
    if (isTransactionLoading) {
      toast.success(`Minting In Progress`);
    }
    if (isTransactionSuccess) {
      toast.success(`Minted Successfully`);
    }
  }, [isTransactionLoading, isTransactionSuccess]);

  return (
   
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[18px] font-medium leading-[22px] text-[#212020]">
          Own this piece
        </span>
        <Button onClick={Buy} className="flex gap-1 rounded-[22px] bg-[#2F2F2F] px-[25px] font-lato text-[12px] font-bold leading-[14px]">
          <Image
            alt="cartIcon"
            src={`/icons/cart.svg`}
            width={15}
            height={15}
          />
          {`Buy | ${price}ETH`}
        </Button>
      </div>
      <div
        className="flex aspect-[635/339] items-end rounded-[8px] bg-cover bg-center max-md:aspect-[351/307]"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="flex flex-col gap-2 px-[12px] pb-[22px]">
          <span className="font-lato text-[14px] font-bold leading-[17px] text-white">
            {`${price} ETH`}
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
