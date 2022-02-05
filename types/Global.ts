
export type Chain = {
    id: string
    symbol: string
    address: string
    explorer: string
}

export type ExecuteFunctionParams = Record<string, any>;

export type ExecuteFunctionOptions = {
    contractAddress: string;
    abi: object;
    functionName: string;
    msgValue?: string;
    params?: ExecuteFunctionParams;
}

export type ObserverMixinOptions = {
    el: HTMLElement,
    root?: HTMLElement,
    rootMargin?: string,
    threshold?: number,
    callback: (options: ObserverMixinOptions) => Promise<void> | void,
}

export type CacheObserver = {
    id: number
    observer: IntersectionObserver
    el: HTMLElement
}
