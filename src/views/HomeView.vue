<template>
  <div style="padding: 50px 80px;">
    <div style="text-align: center; font-size: 0.9rem; padding: 0 0 20px 0;">
      <h3>态势数据爬虫工具</h3>
    </div>
    <div style="display: flex; align-items: center;">
      <el-select v-model="selectValue" placeholder="请选择..." size="large" style="width: 240px" :disabled="loading"
        @change="handleChange">
        <el-option v-for="item in ip" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <div class="buttoms" style="height: 40px; line-height: 32px;">
        <el-button :disabled="loading" @click="collect">采集</el-button>
        <el-date-picker :disabled="disdatepick" style=" margin-left: 15px; height: 40px;" v-model="datePicker"
          type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" @change="daterange"
          @update:modelValue="handleDateChange" />
      </div>
    </div>
    <el-table :data="data1" stripe style="width: 100%;height: 600px; margin: 10px 0;" @row-click="rowClick"
      v-loading="loading"
      element-loading-spinner="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'><path fill='#409eff' d='M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z'></path></svg>"
      element-loading-text="正在加载..." border>
      <!-- // 空数据状态的插槽 换可以引入中文包-->
      <!-- <template #empty>
        <div>暂无数据</div>
      </template> -->
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="author" label="作者" width="200">
        <template #default="scope">
          <div v-if="safeParseJSON(scope.row.author)" style="display: flex;">
            <div v-for="(item, index) in JSON.parse(scope.row.author)" :key="index">{{ item.author }}<span
                v-if="index < JSON.parse(scope.row.author).length - 1">,&nbsp;</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sitename" label="站点名称" width="200" />
      <el-table-column prop="datasource" label="数据来源" width="200" />
      <el-table-column prop="publishDate" label="发布日期" width="300" />
    </el-table>
    <el-pagination style="float: right;" v-model:current-page="currentPage" v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]" :total="total1" layout="total, sizes, prev, pager, next, jumper"
      :disabled="loading" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <!-- <div style="text-align: right;">
      <el-button @click="exportData">导出数据</el-button>
    </div> -->
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import json from '../assets/json/json.json'
// import cs from '../assets/json/cs.json'
import ip from '../assets/json/ip.json'
import indexDB from '../assets/api/indexDB.js'


const ids = ref([]);
let flag = ref(false)//判断维护两个数组，1.接口的返回数据tableData 和 2.筛选的数据 tableDaterange
let disdatepick = ref(true)//时间选择器
let datePicker = ref('')// 时间范围值
const loading = ref(false);  // 控制 loading 状态
let data1 = ref([])//table 表格渲染数据
let tableData = ref([])//原始数据（不动）
let tableDaterange = ref([])//时间筛选数据（不动）
let selectValue = ref('')//选择的网站
let total1 = ref(0)//总数
let currentPage = ref(1)//当前页
let pageSize = ref(20)//每页数量
onMounted(() => {
  console.log(ip)
})

// 清除所有数据
const clearAll = () => {
  indexDB.clearAllData().then(() => {
    ids.value = []; // 清空 ids 列表
    console.log("All data cleared");
  });
};
function safeParseJSON(str) {//判断是字符串还是json串
  try {
    // 尝试解析字符串为 JSON
    const parsed = JSON.parse(str);
    // 判断是否为数组
    return Array.isArray(parsed);
  } catch (e) {
    // 如果解析失败，返回 false
    return false;
  }
}
const handleDateChange = (value) => {
  if (!value) {
    console.log('日期和时间已清空');
    // 在这里处理清空后的逻辑
  } else {
    console.log('选择了日期和时间:', value);
  }
};
function daterange(time) {
  console.log(time)
  if (!time) {
    flag.value = false
    console.log('清空时间')
    data1.value = tableData.value.slice(0, 20)
    currentPage.value = 1
    pageSize.value = 20
    total1.value = tableData.value.length
  } else {
    flag.value = true
    const startDate = new Date(time[0]);
    const endDate = new Date(time[1]);
    const filteredData = tableData.value.filter(item => {
      const publishDate = new Date(item.publishDate);
      return publishDate >= startDate && publishDate <= endDate;
    });
    tableDaterange.value = filteredData
    data1.value = tableDaterange.value.slice(0, 20)
    currentPage.value = 1
    pageSize.value = 20
    total1.value = tableDaterange.value.length
    console.log(filteredData);
  }
}
function handleSizeChange(value) {// 选择页面大小
  let data = []
  if (flag.value) {
    data = tableDaterange.value
  } else {
    data = tableData.value
  }
  if (currentPage.value * value >= data.length) {//上一次的页码，大于当前页码，导致超出数组长度
    let maxSize = Math.ceil(data.length / value)
    data1.value = data.slice((maxSize - 1) * pageSize.value, maxSize * value)
  } else {
    data1.value = data.slice((currentPage.value - 1) * pageSize.value, currentPage.value * value)
  }
  pageSize.value = value;
  console.log(`每页数量：${value}`)
}
function handleCurrentChange(value) {//选择当前页码
  let data = []
  if (flag.value) {
    data = tableDaterange.value
  } else {
    data = tableData.value
  }
  data1.value = data.slice((value - 1) * pageSize.value, value * pageSize.value)
  currentPage.value = value
  console.log(`当前页：${value}`)
}
function rowClick(row) {
  try {
    clearAll()
    let plainRow = JSON.parse(JSON.stringify(row));//重要 深度克隆
    // indexDB.addData(cs[1]).then(() => {
    indexDB.addData(plainRow).then(() => {
      console.log(`数据已添加！`);
    }).catch(error => {
      console.error('Error adding data:', error);
    });
    // localStorage.setItem('myRow', JSON.stringify(row));
    window.open('/about', '_blank');
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      let dataSize = new Blob([JSON.stringify(row)]).size;
      console.error('存储信息过大!', (dataSize / (1024 * 1024)).toFixed(2) + "M");
      // Implement fallback logic here
    }
  }
}
function collect() {
  console.log('采集---', selectValue.value)
  tableData.value = json.slice(0, 3)
  // tableData.value = json
  data1.value = tableData.value.slice(0, 20)
  total1.value = tableData.value.length
  disdatepick.value = false
  return
  if (selectValue.value) {
    // 配转发请求数据变慢
    loading.value = true;  // 数据加载中，开启 loading 
    disdatepick.value = true
    axios.get(selectValue.value)
      .then(response => {
        tableData.value = response.data
        data1.value = tableData.value.slice(0, 20)
        loading.value = false;  // 数据加载完成后，关闭 loading 状态
        disdatepick.value = false
        total1.value = tableData.value.length
      });
  }
}
function handleChange(value) {
  datePicker.value = null;//清空时间
  data1.value = []
  tableDaterange.value = []
  currentPage.value = 1
  pageSize.value = 20
  total1.value = tableDaterange.value.length
  disdatepick.value = true

  console.log('选择---', value)
}
</script>

<style scoped>
::v-deep(.el-table__inner-wrapper) {
  font-size: 16px;
}

::v-deep(.el-loading-spinner .circular) {
  width: 30px;
  height: 30px;
}

.buttoms {
  margin-left: 15px;

  .el-button {
    width: 100px;
    height: 40px;
  }
}
</style>
