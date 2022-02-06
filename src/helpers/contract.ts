import { ExecuteFunctionOptions, ExecuteFunctionParams } from "../../types/Global";
// @ts-ignore
import ABI from "../abi/contracts/Debuy.sol/Debuy.json";
import { Advert } from "../../types/Advert";
import { MORALIS_IPFS_PREFIX } from "@/helpers/consts";
import { isNil } from "@/helpers/base";

export const getShortAddress = (account: string): string => {
    return `${account.substring(0, 5)}...${account.slice(-4)}`
}

export const getIpfsUrl = (hash: string): string => {
    return `${MORALIS_IPFS_PREFIX}${hash}`
}

export const getContractParameters: (functionName: string, params?: ExecuteFunctionParams) => ExecuteFunctionOptions = (functionName, params) => ({
    contractAddress: process.env.VUE_APP_MORALIS_SMART_CONTRACT_ADDRESS as string,
    abi: ABI,
    functionName,
    params
})

export const populateAdvertResponse: (response: any, id?: number | null) => Advert = (response, id) => ({
    buyer: response.buyer.toLowerCase(),
    buyerRatio: parseInt(response.buyerRatio._hex, 16),
    createdAt: parseInt(response.createdAt._hex, 16),
    description: response.description,
    ipfs: response.ipfs,
    price: parseInt(response.price._hex, 16),
    region: response.region,
    seller: response.seller.toLowerCase(),
    sellerRatio: parseInt(response.sellerRatio._hex, 16),
    title: response.title,
    status: response.status,
    id: !isNil(id) ? id! : ``,
    discount: response.discount ? parseInt(response.discount._hex, 16) : 0
})
