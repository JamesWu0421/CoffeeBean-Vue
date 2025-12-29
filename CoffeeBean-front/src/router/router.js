import { createRouter, createWebHistory } from 'vue-router'
import Country from '../view/country.vue'
import BeanMerchant from '../view/BeanMerchant.vue'
import ProcessMethod from '../view/ProcessMethod.vue'

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
    }
]
    


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
