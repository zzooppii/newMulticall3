import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import dotenv from "dotenv" ;

dotenv.config();

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      forking: {
        url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
      },
      // mining: {
      //   auto: false,
      //   interval: 0
      // },
      allowUnlimitedContractSize: false,
    },
    // hardhat: {
    //   chainId: 31337,
    // },
    local: {
      chainId: 31337,
      url: `http://127.0.0.1:8545/`,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      // accounts: [`${process.env.PRIVATE_KEY}`],
      // chainId: 5,
    },
  },
  solidity: "0.8.12",
};

export default config;
