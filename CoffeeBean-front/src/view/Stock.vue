<template>
  <div class="container">
    <div class="search-box">
        <h3>搜尋條件</h3>

        <div class="input-row">
            <div class="input-group">
            <label>咖啡豆</label>
            <select v-model="searchForm.coffeeBeanId">
                <option value="">全部</option>
                <option v-for="b in coffeeBeanOptions" :key="b.id" :value="b.id">
                {{ b.beanVariety }}
                </option>
            </select>
            </div>

            <div class="input-group">
            <label>庫存 ≥</label>
            <input type="number" v-model="searchForm.minStockG" />
            </div>

            <div class="input-group">
            <label>庫存 ≤</label>
            <input type="number" v-model="searchForm.maxStockG" />
            </div>

            <div class="input-group">
            <label>進貨日(起)</label>
            <input type="date" v-model="searchForm.purchaseDateFrom" />
            </div>

            
        </div>

        <div class="btn-group">
            <button class="btn btn-clear" @click="clearSearch">Clear</button>
            <button class="btn btn-new" @click="openModal()">New</button>
            <button class="btn btn-query" @click="handleSearch">Query</button>
        </div>
        </div>

    <!-- ===== table ===== -->
    <div class="table-box">
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>咖啡豆</th>
            <th>庫存(g)</th>
            <th>進貨日</th>
            <th>成本</th>
            <th>售價</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stockList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.coffeeBeanName }}</td>
            <td>{{ item.stockG }}</td>
            <td>{{ item.purchaseDate }}</td>
            <td>{{ item.purchasePrice }}</td>
            <td>{{ item.sellingPrice }}</td>
            <td>
              <button @click="openModal(item)">Edit</button>
              <button @click="removeItem(item.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button :disabled="page === 0" @click="changePage(-1)">上一頁</button>
        <span> Page {{ page + 1 }} / {{ totalPages }} </span>
        <button
          :disabled="page >= totalPages - 1"
          @click="changePage(1)"
        >
          下一頁
        </button>
      </div>
    </div>

    <!-- ===== modal ===== -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">

        <div class="form-row">
          <label>咖啡豆</label>
          <select v-model="modalForm.coffeeBeanId">
            <option value="">請選擇</option>
            <option
              v-for="b in coffeeBeanOptions"
              :key="b.id"
              :value="b.id"
            >
              {{ b.beanVariety }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label>庫存(g)</label>
          <input type="number" v-model="modalForm.stockG" />
        </div>

        <div class="form-row">
          <label>進貨日</label>
          <input type="date" v-model="modalForm.purchaseDate" />
        </div>

        <div class="form-row">
          <label>成本</label>
          <input type="number" v-model="modalForm.purchasePrice" />
        </div>

        <div class="form-row">
          <label>售價</label>
          <input type="number" v-model="modalForm.sellingPrice" />
        </div>

        <div class="form-row">
          <label>備註</label>
          <input v-model="modalForm.storageInfo" />
        </div>

        <div class="modal-footer">
          <button @click="closeModal">取消</button>
          <button @click="saveData">儲存</button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getStocks,
  createStock,
  updateStock,
  deleteStock,
  searchStocks
} from '@/api/stockApi'
import axios from 'axios'

const stockList = ref([])
const coffeeBeanOptions = ref([])

const page = ref(0)
const size = ref(10)
const totalPages = ref(1)

const showModal = ref(false)
const isSearchMode = ref(false)



const searchForm = ref({
  coffeeBeanId: '',
  minStockG: '',
  maxStockG: '',
  purchaseDateFrom: '',
  purchaseDateTo: ''
})

const modalForm = ref({
  id: null,
  coffeeBeanId: '',
  stockG: '',
  purchaseDate: '',
  purchasePrice: '',
  sellingPrice: '',
  storageInfo: ''
})

const getCoffeeBeanOptions = () =>
  axios.get('http://localhost:8080/api/v1/green-bean/options')

async function fetchData() {
  if (isSearchMode.value) {
    const res = await searchStocks({
      coffeeBeanId: searchForm.value.coffeeBeanId || null,
      minStockG: searchForm.value.minStockG || null,
      maxStockG: searchForm.value.maxStockG || null,
      purchaseDateFrom: searchForm.value.purchaseDateFrom || null,
      purchaseDateTo: searchForm.value.purchaseDateTo || null
    })
    stockList.value = res.data.content
    totalPages.value = res.data.totalPages
    return
  }

  const res = await getStocks(page.value, size.value)
  stockList.value = res.data.content
  totalPages.value = res.data.totalPages
}

function handleSearch() {
  isSearchMode.value = true
  page.value = 0
  fetchData()
}

function clearSearch() {
  searchForm.value = {
    coffeeBeanId: '',
    minStockG: '',
    maxStockG: '',
    purchaseDateFrom: '',
    purchaseDateTo: ''
  }
  isSearchMode.value = false
  page.value = 0
  fetchData()
}

function openModal(item = null) {
  if (item) {
    modalForm.value = { ...item }
  } else {
    modalForm.value = {
      id: null,
      coffeeBeanId: '',
      stockG: '',
      purchaseDate: '',
      purchasePrice: '',
      sellingPrice: '',
      storageInfo: ''
    }
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveData() {
  if (modalForm.value.id) {
    await updateStock(modalForm.value)
  } else {
    await createStock(modalForm.value)
  }
  closeModal()
  fetchData()
}

async function removeItem(id) {
  if (!confirm('確定刪除？')) return
  await deleteStock(id)
  fetchData()
}

function changePage(delta) {
  page.value += delta
  fetchData()
}

onMounted(async () => {
  coffeeBeanOptions.value = (await getCoffeeBeanOptions()).data
  fetchData()
})
</script>
<style scoped>
.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}
.search-box {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
}
.input-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
.input-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}
.btn-group {
  margin-top: 10px;
  text-align: right;
}
.btn {
  padding: 6px 14px;
  margin-left: 6px;
}
.btn-new {
  background: #e3f2fd;
}
.btn-query {
  background: #e8f5e9;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 6px;
}
.pagination {
  margin-top: 15px;
  text-align: center;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  width: 340px;
  border-radius: 8px;
}
.form-row {
  margin-bottom: 12px;
}
.form-row label {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
}
.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>

