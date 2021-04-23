// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "../interface/ILiquidityPool.sol";

interface IPoolCreator {
    function grantPrivilege(address trader, uint256 privilege) external;

    function isGranted(
        address owner,
        address trader,
        uint256 privilege
    ) external view returns (bool);

    function getWeth() external view returns (address);
}

contract RemarginHelper is ReentrancyGuard {
    function remargin(
        address from,
        uint256 fromIndex,
        address to,
        uint256 toIndex,
        int256 amount
    ) external nonReentrant {
        require(amount > 0, "remargin amount is zero");
        if (from != to) {
            address collateralFrom = _collateral(from);
            address collateralTo = _collateral(to);
            require(
                collateralFrom == collateralTo,
                "cannot remargin between perpetuals with different collaterals"
            );
            require(
                IERC20(collateralFrom).allowance(msg.sender, to) >= uint256(amount),
                "remargin amount exceeds allowance"
            );
        }
        ILiquidityPool(from).withdraw(fromIndex, msg.sender, amount, false);
        ILiquidityPool(to).deposit(toIndex, msg.sender, amount);
    }

    function _collateral(address perpetual) internal view returns (address collateral) {
        (, , address[7] memory addresses, , ) = ILiquidityPool(perpetual).getLiquidityPoolInfo();
        collateral = addresses[5];
    }
}