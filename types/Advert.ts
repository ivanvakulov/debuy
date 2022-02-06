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

export type Advert = {
    id?: string | number
    buyer: string
    createdAt: number
    description: string
    ipfs: string
    price: number
    region: string
    seller: string
    title: string
    status: number
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
