"use client";
import NFTCard from "@/components/NFTCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import CollaborationModal from "@/components/CollaborationModal";
import { useReadContract } from "wagmi";
import AuthButton from "@/components/AuthButton";
import {
  contractAddress,
  contractAbi,
} from "@/abi/CollaborativeNFTMarketplace";

export default function Home() {
  const [modal, setModal] = useState(false);
  const result = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "getListedNFTs",
    args: [],
  });
 console.log(result?.data);
 
  return (
    
    <div className="container mx-auto max-w-[851px] px-[20px]">
      <nav className="mb-[52px] flex flex-wrap items-center justify-between pt-[48px] max-sm:mb-7 max-sm:justify-center max-sm:gap-2 max-sm:pt-5">
        <Link
          className="font-leckerliOne text-[26px] leading-[35px] text-[#F2295F] underline"
          href={"/"}
        >
          DREAM
        </Link>
        <AuthButton />
      </nav>
      <main className="flex flex-col gap-[53px] max-sm:gap-4">
        <div className="flex flex-col gap-[22px] max-sm:gap-[20px]">
          <h1 className="max-w-[719px] text-[36px] font-medium leading-[44px] max-sm:text-center max-sm:text-[24px] max-sm:leading-[28px]">
            Collaborate With Your Dream Artist and Share your Mintded NFT
          </h1>
          <Button
            onClick={() => {
              setModal(true);
            }}
            className="mr-auto h-auto rounded-[30px] px-[19px] py-[10px] font-lato text-[12px] font-bold leading-[14px] max-sm:mx-auto"
          >
            Create Collaboration
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-x-[13px] gap-y-[28px] max-md:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-y-4">
          {result?.data?.map((item, index) => (
            <NFTCard
               key={index}
              pinataUrl={item.pinataUrl}
              price={item.price.toString()}
              creator={item.creator}
              metaDataCid={item.metadataCID}
              tokenId={Number(item.tokenId)}
            />
          ))}
        </div>
      </main>
      <CollaborationModal modal={modal} setModal={setModal} />
    </div>
  );
}
