<template>
<v-container>
    <v-row id='adverts_listing'>
        <v-col
            v-for='(advert, index) in adverts'
            :key='`advert-${index}`'
            cols='12'
            md='4'>
            <AdvertItemCard
                :advert='advert'
                :advert-index='index'>
            </AdvertItemCard>
        </v-col>
    </v-row>
</v-container>
</template>

<script lang="ts">
import {  Component } from 'vue-property-decorator';
import AdvertItemCard from "@/components/base/AdvertItemCard.vue";
import IntersectionObserverMixin from "@/mixins/IntersectionObserverMixin";
import Moralis from "moralis/dist/moralis.min.js";
import { AdvertModule } from "@/store/modules/AdvertStore";
import {
    ACTION_GET_ADVERTS_FOR_LISTING_COUNT,
    MUTATION_UPDATE_LAST_LOADED_LISTING,
    MUTATION_UPDATE_LISTING_INDICES
} from "@/store-consts";
import { mixins } from "vue-class-component";
import { ObserverMixinOptions } from "../../types/Global";
import { Advert } from "../../types/Advert";

@Component({
    components: { AdvertItemCard }
})
export default class Home extends mixins(IntersectionObserverMixin) {
    unubscribe: any = null

    get adverts(): Array<Advert | number> {
        return AdvertModule.advertsListing
    }

    get lastLoadedListing(): `Main` | `My` | null {
        return AdvertModule.lastLoadedListing
    }

    get shouldLoadMoreAdverts(): boolean {
        return (AdvertModule.lastListingIndex + 1) < AdvertModule.totalListingCount
    }

    async loadAdvertsCount(): Promise<void> {
        AdvertModule[MUTATION_UPDATE_LAST_LOADED_LISTING](`Main`)

        await AdvertModule[ACTION_GET_ADVERTS_FOR_LISTING_COUNT]()
    }

    async handleIntersectionObserver(): Promise<void> {
        if (!this.shouldLoadMoreAdverts) return

        AdvertModule[MUTATION_UPDATE_LISTING_INDICES]()

        await this.$nextTick()
        this.resetObservers()
    }

    resetObservers() {
        this.$intersectionObserverMixin_killObservers();
        if (this.shouldLoadMoreAdverts) {
            this.$intersectionObserverMixin_setIntersectionObserver(this.getObserverOptions())
        }
    }

    getObserverOptions(): ObserverMixinOptions {
        const elArr = this.$el.querySelectorAll(`#adverts_listing .b-advert`) || []
        const lastItem = elArr[elArr.length - 1]

        return {
            el: lastItem as HTMLElement,
            callback: this.handleIntersectionObserver
        }
    }

    async mounted() {
        if (Moralis.isWeb3Enabled()) {
            if (!this.adverts.length || !this.lastLoadedListing || this.lastLoadedListing !== `Main`) {
                await this.loadAdvertsCount()
            }

            this.$intersectionObserverMixin_setIntersectionObserver(this.getObserverOptions())
        } else {
            this.unubscribe = Moralis.onWeb3Enabled(async() => {
                if (!this.adverts.length || !this.lastLoadedListing || this.lastLoadedListing !== `Main`) {
                    await this.loadAdvertsCount()
                }

                this.$intersectionObserverMixin_setIntersectionObserver(this.getObserverOptions())
            })
        }
    }

    beforeDestroy() {
        if (this.unubscribe) {
            this.unubscribe()

            this.$intersectionObserverMixin_killObservers()
        }
    }
}
</script>

<style lang="sass">

</style>
