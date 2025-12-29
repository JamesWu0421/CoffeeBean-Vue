import axios from 'axios'

const request = axios.create({
    baseURL: 'http://localhost:8080/api/v1/bean-merchant'
})

// 1. 取得分頁資料 (GET /{page}/{size})
export const getMerchants = (page, size) => {
    return request.get(`/${page}/${size}`)
}
export const searchMerchants = (name) => {
    return request.get('/search', {
        params: {
            name
        
        }
})
}

// 2. 新增 (POST /)
export const createMerchant = (data) => {
    return request.post('', data)
}

// 3. 更新 (PUT /)
export const updateMerchant = (data) => {
    return request.put('', data)
}

// 4. 刪除 (DELETE /{id})
export const deleteMerchant = (id) => {
    return request.delete(`/${id}`)
}
