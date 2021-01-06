// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "../Type.sol";

interface ILiquidityPool {
    function getLiquidityPoolInfo()
        external
        view
        returns (
            // [0] factory,
            // [1] operator,
            // [2] collateral,
            // [3] vault,
            // [4] governor,
            // [5] shareToken,
            address[6] memory addresses,
            // [0] vaultFeeRate,
            // [1] poolCash,
            int256[2] memory nums,
            uint256 collateralDecimals,
            uint256 perpetualCount,
            uint256 fundingTime,
            bool isInitialized,
            bool isFastCreationEnabled
        );

    function getPerpetualInfo(uint256 perpetualIndex)
        external
        returns (
            PerpetualState state,
            address oracle,
            // [0] totalCollateral
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
            // [12] insuranceFundCap,
            // [13] insuranceFund,
            // [14] donatedInsuranceFund,
            // [15] halfSpread,
            // [16] openSlippageFactor,
            // [17] closeSlippageFactor,
            // [18] fundingRateLimit,
            // [19] ammMaxLeverage,
            // [20] maxClosePriceDiscount
            int256[21] memory nums
        );

    function getMarginAccount(uint256 perpetualIndex, address trader)
        external
        returns (
            int256 cash,
            int256 position,
            int256 availableCash,
            int256 margin,
            int256 settleableMargin,
            bool isInitialMarginSafe,
            bool isMaintenanceMarginSafe,
            bool isBankrupt
        );

    function initialize(
        address operator,
        address collateral,
        uint256 collateralDecimals,
        address governor,
        address shareToken,
        bool isFastCreationEnabled
    ) external;

    function trade(
        uint256 perpetualIndex,
        address trader,
        int256 amount,
        int256 limitPrice,
        uint256 deadline,
        address referrer,
        bool isCloseOnly
    ) external returns (int256);

    function brokerTrade(bytes memory orderData, int256 amount) external returns (int256);

    function activeAccountCount(uint256 perpetualIndex) external view returns (uint256);

    function listActiveAccounts(
        uint256 perpetualIndex,
        uint256 start,
        uint256 count
    ) external view returns (address[] memory result);
}
