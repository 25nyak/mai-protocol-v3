const { ethers } = require("hardhat");
import {
    toWei,
    createFactory,
    createContract,
    setDefaultSigner
} from "./utils";

async function deployLibraries() {
    const AMMModule = await createContract("AMMModule"); // 0x7360a5370d5654dc9d2d9e365578c1332b9a82b5
    const CollateralModule = await createContract("CollateralModule") // 0xdea04ead9bce0ba129120c137117504f6dfaf78f
    const OrderModule = await createContract("OrderModule"); // 0xf8781589ae61610af442ffee69d310a092a8d41a
    const PerpetualModule = await createContract("PerpetualModule"); // 0x07315f8eca5c349716a868150f5d1951d310c53e
    const LiquidityPoolModule = await createContract("LiquidityPoolModule", [], { CollateralModule, AMMModule, PerpetualModule }); // 0xbd7bfceb24108a9adbbcd4c57bacdd5194f3be68
    const TradeModule = await createContract("TradeModule", [], { AMMModule, LiquidityPoolModule, CollateralModule, PerpetualModule }); // 0xbe884fecccbed59a32c7185a171223d1c07c446b
    console.table([
        ["AMMModule", AMMModule.address],
        ["CollateralModule", CollateralModule.address],
        ["OrderModule", OrderModule.address],
        ["PerpetualModule", PerpetualModule.address],
        ["LiquidityPoolModule", LiquidityPoolModule.address],
        ["TradeModule", TradeModule.address],
    ])
    // 2021/1/13 kovan
    // ┌─────────┬───────────────────────┬──────────────────────────────────────────────┐
    // │ (index) │           0           │                      1                       │
    // ├─────────┼───────────────────────┼──────────────────────────────────────────────┤
    // │    0    │      'AMMModule'      │ '0x0A1334aCea4E38a746daC7DCf7C3E61F0AB3D834' │
    // │    1    │  'CollateralModule'   │ '0x25E74e6D8A414Dff02c9CCC680B49F3708955ECF' │
    // │    2    │     'OrderModule'     │ '0x0530ed22a74c57CcD48d181085e78F60280E939b' │
    // │    3    │   'PerpetualModule'   │ '0x6EF05857FA25A81401407dE3D57Ebcb45A746E70' │
    // │    4    │ 'LiquidityPoolModule' │ '0xf5605bBed7BF76c276b6D8468F560a7B76077932' │
    // │    5    │     'TradeModule'     │ '0x99C30392BDe2161019eCa7c3d5fFc4BCf55489b2' │
    // └─────────┴───────────────────────┴──────────────────────────────────────────────┘

    // 2021/1/15 kovan
    // ┌─────────┬───────────────────────┬──────────────────────────────────────────────┐
    // │ (index) │           0           │                      1                       │
    // ├─────────┼───────────────────────┼──────────────────────────────────────────────┤
    // │    0    │      'AMMModule'      │ '0xf9d087E0687356101078DC80A24e9A2296B87228' │
    // │    1    │  'CollateralModule'   │ '0xb972336415C9A8e264Ab44dfd1188293e23511ba' │
    // │    2    │     'OrderModule'     │ '0xF59fD05e4575ddC7BF37183b8aFDD042A085Ce55' │
    // │    3    │   'PerpetualModule'   │ '0x4db2EFBfa164Cf893bd0E6a9fDcAD932844FeEC3' │
    // │    4    │ 'LiquidityPoolModule' │ '0xfE0a7Df6c1c38c384Ac2b23F444bbf6Bc147Cd53' │
    // │    5    │     'TradeModule'     │ '0x04f361eAe689282BcCbA6D05711641FB5D161F1B' │
    // └─────────┴───────────────────────┴──────────────────────────────────────────────┘
}

async function createLiquidityPoolFactory() {
    return await ethers.getContractFactory(
        "LiquidityPool",
        {
            libraries: {
                AMMModule: "0xf9d087E0687356101078DC80A24e9A2296B87228",
                OrderModule: "0xF59fD05e4575ddC7BF37183b8aFDD042A085Ce55",
                LiquidityPoolModule: "0xfE0a7Df6c1c38c384Ac2b23F444bbf6Bc147Cd53",
                TradeModule: "0x04f361eAe689282BcCbA6D05711641FB5D161F1B",
            }
        }
    )
}

async function deployOracle() {
    const oracle1 = await createContract("OracleWrapper", ["ETH", "USD"]);
    const oracle2 = await createContract("OracleWrapper", ["ETH", "BTC"]);
    const oracle3 = await createContract("OracleWrapper", ["USD", "ETH"]);
    const oracle4 = await createContract("OracleWrapper", ["USD", "BTC"]);
    const oracle5 = await createContract("OracleWrapper", ["USD", "DPI"]);
    const oracle6 = await createContract("OracleWrapper", ["USD", "DOT"]);
    const oracle7 = await createContract("OracleWrapper", ["USD", "SP500"]);
    const oracle8 = await createContract("OracleWrapper", ["USD", "TSLA"]);

    // index printer
    const owner = "0x1a3F275b9Af71D597219899151140a0049DB557b";
    await oracle1.transferOwnership(owner);
    await oracle2.transferOwnership(owner);
    await oracle3.transferOwnership(owner);
    await oracle4.transferOwnership(owner);
    await oracle5.transferOwnership(owner);
    await oracle6.transferOwnership(owner);
    await oracle7.transferOwnership(owner);
    await oracle8.transferOwnership(owner);

    console.table([
        ["USD - ETH", oracle1.address],
        ["BTC - ETH", oracle2.address],
        ["ETH - USD", oracle3.address],
        ["BTC - USD", oracle4.address],
        ["DPI - USD", oracle5.address],
        ["DOT - USD", oracle6.address],
        ["SP500 - USD", oracle7.address],
        ["TSLA - USD", oracle8.address],
    ])


    // 2021/1/13 koven / https://kovan.etherscan.io/address/0xa2aAD83466241232290bEbcd43dcbFf6A7f8d23a
    // ┌─────────┬───────────────┬──────────────────────────────────────────────┐
    // │ (index) │       0       │                      1                       │
    // ├─────────┼───────────────┼──────────────────────────────────────────────┤
    // │    0    │  'USD - ETH'  │ '0x27Ca190b32D8fe7274E84f575feF6E22BDEcA4A5' │
    // │    1    │  'BTC - ETH'  │ '0x547b6e5116B6A9167648f1C9d5e5e84ceAC62aae' │
    // │    2    │  'ETH - USD'  │ '0x6fd4C6D4DAA885A948eC8d218e9eaBD638296aFC' │
    // │    3    │  'BTC - USD'  │ '0x34Ee759Dd399F35E63d08A9A5834C148b3fC974F' │
    // │    4    │  'DPI - USD'  │ '0x07A843FCD4F150700275AD0A5A3A252e50503290' │
    // │    5    │ 'SP500 - USD' │ '0x131a6d689a46c947223937929583a586c32Fb349' │
    // └─────────┴───────────────┴──────────────────────────────────────────────┘


    // 2021/1/15 kovan
    // ┌─────────┬───────────────┬──────────────────────────────────────────────┐
    // │ (index) │       0       │                      1                       │
    // ├─────────┼───────────────┼──────────────────────────────────────────────┤
    // │    0    │  'USD - ETH'  │ '0x9Eb6fFf00730a3FDF38A675252aDe65BF3e17D09' │
    // │    1    │  'BTC - ETH'  │ '0x08E6c0e74799EAF55Ce8bdB13e976f038f86ad3e' │
    // │    2    │  'ETH - USD'  │ '0xAcEe0E35dbE08f36563D9Dd6faa687331c39E09A' │
    // │    3    │  'BTC - USD'  │ '0x462F1689663C23Af40bc7011765368D6e83C364b' │
    // │    4    │  'DPI - USD'  │ '0x95eA3D74F5c3616ab1a6bAeCacb5DE6240ADdbd1' │
    // │    5    │  'DOT - USD'  │ '0x38D023c4BfECC83a9Cd7abe4450ceFF944963487' │
    // │    6    │ 'SP500 - USD' │ '0x8e077970fF90d3F1f4ea20fa441AfCBf6A02272E' │
    // │    7    │ 'TSLA - USD'  │ '0xE3bFBe59b711A14660d7f5B55982C3a975168156' │
    // └─────────┴───────────────┴──────────────────────────────────────────────┘
}

async function main(accounts: any[]) {
    var deployer = { address: "0xa2aAD83466241232290bEbcd43dcbFf6A7f8d23a", private: "0xd961926e05ae51949465139b95d91faf028de329278fa5db7462076dd4a245f4" }
    var vault = { address: "0xd69c3820627daC4408CE629730EB8E891F8d5731", private: "0x55ebe4b701c11e6a04b5d77bb25276f090a6fd03a88c6d97ea85e40cd2a3926e" }
    var vaultFeeRate = toWei("0.00015");

    // 1. oracle
    // await deployOracle();

    // 2. libraries
    // await deployLibraries()

    // 3. factory
    // var symbol = await createContract("SymbolService", [10000]);
    // var weth = { address: "0xd0A1E359811322d97991E03f863a0C30C2cF029C" }
    // var usdc = await createContract("CustomERC20", ["USDC", "USDC", 6])
    // var shareTokenTmpl = await createContract("ShareToken");
    // var governorTmpl = await createContract("TestGovernor");
    // var poolCreator = await createContract(
    //     "PoolCreator",
    //     [governorTmpl.address, shareTokenTmpl.address, weth.address, symbol.address, vault.address, vaultFeeRate]
    // );
    // var brokerRelay = await createContract("BrokerRelay");

    // await symbol.addWhitelistedFactory(poolCreator.address);

    // const LiquidityPool = await createLiquidityPoolFactory();
    // var liquidityPoolTmpl = await LiquidityPool.deploy();
    // await poolCreator.addVersion(liquidityPoolTmpl.address, 0, "initial version");

    // console.table([
    //     ["weth", weth.address],
    //     ["usdc", usdc.address],
    //     ["poolCreator", poolCreator.address],
    //     ["symbol", symbol.address],
    //     ["brokerRelay", brokerRelay.address],
    // ])
    // 2021 / 1 / 13 koven / https://kovan.etherscan.io/address/0xa2aAD83466241232290bEbcd43dcbFf6A7f8d23a
    // ┌─────────┬───────────────┬──────────────────────────────────────────────┐
    // │ (index) │       0       │                      1                       │
    // ├─────────┼───────────────┼──────────────────────────────────────────────┤
    // │    0    │    'weth'     │ '0xd0A1E359811322d97991E03f863a0C30C2cF029C' │
    // │    1    │    'usdc'     │ '0x59edD5AEBf97955F53a094B49221E63F544ddA5a' │
    // │    3    │ 'poolCreator' │ '0xFc3Cf479C7EC041f7A75710d5B0aE22407aD766e' │
    // │    4    │   'symbol'    │ '0x465fB17aCc62Efd26D5B3bE9B3FFC984Cebd03d1' │
    // │    5    │ 'brokerRelay' │ '0xF9Aa44df5dD1DFD321c9Dd7cDa892a046135A054' │
    // └─────────┴───────────────┴──────────────────────────────────────────────┘

    // 2021/1/15 kovan
    // ┌─────────┬───────────────┬──────────────────────────────────────────────┐
    // │ (index) │       0       │                      1                       │
    // ├─────────┼───────────────┼──────────────────────────────────────────────┤
    // │    0    │    'weth'     │ '0xd0A1E359811322d97991E03f863a0C30C2cF029C' │
    // │    1    │    'usdc'     │ '0xd4AC81D9FD2b28363eBD1D88a8364Ff3b3577e84' │
    // │    2    │ 'poolCreator' │ '0xfa81036567A378C44C5bC13323416aECfeD29D09' │
    // │    3    │   'symbol'    │ '0x02ae5f2802941789311d0b21969ff52178CeC555' │
    // │    4    │ 'brokerRelay' │ '0xF3B092451cDBD827105aB593222975c5B0F91578' │
    // └─────────┴───────────────┴──────────────────────────────────────────────┘


    // await set1(deployer);

    // await set2(deployer);

    await deployReader(accounts, ["0xe4188585Ffc1E9B41ed5A8593F0b70453a335f9A", "0x8D46b3e33Ece377EdDAfb0cA5187AE603011041F"]);
}

async function set1(deployer) {
    // │    0    │  'USD - ETH'  │ '0x9Eb6fFf00730a3FDF38A675252aDe65BF3e17D09' │
    // │    1    │  'BTC - ETH'  │ '0x08E6c0e74799EAF55Ce8bdB13e976f038f86ad3e' │
    // │    2    │ 'poolCreator' │ '0xfa81036567A378C44C5bC13323416aECfeD29D09' │

    var eth = await createContract("CustomERC20", ["ETH", "ETH", 18])
    var poolCreator = await (await createFactory("PoolCreator")).attach("0xfa81036567A378C44C5bC13323416aECfeD29D09")
    const tx = await poolCreator.createLiquidityPool(
        eth.address,
        18                              /* decimals */,
        true                           /* isFastCreationEnabled */,
        Math.floor(Date.now() / 1000)   /* nonce */
    );
    await tx.wait()

    const n = await poolCreator.getLiquidityPoolCount();
    const allLiquidityPools = await poolCreator.listLiquidityPools(0, n.toString());
    const LiquidityPool = await createLiquidityPoolFactory();
    const liquidityPool = await LiquidityPool.attach(allLiquidityPools[allLiquidityPools.length - 1]);

    const mtx1 = await liquidityPool.createPerpetual("0x9Eb6fFf00730a3FDF38A675252aDe65BF3e17D09",
        // imr          mmr            operatorfr        lpfr              rebate        penalty        keeper           insur         cap
        [toWei("0.04"), toWei("0.02"), toWei("0.00000"), toWei("0.00055"), toWei("0.4"), toWei("0.01"), toWei("0.0005"), toWei("0.25"), toWei("1000")],
        // alpha          beta1            beta2             fr              lev         max close
        [toWei("0.0008"), toWei("0.0075"), toWei("0.00525"), toWei("0.005"), toWei("3"), toWei("0.05")],
        [toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0")],
        [toWei("1"), toWei("1"), toWei("1"), toWei("1"), toWei("10"), toWei("1")],
    )
    await mtx1.wait()

    const mtx2 = await liquidityPool.createPerpetual("0x08E6c0e74799EAF55Ce8bdB13e976f038f86ad3e",
        // imr          mmr            operatorfr        lpfr              rebate        penalty        keeper           insur         cap
        [toWei("0.04"), toWei("0.02"), toWei("0.00000"), toWei("0.00055"), toWei("0.4"), toWei("0.01"), toWei("0.0005"), toWei("0.25"), toWei("1000")],
        // alpha          beta1            beta2             fr              lev         max close
        [toWei("0.0008"), toWei("0.0075"), toWei("0.00525"), toWei("0.005"), toWei("3"), toWei("0.05")],
        [toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0")],
        [toWei("1"), toWei("1"), toWei("1"), toWei("1"), toWei("10"), toWei("1")],
    )
    await mtx2.wait()

    await liquidityPool.runLiquidityPool();

    await eth.mint(deployer.address, toWei("10000"));
    await eth.approve(liquidityPool.address, toWei("10000"));
    await liquidityPool.addLiquidity(toWei("10000"));

    const addresses = [
        ["WETH9", "0xdEA04eAd9bcE0bA129120c137117504f6DFaf78F"],
        ["ETH", eth.address],
        ["  Oracle  'USD - ETH'  ", "0x9Eb6fFf00730a3FDF38A675252aDe65BF3e17D09"],
        ["  Oracle  'BTC - ETH'  ", "0x08E6c0e74799EAF55Ce8bdB13e976f038f86ad3e"],
        ["  LiquidityPool", `${liquidityPool.address} @ ${tx.blockNumber}`],
        ["  PerpetualStorage 0", `@ ${mtx1.blockNumber}`],
        ["  PerpetualStorage 1", `@ ${mtx2.blockNumber}`],
    ]
    console.table(addresses)
    return liquidityPool
    // 2021 / 1 / 13 koven
    // ┌─────────┬───────────────────────────┬─────────────────────────────────────────────────────────┐
    // │ (index) │             0             │                            1                            │
    // ├─────────┼───────────────────────────┼─────────────────────────────────────────────────────────┤
    // │    0    │          'WETH9'          │      '0xdEA04eAd9bcE0bA129120c137117504f6DFaf78F'       │
    // │    1    │          'teth'           │      '0x1520D5561Dfb209c6dF5149CB6146f6B18d7ad2a'       │
    // │    2    │ 'Oracle  \'USD - ETH\'  ' │      '0x27Ca190b32D8fe7274E84f575feF6E22BDEcA4A5'       │
    // │    3    │ 'Oracle  \'BTC - ETH\'  ' │      '0x547b6e5116B6A9167648f1C9d5e5e84ceAC62aae'       │
    // │    4    │      'LiquidityPool'      │ '0xb39744419D360FADb4a0352DE655B5AE64d7bd07 @ 22995210' │
    // │    5    │  '  PerpetualStorage 0'   │                      '@ 22995213'                       │
    // │    6    │  '  PerpetualStorage 1'   │                      '@ 22995215'                       │
    // └─────────┴───────────────────────────┴─────────────────────────────────────────────────────────┘

    // 2021 / 1 / 15 koven
    // ┌─────────┬───────────────┬──────────────────────────────────────────────┐
    // │ (index) │       0       │                      1                       │
    // ├─────────┼───────────────┼──────────────────────────────────────────────┤
    // │    0    │    'weth'     │ '0xd0A1E359811322d97991E03f863a0C30C2cF029C' │
    // │    1    │    'usdc'     │ '0x611DbF710Cd6F336F20bDACa2e9207028F946547' │
    // │    2    │ 'poolCreator' │ '0x1465813E2939ee478834F30a0aD598459D73E091' │
    // │    3    │   'symbol'    │ '0x437EAFd9F268397E9A0AAEA540CCA0338F894e79' │
    // │    4    │ 'brokerRelay' │ '0xF51FfF9342249B4571bb66d7f779Bf2a1d0d5efA' │
    // └─────────┴───────────────┴──────────────────────────────────────────────┘
}

async function set2(deployer) {
    // │    2    │  'ETH - USD'  │ '0xAcEe0E35dbE08f36563D9Dd6faa687331c39E09A' │
    // │    3    │  'BTC - USD'  │ '0x462F1689663C23Af40bc7011765368D6e83C364b' │
    // │    4    │  'DPI - USD'  │ '0x95eA3D74F5c3616ab1a6bAeCacb5DE6240ADdbd1' │
    // │    5    │  'DOT - USD'  │ '0x38D023c4BfECC83a9Cd7abe4450ceFF944963487' │
    // │    6    │ 'SP500 - USD' │ '0x8e077970fF90d3F1f4ea20fa441AfCBf6A02272E' │
    // │    7    │ 'TSLA - USD'  │ '0xE3bFBe59b711A14660d7f5B55982C3a975168156' │
    // │    1    │    'usdc'     │ '0xd4AC81D9FD2b28363eBD1D88a8364Ff3b3577e84' │
    // │    2    │ 'poolCreator' │ '0xfa81036567A378C44C5bC13323416aECfeD29D09' │
    var usd = await (await createFactory("CustomERC20")).attach("0xd4AC81D9FD2b28363eBD1D88a8364Ff3b3577e84")
    var poolCreator = await (await createFactory("PoolCreator")).attach("0xfa81036567A378C44C5bC13323416aECfeD29D09")
    const tx = await poolCreator.createLiquidityPool(
        usd.address,
        6,                              /* decimals */
        true,                           /* isFastCreationEnabled */
        Math.floor(Date.now() / 1000)  /* nonce */
    );
    await tx.wait()

    const n = await poolCreator.getLiquidityPoolCount();
    const allLiquidityPools = await poolCreator.listLiquidityPools(0, n.toString());
    const LiquidityPool = await createLiquidityPoolFactory();
    const liquidityPool = await LiquidityPool.attach(allLiquidityPools[allLiquidityPools.length - 1]);

    const mtx1 = await liquidityPool.createPerpetual("0xAcEe0E35dbE08f36563D9Dd6faa687331c39E09A",
        // imr          mmr            operatorfr        lpfr              rebate        penalty        keeper        insur         cap
        [toWei("0.04"), toWei("0.02"), toWei("0.00000"), toWei("0.00055"), toWei("0.4"), toWei("0.01"), toWei("0.5"), toWei("0.25"), toWei("1000000")],
        // alpha          beta1            beta2             fr              lev         max close
        [toWei("0.0008"), toWei("0.0075"), toWei("0.00525"), toWei("0.005"), toWei("3"), toWei("0.05")],
        [toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0")],
        [toWei("1"), toWei("1"), toWei("1"), toWei("1"), toWei("10"), toWei("1")],
    )
    const mtx2 = await liquidityPool.createPerpetual("0x462F1689663C23Af40bc7011765368D6e83C364b",
        // imr          mmr            operatorfr        lpfr              rebate        penalty        keeper        insur         cap
        [toWei("0.04"), toWei("0.02"), toWei("0.00000"), toWei("0.00055"), toWei("0.4"), toWei("0.01"), toWei("0.5"), toWei("0.25"), toWei("1000000")],
        // alpha          beta1            beta2             fr              lev         max close
        [toWei("0.0008"), toWei("0.0075"), toWei("0.00525"), toWei("0.005"), toWei("3"), toWei("0.05")],
        [toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0")],
        [toWei("1"), toWei("1"), toWei("1"), toWei("1"), toWei("10"), toWei("1")],
    )
    const mtx3 = await liquidityPool.createPerpetual("0x95eA3D74F5c3616ab1a6bAeCacb5DE6240ADdbd1",
        // imr          mmr            operatorfr        lpfr              rebate        penalty        keeper        insur         cap
        [toWei("0.10"), toWei("0.05"), toWei("0.00000"), toWei("0.00055"), toWei("0.4"), toWei("0.01"), toWei("0.1"), toWei("0.25"), toWei("1000000")],
        // alpha         beta1            beta2             fr              lev         max close
        [toWei("0.003"), toWei("0.0075"), toWei("0.00525"), toWei("0.005"), toWei("3"), toWei("0.05")],
        [toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0")],
        [toWei("1"), toWei("1"), toWei("1"), toWei("1"), toWei("10"), toWei("1")],
    )
    const mtx4 = await liquidityPool.createPerpetual("0x38D023c4BfECC83a9Cd7abe4450ceFF944963487",
        // imr          mmr            operatorfr        lpfr              rebate        penalty        keeper        insur         cap
        [toWei("0.10"), toWei("0.05"), toWei("0.00000"), toWei("0.00055"), toWei("0.4"), toWei("0.01"), toWei("0.1"), toWei("0.25"), toWei("1000000")],
        // alpha         beta1            beta2             fr              lev         max close
        [toWei("0.003"), toWei("0.0075"), toWei("0.00525"), toWei("0.005"), toWei("3"), toWei("0.05")],
        [toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0")],
        [toWei("1"), toWei("1"), toWei("1"), toWei("1"), toWei("10"), toWei("1")],
    )
    const mtx5 = await liquidityPool.createPerpetual("0x8e077970fF90d3F1f4ea20fa441AfCBf6A02272E",
        // imr          mmr            operatorfr        lpfr              rebate        penalty        keeper        insur         cap
        [toWei("0.10"), toWei("0.05"), toWei("0.00000"), toWei("0.00055"), toWei("0.4"), toWei("0.01"), toWei("0.1"), toWei("0.25"), toWei("1000000")],
        // alpha         beta1            beta2             fr              lev         max close
        [toWei("0.003"), toWei("0.0075"), toWei("0.00525"), toWei("0.005"), toWei("3"), toWei("0.05")],
        [toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0")],
        [toWei("1"), toWei("1"), toWei("1"), toWei("1"), toWei("10"), toWei("1")],
    )
    const mtx6 = await liquidityPool.createPerpetual("0xE3bFBe59b711A14660d7f5B55982C3a975168156",
        // imr          mmr            operatorfr        lpfr              rebate        penalty        keeper        insur         cap
        [toWei("0.10"), toWei("0.05"), toWei("0.00000"), toWei("0.00055"), toWei("0.4"), toWei("0.01"), toWei("0.1"), toWei("0.25"), toWei("1000000")],
        // alpha         beta1            beta2             fr              lev         max close
        [toWei("0.003"), toWei("0.0075"), toWei("0.00525"), toWei("0.005"), toWei("3"), toWei("0.05")],
        [toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0"), toWei("0")],
        [toWei("1"), toWei("1"), toWei("1"), toWei("1"), toWei("10"), toWei("1")],
    )
    await liquidityPool.runLiquidityPool();

    await usd.mint(deployer.address, "10000000" + "000000");
    await usd.approve(liquidityPool.address, "10000000" + "000000");
    await liquidityPool.addLiquidity(toWei("10000000"));

    const addresses = [
        ["Collateral (USDC)", usd.address],
        ["Oracle  'ETH - USD'  ", "0xAcEe0E35dbE08f36563D9Dd6faa687331c39E09A"],
        ["Oracle  'BTC - USD'  ", "0x462F1689663C23Af40bc7011765368D6e83C364b"],
        ["Oracle  'DPI - USD'  ", "0x95eA3D74F5c3616ab1a6bAeCacb5DE6240ADdbd1"],
        ["Oracle  'DOT - USD'  ", "0x38D023c4BfECC83a9Cd7abe4450ceFF944963487"],
        ["Oracle  'SP500 - USD'", "0x8e077970fF90d3F1f4ea20fa441AfCBf6A02272E"],
        ["Oracle  'TSLA - USD '", "0xE3bFBe59b711A14660d7f5B55982C3a975168156"],
        ["LiquidityPool", `${liquidityPool.address} @ ${tx.blockNumber}`],
        ["  PerpetualStorage 0", `@ ${mtx1.blockNumber}`],
        ["  PerpetualStorage 1", `@ ${mtx2.blockNumber}`],
        ["  PerpetualStorage 2", `@ ${mtx3.blockNumber}`],
        ["  PerpetualStorage 3", `@ ${mtx4.blockNumber}`],
        ["  PerpetualStorage 4", `@ ${mtx5.blockNumber}`],
        ["  PerpetualStorage 5", `@ ${mtx6.blockNumber}`],
    ]
    console.table(addresses)
    return liquidityPool
    // 2021 / 1 / 13 koven
    // ┌─────────┬───────────────────────────┬─────────────────────────────────────────────────────────┐
    // │ (index) │             0             │                            1                            │
    // ├─────────┼───────────────────────────┼─────────────────────────────────────────────────────────┤
    // │    0    │    'Collateral (USDC)'    │      '0x59edD5AEBf97955F53a094B49221E63F544ddA5a'       │
    // │    1    │ 'Oracle  \'ETH - USD\'  ' │      '0x6fd4C6D4DAA885A948eC8d218e9eaBD638296aFC'       │
    // │    2    │ 'Oracle  \'BTC - USD\'  ' │      '0x34Ee759Dd399F35E63d08A9A5834C148b3fC974F'       │
    // │    3    │ 'Oracle  \'DPI - USD\'  ' │      '0x07A843FCD4F150700275AD0A5A3A252e50503290'       │
    // │    4    │ 'Oracle  \'SP500 - USD\'' │      '0x131a6d689a46c947223937929583a586c32Fb349'       │
    // │    5    │      'LiquidityPool'      │ '0x93e790a5f8152486f8130124fF0504454eFc9c2A @ 22995254' │
    // │    6    │  '  PerpetualStorage 0'   │                      '@ 22995259'                       │
    // │    7    │  '  PerpetualStorage 1'   │                      '@ 22995261'                       │
    // │    8    │  '  PerpetualStorage 2'   │                      '@ 22995263'                       │
    // │    9    │  '  PerpetualStorage 3'   │                      '@ 22995265'                       │
    // └─────────┴───────────────────────────┴─────────────────────────────────────────────────────────┘
}

async function deployReader(accounts: any[], pools) {
    var reader = await createContract("Reader");
    const addresses = [
        ["Reader", reader.address],
    ]
    console.table(addresses)

    console.log('reader test: pool1')
    console.log(myDump(await reader.callStatic.getLiquidityPoolStorage(pools[0])))
    console.log('reader test: pool2')
    console.log(myDump(await reader.callStatic.getLiquidityPoolStorage(pools[1])))

    return { reader }
    // 2021 / 1 / 13 koven
    // ┌─────────┬──────────┬──────────────────────────────────────────────┐
    // │ (index) │    0     │                      1                       │
    // ├─────────┼──────────┼──────────────────────────────────────────────┤
    // │    0    │ 'Reader' │ '0x90b24561Ba9cf98dC6bbA3aF0B19442AE37c1fcf' │
    // └─────────┴──────────┴──────────────────────────────────────────────┘
}

function myDump(o: any, prefix?: string) {
    if (o === null) {
        return 'null'
    }
    if ((typeof o) !== 'object') {
        return o.toString()
    }
    if (ethers.BigNumber.isBigNumber(o)) {
        return o.toString()
    }
    let s = '\n'
    if (!prefix) {
        prefix = ''
    }
    prefix += '  '
    // for (let k in o) {
    // s += prefix + `${k}: ${myDump(o[k], prefix)}, \n`
    // }
    return s
}

ethers.getSigners()
    .then(accounts => main(accounts))
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });