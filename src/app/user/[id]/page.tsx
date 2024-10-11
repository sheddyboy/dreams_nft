"use client"
import {
  contractAbi,
  contractAddress,
} from "@/abi/CollaborativeNFTMarketplace";
import NFTCard from "@/components/NFTCard";
import { Address } from "viem";
import { useReadContract, useAccount } from "wagmi";
type UserPageProps = {};

const UserPage = ({}: UserPageProps) => {
    const { isConnected, address } = useAccount();
  const result = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "getNFTsByCreator",
    args: [address as Address],
  });
  console.log(result?.data);
   
  return (
    <div className="flex flex-col gap-[26px] max-md:gap-3.5">
      <span className="text-[18px] font-medium leading-[22px] text-[#212020]">
        My Collaborations
      </span>
      <div className="grid grid-cols-3 gap-x-[13px] gap-y-[28px] max-md:grid-cols-2 max-sm:grid-cols-1">
        {result?.data?.map((item, index) => (
          <NFTCard
            pinataUrl={item.pinataUrl}
            price={item.price.toString()}
            creator={item.creator}
            metaDataCid={item.metadataCID}
            tokenId={Number(item.tokenId)}
          />
        ))}
      </div>
    </div>
  );
};

export default UserPage;
