import { useReadContract } from 'wagmi'
import { type Address } from 'viem'
import { contractAbi,contractAddress } from '@/abi/CollaborativeNFTMarketplace'

// Define the return type based on your contract's nftDetails struct
type NFTDetails = {
  tokenId: bigint
  creator: Address
  price: bigint
  isListed: boolean
  createdAt: bigint
  pinataUrl: string
  metadataCID: string
}

export function useNFTDetails(
  tokenId: number | string
) {
  const { data, error, isPending, isSuccess } = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: 'nftDetails',
    args: [BigInt("2")],
  })

  // Cast the data to our expected type
  const nftDetails = data as NFTDetails | undefined

  // Optional: Transform the data for easier consumption
  const formattedData = nftDetails ? {
    ...nftDetails,
    tokenId: nftDetails.tokenId.toString(),
    price: nftDetails.price.toString(),
    createdAt: new Date(Number(nftDetails.createdAt) * 1000), // Assuming timestamp is in seconds
  } : undefined

  return {
    nftDetails: formattedData,
    error,
    isPending,
    isSuccess
  }
}