<template>
  <div class="container">
    <div class="search-box">
      <h3>搜尋條件</h3>

      <div class="input-row">
        <div class="input-group">
          <label>國家</label>
          <select v-model="searchForm.countryId">
            <option value="">全部</option>
            <option v-for="c in countryOptions" :key="c.id" :value="c.id">
              {{ c.countryName }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <label>處理法</label>
          <select v-model="searchForm.processMethodId">
            <option value="">全部</option>
            <option v-for="p in processOptions" :key="p.id" :value="p.id">
              {{ p.processMethod }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <label>豆商</label>
          <select v-model="searchForm.merchantId">
            <option value="">全部</option>
            <option v-for="m in merchantOptions" :key="m.id" :value="m.id">
              {{ m.merchantName }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <label>豆名</label>
          <input v-model="searchForm.beanVariety" placeholder="Bean Variety" />
        </div>

        <div class="input-group">
          <label>年份</label>
          <select v-model="searchForm.productionYear">
            <option value="">全部</option>
            <option v-for="y in yearOptions" :key="y" :value="y">
              {{ y }}
            </option>
          </select>
        </div>
      </div>

      <div class="btn-group">
        <button class="btn btn-clear" @click="clearSearch">Clear</button>
        <button class="btn btn-new" @click="openModal">New</button>
        <button class="btn btn-query" @click="handleSearch">Query</button>
      </div>
    </div>


    <div class="table-box">
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>國家</th>
            <th>處理法</th>
            <th>豆商</th>
            <th>豆名</th>
            <th>年份</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in greenBeanList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.country }}</td>
            <td>{{ item.processMethod }}</td>
            <td>{{ item.beanMerchant }}</td>
            <td>{{ item.beanVariety }}</td>
            <td>{{ item.productionYear }}</td>
            <td>
                <button class="btn-sm" @click="openModal(item)">Edit</button>
                <button class="btn-sm btn-danger" @click="removeItem(item.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>


      <div v-if="!isSearchMode" class="pagination">
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
        <h3>新增咖啡豆</h3>

        <div class="form-row">
          <label>國家</label>
          <select v-model="modalForm.countryId">
            <option value="">請選擇</option>
            <option v-for="c in countryOptions" :key="c.id" :value="c.id">
              {{ c.countryName }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label>處理法</label>
          <select v-model="modalForm.processMethodId">
            <option value="">請選擇</option>
            <option v-for="p in processOptions" :key="p.id" :value="p.id">
              {{ p.processMethod }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label>豆商</label>
          <select v-model="modalForm.beanMerchantId">
            <option :value="null">請選擇</option>
            <option v-for="m in merchantOptions" :key="m.id" :value="m.id">
                {{ m.merchantName }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label>產區</label>
          <input v-model="modalForm.region" />
        </div>

        <div class="form-row">
          <label>處理廠</label>
          <input v-model="modalForm.processingPlant" />
        </div>

        <div class="form-row">
          <label>豆名</label>
          <input v-model="modalForm.beanVariety" />
        </div>

        <div class="form-row">
          <label>年份</label>
          <select v-model="modalForm.productionYear">
            <option value="">請選擇</option>
            <option v-for="y in yearOptions" :key="y" :value="y">
              {{ y }}
            </option>
          </select>
        </div>

        <div class="modal-footer">
          <button class="btn btn-clear" @click="closeModal">取消</button>
          <button class="btn btn-new" @click="saveData">儲存</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getGreenBeans,
  searchGreenBeans,
  createGreenBean,
  updateGreenBean,
  deleteGreenBean
} from '@/api/greenBeanApi'

import axios from 'axios' 


const greenBeanList = ref([])

const page = ref(0)
const size = ref(10)
const totalPages = ref(1)

const isSearchMode = ref(false)
const showModal = ref(false)


const searchForm = ref({
  countryId: '',
  processMethodId: '',
  merchantId: '',
  beanVariety: '',
  productionYear: ''
})

const modalForm = ref({
  id: null,
  countryId: null,
  processMethodId: null,
  beanMerchantId: null,   
  region: '',
  processingPlant: '',
  beanVariety: '',
  productionYear: null
})


/* ================= options ================= */
const countryOptions = ref([])
const processOptions = ref([])
const merchantOptions = ref([])
const yearOptions = Array.from({ length: 27 }, (_, i) => 2000 + i)

/* ================= options api ================= */
const getCountryOptions = () =>
  axios.get('http://localhost:8080/api/v1/country/options')

const getProcessOptions = () =>
  axios.get('http://localhost:8080/api/v1/process-method/options')

const getMerchantOptions = () =>
  axios.get('http://localhost:8080/api/v1/bean-merchant/options')


async function fetchData() {
  if (isSearchMode.value) {
    const res = await searchGreenBeans({
      countryId: searchForm.value.countryId || null,
      processMethodId: searchForm.value.processMethodId || null,
      merchantId: searchForm.value.merchantId || null,
      beanVariety: searchForm.value.beanVariety || null,
      productionYear: searchForm.value.productionYear || null
    })
    greenBeanList.value = res.data.content
    totalPages.value = res.data.totalPages
    return
  }

  const res = await getGreenBeans(page.value, size.value)
  greenBeanList.value = res.data.content
  totalPages.value = res.data.totalPages
}


function handleSearch() {
  isSearchMode.value = true
  page.value = 0
  fetchData()
}

function clearSearch() {
  searchForm.value = {
    countryId: '',
    processMethodId: '',
    merchantId: '',
    beanVariety: '',
    productionYear: ''
  }
  isSearchMode.value = false
  page.value = 0
  fetchData()
}


function changePage(delta) {
  const next = page.value + delta
  if (next < 0 || next >= totalPages.value) return
  page.value = next
  fetchData()
}
    

function openModal(item = null) {
  if (item) {
    modalForm.value = {
      id: item.id,
      countryId: item.countryId ?? null,
      processMethodId: item.processMethodId ?? null,
      beanMerchantId: item.beanMerchantId ?? null, 
      region: item.region ?? '',
      processingPlant: item.processingPlant ?? '',
      beanVariety: item.beanVariety ?? '',
      productionYear: item.productionYear ?? null
    }
  } else {
    
    modalForm.value = {
      id: null,
      countryId: null,          
      processMethodId: null,    
      beanMerchantId: null,     
      region: '',
      processingPlant: '',
      beanVariety: '',
      productionYear: null
    }
  }

  showModal.value = true
}


function closeModal() {
  showModal.value = false
}
async function saveData() {
  if (modalForm.value.id) {
    await updateGreenBean(modalForm.value)
    alert('更新成功')
  } else {
    await createGreenBean(modalForm.value)
    alert('新增成功')
  }
  closeModal()
  isSearchMode.value = false
  page.value = 0
  fetchData()
}
async function removeItem(id) {
  if (!confirm('確定刪除？')) return
  await deleteGreenBean(id)
  fetchData()
}
onMounted(async () => {
  countryOptions.value = (await getCountryOptions()).data
  processOptions.value = (await getProcessOptions()).data
  merchantOptions.value = (await getMerchantOptions()).data
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
