<template>
<v-container>
    <v-row>
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
import { Vue, Component } from 'vue-property-decorator';
import AdvertItemCard from "@/components/base/AdvertItemCard.vue";
import Moralis from "moralis/dist/moralis.min.js";
import { AdvertModule } from "@/store/modules/AdvertStore";
import { ACTION_GET_ADVERTS_FOR_LISTING_COUNT } from "@/store-consts";
import { isNil } from "@/helpers/base";

const LOADING_STEP = 6;
const range = (start: number, end: number) => {
    // @ts-ignore
    return Array(end - start).fill().map((_, idx) => start + idx)
}

@Component({
    components: { AdvertItemCard }
})
export default class Home extends Vue {
    totalCount: number = 0
    page: number = 1
    lastIndex: number = 0
    advertsIndices: Array<number> = []
    unubscribe: any = null

    updateIndices() {
        const activeCount = this.page * LOADING_STEP
        const activeIndices = activeCount <= this.totalCount ? range(this.lastIndex, activeCount) : range(this.lastIndex, this.totalCount)

        this.lastIndex = activeIndices[activeIndices.length - 1];
        this.advertsIndices = activeIndices
    }

    async loadAdvertsCount(): Promise<void> {
        const count = await AdvertModule[ACTION_GET_ADVERTS_FOR_LISTING_COUNT]()

        if (!isNil(count)) {
            this.totalCount = count as number

            this.updateIndices()
        }
    }

    async created() {
        if (Moralis.isWeb3Enabled()) {
            await this.loadAdvertsCount()
        } else {
            this.unubscribe = Moralis.onWeb3Enabled(async() => {
                await this.loadAdvertsCount()
            })
        }
    }

    beforeDestroy() {
        if (this.unubscribe) {
            this.unubscribe()
        }
    }
}
</script>

<style lang="sass">

</style>
