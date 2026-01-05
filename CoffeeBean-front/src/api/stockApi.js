import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8080/api/v1/stock'
})

export const getStocks = (page, size) => {
  return request.get(`/${page}/${size}`)
}

export const searchStocks = ({
  coffeeBeanId,
  minStockG,
  maxStockG,
  purchaseDateFrom,
  purchaseDateTo
}) => {
  return request.get('/search', {
    params: {
      coffeeBeanId,
      minStockG,
      maxStockG,
      purchaseDateFrom,
      purchaseDateTo
    }
  })
}


export const createStock = (data) => {
  return request.post('', data)
}

export const updateStock = (data) => {
  return request.put('', data)
}

export const deleteStock = (id) => {
  return request.delete(`/${id}`)
}
