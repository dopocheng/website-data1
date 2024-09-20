<template>
  <div>
    <div style="display: flex;justify-content: space-between;">

      <el-select v-model="selectValue" placeholder="请选择..." size="large" style="width: 240px" @change="handleChange">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <div>
        <el-button @click="collect">采集</el-button>
        <el-button @click="sortNew">日期排序</el-button>
      </div>
    </div>
    <el-table :data="data1" style="width: 100%;height: 600px; margin: 10px 0;" @row-click="rowClick">
      <!-- // 空数据状态的插槽 换可以引入中文包-->
      <!-- <template #empty>
        <div>暂无数据</div>
      </template> -->
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="sitename" label="站点名称" />
      <el-table-column prop="datasource" label="数据来源" />
      <el-table-column prop="publishDate" label="发布日期" />
    </el-table>
    <el-pagination style="float: right;" v-model:current-page="currentPage" v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]" :total="total1" :size="medium" :disabled="disabled"
      layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
    <!-- <div style="text-align: right;">
      <el-button @click="exportData">导出数据</el-button>
    </div> -->
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import json from '../assets/json/json.json'
let data1 = ref([])
let tableData = ref([])
let selectValue = ref('')
let total1 = ref(0)
let currentPage = ref(1)//当前页
let pageSize = ref(10)//每页数量
const options = [
  {
    value: 'fhw',
    label: '凤凰网',
  },
  {
    value: 'rmw',
    label: '人民网',
  },
  {
    value: 'bbc',
    label: 'BBC中文',
  },
  {
    value: 'voa',
    label: 'VOA中文',
  }
]
onMounted(() => {


})
function sortNew() {
  // 按时间排序（从最近到最远）
  tableData.value.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  data1.value = tableData.value
  currentPage.value = 1
  pageSize.value = 10
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
  if (selectValue.value) {
    // tableData.value = json
    // data1.value = tableData.value.slice(0, 10)
    // console.log('采集---', selectValue.value.length)
    // total1.value = tableData.value.length
    // 配转发请求数据变慢
    axios.get('http://192.168.1.29:8081/task?sitename=凤凰军事&task=https://mil.ifeng.com/shanklist/14-35083-&tasktype=2&datasource=1')
      .then(response => {
        tableData.value = response.data
        data1.value = tableData.value.slice(0, 10)
        console.log('采集---', selectValue.value.length)
        total1.value = tableData.value.length
        // console.log(response.data);
      });
    // fetch('http://192.168.1.29:8081/task?sitename=凤凰军事&task=https://mil.ifeng.com/shanklist/14-35083-&tasktype=2&datasource=1', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'  // Specify JSON format
    //   }
    // })
    //   .then(response => response.json())  // Parse the JSON response
    //   .then(result => {
    //     console.log('Success:', result);  // Handle the response data
    //     // Optionally, you can redirect or perform further actions here
    //   })
  }
}
function handleChange(value) {
  console.log('选择---', value)
}
function exportData() {
  console.log('数据导出---')
}
</script>
