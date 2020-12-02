// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.4;

import "../Type.sol";
import "../interface/IOracle.sol";

import "hardhat/console.sol";

library OracleModule {
    function markPrice(Core storage core) internal view returns (int256) {
        return core.state == State.NORMAL ? core.markPriceData.price : core.settlePriceData.price;
    }

    function updatePrice(Core storage core) internal {
        // no longer update price after emergency
        if (block.timestamp != core.priceUpdateTime && core.state == State.NORMAL) {
            updatePriceData(core.markPriceData, IOracle(core.oracle).priceTWAPLong);
            updatePriceData(core.indexPriceData, IOracle(core.oracle).priceTWAPShort);
            core.priceUpdateTime = block.timestamp;
        }
        console.log("index1:", uint256(core.indexPriceData.price));
    }

    function indexPrice(Core storage core) internal view returns (int256) {
        return core.state == State.NORMAL ? core.indexPriceData.price : core.settlePriceData.price;
    }

    // prettier-ignore
    function updatePriceData(
        OraclePriceData storage priceData,
        function() external returns (int256, uint256) priceGetter
    ) internal {
        (int256 price, uint256 time) = priceGetter();
        if (time != priceData.time) {
            priceData.price = price;
            priceData.time = time;
        }
        console.log("price updated:", uint256(priceData.price));
    }

    function freezeOraclePrice(Core storage core) internal {
        require(core.state != State.NORMAL, "not in normal state");

        console.log("index2:", uint256(core.indexPriceData.price));
        core.settlePriceData = core.indexPriceData;
        core.priceUpdateTime = block.timestamp;
    }
}
