<template>
<v-card
    :loading='isAdvertLoading'
    height='432px'
    class='b-advert mx-auto my-12'
    @click='goToAdvert'>
    <template slot='progress'>
        <v-progress-linear
            color='primary'
            height='10'
            indeterminate></v-progress-linear>
    </template>

    <v-skeleton-loader
        v-if='isAdvertLoading'
        width='100%'
        height='250px'
        type='image'></v-skeleton-loader>
    <v-img
        v-else-if='!isNoPhoto'
        height='250'
        lazy-src='@/assets/blur-image.png'
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
import { ACTION_GET_ADVERT_FOR_LISTING } from "@/store-consts";
import { Advert } from "../../../types/Advert";
import { getIpfsUrl, getShortAddress } from "@/helpers/contract";
import { NO_IMAGE_SETTLED_KEY } from "@/helpers/consts";

@Component
export default class AdvertItemCard extends Vue {
    @Prop({ type: [Object, Number], required: true })
    advert!: Advert | number

    @Prop({ type: Number, required: true })
    advertIndex!: number

    @Prop({ type: String, default: ACTION_GET_ADVERT_FOR_LISTING })
    loadAdvertMethod!: string

    isAdvertLoading: boolean = false

    get isAdvertNumber(): boolean {
        return Number.isInteger(this.advert)
    }

    get isNoPhoto(): boolean {
        if (this.isAdvertNumber) return true

        return (this.advert as Advert)?.ipfs === NO_IMAGE_SETTLED_KEY
    }

    get ipfsPhoto(): string {
        if (this.isAdvertNumber) return ``

        return (this.advert as Advert)?.ipfs ? getIpfsUrl((this.advert as Advert)?.ipfs) : ``
    }

    get advertTitle(): string {
        if (this.isAdvertNumber) return ``

        return (this.advert as Advert)?.title || ``
    }

    get advertDescription(): string {
        if (this.isAdvertNumber) return ``

        // @ts-ignore
        return (this.advert as Advert)?.description?.length > 100 ? `${(this.advert as Advert)?.description?.substr(0, 100)}...` : (this.advert as Advert)?.description || ``
    }

    get createdAt(): string {
        if (this.isAdvertNumber) return ``

        const date = (this.advert as Advert)?.createdAt ? new Date((this.advert as Advert).createdAt * 1000).toLocaleDateString() : ``
        return date || ``
    }

    get sellerAddress(): string {
        if (this.isAdvertNumber) return ``

        return (this.advert as Advert)?.seller ? getShortAddress((this.advert as Advert).seller) : ``
    }

    get region(): string {
        if (this.isAdvertNumber) return ``

        return (this.advert as Advert)?.region || ``
    }

    async loadAdvert() {
        this.isAdvertLoading = true

        if (this.isAdvertNumber) {
            // @ts-ignore
            await AdvertModule[this.loadAdvertMethod]({ id: this.advert, index: this.advertIndex })
        }

        this.isAdvertLoading = false
    }

    goToAdvert() {
        this.$router.push({ name: `AdvertPage`, params: { id: `${this.isAdvertNumber ? this.advert : (this.advert as Advert)?.id}` } })
    }

    async created() {
        if (Moralis.isWeb3Enabled()) {
            await this.loadAdvert()
        }
    }
}
</script>

<style lang="sass">
.b-advert

    .v-card__title
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        display: block

</style>
