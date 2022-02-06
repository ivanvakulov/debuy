export type CreateAdvertParams = {
    _price: string | number
    _title: string
    _description: string
    _region: string
    _ipfs: string
    _buyer: string
}

export type EditAdvertParams = {
    _id: string | number
    _newPrice: string | number
    _newTitle: string
    _newDescription: string
    _newRegion: string
    _newIpfs: string
    _newBuyer: string
}

export type LockFundsParams = {
    id: string | number
    value: string | number
}

export type ProvideDiscountParams = {
    id: string | number
    discount: number
}

export type DropBuyerParams = {
    id: string | number
    address: string
}

export type GetAdvertParams = {
    id: string | number
    index: number
}

export type HydrateAdvertParams = {
    index: number
    advert: Advert | null
}

export type Advert = {
    id?: string | number
    buyer: string
    buyerRatio: number
    createdAt: number
    description: string
    ipfs: string
    price: number
    region: string
    seller: string
    sellerRatio: number
    title: string
    status: number
    discount: number
}

export enum AdvertStatus {
    Created,
    SellerBacked,
    BuyerBacked,
    Active,
    ForceClosed,
    Finished,
    Deleted
}
