// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

contract Events {
	// governance
	event UpdateCoreSetting(bytes32 key, int256 value);
	event UpdateRiskSetting(bytes32 key, int256 value, int256 minValue, int256 maxValue);
	event AdjustRiskSetting(bytes32 key, int256 value);
	// privilege
	event GrantPrivilege(address indexed owner, address indexed trader, uint256 privilege);
	event RevokePrivilege(address indexed owner, address indexed trader, uint256 privilege);
	// trade
	event Deposit(address trader, int256 amount);
	event Withdraw(address trader, int256 amount);
	event Clear(address trader);
	event Trade(
		address indexed trader,
		int256 positionAmount,
		int256 price,
		int256 fee,
		uint256 deadline
	);
	event LiquidateByAMM(
		address indexed trader,
		int256 amount,
		int256 price,
		int256 fee,
		uint256 deadline
	);
	event LiquidateByTrader(
		address indexed liquidator,
		address indexed trader,
		int256 amount,
		int256 price,
		uint256 deadline
	);
	// amm
	event AddLiquidatity(address trader, int256 addedCash, int256 mintedShare);
	event RemoveLiquidatity(address trader, int256 returnedCash, int256 burnedShare);
	event DonateInsuranceFund(address trader, int256 amount);
	// fee
	event ClaimFee(address claimer, int256 amount);
	// trick, to watch events fired from libraries
	event ClosePositionByTrade(address trader, int256 amount, int256 price, int256 fundingLoss);
	event OpenPositionByTrade(address trader, int256 amount, int256 price);
	event ClosePositionByLiquidation(
		address trader,
		int256 amount,
		int256 price,
		int256 fundingLoss
	);
	event OpenPositionByLiquidation(address trader, int256 amount, int256 price);
}