import axios from 'axios'


const request = axios.create({
    baseURL: 'http://localhost:8080/api/v1/country' 
})

// 1. 取得分頁資料 (對應 GET /{page}/{size})
export const getCountries = (page, size) => {
    return request.get(`/${page}/${size}`)
}

// 搜尋國家（Query 用）
export const searchCountries = (code, name, engName) => {
    return request.get('/search', {
        params: {
        code,
        name,
        engName
        }
    })
}
// 2. 新增 (對應 POST /)
export const createCountry = (data) => {
    return request.post('', data)
}

// 3. 更新 (對應 PUT /)
export const updateCountry = (data) => {
    return request.put('', data)
}

// 4. 刪除 (對應 DELETE /{id})
export const deleteCountry = (id) => {
    return request.delete(`/${id}`)
}