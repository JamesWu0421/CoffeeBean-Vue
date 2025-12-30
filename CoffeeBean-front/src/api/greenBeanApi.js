import axios from 'axios'

const request = axios.create({
    baseURL: 'http://localhost:8080/api/v1/green-bean'
})


export const getGreenBeans = (page, size) => {
    return request.get(`/${page}/${size}`)
}


export const searchGreenBeans = ({
    countryId,
    processMethodId,
    merchantId,
    beanVariety,
    productionYear
}) => {
    return request.get('/search', {
    params: {
        countryId,
        processMethodId,
        merchantId,
        beanVariety,
        productionYear
    }
    })
}

export const createGreenBean = (data) => {
    return request.post('', data)
}


export const updateGreenBean = (data) => {
    return request.put('', data)
}


export const deleteGreenBean = (id) => {
    return request.delete(`/${id}`)
}


export const getGreenBeanOptions = () => {
    return request.get('/options')
}
