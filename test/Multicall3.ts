import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const Web3EthAbi = require('web3-eth-abi');
const { padLeft, web3 } = require('web3-utils');

const WTON_ABI = require("../abis/WTON.json");
const TON_ABI = require("../abis/TON.json");
const Multi_ABI = require("../artifacts/contracts/Multicall3.sol/Multicall3.json")

// const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
// if (!MAINNET_RPC_URL) throw new Error('Please set the MAINNET_RPC_URL environment variable.');
// const provider = new JsonRpcProvider("https://goerli.infura.io/v3/086aad6219cf436eb12e2ceae00e3b29");

describe("Multicall3", function () {
  let richAccount = "0xf0B595d10a92A5a9BC3fFeA7e79f5d266b6035Ea";

  let set = true
  let multiAddress = "0x92D5B05741938d4BFe068E91616F442E10edE5f0"
  let goerliMultiAddress = "0xcA11bde05977b3631167028862bE2a173976CA11"
  let testAccount : any

  let Multicall3: any
  let MultiCont: any

  let wtonContract: any
  let tonContract: any

  let wtonAddress = "0xe86fCf5213C785AcF9a8BFfEeDEfA9a2199f7Da6";
  let tonAddress = "0x68c1F9620aeC7F2913430aD6daC1bb16D8444F00";
  let l1bridge = "0x7377f3d0f64d7a54cf367193eb74a052ff8578fd";
  // const ensRegistryInterface = new Interface(['function resolver(bytes32) view returns (address)']);
  // const wtonInterface = new Interface(['function swapToTON(uint256) returns (bool)']);
  // console.log(wtonInterface)
  const selector1 = Web3EthAbi.encodeFunctionSignature("swapToTON(uint256)");
  // const selector2 = Web3EthAbi.encodeFunctionSignature("transferFrom(address,address,uint256)");
  const wtonAmount = ethers.utils.parseUnits("1", 27);
  const wtonAmoun2 = 10000000
  const data1 = padLeft(wtonAmoun2.toString(16), 64);
  // const data1 = padLeft(wtonAmount.toHexString(), 64);
  const functionBytecode1 = selector1.concat(data1);
  console.log(functionBytecode1)
  
  //swapToTON
  const functionByte = "0xf53fe70f0000000000000000000000000000000000000000033b2e3c9fd0803ce8000000"

  //balanceOf
  const functionBytecode2 = "0x70a08231000000000000000000000000f0b595d10a92a5a9bc3ffea7e79f5d266b6035ea"

  //transferFrom
  const functionBytecode3 = "0x23b872dd000000000000000000000000f0b595d10a92a5a9bc3ffea7e79f5d266b6035ea000000000000000000000000ca11bde05977b3631167028862be2a173976ca110000000000000000000000000000000000000000033b2e3c9fd0803ce8000000"

  //transfer
  const functionBytecode4 = "0xa9059cbb000000000000000000000000195c1d13fc588c0b1ca8a78dd5771e0ee5a2eae40000000000000000000000000000000000000000033b2e3c9fd0803ce8000000"
  
  //depositERC20To
  const functionDepositTo = "0x838b252000000000000000000000000068c1f9620aec7f2913430ad6dac1bb16d8444f000000000000000000000000007c6b91d9be155a6db01f749217d76ff02a7227f2000000000000000000000000f0b595d10a92a5a9bc3ffea7e79f5d266b6035ea0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000030d4000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000"

  //approve
  const functionApprove = "0x095ea7b3000000000000000000000000ca11bde05977b3631167028862be2a173976ca110000000000000000000000000000000000000000033b2e3c9fd0803ce8000000"

  //depositERC20To2
  const functionDepositToGas2 = "0x838b252000000000000000000000000068c1f9620aec7f2913430ad6dac1bb16d8444f000000000000000000000000007c6b91d9be155a6db01f749217d76ff02a7227f2000000000000000000000000f0b595d10a92a5a9bc3ffea7e79f5d266b6035ea0000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000007a12000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000000"

  // const selector2 = Web3EthAbi.encodeFunctionCall({
  //   name: 'transferFrom',
  //   type: 'function',
  //   inputs: [{
  //       type: 'address',
  //       name: 'myNumber'
  //   },{
  //       type: 'address',
  //       name: 'myString'
  //   },{
  //       type: 'uint256',
  //       name: 'myString'
  //   }]
  // }, ['2345675643', 'Hello!%']);
  // })

  // const test2 = Web3EthAbi.encodeFunctionData('swapToTON', [wtonAmount])
  // console.log(test2);
  // const wtonInterface2 = wtonInterface.encodeFunctionData('swapToTON', [amount])
  // console.log(wtonInterface2)
  // let amount = ethers.utils.parseUnits("1", 27);

  const calls = [ 
    {
      target: wtonAddress,
      allowFailure: false, // We allow failure for all calls.
      callData: functionBytecode3,
    },
    {
      target: wtonAddress,
      allowFailure: false, // We allow failure for all calls.
      callData: functionByte,
    },
    {
      target: l1bridge,
      allowFailure: false, // We allow failure for all calls.
      callData: functionDepositTo, 
    }
  ]

  /*
    //불가능
    1.approve
    2.transferFrom
    3.swapToTON
  */
  const calls2 = [ 
    {
      target: wtonAddress,
      allowFailure: false, // We allow failure for all calls.
      callData: functionApprove,
    },
    {
      target: wtonAddress,
      allowFailure: false, // We allow failure for all calls.
      callData: functionBytecode3,
    },
    {
      target: wtonAddress,
      allowFailure: false, // We allow failure for all calls.
      callData: functionByte,
    }
  ]

  /*
    //미리 approve받고 실행
    1.transferFrom
    2.swapToTON
  */
  const calls3 = [ 
    {
      target: wtonAddress,
      allowFailure: false, // We allow failure for all calls.
      callData: functionBytecode3,
    },
    {
      target: wtonAddress,
      allowFailure: false, // We allow failure for all calls.
      callData: functionByte,
    }
  ]

  const call4 = [
    {
      target: l1bridge,
      allowFailure: false, // We allow failure for all calls.
      callData: functionDepositToGas2,
    }
  ]

    
  

  before("account setting",async () => {
    testAccount = await ethers.getSigner(richAccount)
    await ethers.provider.send("hardhat_impersonateAccount",[richAccount]);
    await ethers.provider.send("hardhat_setBalance", [
      richAccount,
      "0x8ac7230489e80000",
    ]);
})

  describe("Deployment", function () {
    it("Set the Mullticall3", async () => {
      if(set == false) {
        Multicall3 = await ethers.getContractFactory("Multicall3");
        MultiCont = await Multicall3.deploy();
        console.log("MultiCall3Address :",MultiCont.address);
      } else {
        MultiCont = await ethers.getContractAt(Multi_ABI.abi, goerliMultiAddress, testAccount)
      }
    })

    it("set wton", async () => {
      wtonContract = new ethers.Contract(wtonAddress, WTON_ABI.abi, testAccount );
    })

    it("set ton", async () => {
      tonContract = new ethers.Contract(tonAddress, TON_ABI.abi, testAccount );
    })

  });

  describe("Multicall Test", function () {
    // it("multiCall safetransferFrom", async () => {
    //   let beforeTON = await tonContract.balanceOf(MultiCont.address)
    //   console.log(beforeTON)
    //   await wtonContract.connect(testAccount).approve(MultiCont.address, wtonAmount);
    //   await MultiCont.connect(testAccount).aggregate3(calls);
    //   let afterTON = await tonContract.balanceOf(MultiCont.address)
    //   console.log(afterTON)
    //   expect(beforeTON).to.be.equal(0);
    //   expect(beforeTON).to.be.gt(afterTON);
    // })

    // it("multiConti have wton", async () => {
    //   let beforeWTON = await wtonContract.balanceOf(MultiCont.address)
    //   console.log(beforeWTON)
    //   await wtonContract.connect(testAccount).transfer(MultiCont.address, wtonAmount)
    //   let afterWTON = await wtonContract.balanceOf(MultiCont.address)
    //   console.log(afterWTON)
    //   expect(afterWTON).to.be.gt(beforeWTON);
    // })

    // it("multiCon swapToTON", async () => {
    //   let beforeWTON = await wtonContract.balanceOf(MultiCont.address)
    //   console.log(beforeWTON)
    //   await MultiCont.connect(testAccount).aggregate3(calls2);
    //   let afterWTON = await wtonContract.balanceOf(MultiCont.address)
    //   console.log(afterWTON)
    // })

    // it("MultiCall Test (approve, transferFrom, swapToTON", async () => {
    //   let beforeWTON = await wtonContract.balanceOf(testAccount.address)
    //   console.log(beforeWTON)
    //   let beforeTON = await tonContract.balanceOf(MultiCont.address)
    //   console.log(beforeTON)
    //   await MultiCont.connect(testAccount).aggregate3(calls2);
    //   let afterWTON = await wtonContract.balanceOf(testAccount.address)
    //   console.log(afterWTON)
    //   let afterTON = await tonContract.balanceOf(MultiCont.address)
    //   console.log(afterTON)
    // })

    // it("Multical Test (transferFrom, swapToTON)", async () => {
    //   let beforeWTON = await wtonContract.balanceOf(testAccount.address)
    //   console.log(beforeWTON)
    //   let beforeTON = await tonContract.balanceOf(MultiCont.address)
    //   console.log(beforeTON)
    //   await wtonContract.connect(testAccount).approve(MultiCont.address, wtonAmount);
    //   await MultiCont.connect(testAccount).aggregate3(calls3);
    //   let afterWTON = await wtonContract.balanceOf(testAccount.address)
    //   console.log(afterWTON)
    //   let afterTON = await tonContract.balanceOf(MultiCont.address)
    //   console.log(afterTON)
    //   expect(beforeWTON).to.be.gt(afterWTON);
    //   expect(afterTON).to.be.gt(beforeTON);
    // })

    // it("MulticalTest (transferFrom, swapToTON, DepositToERC20", async () => {
    //   await wtonContract.connect(testAccount).approve(MultiCont.address, wtonAmount);
    //   await MultiCont.connect(testAccount).aggregate3(calls);
    // })

    // it("check balance WTON", async () => {
    //   let checkWTON = await wtonContract.balanceOf(testAccount.address)
    //   console.log(checkWTON)
    // })

    it("MulticallTest (depositERC20To)", async () => {
      await MultiCont.connect(testAccount).aggregate3(call4);
    })

    it("check balance WTON", async () => {
      let checkTON = await tonContract.balanceOf(MultiCont.address)
      console.log(checkTON)
    })
  });
});
