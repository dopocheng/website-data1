<template>
  <div class="detail-container">
    <div class="title">
      <h2>
        {{ rowData.title }}
      </h2>
      <div style="text-align: center;margin: 10px 0px; font-size: 14px;">
        <ul>
          <li v-for="(item, index) in rowData.labels" :key=index>#{{ item }}&nbsp;</li>
        </ul>
      </div>
    </div>
    <div class="author">
      <a :href="rowData.authorUrl">
        <div class="a-cont-1">
          <div v-if="rowData.vatar" class="a-img">
            <img :src="'data:image/jpeg;base64,' + rowData.vatar" alt="">
            <img src="./tubiao.png" alt="tubiao">
          </div>
          <div class="a-name">
            <div v-if="safeParseJSON(rowData.author)" style="display: flex;">
              <span v-for="(item, index) in JSON.parse((rowData.author))" :key="index">
                <a :href="item.authorUrl">{{ item.author }}</a>&nbsp;
              </span>
            </div>
            <div v-else>
              <span>
                {{ rowData.author }}
              </span>
            </div>
            <div>
              {{ rowData.publishDate }}
            </div>
          </div>
        </div>
      </a>
    </div>
    <div class="text-box">
      <p v-html="formattedContent" class="text-box"></p>
    </div>
    <div id="videoPlayer" v-if="mediaList && mediaList.length > 0">
      {{ mediaList.length }}
      <div class="gallery">
        <div class="media" v-for="(media, index) in mediaList" :key="index">
          {{ media.slice(0, 4) }}
          <div v-if="media.startsWith('/9j/') || media.startsWith('iVBORw')">
            <img :src="'data:image/jpg;base64,' + media" alt="index + 1" style="max-width: 300px; height: auto;">
            <!-- <video width="100%" controls :src="'data:video/mp4;base64,' + json[0].medias"></video> -->
          </div>
          <div v-else>
            <video :src="'data:video/mp4;base64,' + media" controls>
              Your browser does not support the video tag.
            </video>
            <!-- <video style="max-width: 300px; height: auto;" src="../assets/media/44.mp4" controls></video> -->
            <!-- <video width="100%" controls :src="'data:video/mp4;base64,' + cs[1].medias"></video> -->
            <!-- <videoXg mediaId="44.mp4"></videoXg> -->
          </div>
        </div>
      </div>
    </div>
    <div style="text-align: right;">
      <a :href="rowData.url">
        (来源：{{ rowData.url }} )
      </a>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue';
// import videoXg from '../components/videoXg.vue'
import indexDB from '../assets/api/indexDB.js'
// import cs from '../assets/json/cs.json'
let mediaList = []
let rowData = ref({})
onMounted(() => {
  // rowData.value = JSON.parse(localStorage.getItem('myRow'));
  // console.log('777', rowData.value.content)
  getId()
})
const getId = async () => {
  const videoElement = document.getElementById('videoPlayer');
  let idLeng = await indexDB.getAllIds().then((allIds) => {
    // console.log('All IDs:', allIds);
    return allIds[allIds.length - 1];
  });
  // 从数据库获取数据
  indexDB.getData(idLeng).then((data) => {
    console.log(`${idLeng}-的数据:`, data);
    let { title, author, authorUrl, content, imageUrl, publishDate, url } = data;
    rowData.value = { title, author, authorUrl, content, imageUrl, publishDate, url }
    // rowData.value = data//直接赋值页面奔溃
    mediaList = data.medias
    videoElement.style.display = 'block'; // 显示视频
  });
}
const loadIds = () => {
  indexDB.getAllIds().then((allIds) => {
    console.log('All IDs:', allIds);
    return allIds.length;
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

const formattedContent = computed(() => {
  return rowData.value.content
    ? rowData.value.content
      .replace(/\r\n/g, '<br><br>')   // 替换 \r\n 为 <br><br>
      .replace(/\n\n/g, '<br><br>')   // 替换 \n\n 为 <br><br>
    : '';
});

</script>

<style>
iframe {
  width: 100%;
  height: 600px;
  /* Adjust the height as needed */
  border: none;
}

ul {
  display: inline-flex;
}

.text-box p {
  color: #000;
  font-family: Microsoft YaHei;
  line-height: .8rem;
  padding: .266667rem 0;
  text-align: justify;
  word-break: normal;
  font-size: .48rem;
}

.author a {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-width: 0;

  .a-cont-1 {
    display: flex;
    font-size: .293333rem;
  }
}

.a-cont2 {
  color: #9e9e9e;
  font-size: .293333rem;
  font-weight: 400;
  line-height: .346667rem;
  min-width: 2.4rem;
  text-align: right;
  white-space: nowrap;
}

.author {
  display: flex;
  font-size: .293333rem;
  padding: .4rem .4rem .266667rem;

  .a-img {
    height: .853333rem;
    margin-right: .213333rem;
    position: relative;
    width: .853333rem;

    img:first-child {
      border-radius: 50%;
      height: .853333rem;
      width: .853333rem;
    }

    img:last-child {
      bottom: 0;
      height: .373333rem;
      position: absolute;
      right: 0;
      width: .373333rem;
    }
  }

  .a-name {
    span {
      color: #1a1a1a;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      font-size: .373333rem;
      font-weight: 700;
      line-height: .4rem;
      position: relative;
    }

    div {
      overflow: hidden;
      padding-top: .08rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }


  }
}

.detail-container {
  overflow: hidden;
  padding-top: .586667rem;
  position: relative;
  height: auto;
  margin: 0 auto;
  max-width: 1024px;
}

.title h2 {
  margin: 0;
  padding: 0;
  text-align: center;
  color: #212223;
  font-size: .64rem;
  font-weight: 700;
  line-height: .88rem;
  padding: 0 .4rem;
  /* text-align: justify; */
}

h1 {
  text-align: center;
}

/* h2 {
        display: flex;
        font-size: .293333rem;
        text-align: center;
    } */

.gallery {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

body {
  margin: 0;
  width: 100%;
  font-size: 12px;
  background-color: #f0f0f0;

  a {
    text-decoration: none !important;
    /* 移除下划线 */
    color: inherit !important;
    /* 保持与父元素相同的字体颜色 */

  }
}

/* @media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
} */
</style>