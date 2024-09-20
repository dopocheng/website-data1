<template>
    <!-- 视频播放组件 -->
    <div style="width: 600px">
        <div id="mse"></div>
    </div>
</template>

<script setup>
import { onMounted, toRef } from "vue";
import Player from "xgplayer";
import "xgplayer/dist/xgplayer.vod.min.css";
// import xg from '../assets/media/44.mp4'
let xg
const props = defineProps(
    ['mediaId']
)
let id = toRef(props, 'mediaId')
// let id = ref(props.mediaId)

onMounted(() => {
    xg = getImageUrl()
    initVideo()
})

function getImageUrl() {
    // 动态导入图片文件
    return new URL(`../assets/media/${id.value}`, import.meta.url).href;
}

function initVideo() {
    let player = new Player({
        lang: "zh",
        id: 'mse',
        url: xg,
        videoInit: true,
        playsinline: true,
        keyShortcut: "on",
        closeVideoClick: false,
        closeVideoDblclick: false,
        closeVideoTouch: false,
        rotate: {
            clockwise: true,
            innerRotate: true
        },
        screenShot: {
            saveImg: true,
            quality: 0.92,
            type: 'image/png',
            format: '.png'
        },
        download: true,
        pip: true,
        width: 620,
        height: 350,
        poster: "../assets/img/下载.png",
        volume: 0.4,
        autoplay: true,
        fluid: true,
        playbackRate: [
            2,
            1.5,
            1,
            0.5,
        ]
    });
    player.emit('resourceReady', [])
}

</script>

<style>
.xgplayer-video {
    transform-origin: center center;
    overflow: hidden;
}
</style>