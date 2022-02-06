import { Action, Module, VuexModule, getModule, Mutation } from 'vuex-module-decorators'
import store from '@/store'
import {
    ACTION_DELETE_ADVERT,
    ACTION_EDIT_ADVERT,
    ACTION_GET_ADVERT,
    ACTION_GET_ADVERT_FOR_LISTING,
    ACTION_GET_ADVERTS_FOR_LISTING_COUNT,
    ACTION_GET_ADVERT_BY_ADDRESS,
    ACTION_GET_ADVERTS_COUNT_BY_ADDRESS,
    ACTION_UPLOAD_ADVERT,
    ACTION_UPLOAD_IMAGE,
    ADVERT_STORE,
    GETTER_ADVERT_TO_EDIT,
    MUTATION_ADVERT_ITEM,
    MUTATION_ADVERT_TO_EDIT,
    ACTION_COULD_BE_FORCE_CLOSED_BY_SELLER,
    ACTION_COULD_BE_FORCE_CLOSED_BY_BUYER,
    ACTION_FORCE_CLOSE_ADVERT,
    ACTION_APPLY_ADVERT,
    ACTION_WITHDRAW_ADVERT,
    ACTION_CONFIRM_ADVERT,
    ACTION_PROVIDE_DISCOUNT,
    ACTION_UPDATE_BUYER,
    MUTATION_UPDATE_LISTING_INDICES,
    MUTATION_UPDATE_ADVERT_IN_LIST,
    MUTATION_UPDATE_LAST_LOADED_LISTING, GETTER_ADVERTS, GETTER_TOTAL_COUNT, GETTER_TOTAL_LAST_INDEX
} from "@/store-consts"
import Moralis from "moralis/dist/moralis.min.js";
import {
    getContractParameters,
    getNativeContractParameters,
    mergeArrays, populateAdvertNativeResponse,
    populateAdvertResponse
} from "@/helpers/contract";
import {
    Advert, AdvertIdType,
    CreateAdvertParams, DropBuyerParams,
    EditAdvertParams, GetAdvertItemParams, GetAdvertParams, HydrateAdvertParams,
    LockFundsParams,
    ProvideDiscountParams, SetCountsParams
} from "../../../types/Advert";
import { AuthModule } from "@/store/modules/AuthStore";
import { isNil, range } from "@/helpers/base";
import { Vue } from "vue-property-decorator";
import { MUMBAI_CHAIN, RINKEBY_CHAIN } from "@/helpers/consts";

const LOADING_STEP = 3;

export interface IAdvertState {
    advertToEdit: Advert | null
}

@Module({ name: ADVERT_STORE, store, dynamic: true, namespaced: true, stateFactory: true })
class AdvertStore extends VuexModule implements IAdvertState {
    advertItem: Advert | null = null
    advertToEdit: Advert | null = null

    advertsMumbaiListing: Array<Advert | AdvertIdType> = []
    advertsRinkebyListing: Array<Advert | AdvertIdType> = []
    totalListingMumbaiCount: number = 0
    totalListingRinkebyCount: number = 0
    listingPage: number = 1
    lastListingMumbaiIndex: number = -1
    lastListingRinkebyIndex: number = -1

    lastLoadedListing: `Main` | `My` | null = null

    get [GETTER_ADVERT_TO_EDIT](): Advert | null {
        return this.advertToEdit
    }

    get [GETTER_TOTAL_COUNT](): number {
        return this.totalListingMumbaiCount + this.totalListingRinkebyCount
    }

    get [GETTER_TOTAL_LAST_INDEX](): number {
        return this.lastListingMumbaiIndex + this.lastListingRinkebyIndex
    }

    get [GETTER_ADVERTS](): Array<Advert | AdvertIdType> {
        return mergeArrays(this.advertsMumbaiListing, this.advertsRinkebyListing)
    }

    @Mutation
    [MUTATION_UPDATE_LAST_LOADED_LISTING](listing: `Main` | `My` | null): void {
        this.lastLoadedListing = listing

        this.advertsMumbaiListing = []
        this.advertsRinkebyListing = []
        this.totalListingMumbaiCount = 0
        this.totalListingRinkebyCount = 0
        this.listingPage = 1
        this.lastListingMumbaiIndex = -1
        this.lastListingRinkebyIndex = -1
    }

    @Mutation
    [MUTATION_ADVERT_ITEM](advert: Advert | null): void {
        this.advertItem = advert
    }

    @Mutation
    [MUTATION_ADVERT_TO_EDIT](advertToEdit: Advert | null): void {
        this.advertToEdit = advertToEdit
    }

    @Mutation
    [MUTATION_UPDATE_ADVERT_IN_LIST](params: HydrateAdvertParams): void {
        Vue.set(
            params.chain === MUMBAI_CHAIN.id ? this.advertsMumbaiListing : this.advertsRinkebyListing,
            params.index,
            params.advert
        )
    }

    @Mutation
    [MUTATION_UPDATE_LISTING_INDICES](params?: SetCountsParams): void {
        if (!isNil(params?.countMumbai) && !isNil(params?.countRinkeby)) {
            this.totalListingMumbaiCount = params?.countMumbai as number
            this.totalListingRinkebyCount = params?.countRinkeby as number
        }

        const activeCount = this.listingPage * LOADING_STEP
        const activeIndicesMumbai = activeCount <= this.totalListingMumbaiCount ? range(this.lastListingMumbaiIndex + 1, activeCount) : range(this.lastListingMumbaiIndex + 1, this.totalListingMumbaiCount)
        const activeIndicesRinkeby = activeCount <= this.totalListingRinkebyCount ? range(this.lastListingRinkebyIndex + 1, activeCount) : range(this.lastListingRinkebyIndex + 1, this.totalListingRinkebyCount)

        this.lastListingMumbaiIndex = activeIndicesMumbai[activeIndicesMumbai.length - 1];
        this.lastListingRinkebyIndex = activeIndicesRinkeby[activeIndicesRinkeby.length - 1];
        this.advertsMumbaiListing = [
            ...this.advertsMumbaiListing,
            ...(activeIndicesMumbai.map(e => ({ id: e, chain: MUMBAI_CHAIN.id })))
        ].map((e, index) => ({ ...e, index }))
        this.advertsRinkebyListing = [
            ...this.advertsRinkebyListing,
            ...(activeIndicesRinkeby.map(e => ({ id: e, chain: RINKEBY_CHAIN.id })))
        ].map((e, index) => ({ ...e, index }))

        this.listingPage += 1
    }

    @Action({ rawError: true })
    async [ACTION_COULD_BE_FORCE_CLOSED_BY_SELLER](id: number | string): Promise<boolean | null> {
        try {
            const options = getContractParameters(`couldBeForceCloseBySeller`, { _id: id })

            return await Moralis.executeFunction(options)
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_COULD_BE_FORCE_CLOSED_BY_BUYER](id: number | string): Promise<boolean | null> {
        try {
            const options = getContractParameters(`couldBeForceCloseByBuyer`, { _id: id })

            return await Moralis.executeFunction(options)
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_FORCE_CLOSE_ADVERT](id: number | string): Promise<void> {
        try {
            const options = getContractParameters(`forceClose`, { _id: id })

            await Moralis.executeFunction(options)
        }  catch (e) {
            console.log(e)
            return Promise.resolve()
        }
    }

    @Action({ rawError: true })
    async [ACTION_GET_ADVERT]({ id, chain }: GetAdvertItemParams): Promise<void> {
        try {
            const nativeOptions = getNativeContractParameters(`advert`, chain,{ _id: `${id}` })

            const response = await Moralis.Web3API.native.runContractFunction(nativeOptions)

            const advert = {
                ...populateAdvertNativeResponse(response),
                chain,
            }
            this.context.commit(MUTATION_ADVERT_ITEM, advert)
        }  catch (e) {
            console.log(e)
            return Promise.resolve()
        }
    }

    @Action({ rawError: true })
    async [ACTION_GET_ADVERT_FOR_LISTING]({ id, index, chain }: GetAdvertParams): Promise<void> {
        try {
            const nativeOptions = getNativeContractParameters(`advertForListingByIndex`, chain,{ _index: `${id}` })

            const response = await Moralis.Web3API.native.runContractFunction(nativeOptions)

            const advert = {
                ...populateAdvertNativeResponse(response[0], !isNil(response.id) ? response.id : null),
                chain,
            }


            this.context.commit(MUTATION_UPDATE_ADVERT_IN_LIST, {
                index,
                advert,
                chain,
            })
        }  catch (e) {
            console.log(e)
            return Promise.resolve()
        }
    }

    @Action({ rawError: true })
    async [ACTION_GET_ADVERT_BY_ADDRESS]({ id, index, chain }: GetAdvertParams): Promise<void> {
        try {
            const nativeOptions = getNativeContractParameters(`advertOfAddressByIndex`, chain,{ _index: `${id}`, _address: AuthModule.account })

            const response = await Moralis.Web3API.native.runContractFunction(nativeOptions)

            const advert = {
                ...populateAdvertNativeResponse(response[0], !isNil(response.id) ? response.id : null),
                chain,
            }

            this.context.commit(MUTATION_UPDATE_ADVERT_IN_LIST, {
                index,
                advert,
                chain,
            })
        }  catch (e) {
            console.log(e)
            return Promise.resolve()
        }
    }

    @Action({ rawError: true })
    async [ACTION_GET_ADVERTS_FOR_LISTING_COUNT](): Promise<void> {
        try {
            const nativeOptionsMumbai = getNativeContractParameters(`advertsForListingCount`)
            const nativeOptionsRinke = getNativeContractParameters(`advertsForListingCount`, RINKEBY_CHAIN.id)

            const responseMumbai = await Moralis.Web3API.native.runContractFunction(nativeOptionsMumbai)
            const responseRinke = await Moralis.Web3API.native.runContractFunction(nativeOptionsRinke)

            this.context.commit(MUTATION_UPDATE_LISTING_INDICES, { countMumbai: responseMumbai, countRinkeby: responseRinke })
        }  catch (e) {
            console.log(e)
            return Promise.resolve()
        }
    }

    @Action({ rawError: true })
    async [ACTION_GET_ADVERTS_COUNT_BY_ADDRESS](): Promise<void> {
        try {
            const nativeOptionsMumbai = getNativeContractParameters(`advertsOfAddressCount`, MUMBAI_CHAIN.id, { _address: AuthModule.account })
            const nativeOptionsRinke = getNativeContractParameters(`advertsOfAddressCount`, RINKEBY_CHAIN.id, { _address: AuthModule.account })

            const responseMumbai = await Moralis.Web3API.native.runContractFunction(nativeOptionsMumbai)
            const responseRinke = await Moralis.Web3API.native.runContractFunction(nativeOptionsRinke)

            this.context.commit(MUTATION_UPDATE_LISTING_INDICES, { countMumbai: responseMumbai, countRinkeby: responseRinke })
        }  catch (e) {
            console.log(e)
            return Promise.resolve()
        }
    }

    @Action({ rawError: true })
    async [ACTION_UPLOAD_IMAGE](fileInput: File): Promise<string | null> {
        try {
            const file = new Moralis.File(fileInput.name, fileInput)
            await file.saveIPFS({ useMasterKey:true })

            return file.hash()
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_UPLOAD_ADVERT](params: CreateAdvertParams): Promise<number | null> {
        try {
            const options = getContractParameters(`createAdvert`, params)

            const transaction = await Moralis.executeFunction(options)

            const response = await transaction.wait();

            // @ts-ignore
            const event = response?.events?.find(el => el.event === `AdvertCreated`)
            const id = event?.topics[event.topics?.length - 1]

            return id ? parseInt(id, 16) : null
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_EDIT_ADVERT](params: EditAdvertParams): Promise<number | null> {
        try {
            const options = getContractParameters(`updateAdvert`, params)

            const transaction = await Moralis.executeFunction(options)

            await transaction.wait();

            this.context.dispatch(ACTION_GET_ADVERT, params._id)

            return null
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_DELETE_ADVERT](id: number | string): Promise<number | null> {
        try {
            const options = getContractParameters(`deleteAdvert`, { _id: id })

            const transaction = await Moralis.executeFunction(options)

            await transaction.wait();

            this.context.dispatch(ACTION_GET_ADVERT, id)

            return null
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_CONFIRM_ADVERT](id: number | string): Promise<number | null> {
        try {
            const options = getContractParameters(`confirmClose`, { _id: id })

            const transaction = await Moralis.executeFunction(options)

            await transaction.wait();

            this.context.dispatch(ACTION_GET_ADVERT, id)

            return null
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_WITHDRAW_ADVERT](id: number | string): Promise<number | null> {
        try {
            const options = getContractParameters(`withdraw`, { _id: id })

            const transaction = await Moralis.executeFunction(options)

            await transaction.wait();

            this.context.dispatch(ACTION_GET_ADVERT, id)

            return null
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_APPLY_ADVERT](params: LockFundsParams): Promise<number | null> {
        try {
            const options = getContractParameters(`applyToAdvert`, { _id: params.id })

            const transaction = await Moralis.executeFunction({
                ...options,
                msgValue: params.value
            })

            await transaction.wait();

            this.context.dispatch(ACTION_GET_ADVERT, params.id)

            return null
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_PROVIDE_DISCOUNT](params: ProvideDiscountParams): Promise<number | null> {
        try {
            const options = getContractParameters(`provideDiscount`, { _id: params.id, _discount: params.discount })

            const transaction = await Moralis.executeFunction(options)

            await transaction.wait();

            this.context.dispatch(ACTION_GET_ADVERT, params.id)

            return null
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_UPDATE_BUYER](params: DropBuyerParams): Promise<number | null> {
        try {
            const options = getContractParameters(`updateBuyer`, { _id: params.id, _newBuyer: params.address })

            const transaction = await Moralis.executeFunction(options)

            await transaction.wait();

            this.context.dispatch(ACTION_GET_ADVERT, params.id)

            return null
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }
}

export const AdvertModule = getModule(AdvertStore)
