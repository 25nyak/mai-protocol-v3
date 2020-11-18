// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SignedSafeMath.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "../libraries/Constant.sol";
import "../libraries/Math.sol";
import "../libraries/SafeMathExt.sol";

import "../Type.sol";

library AMMCommon {
    using Math for int256;
    using SafeMathExt for int256;
    using SignedSafeMath for int256;

    function regress(
        int256 mc,
        int256 positionAmount,
        int256 indexPrice,
        int256 targetLeverage,
        int256 beta
    ) internal pure returns (int256 mv, int256 m0) {
        if (positionAmount == 0) {
            mv = targetLeverage.sub(Constant.SIGNED_ONE).wmul(mc);
        } else if (positionAmount > 0) {
            mv = longVirtualMargin(
                mc,
                positionAmount,
                indexPrice,
                targetLeverage,
                beta
            );
        } else {
            mv = shortVirtualMargin(
                mc,
                positionAmount,
                indexPrice,
                targetLeverage,
                beta
            );
        }
        m0 = mv.wfrac(targetLeverage, targetLeverage.sub(Constant.SIGNED_ONE));
    }

    function longVirtualMargin(
        int256 mc,
        int256 positionAmount,
        int256 indexPrice,
        int256 targetLeverage,
        int256 beta
    ) internal pure returns (int256 mv) {
        int256 t = targetLeverage.sub(Constant.SIGNED_ONE);
        int256 b = t.wmul(indexPrice.wmul(positionAmount)).add(
            targetLeverage.wmul(mc)
        );
        int256 beforeSqrt = beta
            .wmul(indexPrice)
            .wmul(targetLeverage)
            .wmul(mc)
            .mul(positionAmount)
            .mul(4);
        beforeSqrt = beforeSqrt.add(b.mul(b));
        mv = beta.sub(Constant.SIGNED_ONE).wmul(mc).mul(2);
        mv = mv.add(beforeSqrt.sqrt()).add(b);
        mv = mv.wfrac(t, t.add(beta)).div(2);
    }

    function shortVirtualMargin(
        int256 mc,
        int256 positionAmount,
        int256 indexPrice,
        int256 targetLeverage,
        int256 beta
    ) internal pure returns (int256 mv) {
        int256 a = indexPrice.wmul(positionAmount).mul(2);
        int256 b = targetLeverage
            .add(Constant.SIGNED_ONE)
            .wmul(indexPrice)
            .wmul(positionAmount)
            .add(targetLeverage.wmul(mc));
        int256 beforeSqrt = b.mul(b).sub(
            beta.wmul(targetLeverage).wmul(a).mul(a)
        );
        mv = b.sub(a).add(beforeSqrt.sqrt());
        mv = mv
            .wfrac(targetLeverage.sub(Constant.SIGNED_ONE), targetLeverage)
            .div(2);
    }

    function availableCashBalance(
        MarginAccount storage account,
        int256 unitAccFundingLoss
    ) internal view returns (int256) {
        return
            account.cashBalance.sub(
                account.positionAmount.wmul(unitAccFundingLoss)
            );
    }

    function isAMMMarginSafe(
        int256 mc,
        int256 positionAmount,
        int256 indexPrice,
        int256 targetLeverage,
        int256 beta
    ) internal pure returns (bool) {
        if (positionAmount == 0 || (positionAmount > 0 && mc >= 0)) {
            return true;
        }
        if (positionAmount > 0) {
            return
                indexPrice >=
                _indexLowerbound(mc, positionAmount, targetLeverage, beta);
        } else {
            return
                indexPrice <=
                _indexUpperbound(mc, positionAmount, targetLeverage, beta);
        }
    }

    function _indexLowerbound(
        int256 mc,
        int256 positionAmount,
        int256 targetLeverage,
        int256 beta
    ) private pure returns (int256 lowerbound) {
        int256 t = targetLeverage.sub(Constant.SIGNED_ONE);
        lowerbound = t.add(beta).mul(beta);
        lowerbound = lowerbound.sqrt().mul(2).add(t).add(beta.mul(2));
        lowerbound = lowerbound.wfrac(targetLeverage, positionAmount).wfrac(
            mc.neg(),
            t.wmul(t)
        );
    }

    function _indexUpperbound(
        int256 mc,
        int256 positionAmount,
        int256 targetLeverage,
        int256 beta
    ) private pure returns (int256 upperbound) {
        upperbound = beta
            .mul(targetLeverage)
            .sqrt()
            .mul(2)
            .add(targetLeverage)
            .add(Constant.SIGNED_ONE);
        upperbound = targetLeverage.wfrac(mc, positionAmount.neg()).wdiv(
            upperbound
        );
    }
}
