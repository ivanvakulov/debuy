import { ExecuteFunctionOptions, ExecuteFunctionParams } from "../../types/Global";
// @ts-ignore
import ABI from "../abi/contracts/Debuy.sol/Debuy.json";

export const getContractParameters: (functionName: string, params?: ExecuteFunctionParams) => ExecuteFunctionOptions = (functionName, params) => ({
    contractAddress: process.env.VUE_APP_MORALIS_SMART_CONTRACT_ADDRESS as string,
    abi: ABI,
    functionName,
    params
})
