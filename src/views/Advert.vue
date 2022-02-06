<template>
<v-container>
    <v-row>
        <v-col
            cols='12'
            md='8'>
            <v-skeleton-loader
                v-if='!advert'
                width='100%'
                height='400px'
                type='image'>
            </v-skeleton-loader>
            <v-carousel
                v-else
                v-model='slideIndex'
                height='400'
                dark
                hide-delimiters>
                <template v-if='!isNoPhoto'>
                    <v-carousel-item
                        v-for='img in ipfsPhotos'
                        :src='img'
                        lazy-src='@/assets/blur-image.png'
                        :key='img'>
                    </v-carousel-item>
                </template>
                <v-carousel-item
                    v-else
                    src='@/assets/default-image.png'>
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
                        <v-card-text class='b-description pl-0'>
                            {{ advertDescription }}
                        </v-card-text>
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
            <AdvertSellerBlock
                v-else
                :advert='advert'>
            </AdvertSellerBlock>

            <v-skeleton-loader
                v-if='!advert'
                class='mb-4'
                width='100%'
                height='112'
                type='card'></v-skeleton-loader>
            <AdvertBuyerBlock
                v-else-if='isBuyerSettled'
                :advert='advert'>
            </AdvertBuyerBlock>

            <v-skeleton-loader
                v-if='!advert'
                class='mb-4'
                width='100%'
                height='64'
                type='card'>
            </v-skeleton-loader>
            <AdvertPriceBlock
                v-else
                :advert='advert'>
            </AdvertPriceBlock>

            <AdvertSellerActionsBlock
                v-if='isSeller && !isFinished && !isClosed && !isDeleted'
                :advert='advert'
                :advert-id='$route.params.id'></AdvertSellerActionsBlock>

            <AdvertDiscountBlock
                v-if='isSeller && isActive'
                :advert='advert'
                :advert-id='$route.params.id'></AdvertDiscountBlock>

            <AdvertBuyerActionsBlock
                v-if='!isSeller && !isClosed &&!isDeleted && isAdvertAvailable'
                :advert='advert'
                :advert-id='$route.params.id'></AdvertBuyerActionsBlock>

            <AdvertForceCloseBlock
                v-if='forceCloseBySeller || forceCloseByBuyer'
                :advert-id='$route.params.id'>
            </AdvertForceCloseBlock>

            <v-alert
                v-if='isActive || (!isAdvertAvailable && isBuyerBacked && !isSeller)'
                border='top'
                color='warning lighten-1'
                class='mb-4'
                dark>
                {{ isSeller ?
                    `Waiting for Buyer to confirm the deal.` :
                    isBuyer ? `This deal is in progress. Confirm to finish it.` :
                    `This deal is in progress.`
                }}

                <router-link :to='{ name: "HomePage" }' class='white--text'>Find more deals</router-link>
            </v-alert>

            <v-alert
                v-if='(isCreated || isSellerBacked) && isBuyer'
                border='top'
                color='green lighten-2'
                class='mb-4'
                dark>
                This deal created specially for you!
                <br>
                (<a
                    :href='explorerBuyerLink'
                    target='_blank'
                    class='text-decoration-underline white--text'>
                    {{ buyerAddress }}
                </a>)
            </v-alert>

            <v-alert
                v-if='isActive && isBuyer && discountMinValue'
                border='top'
                color='green lighten-2'
                class='mb-4'
                dark>
                Seller applied {{ discountMinValue }}% discount for you!
            </v-alert>

            <v-alert
                v-if='isBuyerBacked && isSeller'
                border='top'
                color='warning lighten-1'
                class='mb-4'
                dark>
                <div
                    v-if='isBuyerDropLoading'
                    class='d-flex align-center justify-center'>
                    <v-progress-circular
                        indeterminate
                        size='25'
                        color='white'>
                    </v-progress-circular>
                </div>
                <template v-else>
                    Buyer
                    <a
                        :href='explorerBuyerLink'
                        target='_blank'
                        class='text-decoration-underline white--text'>
                        {{ buyerAddress }}
                    </a> staked funds for your deal!
                    <br>
                    <a
                        class='text-decoration-underline white--text'
                        @click.prevent='dropBuyer'>
                        Click here to drop him off.
                    </a>
                </template>
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
import AdvertPriceBlock from "@/components/advert/AdvertPriceBlock.vue";
import AdvertSellerBlock from "@/components/advert/AdvertSellerBlock.vue";
import AdvertForceCloseBlock from "@/components/advert/AdvertForceCloseBlock.vue";
import AdvertDiscountBlock from "@/components/advert/AdvertDiscountBlock.vue";
import AdvertBuyerBlock from "@/components/advert/AdvertBuyerBlock.vue";
import { AdvertModule } from "@/store/modules/AdvertStore";
import { GlobalModule } from "@/store/modules/GlobalStore";
import { AuthModule } from "@/store/modules/AuthStore";
import {
    ACTION_COULD_BE_FORCE_CLOSED_BY_BUYER,
    ACTION_COULD_BE_FORCE_CLOSED_BY_SELLER,
    ACTION_GET_ADVERT, ACTION_UPDATE_BUYER, GETTER_ACTIVE_CHAIN,
    MUTATION_ADVERT_ITEM
} from "@/store-consts";
import { Advert, AdvertStatus } from "../../types/Advert";
import { getIpfsUrl, getShortAddress } from "@/helpers/contract";
import { DEFAULT_ZERO_ADDRESS, NO_IMAGE_SETTLED_KEY } from "@/helpers/consts";
import { Chain } from "../../types/Global";

@Component({
    components: { AdvertSellerActionsBlock, AdvertBuyerActionsBlock, AdvertPriceBlock, AdvertSellerBlock, AdvertForceCloseBlock, AdvertDiscountBlock, AdvertBuyerBlock }
})
export default class AdvertPage extends Vue {
    slideIndex: number = 0

    forceCloseBySeller: boolean = false
    forceCloseByBuyer: boolean = false

    isBuyerDropLoading: boolean = false

    get advert(): Advert | null {
        return AdvertModule.advertItem
    }

    get isSeller(): boolean {
        return this.advert?.seller === AuthModule.account
    }

    get isBuyer(): boolean {
        return this.advert?.buyer === AuthModule.account
    }

    get isAdvertAvailable(): boolean {
        return this.advert?.buyer === AuthModule.account || !this.isBuyerSettled
    }

    get isBuyerSettled(): boolean {
        return this.advert?.buyer !== DEFAULT_ZERO_ADDRESS
    }

    get isCreated(): boolean {
        return this.advert?.status === AdvertStatus.Created
    }

    get isSellerBacked(): boolean {
        return this.advert?.status === AdvertStatus.SellerBacked
    }

    get isBuyerBacked(): boolean {
        return this.advert?.status === AdvertStatus.BuyerBacked
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

    get discountMinValue(): number {
        return this.advert?.discount || 0
    }

    get isNoPhoto(): boolean {
        return this.advert?.ipfs === NO_IMAGE_SETTLED_KEY
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

    get region(): string {
        return this.advert?.region || ``
    }

    get activeChain(): Chain | null {
        return GlobalModule[GETTER_ACTIVE_CHAIN]
    }

    get explorerBuyerLink(): string {
        return this.activeChain?.explorer ? `${this.activeChain?.explorer}${this.advert?.buyer || ``}` : ``
    }

    get buyerAddress(): string {
        return this.advert?.buyer ? getShortAddress(this.advert.buyer) : ``
    }

    @Watch(`$route`)
    async routeChangeHandler(): Promise<void> {
        await AdvertModule[ACTION_GET_ADVERT]({
            id: this.$route.params.id,
            chain: this.$route.params.chain
        })

        if (!this.advert) {
            this.$router.push({ name: `HomePage` })
        }
    }

    async dropBuyer() {
        this.isBuyerDropLoading = true

        await AdvertModule[ACTION_UPDATE_BUYER]({ id: this.$route.params.id, address: DEFAULT_ZERO_ADDRESS })

        this.isBuyerDropLoading = false
    }

    async loadAdvert() {
        await AdvertModule[ACTION_GET_ADVERT]({
            id: this.$route.params.id,
            chain: this.$route.params.chain
        })

        if (!this.advert) {
            this.$router.push({ name: `HomePage` })
        }
    }

    async checkForceCloseBySeller() {
        this.forceCloseBySeller = !!await AdvertModule[ACTION_COULD_BE_FORCE_CLOSED_BY_SELLER](this.$route.params.id)
    }

    async checkForceCloseByBuyer() {
        this.forceCloseByBuyer = !!await AdvertModule[ACTION_COULD_BE_FORCE_CLOSED_BY_BUYER](this.$route.params.id)
    }

    async initAdvertRequests() {
        await this.loadAdvert()

        if (this.isSeller && !this.isCreated) {
            await this.checkForceCloseBySeller()
        }

        if (this.isBuyer && !this.isCreated) {
            await this.checkForceCloseByBuyer()
        }
    }

    created() {
        if (this.$route.params.id) {
            this.initAdvertRequests()
        } else {
            this.$router.push({ name: `HomePage` })
        }
    }

    beforeDestroy() {
        AdvertModule[MUTATION_ADVERT_ITEM](null)
    }
}
</script>

<style lang="sass">
.b-description
    white-space: pre-wrap

</style>
