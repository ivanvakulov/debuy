import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: `/`,
        name: `HomePage`,
        component: Home
    },
    {
        path: `/advert/:id`,
        name: `AdvertPage`,
        component: () => import(/* webpackChunkName: "advert" */ `../views/Advert.vue`)
    }
]

const router = new VueRouter({
    mode: `history`,
    base: process.env.BASE_URL,
    routes
})

export default router
