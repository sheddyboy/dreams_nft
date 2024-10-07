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
  collaborators: string[];
  attributes: {
    trait_type: string;
    value: number;
  }[];
}