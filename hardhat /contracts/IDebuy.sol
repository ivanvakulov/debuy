//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDebuy {
    enum Status {
        Created,
        SellerBacked,
        BuyerBacked,
        Active,
        ForceClosed,
        Finished
    }

    struct Advert {
        uint256 createdAt;
        Status status;
        uint256 price;
        string title;
        string description;
        string region;
        string ipfs;
        address seller;
        address buyer;
        uint256 sellerRatio;
        uint256 buyerRatio;
    }

    function createAdvert(
        uint256 _price,
        string calldata _title,
        string calldata _description,
        string calldata _region,
        string calldata _ipfs,
        address _buyer
    ) external payable returns (uint256 index);

    // TODO add functions and events
}
