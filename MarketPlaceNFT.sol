// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

contract CollaborativeNFTMarketplace is ERC1155, ERC1155Holder, ERC1155Receiver {
    // Base URI for metadata
    string private _baseUri;
    uint256 private tokenCounter;
    // Struct to store NFT details
    struct NFTDetails {
        uint256 tokenId;
        address creator;
        uint256 price;
        uint256 availableSupply;
        bool isListed;
        uint256 createdAt;
    }

    // Mapping to store creator addresses and their shares
    struct Creator {
        address creatorAddress;
        uint256 share;
    }
    
    // Array to keep track of all token IDs
    uint256[] private _allTokenIds;
    
    // Mapping from token ID to NFT details
    mapping(uint256 => NFTDetails) public nftDetails;
    mapping(uint256 => Creator[]) public nftCreators;
    
    // Events
    event NFTCreated(uint256 indexed tokenId, address creator, uint256 price, uint256 supply);
    event NFTListed(uint256 indexed tokenId, uint256 price);
    event NFTUnlisted(uint256 indexed tokenId);
    event NFTPriceUpdated(uint256 indexed tokenId, uint256 newPrice);

    constructor(string memory baseUri) ERC1155(baseUri) {
        _baseUri = baseUri;
        tokenCounter = 0;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155, ERC1155Receiver, ERC1155Holder) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Function to create a new NFT with multiple creators
    function createNFT(
        uint256 amount,
        uint256 price,
        address[] memory creatorAddresses, 
        uint256[] memory shares
    ) public {
        uint256 tokenId = getTokenCounter() + 1;
        require(creatorAddresses.length > 0, "At least one creator is required");
        require(creatorAddresses.length == shares.length, "Mismatched creator and share arrays");
        require(getTotalShares(shares) == 100, "Total shares must equal 100");
        // Check if token ID already exists (by checking if it is in the _allTokenIds array)
        require(nftDetails[tokenId].createdAt == 0, "Token ID already exists");

        _mint(msg.sender, tokenId, 1, "");

        // Store NFT details
        nftDetails[tokenId] = NFTDetails({
            tokenId: tokenId,
            creator: msg.sender,
            price: price,
            availableSupply: amount,
            isListed: true,
            createdAt: block.timestamp
        });

        // Store creators
        for (uint256 i = 0; i < creatorAddresses.length; i++) {
            nftCreators[tokenId].push(Creator(creatorAddresses[i], shares[i]));
        }

        _allTokenIds.push(tokenId);
        
        emit NFTCreated(tokenId, msg.sender, price, amount);
    }

    // Function for users to mint additional tokens of an existing NFT
    function mintToken(uint256 tokenId, uint256 amount) public payable {
        NFTDetails storage details = nftDetails[tokenId];
        require(details.createdAt > 0, "NFT does not exist");
        require(details.isListed, "NFT is not listed for sale");
        require(msg.value >= details.price * amount, "Insufficient funds");
        //require(amount <= details.availableSupply, "Insufficient supply");

        _mint(msg.sender, tokenId, amount, "");
        details.availableSupply -= amount;

        // Distribute revenue among creators
        uint256 totalRevenue = msg.value;
        for (uint256 i = 0; i < nftCreators[tokenId].length; i++) {
            Creator memory creator = nftCreators[tokenId][i];
            uint256 creatorShare = (totalRevenue * creator.share) / 100;
            payable(creator.creatorAddress).transfer(creatorShare);
        }
    }

    // Function to list/unlist NFT
    function setNFTListing(uint256 tokenId, bool isListed) public {
        require(nftDetails[tokenId].creator == msg.sender, "Not the creator");
        nftDetails[tokenId].isListed = isListed;
        if (isListed) {
            emit NFTListed(tokenId, nftDetails[tokenId].price);
        } else {
            emit NFTUnlisted(tokenId);
        }
    }

    // Function to update NFT price
    function updateNFTPrice(uint256 tokenId, uint256 newPrice) public {
        require(nftDetails[tokenId].creator == msg.sender, "Not the creator");
        nftDetails[tokenId].price = newPrice;
        emit NFTPriceUpdated(tokenId, newPrice);
    }

    // Query functions
    function getAllNFTs() public view returns (NFTDetails[] memory) {
        NFTDetails[] memory allNFTs = new NFTDetails[](_allTokenIds.length);
        for (uint256 i = 0; i < _allTokenIds.length; i++) {
            allNFTs[i] = nftDetails[_allTokenIds[i]];
        }
        return allNFTs;
    }

    function getListedNFTs() public view returns (NFTDetails[] memory) {
        uint256 listedCount = 0;
        for (uint256 i = 0; i < _allTokenIds.length; i++) {
            if (nftDetails[_allTokenIds[i]].isListed) {
                listedCount++;
            }
        }

        NFTDetails[] memory listedNFTs = new NFTDetails[](listedCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < _allTokenIds.length; i++) {
            if (nftDetails[_allTokenIds[i]].isListed) {
                listedNFTs[currentIndex] = nftDetails[_allTokenIds[i]];
                currentIndex++;
            }
        }
        return listedNFTs;
    }

    function getNFTsByCreator(address creator) public view returns (NFTDetails[] memory) {
        uint256 creatorNFTCount = 0;
        for (uint256 i = 0; i < _allTokenIds.length; i++) {
            if (nftDetails[_allTokenIds[i]].creator == creator) {
                creatorNFTCount++;
            }
        }

        NFTDetails[] memory creatorNFTs = new NFTDetails[](creatorNFTCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < _allTokenIds.length; i++) {
            if (nftDetails[_allTokenIds[i]].creator == creator) {
                creatorNFTs[currentIndex] = nftDetails[_allTokenIds[i]];
                currentIndex++;
            }
        }
        return creatorNFTs;
    }

    // Override uri function to return the correct metadata URI
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        return string(abi.encodePacked(_baseUri, _uint2str(tokenId), ".json"));
    }

    // Function to update the base URI (only contract owner should be able to call this)
    function setBaseURI(string memory newUri) public {
        // Add access control here
        _baseUri = newUri;
    }

    // Helper functions
    function getTotalShares(uint256[] memory shares) internal pure returns (uint256) {
        uint256 totalShares = 0;
        for (uint256 i = 0; i < shares.length; i++) {
            totalShares += shares[i];
        }
        return totalShares;
    }

    function _uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }
    function getTokenCounter() public view returns (uint256) {
		return tokenCounter;
	}
}