<template>
    <div class="container">

    <div class="search-box">
        <h3>搜尋條件</h3>
        <div class="input-row">
        <div class="input-group">
            <label>Name</label>
            <input v-model="searchForm.name" placeholder="中文名稱" />
        </div>
        <div class="input-group">
            <label>Eng Name</label>
            <input v-model="searchForm.engName" placeholder="英文名稱" />
        </div>
        </div>

        <div class="btn-group">
        <button class="btn btn-clear" @click="clearSearch">Clear</button>
        <button class="btn btn-new" @click="openModal('create')">New</button>
        <button class="btn btn-query" @click="handleSearch">Query</button>
        </div>
    </div>

    <table>
        <thead>
        <tr>
            <th>Method</th>
            <th>Eng</th>
            <th>Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in methodList" :key="item.id">
            <td>{{ item.processMethod }}</td>
            <td>{{ item.processMethodEng }}</td>
            <td>
            <button class="btn-sm" @click="openModal('edit', item)">Ed</button>
            <button class="btn-sm btn-danger" @click="removeItem(item.id)">De</button>
            </td>
        </tr>
        </tbody>
    </table>

    <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
        <h3>{{ modalMode==='create' ? '新增處理法' : '編輯處理法' }}</h3>

        <div class="form-row">
            <label>Method</label>
            <input v-model="modalForm.processMethod" />
        </div>
        <div class="form-row">
            <label>Eng</label>
            <input v-model="modalForm.processMethodEng" />
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
    getProcessMethods,
    createProcessMethod,
    updateProcessMethod,
    deleteProcessMethod,
    searchProcessMethods
} from '../api/processMethodApi'

const methodList = ref([])
const page = ref(0)
const size = ref(10)
const totalPages = ref(1)

const searchForm = ref({ name:'', engName:'' })

const modalForm = ref({
    id:null,
    processMethod:'',
    processMethodEng:''
})

const isSearchMode = ref(false)
const showModal = ref(false)
const modalMode = ref('create')

async function fetchData () {
    let res

    
    if (isSearchMode.value) {
        res = await searchProcessMethods(
        searchForm.value.name.trim(),
        searchForm.value.engName.trim()
        )
        methodList.value = res.data
        page.value = 0
        totalPages.value = 1
        return   
    }

    
    res = await getProcessMethods(page.value, size.value)
    methodList.value = res.data.content
    totalPages.value = res.data.totalPages
}

function handleSearch () {
    page.value = 0
    isSearchMode.value = true
    fetchData()
}


function clearSearch () {
    searchForm.value = { name:'', engName:'' }
    page.value = 0
    isSearchMode.value = false
    fetchData()
}



function openModal (mode, item=null) {
    modalMode.value = mode
    showModal.value = true
    modalForm.value = item
        ? { ...item }
        : { id:null, processMethod:'', processMethodEng:'' }
}

function closeModal () {
  showModal.value = false
}

async function saveData () {
    modalMode.value === 'create'
        ? await createProcessMethod(modalForm.value)
        : await updateProcessMethod(modalForm.value)
    closeModal()
    fetchData()
}

async function removeItem (id) {
  if (!confirm('確定刪除?')) return
  await deleteProcessMethod(id)
  fetchData()
}

onMounted(fetchData)
</script>
<style scoped>
.container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    font-family: sans-serif;
}


.search-box {
    border: 1px solid #ccc;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
}
.input-row {
    display: flex;
    gap: 15px;
    margin-bottom: 10px;
    }
.input-group {
    display: flex;
    flex-direction: column;
}
.btn-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}


.btn { padding: 6px 15px; cursor: pointer; border-radius: 4px; border: 1px solid #999; }
.btn-new { background-color: #e3f2fd; }
.btn-query { background-color: #e8f5e9; }
.btn-clear { background-color: #fff; }
.btn-danger { background-color: #ffebee; color: red; border-color: red;}
.btn-sm { padding: 2px 6px; margin-right: 5px; cursor: pointer; }

table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th, td { padding: 8px; border: 1px solid #ccc; text-align: left; }
th { background-color: #eee; }
.pagination { margin-top: 15px; text-align: center; }


.modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.5); 
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.form-row {
    margin-bottom: 15px;
}
.form-row label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
}
.form-row input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box; 
}

.modal-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}
</style>