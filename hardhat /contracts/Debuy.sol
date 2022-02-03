//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IDebuy.sol";

contract Debuy is IDebuy {
    uint256 constant DEPOSIT_MULTIPLIER = 2;
    uint256 constant ACTIVITY_TIMEOUT = 100 days;
    uint256 public indexCounter;

    Advert[] public adverts;
    mapping(address => uint256) public lastActivity;

    function updateActivity() public {
        lastActivity[msg.sender] = block.timestamp;
    }

    // if _buyer set to zero address then anyone could apply to this advert
    // TODO add check that both addresses could accept ether
    function createAdvert(
        uint256 _price,
        string calldata _title,
        string calldata _description,
        string calldata _region,
        string calldata _ipfs,
        address _buyer
    ) external payable override returns (uint256 index) {
        Status status = Status.Created;
        if (msg.value > 0) {
            require(
                msg.value == _price * DEPOSIT_MULTIPLIER,
                "Wrong deposit value."
            );
            status = Status.SellerBacked;
        }
        adverts.push(
            Advert({
                createdAt: block.timestamp,
                status: status,
                price: _price,
                title: _title,
                description: _description,
                region: _region,
                ipfs: _ipfs,
                seller: msg.sender,
                buyer: _buyer,
                sellerRatio: DEPOSIT_MULTIPLIER,
                buyerRatio: DEPOSIT_MULTIPLIER
            })
        );

        // TODO emit event of creation
        updateActivity();
        indexCounter++;
        return indexCounter - 1;
    }

    function applyToAdvert(uint256 _id) external payable {
        if (msg.sender == adverts[_id].seller) {
            applyToAdvertBySeller(_id);
        } else {
            applyToAdvertByBuyer(_id);
        }
        updateActivity();
    }

    function applyToAdvertBySeller(uint256 _id) private {
        // require(
        //     msg.sender == adverts[_id].seller,
        //     "You are not a seller of this advert."
        // );
        require(
            msg.value == adverts[_id].price * adverts[_id].sellerRatio,
            "Wrong deposit value."
        );
        if (adverts[_id].status == Status.Created) {
            adverts[_id].status = Status.SellerBacked;
            // TODO emit event of seller backed
        } else if (adverts[_id].status == Status.BuyerBacked) {
            adverts[_id].status = Status.Active;
            // TODO emit event of active
        } else {
            revert("Already applied.");
        }
    }

    // TODO add check that buyer address could accept ether
    function applyToAdvertByBuyer(uint256 _id) private {
        require(
            msg.sender == adverts[_id].buyer ||
                adverts[_id].buyer == address(0),
            "You can't applie to this advert."
        );
        require(
            msg.value == adverts[_id].price * adverts[_id].buyerRatio,
            "Wrong deposit value."
        );
        if (adverts[_id].status == Status.Created) {
            adverts[_id].status = Status.BuyerBacked;
            // TODO emit event of seller backed
        } else if (adverts[_id].status == Status.SellerBacked) {
            adverts[_id].status = Status.Active;
            // TODO emit event of active
        } else {
            revert("Already applied.");
        }
        adverts[_id].buyer = msg.sender;
    }

    function forceClose(uint256 _id) external {
        uint256 lastActive;

        if (msg.sender == adverts[_id].seller) {
            lastActive = lastActivity[adverts[_id].buyer];
        } else if (msg.sender == adverts[_id].buyer) {
            lastActive = lastActivity[adverts[_id].seller];
        } else {
            revert("You are not a part of this advert.");
        }

        require(
            block.timestamp > lastActive + ACTIVITY_TIMEOUT,
            "Activity timeout not reached."
        );

        uint256 value = adverts[_id].price *
            adverts[_id].sellerRatio +
            adverts[_id].price *
            adverts[_id].buyerRatio;
        (bool sent, ) = msg.sender.call{value: value}("");
        require(sent, "Failed to send Ether");

        adverts[_id].status = Status.ForceClosed;
        // TODO emit event of forceClose
        updateActivity();
    }

    function confirmClose(uint256 _id) external {
        require(msg.sender == adverts[_id].buyer, "You are not a buyer.");

        uint256 value = adverts[_id].price * (adverts[_id].sellerRatio + 1);
        (bool sent, ) = adverts[_id].seller.call{value: value}("");
        require(sent, "Failed to send Ether");

        value = adverts[_id].price * (adverts[_id].buyerRatio - 1);
        (sent, ) = adverts[_id].buyer.call{value: value}("");
        require(sent, "Failed to send Ether");

        adverts[_id].status = Status.Finished;
        // TODO emit event of Finished

        updateActivity();
    }
}
