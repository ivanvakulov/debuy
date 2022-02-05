import { Action, Module, VuexModule, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
    ACTION_GET_ADVERT, ACTION_GET_ADVERT_FOR_LISTING, ACTION_GET_ADVERTS_FOR_LISTING_COUNT,
    ACTION_UPLOAD_ADVERT,
    ACTION_UPLOAD_IMAGE,
    ADVERT_STORE
} from "@/store-consts"
import Moralis from "moralis/dist/moralis.min.js";
import { getContractParameters, populateAdvertResponse } from "@/helpers/contract";
import { Advert, CreateAdvertParams } from "../../../types/Advert";

export interface IAdvertState {
}

@Module({ name: ADVERT_STORE, store, dynamic: true, namespaced: true, stateFactory: true })
class AdvertStore extends VuexModule implements IAdvertState {

    @Action({ rawError: true })
    async [ACTION_GET_ADVERT](id: number | string): Promise<Advert | null> {
        try {
            const options = getContractParameters(`advert`, { _id: id })

            const response = await Moralis.executeFunction(options)

            return populateAdvertResponse(response)
        }  catch (e) {
            console.log(e)
            return Promise.resolve(null)
        }
    }

    @Action({ rawError: true })
    async [ACTION_GET_ADVERT_FOR_LISTING](id: number | string): Promise<Advert | null> {
        try {
            const options = getContractParameters(`advertForListingByIndex`, { _id: id })

            const response = await Moralis.executeFunction(options)

            return populateAdvertResponse(response)
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

            console.log(options)
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
}

export const AdvertModule = getModule(AdvertStore)
