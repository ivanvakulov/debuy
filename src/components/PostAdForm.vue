<template>
<v-container>
    <v-btn absolute
           right
           color='primary'
           icon
           small
           :disabled='isButtonLoading'
           @click='emitClose'>
        <v-icon>
            mdi-close
        </v-icon>
    </v-btn>
    <v-row class='pt-16'>
        <v-col
            cols='12'
            md='6'>
            <CustomImagePicker @hash='setImageHash'></CustomImagePicker>
        </v-col>
        <v-col
            cols='12'
            md='6'>
            <v-text-field
                v-model='title'
                label='Title'
                :rules='titleRules'
                outlined>
            </v-text-field>
            <v-text-field
                v-model='region'
                label='Region'
                :rules='regionRules'
                outlined>
            </v-text-field>
            <v-text-field
                v-model='price'
                label='Price'
                :rules='priceRules'
                outlined>
                <v-chip
                    slot='append'
                    class='mt-n1'
                    color='primary'
                    text-color='white'
                    label>
                    {{ activeChainSymbol }}
                </v-chip>
            </v-text-field>
            <v-textarea
                v-model='description'
                outlined
                :rules='descriptionRules'
                label='Description'></v-textarea>
            <v-switch
                v-if='!specifyBuyerAddress'
                v-model='specifyBuyerAddress'
                class='mt-n4'
                label='Specify Buyer Address'></v-switch>
            <v-text-field
                v-else
                v-model='buyerAddress'
                label='Buyer Address'
                :rules='addressRules'
                outlined>
                <v-btn
                    slot='append'
                    class='mt-n2'
                    color='primary'
                    icon
                    :disabled='isButtonLoading'
                    @click='specifyBuyerAddress = false'>
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-text-field>

            <v-btn
                color='primary'
                :disabled='isButtonDisabled'
                :loading='isButtonLoading'
                large
                block
                @click='createAdvert'>
                Create
            </v-btn>
        </v-col>
    </v-row>
</v-container>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import CustomImagePicker from "@/components/base/CustomImagePicker.vue";
import { Chain } from "@/../types/Global.ts";
import { ACTION_UPLOAD_ADVERT, GETTER_ACTIVE_CHAIN } from "@/store-consts";
import { GlobalModule } from "@/store/modules/GlobalStore";
import { AdvertModule } from "@/store/modules/AdvertStore";
import { DEFAULT_ZERO_ADDRESS, ERC20_ADDRESS_LENGTH } from "@/helpers/consts";
import Moralis from "moralis/dist/moralis.min.js";
import { isNil } from "@/helpers/base";

@Component({
    components: { CustomImagePicker }
})
export default class PostAdForm extends Vue {
    imageHash: string | null = null
    title: string = ``
    price: string = ``
    region: string = ``
    description: string = ``
    buyerAddress: string = ``
    specifyBuyerAddress: boolean = false
    isButtonLoading: boolean = false

    priceRules: Array<Function> = [
        (value: string) => !!value || `Required.`,
        (value: string) => parseFloat(value) && parseFloat(value) > 0 || `Invalid price.`,
    ]
    regionRules: Array<Function> = [
        (value: string) => !!value || `Required.`,
    ]
    titleRules: Array<Function> = [
        (value: string) => !!value || `Required.`,
    ]
    descriptionRules: Array<Function> = [
        (value: string) => !!value || `Required.`,
    ]
    addressRules: Array<Function> = [
        (value: string) => !value || value.length === ERC20_ADDRESS_LENGTH || `Incorrect address.`,
    ]

    get activeChain(): Chain | null {
        return GlobalModule[GETTER_ACTIVE_CHAIN]
    }

    get activeChainSymbol(): string | null {
        return this.activeChain?.symbol || null
    }

    get isButtonDisabled(): boolean {
        return !this.title || !this.description || !this.price || !this.region || (this.specifyBuyerAddress && !this.buyerAddress)
    }

    setImageHash(hash: string | null): void {
        this.imageHash = hash
    }

    async createAdvert(): Promise<void> {
        this.isButtonLoading = true

        const id = await AdvertModule[ACTION_UPLOAD_ADVERT]({
            _title: this.title || ``,
            _description: this.description || ``,
            _ipfs: this.imageHash || ``,
            _price: Moralis.Units.ETH(this.price) || 0,
            _region: this.region || ``,
            _buyer: DEFAULT_ZERO_ADDRESS
        })

        if (!isNil(id)) {
            this.emitClose()
            this.$router.push({ name: `AdvertPage`, params: { id: `${id}` } })
        }

        this.isButtonLoading = false
    }

    @Emit(`close`)
    emitClose() { }
}
</script>

<style lang="sass">

</style>
