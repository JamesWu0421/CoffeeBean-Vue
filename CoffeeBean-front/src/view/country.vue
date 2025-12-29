<template>
    <div class="container">
    
    <div class="search-box">
        <h3>搜尋條件</h3>
        <div class="input-row">
            <div class="input-group">
            <label>Ctry. CODE:</label>
            <input type="text" v-model="searchForm.code" placeholder="查詢代碼" />
            </div>
            <div class="input-group">
            <label>Ctry. Name:</label>
            <input type="text" v-model="searchForm.name" placeholder="查詢名稱" />
            </div>
            <div class="input-group">
            <label>Ctry. engName:</label>
            <input type="text" v-model="searchForm.engName" placeholder="查詢英文名" />
            </div>
        </div>

        <div class="btn-group">
            <button class="btn btn-clear" @click="clearSearch">Clear</button>
            <button class="btn btn-new" @click="openModal('create')">New</button> 
            <button class="btn btn-query" @click="handleSearch">Query</button>
        </div>
    </div>

    <div class="table-box">
        <table border="1">
            <thead>
            <tr>
                <th>Select</th>
                <th>CODE</th>
                <th>Name</th>
                <th>ENG</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in countryList" :key="item.id">
                <td><input type="checkbox" /></td>
                <td>{{ item.countryCode }}</td>
                <td>{{ item.countryName }}</td>
                <td>{{ item.countryEngName }}</td>
                <td class="action-col">
                <button class="btn-sm" @click="openModal('edit', item)">Ed</button>
                <button class="btn-sm btn-danger" @click="removeItem(item.id)">De</button>
                </td>
            </tr>
            </tbody>
        </table>

        <div class="pagination">
            <button :disabled="page === 0" @click="changePage(-1)">上一頁</button>
            <span> Page {{ page + 1 }} / {{ totalPages }} </span>
            <button :disabled="page >= totalPages - 1" @click="changePage(1)">下一頁</button>
        </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
            <h3>{{ modalMode === 'create' ? '新增國家' : '編輯國家' }}</h3>
            
            <div class="form-row">
            <label>CODE:</label>
            <input type="text" v-model="modalForm.countryCode">
            </div>
            <div class="form-row">
            <label>Name:</label>
            <input type="text" v-model="modalForm.countryName">
            </div>
            <div class="form-row">
            <label>Eng:</label>
            <input type="text" v-model="modalForm.countryEngName">
            </div>

            <div class="modal-footer">
            <button class="btn btn-clear" @click="closeModal">取消 (X)</button>
            <button class="btn btn-new" @click="saveData">儲存 (OK)</button>
            </div>
        </div>
    </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
    getCountries, 
    createCountry, 
    updateCountry, 
    deleteCountry,
    searchCountries
} from '../api/countryApi'


const countryList = ref([])
const page = ref(0)
const size = ref(10)
const totalPages = ref(1)


const searchForm = ref({
    code: '',
    name: '',
    engName: ''
})


const modalForm = ref({
    id: null,
    countryCode: '',
    countryName: '',
    countryEngName: ''
})


const showModal = ref(false)
const modalMode = ref('create') 
const isSearchMode = ref(false)


async function fetchData() {
  let res

  if (isSearchMode.value) {
    res = await searchCountries(
      searchForm.value.code,
      searchForm.value.name,
      searchForm.value.engName
    )
    countryList.value = res.data

    
    totalPages.value = 1
    page.value = 0
    return  
  }

  
  res = await getCountries(page.value, size.value)
  countryList.value = res.data.content
  totalPages.value = res.data.totalPages
}



function clearSearch() {
    searchForm.value = { code: '', name: '', engName: '' }
    page.value = 0
    isSearchMode.value = false
    fetchData()
}


function handleSearch() {
    page.value = 0
    isSearchMode.value = true
    fetchData()
}

function openModal(mode, item = null) {
    modalMode.value = mode
    showModal.value = true
    
    if (mode === 'edit' && item) {
        modalForm.value = { ...item }
    } else {
        modalForm.value = { id: null, countryCode: '', countryName: '', countryEngName: '' }
    }
}


function closeModal() {
    showModal.value = false
}


async function saveData() {
    try {
        if (modalMode.value === 'create') {
        await createCountry(modalForm.value)
        alert('新增成功')
        } else {
        await updateCountry(modalForm.value)
        alert('更新成功')
        }
        closeModal() 
        fetchData()  
    } catch (err) {
        console.error(err)
        alert('儲存失敗')
    }
}


async function removeItem(id) {
    if (!confirm('確定刪除此筆資料嗎？(Confirm)')) return
    
    try {
        await deleteCountry(id)
        fetchData()
    } catch (err) {
        alert('刪除失敗')
    }
}


function changePage(delta) {
    const newPage = page.value + delta
    if (newPage < 0 || newPage >= totalPages.value) return 
    page.value = newPage
    fetchData()
}

onMounted(() => {
    isSearchMode.value = false
    fetchData()
})

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