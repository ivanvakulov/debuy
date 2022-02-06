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
import { AdvertModule } from "@/store/modules/AdvertStore";
import {
    ACTION_GET_ADVERTS_FOR_LISTING_COUNT, GETTER_ADVERTS, GETTER_TOTAL_COUNT, GETTER_TOTAL_LAST_INDEX,
    MUTATION_UPDATE_LAST_LOADED_LISTING,
    MUTATION_UPDATE_LISTING_INDICES
} from "@/store-consts";
import { mixins } from "vue-class-component";
import { ObserverMixinOptions } from "../../types/Global";
import { Advert, AdvertIdType } from "../../types/Advert";

@Component({
    components: { AdvertItemCard }
})
export default class Home extends mixins(IntersectionObserverMixin) {
    get adverts(): Array<Advert | AdvertIdType> {
        return AdvertModule[GETTER_ADVERTS]
    }

    get lastLoadedListing(): `Main` | `My` | null {
        return AdvertModule.lastLoadedListing
    }

    get shouldLoadMoreAdverts(): boolean {
        return (AdvertModule[GETTER_TOTAL_LAST_INDEX] + 1) < AdvertModule[GETTER_TOTAL_COUNT]
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
        if (!this.adverts.length || !this.lastLoadedListing || this.lastLoadedListing !== `Main`) {
            await this.loadAdvertsCount()
        }

        this.$intersectionObserverMixin_setIntersectionObserver(this.getObserverOptions())
    }

    beforeDestroy() {
        this.$intersectionObserverMixin_killObservers()
    }
}
</script>

<style lang="sass">

</style>
