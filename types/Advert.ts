export type CreateAdvertParams = {
    _price: string | number
    _title: string
    _description: string
    _region: string
    _ipfs: string
    _buyer: string
}

export type Advert = {
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
}
