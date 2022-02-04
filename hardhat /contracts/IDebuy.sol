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

    function applyToAdvert(uint256 _id) external payable;

    function withdraw(uint256 _id) external;

    function forceClose(uint256 _id) external;

    function confirmClose(uint256 _id) external;

    function updateBuyer(uint256 _id, address _newBuyer) external;

    function updatePrice(uint256 _id, uint256 _newPrice) external;

    function updateTitle(uint256 _id, string calldata _newTitle) external;

    function updateDescription(uint256 _id, string calldata _newDescription)
        external;

    function updateIpfs(uint256 _id, string calldata _newIpfs) external;

    function updateRegion(uint256 _id, string calldata _newRegion) external;

    function decreaseSellerRatio(uint256 _id, uint256 _newRatio) external;

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
}
