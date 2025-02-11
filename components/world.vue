<script setup lang="ts">
import * as echarts from "echarts";
import {ref, nextTick, onMounted, onUnmounted, watch} from "vue";
import world from "../config/world.json"
import {useData} from "vitepress";
import {VideoMetaData} from "../utils/VideoMetaData";
import {HTMLElementUtil} from "../utils/HTMLElementUtil";
import consts from "../config/consts";

let myChart1: any = null;
let myChart2: any = null;
let myChart3: any = null;
const width = ref(0);
const height = ref(0);
const data = useData();

/**
 * 监听暗黑模式变化
 */
watch(() => data.isDark.value, () => {
    refreshChatColor();
})

const windowWidth = ref(0);
const left1 = ref(0);
const left2 = ref(0);
const left3 = ref(0);
const realLeft1 = ref(0);
const realLeft2 = ref(0);
const realLeft3 = ref(0);

/**
 * onMounted
 */
onMounted(() => {
    nextTick(() => {
        resize();

        nextTick(() => {
            initChart();
        })
    })

    //
    document.addEventListener("mousedown", startMove);
    document.addEventListener("mousemove", execMove);
    document.addEventListener("touchstart", startMove);
    document.addEventListener("touchmove", execMove);
    document.addEventListener('mouseup', endMove);
    document.addEventListener('touchend', endMove);
    // 创建大小监听
    window.addEventListener("resize", resize);
})

/**
 * on unmounted
 */
onUnmounted(() => {
    window.removeEventListener("resize", resize);
});

let isMove = false;
let startX = 0;


function startMove(event: any) {
    isMove = true;
    startX = event.clientX;
}

function execMove(event: any) {
    if (!isMove) {
        return ;
    }

    const deltaX = event.clientX - startX;
    left1.value = realLeft1.value + deltaX;
    left2.value = realLeft2.value + deltaX;
    left3.value = realLeft3.value + deltaX;

    // if (Math.abs(left1.value) % windowWidth.value == 0) {
    //     // resize();
    //     // console.log("left1 临界");
    // }
    //
    // if (Math.abs(left2.value) < 10) {
    //     console.log("left2 临界");
    // }
    //
    // if (Math.abs(left1.value) >= windowWidth.value * 2 ) {
    //     console.log("left1 过界");
    //     // resize();
    // }

    if (left1.value >= 0) {
        left1.value = 0;
        left2.value = windowWidth.value;
        left3.value = windowWidth.value * 2;
    }

    if (left1.value < 0 && Math.abs(left1.value) >= windowWidth.value * 2) {
        left1.value = -(windowWidth.value * 2);
        left2.value = -(windowWidth.value);
        left3.value = 0;
    }

}

function endMove() {
    if (isMove) {
        isMove = false;
    }

    realLeft1.value = left1.value;
    realLeft2.value = left2.value;
    realLeft3.value = left3.value;
}

/**
 * 窗口大小变化
 */
function resize() {
    const dom = document.querySelector(".VPContent.is-home");
    const navDom = document.querySelector(".VPNav");

    width.value = HTMLElementUtil.getDomWidth(dom);
    height.value = HTMLElementUtil.getDomHeight(dom) - HTMLElementUtil.getDomHeight(navDom);

    windowWidth.value = width.value;
    left1.value = -width.value;
    left2.value  = 0;
    left3.value  = width.value;
    realLeft1.value = -width.value;
    realLeft2.value = 0;
    realLeft3.value = width.value;

    if (myChart1 || myChart2 || myChart3) {
        nextTick(() => {
            myChart1.resize();
            myChart2.resize();
            myChart3.resize();
        })
    }
}

/**
 * 初始化图表
 */
function initChart() {
    echarts.registerMap('world', world as any);
    myChart1 = echarts.init(document.getElementById('map1'));
    myChart2 = echarts.init(document.getElementById('map2'));
    myChart3 = echarts.init(document.getElementById('map3'));

    // 指定图表的配置项和数据
    let option = {
        geo: {
            // projection: {
            //     project: (point) => [point[0] / 180 * Math.PI, -Math.log(Math.tan((Math.PI / 2 + point[1] / 180 * Math.PI) / 2))],
            //     unproject: (point) => [point[0] * 180 / Math.PI, 2 * 180 / Math.PI * Math.atan(Math.exp(point[1])) - 90]
            // },
            zoom: 1,
            left: 0,
            right: 0,
            map: 'world',
            roam: 'false',
            label: {
                show: false,
            },
            selectedMode: false,
            emphasis: {
                label: {
                    show: true,
                },
            },
            nameMap: VideoMetaData.getEchartsNameMap(),
            regions: VideoMetaData.getEchartsExistRegions(),
        },
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart1.setOption(option);
    myChart2.setOption(option);
    myChart3.setOption(option);
    refreshChatColor();

    const clickFn = (params: any) => {
        const video: any = VideoMetaData.getVideoByAreaName(params.name);

        if (video && video.bvid) {
            window.open(consts.BiliBiliUrl + video.bvid, "_blank");
        }
    };

    // 点击事件
    myChart1.on("click", clickFn)
    myChart2.on("click", clickFn)
    myChart3.on("click", clickFn)
}

/**
 * 获取主题颜色
 */
function refreshChatColor() {
    let color = {};

    if (data.isDark.value) {
        // color = getDarkColor();
    } else {
        color = getLightColor();
    }

    myChart1.setOption(color);
    myChart2.setOption(color);
    myChart3.setOption(color);
}

/**
 * 获取亮色主题颜色
 */
function getLightColor() {
    return {
        geo: {
            itemStyle: {
                areaColor: '#007078',
                borderColor: '#fff'
            },
            emphasis: {
                label: {
                    color: '#FAB30F'
                },
                itemStyle: {
                    areaColor: '#004952'
                }
            },
        }
    };
}


</script>

<template>
    <div class="map-container" :style="{
        width: width + 'px',
        height: height + 'px',
    }">
        <div class="map" id="map1" :style="{

        left: left1 + 'px',
    }" />

        <div class="map" id="map2" :style="{
        left: left2 + 'px',
    }" />

        <div class="map" id="map3" :style="{
        left: left3 + 'px',
    }" />
    </div>
</template>

<style scoped lang="scss">
.map-container {
    position: relative;
    overflow: hidden;

    .map {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
}

</style>