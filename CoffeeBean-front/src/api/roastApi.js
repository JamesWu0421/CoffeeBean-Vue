import axios from 'axios'

// 假設你的後端 Controller RequestMapping 是 /api/v1/roast
const request = axios.create({
  baseURL: 'http://localhost:8080/api/v1/roast'
})

export const getRoasts = (page, size) => {
  return request.get(`/${page}/${size}`)
}

export const searchRoasts = ({
  coffeeBeanId,
  batchNo,
  roastLevel,
  roastDateFrom,
  roastDateTo
}) => {
  return request.get('/search', {
    params: {
      coffeeBeanId,
      batchNo,
      roastLevel,
      roastDateFrom,
      roastDateTo
    }
  })
}

export const createRoast = (data) => {
  return request.post('', data)
}

export const updateRoast = (data) => {
  return request.put('', data)
}

export const deleteRoast = (id) => {
  return request.delete(`/${id}`)
}