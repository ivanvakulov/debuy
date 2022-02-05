import { Action, Module, VuexModule, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
    ACTION_UPLOAD_ADVERT,
    ACTION_UPLOAD_IMAGE,
    ADVERT_STORE
} from "@/store-consts"
import Moralis from "moralis/dist/moralis.min.js";
import { getContractParameters } from "@/helpers/contract";
import { CreateAdvertParams } from "../../../types/Advert";

export interface IAdvertState {
}

@Module({ name: ADVERT_STORE, store, dynamic: true, namespaced: true, stateFactory: true })
class AdvertStore extends VuexModule implements IAdvertState {

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
}

export const AdvertModule = getModule(AdvertStore)
