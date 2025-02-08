<script setup lang="ts">
import * as echarts from "echarts";
import {ref, nextTick, onMounted, onUnmounted, watch} from "vue";
import world from "../config/world.json"
import {useData} from "vitepress";
import {VideoMetaData} from "../utils/VideoMetaData";
import {HTMLElementUtil} from "../utils/HTMLElementUtil";
import consts from "../config/consts";

let myChart: any = null;
const width = ref(0);
const height = ref(0);
const data = useData();

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

    if (myChart) {
        nextTick(() => {
            myChart.resize();
        })
    }
}

/**
 * 初始化图表
 */
function initChart() {
    echarts.registerMap('world', world as any);
    myChart = echarts.init(document.getElementById('main'));

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
            nameMap: VideoMetaData.getEchartsNameMap(),
            regions: VideoMetaData.getEchartsExistRegions(),
        },
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    refreshChatColor();

    // 点击事件
    myChart.on("click", (params: any) => {
        const video: any = VideoMetaData.getVideoByAreaName(params.name);

        if (video && video.bvid) {
            window.open(consts.BiliBiliUrl + video.bvid, "_blank");
        }
    })
}

/**
 * 获取主题颜色
 */
function refreshChatColor() {
    let color = {};

    if (data.isDark.value) {
        color = getDarkColor();
    } else {
        color = getLightColor();
    }

    myChart.setOption(color);
}

/**
 * 获取暗黑主题颜色
 */
function getDarkColor() {
    return {
        geo: {
            itemStyle: {
                areaColor: '#575A5E',
                borderColor: '#888B8F'
            },
            emphasis: {
                label: {
                    color: '#fff'
                },
                itemStyle: {
                    areaColor: '#234200'
                }
            },
        }
    };
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
    <div class="model-3d" id="main" :style="{width: width + 'px', height: height + 'px'}">

    </div>
</template>

<style scoped lang="scss">
.model-3d {

}
</style>