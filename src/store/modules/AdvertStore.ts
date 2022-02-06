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
    MUTATION_UPDATE_LAST_LOADED_LISTING
} from "@/store-consts"
import Moralis from "moralis/dist/moralis.min.js";
import { getContractParameters,  populateAdvertResponse } from "@/helpers/contract";
import {
    Advert,
    CreateAdvertParams, DropBuyerParams,
    EditAdvertParams, GetAdvertParams, HydrateAdvertParams,
    LockFundsParams,
    ProvideDiscountParams
} from "../../../types/Advert";
import { AuthModule } from "@/store/modules/AuthStore";
import { isNil, range } from "@/helpers/base";
import { Vue } from "vue-property-decorator";

const LOADING_STEP = 6;

export interface IAdvertState {
    advertToEdit: Advert | null
}

@Module({ name: ADVERT_STORE, store, dynamic: true, namespaced: true, stateFactory: true })
class AdvertStore extends VuexModule implements IAdvertState {
    advertItem: Advert | null = null
    advertToEdit: Advert | null = null

    advertsListing: Array<Advert | number> = []
    totalListingCount: number = 0
    listingPage: number = 1
    lastListingIndex: number = -1

    lastLoadedListing: `Main` | `My` | null = null

    get [GETTER_ADVERT_TO_EDIT](): Advert | null {
        return this.advertToEdit
    }

    @Mutation
    [MUTATION_UPDATE_LAST_LOADED_LISTING](listing: `Main` | `My` | null): void {
        this.lastLoadedListing = listing

        this.advertsListing = []
        this.totalListingCount = 0
        this.listingPage = 1
        this.lastListingIndex = -1
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
        Vue.set(this.advertsListing, params.index, params.advert)
    }

    @Mutation
    [MUTATION_UPDATE_LISTING_INDICES](count?: number): void {
        if (!isNil(count)) {
            this.totalListingCount = count as number
        }

        const activeCount = this.listingPage * LOADING_STEP
        const activeIndices = activeCount <= this.totalListingCount ? range(this.lastListingIndex + 1, activeCount) : range(this.lastListingIndex + 1, this.totalListingCount)

        this.lastListingIndex = activeIndices[activeIndices.length - 1];
        this.advertsListing = [...this.advertsListing, ...activeIndices]

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
    async [ACTION_GET_ADVERT](id: number | string): Promise<Advert | null> {
        try {
            const options = getContractParameters(`advert`, { _id: id })

            const response = await Moralis.executeFunction(options)

            const advert = populateAdvertResponse(response)
            this.context.commit(MUTATION_ADVERT_ITEM, advert)

            return advert
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_GET_ADVERT_FOR_LISTING]({ id, index }: GetAdvertParams): Promise<Advert | null> {
        try {
            const options = getContractParameters(`advertForListingByIndex`, { _index: id })

            const response = await Moralis.executeFunction(options)
            const _id = response.id._hex

            const advert = populateAdvertResponse(response[0], _id ? parseInt(_id, 16) : null)

            this.context.commit(MUTATION_UPDATE_ADVERT_IN_LIST, {
                index,
                advert,
            })

            return advert
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_GET_ADVERT_BY_ADDRESS](id: number | string): Promise<Advert | null> {
        try {
            const options = getContractParameters(`advertOfAddressByIndex`, { _index: id, _address: AuthModule.account })

            const response = await Moralis.executeFunction(options)
            const _id = response.id._hex

            return populateAdvertResponse(response[0], _id ? parseInt(_id, 16) : null)
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_GET_ADVERTS_FOR_LISTING_COUNT](): Promise<number | null> {
        try {
            const options = getContractParameters(`advertsForListingCount`)

            const response = await Moralis.executeFunction(options)
            const count = response._hex

            this.context.commit(MUTATION_UPDATE_LISTING_INDICES, count ? parseInt(count, 16) : null)

            return count ? parseInt(count, 16) : null
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_GET_ADVERTS_COUNT_BY_ADDRESS](): Promise<number | null> {
        try {
            const options = getContractParameters(`advertsOfAddressCount`, { _address: AuthModule.account })

            const response = await Moralis.executeFunction(options)
            const count = response._hex

            return count ? parseInt(count, 16) : null
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
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
