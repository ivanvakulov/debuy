<template>
<v-container>
    <v-row id='adverts_listing'>
        <v-col
            v-for='advertIndex in advertsIndices'
            :key='`advert-${advertIndex}`'
            cols='12'
            md='4'>
            <AdvertItemCard :advert-index='advertIndex'></AdvertItemCard>
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
import { ACTION_GET_ADVERTS_FOR_LISTING_COUNT } from "@/store-consts";
import { isNil } from "@/helpers/base";
import { mixins } from "vue-class-component";
import { ObserverMixinOptions } from "../../types/Global";

const LOADING_STEP = 6;
// const BOTTOM_OFFSET_TO_FETCH = window.innerHeight * 2

const range = (start: number, end: number) => {
    // @ts-ignore
    return Array(end - start).fill().map((_, idx) => start + idx)
}

@Component({
    components: { AdvertItemCard }
})
export default class Home extends mixins(IntersectionObserverMixin) {
    totalCount: number = 0
    page: number = 1
    lastIndex: number = -1
    advertsIndices: Array<number> = []
    unubscribe: any = null

    get shouldLoadMoreAdverts(): boolean {
        return (this.lastIndex + 1) < this.totalCount
    }

    updateIndices() {
        const activeCount = this.page * LOADING_STEP
        const activeIndices = activeCount <= this.totalCount ? range(this.lastIndex + 1, activeCount) : range(this.lastIndex + 1, this.totalCount)

        this.lastIndex = activeIndices[activeIndices.length - 1];
        this.advertsIndices = [...this.advertsIndices, ...activeIndices]
    }

    async loadAdvertsCount(): Promise<void> {
        const count = await AdvertModule[ACTION_GET_ADVERTS_FOR_LISTING_COUNT]()

        if (!isNil(count)) {
            this.totalCount = count as number

            this.updateIndices()

            this.page += 1
        }
    }

    async handleIntersectionObserver(): Promise<void> {
        if (!this.shouldLoadMoreAdverts) return

        this.updateIndices()

        this.page += 1

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

    async created() {
        if (Moralis.isWeb3Enabled()) {
            await this.loadAdvertsCount()

            this.$intersectionObserverMixin_setIntersectionObserver(this.getObserverOptions())
        } else {
            this.unubscribe = Moralis.onWeb3Enabled(async() => {
                await this.loadAdvertsCount()

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
