interface Window {
  ethereum: any;
}

export interface IPFSData {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
}
export interface NFT {
  createdAt: number; // Assuming a Unix timestamp in seconds
  creator: string; // Ethereum address format (hexadecimal)
  isListed: boolean;
  metadataCID: string; // IPFS Content identifier (CID)
  pinataUrl: string; // Full URL for accessing metadata on Pinata
  price: string; // Assuming price in Wei (1 Wei = 10^-18 ETH)
  tokenId: number;
}
export type NFTCardProps = {
  creator: string; // Ethereum address format (hexadecimal) // IPFS Content identifier (CID)
  pinataUrl: string; // Full URL for accessing metadata on Pinata
  price: string; // Assuming price in Wei (1 Wei = 10^-18 ETH)
  metaDataCid: string;
  tokenId: number
};