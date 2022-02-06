import { ExecuteFunctionOptions, ExecuteFunctionParams } from "../../types/Global";
// @ts-ignore
import ABI from "../abi/contracts/Debuy.sol/Debuy.json";
import { Advert } from "../../types/Advert";
import { MORALIS_IPFS_PREFIX, MUMBAI_CHAIN } from "@/helpers/consts";
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

export const getNativeContractParameters: (functionName: string, chain?: string, params?: ExecuteFunctionParams) => ExecuteFunctionOptions = (functionName, chain, params) => ({
    address: process.env.VUE_APP_MORALIS_SMART_CONTRACT_ADDRESS as string,
    abi: ABI,
    function_name: functionName,
    chain: chain || MUMBAI_CHAIN.id,
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

export const populateAdvertNativeResponse: (response: any, id?: number | null) => Advert = (response, id) => ({
    createdAt: response[0],
    status: +response[1],
    price: response[2],
    discount: response[3],
    title: response[4],
    description: response[5],
    region: response[6],
    ipfs: response[7],
    seller: response[8].toLowerCase(),
    buyer: response[9].toLowerCase(),
    buyerRatio: response[10],
    sellerRatio: response[11],
    id: !isNil(id) ? id! : ``,
})

export const mergeArrays = <T>(arr1: Array<T>, arr2: Array<T>) => {
    const longerArr = arr1.length > arr2.length ? arr1 : arr2
    const shorterArr = arr1.length > arr2.length ? arr2 : arr1

    return longerArr.reduce((accum: Array<T>, cur: T, index: number) => {
        accum.push(cur)

        if (shorterArr[index]) {
            accum.push(shorterArr[index])
        }

        return accum
    }, [])
}
