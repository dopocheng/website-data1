<template>
  <div style="padding: 50px 80px;">
    <div style="text-align: center; font-size: 0.9rem; padding: 0 0 20px 0;">
      <h3>态势数据爬虫工具</h3>
    </div>
    <div style="display: flex; align-items: center;">
      <el-select v-model="selectValue" placeholder="请选择..." size="large" style="width: 240px" :disabled="loading"
        @change="handleChange">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-table-column prop="author" label="作者" width="200" />
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

let disdatepick = ref(true)//时间选择器
let datePicker = ref('')
const loading = ref(false);  // 控制 loading 状态
let data1 = ref([])
let tableData = ref([])//原始数据（不动）
let tableDaterange = ref([])//
let selectValue = ref('')
let total1 = ref(0)
let currentPage = ref(1)//当前页
let pageSize = ref(20)//每页数量
const options = [
  {
    // value: 'http://192.168.43.220:8081/task?sitename=凤凰军事&task=台海&tasktype=3&datasource=1',
    value: 'http://192.168.43.220:8081/task?sitename=凤凰军事&task=台海&tasktype=3&datasource=1',
    label: '凤凰军事',
  },
  {
    value: 'http://192.168.43.220:8081/task?sitename=人民网&task=台湾&tasktype=3&datasource=1',
    label: '人民网',
  },
  {
    value: 'http://192.168.43.220:8081/task?sitename=VOA中文&task=https://www.voachinese.com/z/2371&tasktype=2&datasource=1',
    label: 'VOA中文',
  },
  {
    value: 'http://192.168.43.220:8081/task?sitename=BBC中文&task=https://www.bbc.com/zhongwen/simp/topics/cxe2wdp384wt&tasktype=2&datasource=1',
    label: 'BBC中文',
  }
]
onMounted(() => {


})
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
    console.log('清空时间')
    data1.value = tableData.value.slice(0, 20)
    currentPage.value = 1
    pageSize.value = 20
    total1.value = tableData.value.length
  } else {
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
  if (currentPage.value * value >= tableData.value.length) {//上一次的页码，大于当前页码，导致超出数组长度
    let maxSize = Math.ceil(tableData.value.length / value)
    data1.value = tableData.value.slice((maxSize - 1) * pageSize.value, maxSize * value)
  } else {
    data1.value = tableData.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * value)
  }
  pageSize.value = value;
  console.log(`每页数量：${value}`)
}
function handleCurrentChange(value) {//选择当前页码
  data1.value = tableData.value.slice((value - 1) * pageSize.value, value * pageSize.value)
  currentPage.value = value
  console.log(`当前页：${value}`)
}
function rowClick(row) {
  // console.log('77', row)
  localStorage.setItem('myRow', JSON.stringify(row));
  window.open('/about', '_blank');
}
function collect() {
  // console.log('采集---', selectValue.value)
  // tableData.value = json
  // data1.value = tableData.value.slice(0, 10)
  // console.log('采集---', selectValue.value.length)
  // total1.value = tableData.value.length
  // return
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
function exportData() {
  console.log('数据导出---')
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
