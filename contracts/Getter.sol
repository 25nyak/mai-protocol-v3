// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.4;

import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/SafeCastUpgradeable.sol";

import "./interface/IFactory.sol";

import "./module/FundingModule.sol";
import "./module/OracleModule.sol";
import "./module/MarginModule.sol";
import "./module/CollateralModule.sol";
import "./module/ParameterModule.sol";
import "./module/SettlementModule.sol";

import "./Type.sol";
import "./Storage.sol";

contract Getter is Storage {
    using SafeMathUpgradeable for uint256;
    using SafeCastUpgradeable for uint256;
    using CollateralModule for address;
    using FundingModule for LiquidityPoolStorage;
    using MarginModule for LiquidityPoolStorage;
    using OracleModule for PerpetualStorage;
    using OracleModule for LiquidityPoolStorage;
    using ParameterModule for LiquidityPoolStorage;
    using SettlementModule for LiquidityPoolStorage;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.Bytes32Set;

    function liquidityPoolInfo()
        public
        view
        returns (
            // [0] factory
            // [1] operator
            // [2] collateral
            // [3] vault
            // [4] governor
            // [5] shareToken
            address[6] memory addresses,
            // [0] vaultFeeRate,
            // [1] insuranceFundCap,
            // [2] insuranceFund,
            // [3] donatedInsuranceFund,
            // [4] totalClaimableFee,
            // [5] poolCashBalance,
            // [6] poolCollateralAmount,
            int256[7] memory nums,
            uint256 perpetualCount,
            uint256 fundingTime
        )
    {
        addresses = [
            _liquidityPool.factory,
            _liquidityPool.operator,
            _liquidityPool.collateral,
            _liquidityPool.vault,
            _liquidityPool.governor,
            _liquidityPool.shareToken
        ];
        nums = [
            _liquidityPool.vaultFeeRate,
            _liquidityPool.insuranceFundCap,
            _liquidityPool.insuranceFund,
            _liquidityPool.donatedInsuranceFund,
            _liquidityPool.totalClaimableFee,
            _liquidityPool.poolCashBalance,
            _liquidityPool.poolCollateralAmount
        ];
        perpetualCount = _liquidityPool.perpetuals.length;
        fundingTime = _liquidityPool.fundingTime;
    }

    function perpetualInfo(uint256 perpetualIndex)
        public
        syncState
        onlyExistedPerpetual(perpetualIndex)
        returns (
            PerpetualState state,
            address oracle,
            // [0] collateralAmount
            // [1] markPrice,
            // [2] indexPrice,
            // [3] unitAccumulativeFunding,
            // [4] initialMarginRate,
            // [5] maintenanceMarginRate,
            // [6] operatorFeeRate,
            // [7] lpFeeRate,
            // [8] referrerRebateRate,
            // [9] liquidationPenaltyRate,
            // [10] keeperGasReward,
            // [11] insuranceFundRate,
            // [12] halfSpread,
            // [13] openSlippageFactor,
            // [14] closeSlippageFactor,
            // [15] fundingRateLimit,
            // [16] maxLeverage
            int256[17] memory nums
        )
    {
        PerpetualStorage storage perpetual = _liquidityPool.perpetuals[perpetualIndex];

        state = perpetual.state;
        oracle = perpetual.oracle;
        nums = [
            perpetual.collateralAmount,
            perpetual.markPrice(),
            perpetual.indexPrice(),
            perpetual.unitAccumulativeFunding,
            perpetual.initialMarginRate,
            perpetual.maintenanceMarginRate,
            perpetual.operatorFeeRate,
            perpetual.lpFeeRate,
            perpetual.referrerRebateRate,
            perpetual.liquidationPenaltyRate,
            perpetual.keeperGasReward,
            perpetual.insuranceFundRate,
            perpetual.halfSpread.value,
            perpetual.openSlippageFactor.value,
            perpetual.closeSlippageFactor.value,
            perpetual.fundingRateLimit.value,
            perpetual.maxLeverage.value
        ];
    }

    bytes[50] private __gap;
}
