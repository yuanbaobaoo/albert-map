<script setup lang="ts">
import * as echarts from "echarts";
import {ref, nextTick, onMounted, onUnmounted, watch} from "vue";
import world from "../world.json"
import {useData} from "vitepress";
import {VideoMetaData} from "../utils/VideoMetaData";
import {HTMLElementUtil} from "../utils/HTMLElementUtil";
import consts from "../consts";
import {Refresh} from '@element-plus/icons-vue'
import {ElSlider, ElButton} from "element-plus";
import 'element-plus/dist/index.css'

const data = useData();

const scale = ref(1);
const width = ref(0);
const height = ref(0);

// 图例
let chart: any = null;

/**
 * 监听暗黑模式变化
 */
watch(() => data.isDark.value, () => {
    refreshChatColor();
})

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

    // 创建大小监听
    window.addEventListener("resize", resize);
})

/**
 * on unmounted
 */
onUnmounted(() => {
    window.removeEventListener("resize", resize);
});

/**
 * 窗口大小变化
 */
function resize() {
    const dom = document.querySelector(".VPContent.is-home");
    const navDom = document.querySelector(".VPNav");

    width.value = HTMLElementUtil.getDomWidth(dom);
    height.value = HTMLElementUtil.getDomHeight(dom) - HTMLElementUtil.getDomHeight(navDom);

    if (chart) {
        nextTick(() => {
            chart.resize();
        })
    }
}

/**
 * 初始化图表
 */
function initChart() {
    echarts.registerMap('world', world as any);
    chart = echarts.init(document.getElementById('map'));

    // 指定图表的配置项和数据
    let option = {
        geo: {
            zoom: 1,
            left: 0,
            right: 0,
            center: [0, 0],
            map: 'world',
            roam: true,
            label: {
                show: false,
            },
            selectedMode: false,
            emphasis: {
                label: {
                    show: true,
                },
            },
            scaleLimit: {
                min: 1,
                max: 20
            },
            nameMap: VideoMetaData.getEchartsNameMap(),
            regions: VideoMetaData.getEchartsExistRegions(),
        },
    };

    // 使用刚指定的配置项和数据显示图表。
    chart.setOption(option);
    refreshChatColor();

    // 点击事件
    chart.on("click", (params: any) => {
        const video: any = VideoMetaData.getVideoByAreaName(params.name);

        if (video && video.bvid) {
            window.open(consts.BiliBiliUrl + video.bvid, "_blank");
        }
    });

    // 图例放大、缩小、拖拽
    chart.on("georoam", (e: any) => {
        console.log(e.totalZoom, chart.getOption().geo[0].zoom);

        e.totalZoom && (scale.value = e.totalZoom);
    })
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

    chart.setOption(color);
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
                    color: '#FFF'
                },
                itemStyle: {
                    areaColor: '#578F03',
                    borderColor: '#000'
                }
            },
        }
    };
}

/**
 * slider change
 */
function sliderChange(center?: object) {
    console.log(scale.value);
    const option: any = {geo: {zoom: scale.value}};

    if (chart) {
        if (center) {
            option.geo.center = center;
        }

        chart.setOption(option);
    }
}

/**
 * 重置图例
 */
function resetScale() {
    scale.value = 1;
    sliderChange([0, 0]);
}
</script>

<template>
    <div class="map-container" :style="{ width: width + 'px', height: height + 'px' }">
        <div class="map" id="map"/>
        <el-slider class="slider-box" vertical v-model="scale" :min="1" :max="20" @input="sliderChange()"/>
        <el-button class="reset-btn" :icon="Refresh" @click="resetScale">重置图例</el-button>
    </div>
</template>

<style scoped lang="scss">
@use 'element-plus/dist/index.css';

.map-container {
    position: relative;
    overflow: hidden;

    .map {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
    }

    .slider-box {
        position: absolute;
        height: 40%;
        left: 10px;
        top: 30%;
        z-index: 2;
    }

    .reset-btn {
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 20px;
        font-size: 12px;
        z-index: 3;
    }

}

</style>