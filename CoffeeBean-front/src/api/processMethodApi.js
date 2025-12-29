import axios from 'axios'

const request = axios.create({
    baseURL: 'http://localhost:8080/api/v1/process-method'
})

// 1. 取得分頁資料 (GET /{page}/{size})
export const getProcessMethods = (page, size) => {
    return request.get(`/${page}/${size}`)
}
// 搜尋處理法（Query 用)
export const searchProcessMethods = (name, engName) => {
    return request.get('/search', {
    params: {
        name,
        engName
    }
    })
}

// 2. 新增 (POST /)
export const createProcessMethod = (data) => {
    return request.post('', data)
}

// 3. 更新 (PUT /)
export const updateProcessMethod = (data) => {
    return request.put('', data)
}

// 4. 刪除 (DELETE /{id})
export const deleteProcessMethod = (id) => {
    return request.delete(`/${id}`)
}
