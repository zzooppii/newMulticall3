import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const Web3EthAbi = require('web3-eth-abi');
const { padLeft, web3 } = require('web3-utils');

const WTON_ABI = require("../abis/WTON.json");

// const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
// if (!MAINNET_RPC_URL) throw new Error('Please set the MAINNET_RPC_URL environment variable.');
// const provider = new JsonRpcProvider("https://goerli.infura.io/v3/086aad6219cf436eb12e2ceae00e3b29");

describe("Multicall3", function () {
  let richAccount = "0xf0B595d10a92A5a9BC3fFeA7e79f5d266b6035Ea";
  let testAccount : any

  let Multicall3: any
  let MultiCont: any

  let wtonContract: any

  let wtonAddress = "0xe86fCf5213C785AcF9a8BFfEeDEfA9a2199f7Da6";
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

  const functionByte = "0xf53fe70f0000000000000000000000000000000000000000033b2e3c9fd0803ce8000000"
  const functionBytecode2 = "0x70a08231000000000000000000000000f0b595d10a92a5a9bc3ffea7e79f5d266b6035ea"
  const functionBytecode3 = "0x23b872dd000000000000000000000000f0b595d10a92a5a9bc3ffea7e79f5d266b6035ea000000000000000000000000195c1d13fc588c0b1ca8a78dd5771e0ee5a2eae40000000000000000000000000000000000000000000000000000000000989680"
  const functionBytecode4 = "0xa9059cbb000000000000000000000000195c1d13fc588c0b1ca8a78dd5771e0ee5a2eae40000000000000000000000000000000000000000033b2e3c9fd0803ce8000000"

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
  ]

  const calls2 = [ 
    {
      target: wtonAddress,
      allowFailure: false, // We allow failure for all calls.
      callData: functionByte,
    },
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
      Multicall3 = await ethers.getContractFactory("Multicall3");
      MultiCont = await Multicall3.deploy();
      console.log("MultiCall3Address :",MultiCont.address);
    })

    it("set wton", async () => {
      wtonContract = new ethers.Contract(wtonAddress, WTON_ABI.abi, testAccount );
    })
  });

  describe("Multicall Test", function () {
    it("multiCall safetransferFrom", async () => {
      let beforeWTON = await wtonContract.balanceOf(testAccount.address)
      console.log(beforeWTON)
      await wtonContract.connect(testAccount).approve(MultiCont.address, wtonAmoun2);
      let tx = await MultiCont.connect(testAccount).aggregate3(calls);
      await tx.wait();
      let afterWTON = await wtonContract.balanceOf(testAccount.address)
      console.log(afterWTON)
      // expect(afterWTON).to.be.gt(beforeWTON);
    })

    it("multiConti have wton", async () => {
      let beforeWTON = await wtonContract.balanceOf(MultiCont.address)
      console.log(beforeWTON)
      await wtonContract.connect(testAccount).transfer(MultiCont.address, wtonAmount)
      let afterWTON = await wtonContract.balanceOf(MultiCont.address)
      console.log(afterWTON)
      expect(afterWTON).to.be.gt(beforeWTON);
    })

    it("multiCon swapToTON", async () => {
      let beforeWTON = await wtonContract.balanceOf(MultiCont.address)
      console.log(beforeWTON)
      await MultiCont.connect(testAccount).aggregate3(calls2);
      let afterWTON = await wtonContract.balanceOf(MultiCont.address)
      console.log(afterWTON)
    })
  });
});
