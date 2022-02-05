<template>
<v-card
    :loading='isAdvertLoading'
    class='mx-auto my-12'
    @click='goToAdvert'>
    <template slot='progress'>
        <v-progress-linear
            color='primary'
            height='10'
            indeterminate></v-progress-linear>
    </template>

    <v-img
        v-if='ipfsPhoto'
        height='250'
        :src='ipfsPhoto'></v-img>
    <v-img
        v-else
        height='250'
        src='@/assets/default-image.png'></v-img>

    <v-card-title>{{ advertTitle }}</v-card-title>

    <v-card-text>
        <v-row
            align='center'
            class='mx-0'>
            <div class='grey--text'>
                {{ createdAt }}
            </div>
        </v-row>

        <div class='my-4 text-subtitle-1'>
            {{ region }}
        </div>

        <div>{{ advertDescription }}</div>
    </v-card-text>

    <template v-if='false'>
        <v-divider class='mx-4'></v-divider>

        <v-card-actions>
            <v-btn
                color='deep-purple lighten-2'
                text
                @click='test'>
                Reserve
            </v-btn>
        </v-card-actions>
    </template>
</v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Moralis from "moralis/dist/moralis.min.js";
import { AdvertModule } from "@/store/modules/AdvertStore";
import { ACTION_GET_ADVERT } from "@/store-consts";
import { Advert } from "../../../types/Advert";
import { getIpfsUrl, getShortAddress } from "@/helpers/contract";

@Component
export default class AdvertItemCard extends Vue {
    @Prop({ type: Number, required: true })
    advertIndex!: number

    advert: Advert | null = null
    isAdvertLoading: boolean = false

    get ipfsPhoto(): string {
        return this.advert?.ipfs ? getIpfsUrl(this.advert?.ipfs) : ``
    }

    get advertTitle(): string {
        return this.advert?.title || ``
    }

    get advertDescription(): string {
        return this.advert?.description || ``
    }

    get createdAt(): string {
        const date = this.advert?.createdAt ? new Date(this.advert.createdAt * 1000).toLocaleDateString() : ``
        return date || ``
    }

    get sellerAddress(): string {
        return this.advert?.seller ? getShortAddress(this.advert.seller) : ``
    }

    get region(): string {
        return this.advert?.region || ``
    }

    async loadAdvert() {
        this.isAdvertLoading = true

        this.advert = await AdvertModule[ACTION_GET_ADVERT](this.advertIndex)

        this.isAdvertLoading = false
    }

    goToAdvert() {
        this.$router.push({ name: `AdvertPage`, params: { id: `${this.advertIndex}` } })
    }

    test() {}

    async created() {
        if (Moralis.isWeb3Enabled()) {
            await this.loadAdvert()
        }
    }
}
</script>

<style lang="sass">

</style>
