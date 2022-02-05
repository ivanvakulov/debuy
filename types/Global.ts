
export type Chain = {
    id: string
    symbol: string
    address: string
}

export type ExecuteFunctionParams = Record<string, any>;

export type ExecuteFunctionOptions = {
    contractAddress: string;
    abi: object;
    functionName: string;
    msgValue?: string;
    params?: ExecuteFunctionParams;
}
