//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDebuy {
    enum Status {
        Created,
        SellerBacked,
        BuyerBacked,
        Active,
        ForceClosed,
        Finished,
        Deleted
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

    event AdvertCreated(
        address indexed seller,
        address indexed buyer,
        uint256 indexed id
    );

    event SellerBacked(
        address indexed seller,
        address indexed buyer,
        uint256 indexed id,
        uint256 amount
    );

    event BuyerBacked(
        address indexed seller,
        address indexed buyer,
        uint256 indexed id,
        uint256 amount
    );

    event AdvertActivated(
        address indexed seller,
        address indexed buyer,
        uint256 indexed id,
        uint256 totalDeposit
    );

    event Withdrawn(
        address indexed seller,
        address indexed buyer,
        uint256 indexed id,
        address side
    );

    event ForceClosed(
        address indexed seller,
        address indexed buyer,
        uint256 indexed id,
        address side
    );

    event AdvertFinished(
        address indexed seller,
        address indexed buyer,
        uint256 indexed id
    );

    event AdvertUpdated(
        address indexed seller,
        address indexed buyer,
        uint256 indexed id
    );

    event BuyerUpdated(
        address indexed seller,
        address indexed buyer,
        uint256 indexed id
    );

    event AdvertDeleted(
        address indexed seller,
        address indexed buyer,
        uint256 indexed id
    );
}
