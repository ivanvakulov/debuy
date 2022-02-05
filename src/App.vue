<template>
<v-app>
    <Header></Header>

    <v-main>
        <router-view></router-view>
    </v-main>

    <v-bottom-sheet v-model='sheet'>
        <template v-slot:activator='{ on, attrs }'>
            <v-btn
                class='mx-5 my-5'
                color='primary'
                elevation='10'
                x-large
                fab
                dark
                fixed
                right
                bottom
                v-bind='attrs'
                v-on='on'>
                <v-icon>
                    mdi-plus
                </v-icon>
            </v-btn>
        </template>
        <v-sheet
            class='text-center'
            height='400px'>
            <v-btn
                class='mt-6'
                text
                color='error'
                @click='sheet = !sheet'>
                close
            </v-btn>
            <div class='my-3'>
                This is a bottom sheet using the inset prop
            </div>
        </v-sheet>
    </v-bottom-sheet>
</v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Header from "@/components/base/Header.vue";
import { AuthModule } from "@/store/modules/AuthStore";
import { ACTION_SET_MAIN_SUBSCRIBERS } from "@/store-consts";

@Component({
    components: { Header }
})
export default class App extends Vue {
    sheet: boolean = false

    async created() {
        await AuthModule[ACTION_SET_MAIN_SUBSCRIBERS]()
    }
}
</script>

<style lang="scss">

</style>
