<template>
<v-container>
    <v-row>
        <v-col
            cols='12'
            md='8'>
            <v-skeleton-loader
                v-if='!advert'
                width='100%'
                height='300px'
                type='image'></v-skeleton-loader>
            <v-carousel
                v-else
                v-model='slideIndex'
                height='300'
                dark
                hide-delimiters>
                <v-carousel-item
                    v-for='img in ipfsPhotos'
                    :src='img'
                    lazy-src='@/assets/blur-image.png'
                    :key='img'>
                </v-carousel-item>
            </v-carousel>

            <v-skeleton-loader
                v-if='!advert'
                width='100%'
                height='300px'
                type='card'></v-skeleton-loader>
            <v-card
                v-else
                class='mt-4 mx-auto'
                outlined>
                <v-list-item three-line>
                    <v-list-item-content>
                        <div class='d-flex justify-space-between mb-4'>
                            <v-chip
                                color='primary'>
                                <v-icon>
                                    mdi-calendar
                                </v-icon>
                                <span class='ml-2'>{{ createdAt }}</span>
                            </v-chip>

                            <v-chip
                                color='green'
                                text-color='white'>
                                <v-icon>
                                    mdi-map-marker-outline
                                </v-icon>
                                <span class='ml-2'>{{ region }}</span>
                            </v-chip>
                        </div>
                        <v-list-item-title class='text-h5 mb-1'>
                            {{ advertTitle }}
                        </v-list-item-title>
                        <v-card-text class='pl-0'>{{ advertDescription }}</v-card-text>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
        </v-col>
        <v-col
            cols='12'
            md='4'>
            <v-skeleton-loader
                v-if='!advert'
                class='mb-4'
                width='100%'
                height='112'
                type='card'></v-skeleton-loader>
            <v-card
                v-else
                class='mx-auto mb-4'
                outlined>
                <v-list-item three-line>
                    <v-list-item-content>
                        <div class='text-overline mb-4'>
                            Seller
                        </div>
                        <v-btn
                            :href='explorerLink'
                            :disabled='!explorerLink'
                            target='_blank'
                            color='primary'
                            rounded>
                            <v-icon>
                                mdi-open-in-new
                            </v-icon>
                            <span class='ml-2'>{{ sellerAddress }}</span>
                        </v-btn>
                    </v-list-item-content>

                    <v-list-item-avatar
                        rounded
                        size='80'
                        color='primary'>
                        <v-icon
                            color='white'
                            size='40'>
                            mdi-account-check
                        </v-icon>
                    </v-list-item-avatar>
                </v-list-item>
            </v-card>

            <v-skeleton-loader
                v-if='!advert'
                class='mb-4'
                width='100%'
                height='64'
                type='card'></v-skeleton-loader>
            <v-card
                v-else
                class='mx-auto mb-4'
                outlined>
                <div class='d-flex justify-space-between pa-4'>
                    <span class='text-overline'>Price</span>
                    <v-chip
                        color='primary'
                        label>
                        <v-icon left>
                            mdi-plus-circle-multiple
                        </v-icon>
                        {{ price }} {{ activeChainSymbol }}
                    </v-chip>
                </div>
            </v-card>

            <AdvertSellerActionsBlock
                v-if='isOwner && !isFinished && !isClosed && !isDeleted'
                :advert='advert'
                :advert-id='$route.params.id'></AdvertSellerActionsBlock>

            <AdvertBuyerActionsBlock
                v-if='!isOwner && !isClosed &&!isDeleted && isAdvertAvailable'
                :advert='advert'></AdvertBuyerActionsBlock>

            <v-alert
                v-if='isActive'
                border='top'
                color='warning lighten-1'
                class='mb-4'
                dark>
                This deal is in progress.
                <router-link :to='{ name: "HomePage" }' class='white--text'>Find more deals</router-link>
            </v-alert>

            <v-alert
                v-if='isFinished'
                border='top'
                color='primary lighten-2'
                class='mb-4'
                dark>
                This deal is finished.
                <router-link :to='{ name: "HomePage" }' class='white--text'>Find more deals</router-link>
            </v-alert>

            <v-alert
                v-if='isClosed || isDeleted'
                border='top'
                color='red lighten-2'
                class='mb-4'
                dark>
                This deal is not available anymore. <br>
                <router-link :to='{ name: "HomePage" }' class='white--text'>Find more deals</router-link>
            </v-alert>
        </v-col>
    </v-row>
</v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import AdvertSellerActionsBlock from "@/components/advert/AdvertSellerActionsBlock.vue";
import AdvertBuyerActionsBlock from "@/components/advert/AdvertBuyerActionsBlock.vue";
import { AdvertModule } from "@/store/modules/AdvertStore";
import { ACTION_GET_ADVERT, GETTER_ACTIVE_CHAIN, MUTATION_ADVERT_ITEM } from "@/store-consts";
import { Advert, AdvertStatus } from "../../types/Advert";
import Moralis from "moralis/dist/moralis.min.js";
import { getIpfsUrl, getShortAddress } from "@/helpers/contract";
import { GlobalModule } from "@/store/modules/GlobalStore";
import { Chain } from "../../types/Global";
import { AuthModule } from "@/store/modules/AuthStore";
import { DEFAULT_ZERO_ADDRESS } from "@/helpers/consts";

@Component({
    components: { AdvertSellerActionsBlock, AdvertBuyerActionsBlock }
})
export default class AdvertPage extends Vue {
    slideIndex: number = 0
    unubscribe: any = null

    get advert(): Advert | null {
        return AdvertModule.advertItem
    }

    get isOwner(): boolean {
        return this.advert?.seller === AuthModule.account
    }

    get isAdvertAvailable(): boolean {
        return this.advert?.buyer === AuthModule.account || this.advert?.buyer === DEFAULT_ZERO_ADDRESS
    }

    get isCreated(): boolean {
        return this.advert?.status === AdvertStatus.Created
    }

    get isActive(): boolean {
        return this.advert?.status === AdvertStatus.Active
    }

    get isFinished(): boolean {
        return this.advert?.status === AdvertStatus.Finished
    }

    get isClosed(): boolean {
        return this.advert?.status === AdvertStatus.ForceClosed
    }

    get isDeleted(): boolean {
        return this.advert?.status === AdvertStatus.Deleted
    }

    get ipfsPhotos(): Array<string> {
        return this.advert?.ipfs ? [getIpfsUrl(this.advert?.ipfs)] : []
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

    get price(): string {
        return this.advert?.price ? Moralis.Units.FromWei(`${this.advert?.price}`) : ``
    }

    get activeChain(): Chain | null {
        return GlobalModule[GETTER_ACTIVE_CHAIN]
    }

    get activeChainSymbol(): string | null {
        return this.activeChain?.symbol || null
    }

    get explorerLink(): string {
        return this.activeChain?.explorer ? `${this.activeChain?.explorer}${this.advert?.seller || ``}` : ``
    }

    get advertToEdit(): Advert | null {
        return AdvertModule.advertToEdit
    }

    @Watch(`$route`)
    async routeChangeHandler(): Promise<void> {
        await AdvertModule[ACTION_GET_ADVERT](this.$route.params.id)

        if (!this.advert) {
            this.$router.push({ name: `HomePage` })
        }
    }

    async loadAdvert() {
        await AdvertModule[ACTION_GET_ADVERT](this.$route.params.id)

        if (!this.advert) {
            this.$router.push({ name: `HomePage` })
        }
    }

    async created() {
        if (this.$route.params.id) {
            if (Moralis.isWeb3Enabled()) {
                await this.loadAdvert()
            } else {
                this.unubscribe = Moralis.onWeb3Enabled(async() => {
                    await this.loadAdvert()
                })
            }
        } else {
            this.$router.push({ name: `HomePage` })
        }
    }

    beforeDestroy() {
        if (this.unubscribe) {
            this.unubscribe()
        }

        AdvertModule[MUTATION_ADVERT_ITEM](null)
    }
}
</script>

<style lang="sass">

</style>
