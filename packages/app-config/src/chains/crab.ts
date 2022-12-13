import { ChainConfig } from "@darwinia/app-types";
import contractABI from "../abi/crabContract.json";

export const crab: ChainConfig = {
  name: "Crab",
  displayName: "Crab",
  explorerURL: ["https://pangolin.subscan.io/"],
  rpcURL: ["https://pangolin-rpc.darwinia.network/"],
  kton: {
    address: "0x0000000000000000000000000000000000000402",
    symbol: "CKTON",
    decimals: 18,
  },
  ring: {
    address: "0xc52287b259b2431ba0f61BC7EBD0eD793B0b7044",
    symbol: "CRAB",
    decimals: 18,
  },
  contractAddress: "0xcA927Df15afb7629b79dA4713a871190315c7409", // This is a random address brought from fee market
  contractInterface: contractABI,
  chainId: 43,
};
