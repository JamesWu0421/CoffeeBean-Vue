<template>
  <div class="container">
    <div class="search-box">
        <h3>搜尋條件 (烘焙紀錄)</h3>

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
            <label>批次號 (Batch No)</label>
            <input type="text" v-model="searchForm.batchNo" placeholder="輸入批次號" />
            </div>
            
            <div class="input-group">
            <label>烘焙度</label>
            <input type="text" v-model="searchForm.roastLevel" placeholder="ex: City+" />
            </div>

            <div class="input-group">
            <label>烘焙日(起)</label>
            <input type="date" v-model="searchForm.roastDateFrom" />
            </div>
            
        </div>

        <div class="btn-group">
            <button class="btn btn-clear" @click="clearSearch">Clear</button>
            <button class="btn btn-new" @click="openModal()">New</button>
            <button class="btn btn-query" @click="handleSearch">Query</button>
        </div>
        </div>

    <div class="table-box">
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>批次號</th>
            <th>咖啡豆</th>
            <th>烘焙日</th>
            <th>生豆重(g)</th>
            <th>熟豆重(g)</th>
            <th>烘焙度</th>
            <th>評分</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in roastList" :key="item.roastId">
            <td>{{ item.roastId }}</td>
            <td>{{ item.batchNo }}</td>
            <td>{{ item.coffeeBean ? item.coffeeBean.beanVariety : '' }}</td>
            <td>{{ item.roastDate }}</td>
            <td>{{ item.greenBeanWeight }}</td>
            <td>{{ item.roastedBeanWeight }}</td>
            <td>{{ item.roastLevel }}</td>
            <td>{{ item.rating }}</td>
            <td>
              <button @click="openModal(item)">Edit</button>
              <button @click="removeItem(item.roastId)">Delete</button>
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

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ modalForm.roastId ? '編輯紀錄' : '新增紀錄' }}</h3>

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
          <label>批次號 (Batch No)</label>
          <input type="text" v-model="modalForm.batchNo" />
        </div>

        <div class="form-row">
          <label>烘焙日期</label>
          <input type="date" v-model="modalForm.roastDate" />
        </div>

        <div class="form-row">
          <label>烘焙度 (Level)</label>
          <input type="text" v-model="modalForm.roastLevel" />
        </div>

        <div class="form-row input-split">
          <div>
            <label>生豆重 (g)</label>
            <input type="number" step="0.1" v-model="modalForm.greenBeanWeight" />
          </div>
          <div>
            <label>熟豆重 (g)</label>
            <input type="number" step="0.1" v-model="modalForm.roastedBeanWeight" />
          </div>
        </div>

        <div class="form-row">
            <label>評分 (Rating)</label>
            <input type="number" v-model="modalForm.rating" />
        </div>

        <hr/>
        <h4 style="margin: 10px 0;">技術參數</h4>

        <div class="form-row input-split">
            <div>
                <label>入豆溫 (Charge)</label>
                <input type="number" v-model="modalForm.chargeTemp" />
            </div>
            <div>
                <label>下豆溫 (Drop)</label>
                <input type="number" step="0.1" v-model="modalForm.dropTemp" />
            </div>
        </div>

        <div class="form-row input-split">
             <div>
                <label>一爆時間</label>
                <input type="text" v-model="modalForm.firstCrackTime" placeholder="mm:ss"/>
            </div>
             <div>
                <label>一爆溫</label>
                <input type="number" step="0.1" v-model="modalForm.firstCrackTemp" />
            </div>
        </div>
        
         <div class="form-row">
             <label>下豆時間 (Drop Time)</label>
             <input type="text" v-model="modalForm.dropTime" placeholder="mm:ss" />
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
  getRoasts,
  createRoast,
  updateRoast,
  deleteRoast,
  searchRoasts
} from '@/api/roastApi' // 記得改 import 路徑
import axios from 'axios'

const roastList = ref([])
const coffeeBeanOptions = ref([])

const page = ref(0)
const size = ref(10)
const totalPages = ref(1)

const showModal = ref(false)
const isSearchMode = ref(false)

const searchForm = ref({
  coffeeBeanId: '',
  batchNo: '',
  roastLevel: '',
  roastDateFrom: '',
  roastDateTo: ''
})

// 初始化 Modal 表單，對應 Roast.java
const modalForm = ref({
  roastId: null,
  coffeeBeanId: '',
  batchNo: '',
  roastDate: '',
  greenBeanWeight: '',
  roastedBeanWeight: '',
  roastLevel: '',
  rating: '',
  chargeTemp: '',
  dropTemp: '',
  firstCrackTime: '',
  firstCrackTemp: '',
  dropTime: ''
  // ...其他欄位視需求加入
})

const getCoffeeBeanOptions = () =>
  axios.get('http://localhost:8080/api/v1/green-bean/options')

async function fetchData() {
  if (isSearchMode.value) {
    const res = await searchRoasts({
      coffeeBeanId: searchForm.value.coffeeBeanId || null,
      batchNo: searchForm.value.batchNo || null,
      roastLevel: searchForm.value.roastLevel || null,
      roastDateFrom: searchForm.value.roastDateFrom || null,
      roastDateTo: searchForm.value.roastDateTo || null
    })
    roastList.value = res.data.content
    totalPages.value = res.data.totalPages
    return
  }

  const res = await getRoasts(page.value, size.value)
  roastList.value = res.data.content
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
    batchNo: '',
    roastLevel: '',
    roastDateFrom: '',
    roastDateTo: ''
  }
  isSearchMode.value = false
  page.value = 0
  fetchData()
}

function openModal(item = null) {
  if (item) {
    // 複製 item 到 form, 注意處理 coffeeBeanId
    modalForm.value = { 
        ...item,
        coffeeBeanId: item.coffeeBean ? item.coffeeBean.id : (item.coffeeBeanId || '')
    }
  } else {
    // Reset
    modalForm.value = {
      roastId: null,
      coffeeBeanId: '',
      batchNo: '',
      roastDate: '',
      greenBeanWeight: '',
      roastedBeanWeight: '',
      roastLevel: '',
      rating: '',
      chargeTemp: '',
      dropTemp: '',
      firstCrackTime: '',
      firstCrackTemp: '',
      dropTime: ''
    }
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveData() {
  // 注意這裡判斷的是 roastId
  if (modalForm.value.roastId) {
    await updateRoast(modalForm.value)
  } else {
    await createRoast(modalForm.value)
  }
  closeModal()
  fetchData()
}

async function removeItem(id) {
  if (!confirm('確定刪除此烘焙紀錄？')) return
  await deleteRoast(id)
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
/* 大部分樣式沿用，只增加 modal 捲動處理 */
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
  width: 400px; /* 稍微加寬以容納兩欄 */
  border-radius: 8px;
  /* 因欄位較多，建議限制高度並允許捲動 */
  max-height: 90vh; 
  overflow-y: auto;
}
.form-row {
  margin-bottom: 12px;
}
.form-row label {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
}
/* 新增：讓兩個 input 並排的小工具 class */
.input-split {
  display: flex;
  gap: 10px;
}
.input-split > div {
  flex: 1;
}
.input-split input {
  width: 100%;
  box-sizing: border-box; /* 確保 padding 不會撐破寬度 */
}
.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>