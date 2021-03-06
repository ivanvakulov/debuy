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

    <v-btn
        class='b-network-label'
        color='white'
        icon
        disabled
        large>
        <v-img
            v-if='advertChainSlug === "mumbai"'
            width='40px'
            src='@/assets/mumbai.svg'>
        </v-img>
        <v-img
            v-if='advertChainSlug === "rinkeby"'
            width='40px'
            src='@/assets/rinkeby.svg'>
        </v-img>
    </v-btn>

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

    <v-card-title class='d-flex justify-space-between'>
        <div class='b-title-text'>{{ advertTitle }}</div>

        <v-skeleton-loader
            v-if='isAdvertLoading'
            width='50px'
            height='32px'
            type='text'>
        </v-skeleton-loader>
        <v-chip
            v-else
            color='primary'
            label>
            {{ price }} {{ activeChainSymbol }}
        </v-chip>
    </v-card-title>

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
</v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { AdvertModule } from "@/store/modules/AdvertStore";
import { ACTION_GET_ADVERT_FOR_LISTING } from "@/store-consts";
import { Advert, AdvertIdType } from "../../../types/Advert";
import { getIpfsUrl, getShortAddress } from "@/helpers/contract";
import { MUMBAI_CHAIN, NO_IMAGE_SETTLED_KEY, SUPPORTED_CHAINS } from "@/helpers/consts";
import Moralis from "moralis/dist/moralis.min.js";
import { Chain } from "../../../types/Global";

@Component
export default class AdvertItemCard extends Vue {
    @Prop({ type: [Object, Number], required: true })
    advert!: Advert | AdvertIdType

    @Prop({ type: Number, required: true })
    advertIndex!: number

    @Prop({ type: String, default: ACTION_GET_ADVERT_FOR_LISTING })
    loadAdvertMethod!: string

    isAdvertLoading: boolean = false

    get activeChain(): Chain | null {
        const chain = SUPPORTED_CHAINS.find(e => e.id === this.advert?.chain || e.slug === this.advert?.chain)

        return chain || null
    }

    get activeChainSymbol(): string | null {
        return this.activeChain?.symbol || null
    }

    get advertChainSlug(): string {
        const chain = SUPPORTED_CHAINS.find(e => e.id === this.advert?.chain || e.slug === this.advert?.chain)

        return chain?.slug || ``
    }

    get isAdvertNumber(): boolean {
        return !(this.advert as Advert).createdAt
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
        return (this.advert as Advert)?.description?.length > 90 ? `${(this.advert as Advert)?.description?.substr(0, 90)}...` : (this.advert as Advert)?.description || ``
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

    get price(): string {
        if (this.isAdvertNumber) return ``

        return (this.advert as Advert)?.price ? Moralis.Units.FromWei(`${(this.advert as Advert)?.price}`) : ``
    }

    async loadAdvert() {
        this.isAdvertLoading = true

        if (this.isAdvertNumber) {
            // @ts-ignore
            await AdvertModule[this.loadAdvertMethod]({ id: (this.advert as AdvertIdType).id, index: (this.advert as AdvertIdType).index, chain: (this.advert as AdvertIdType).chain })
        }

        this.isAdvertLoading = false
    }

    goToAdvert() {
        const chain = SUPPORTED_CHAINS.find(e => e.id === this.advert?.chain || e.slug === this.advert?.chain)

        this.$router.push({
            name: `AdvertPage`,
            params: {
                id: `${this.isAdvertNumber ? (this.advert as AdvertIdType).id : (this.advert as Advert)?.id}`,
                chain: chain?.slug || MUMBAI_CHAIN.slug
            }
        })
    }

    async created() {
        await this.loadAdvert()
    }
}
</script>

<style lang="sass">
.b-advert
    position: relative

    .b-network-label
        background-color: white
        position: absolute
        z-index: 1
        top: 5px
        right: 5px

    .b-title-text
        max-width: 60%
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        display: block

</style>
