import { createRouter, createWebHistory } from 'vue-router'
import Country from '../view/country.vue'
import BeanMerchant from '../view/BeanMerchant.vue'
import ProcessMethod from '../view/ProcessMethod.vue'
import GreenBean from '../view/GreenBean.vue'
import Stock from '@/view/Stock.vue'
import Roast from '@/view/Roast.vue'

const routes = [
    {
        path: '/country',
        name: 'Country',
        component: Country
    },
    {
        path: '/bean-merchant',
        name: 'BeanMerchant',
        component: BeanMerchant
    },
    { 
        path: '/process-method',
        name: 'ProcessMethod',
        component: ProcessMethod
    },
    { 
        path: '/green-bean',
        name: 'GreenBean',
        component: GreenBean
    },
    {
        path: '/stock',
        name: 'Stock',
        component: Stock
    },
    {
        path: '/roast',
        name: 'Roast',
        component: Roast
    }
]
    


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
