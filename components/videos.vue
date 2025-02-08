<script setup lang="ts">
import {ref, nextTick, onMounted, onUnmounted, watch} from "vue";
import {useData} from "vitepress";
import {HTMLElementUtil} from "../utils/HTMLElementUtil";
import {VideoMetaData} from "../utils/VideoMetaData";
import consts from "../config/consts";

const data = useData();
const videoId = ref("")
const videoUrl = ref("");
const videoTitle = ref("")

/**
 * onMounted
 */
onMounted(() => {
    videoTitle.value = "";

    const region: any = HTMLElementUtil.getQueryParams();
    const video: any = VideoMetaData.getVideoByAreaName(region.get("a"));

    if (video && video.bvid) {
        videoId.value = video.bvid;
        videoUrl.value = consts.PlayerUrl + video.bvid;
        videoTitle.value = video.title;
    }
})

/**
 * 打开B站链接
 */
function openTheBiliBili() {
    window.open(consts.BiliBiliUrl + videoId.value, "_blank");
}

</script>

<template>
    <div class="player">
        <div class="title">
            <span>{{ videoTitle }}</span>
        </div>
        <div class="video">
            <span v-if="!videoUrl">视频加载中...</span>
            <iframe v-if="videoUrl" :src="videoUrl" />
        </div>
        <button class="toBlibili" @click="openTheBiliBili">打开B站</button>
    </div>
</template>

<style scoped lang="scss">
.player {
    width: 100%;
    height: 100%;
    padding: 10px 2.5rem;
    text-align: center;

    .video {
        width: 100%;
        height: 30rem;
        background: #000;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
            color: #FFF;
        }

        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    }

    .title {
        width: 100%;
        text-align: left;
        border-left: 5px solid #409eff;

        padding: 8px 16px;
        background-color: rgba( 64, 158, 255, .1);
        border-radius: 4px;
        margin: 20px 0;
    }

    .toBlibili {
        padding: 1rem 3.5rem;
        border-radius: 3px;
        color: #FFF;
        cursor: pointer;
        margin: 3rem auto;
        background: linear-gradient(135deg, #f08797, #ff7e5f); /* 渐变背景 */
    }
}
</style>