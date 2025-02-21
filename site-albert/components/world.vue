<script setup lang="ts">
import * as echarts from "echarts";
import {ref, nextTick, onMounted, onUnmounted, watch} from "vue";
import world from "../world.json"
import {useData} from "vitepress";
import {VideoMetaData} from "../utils/VideoMetaData";
import {HTMLElementUtil} from "../utils/HTMLElementUtil";
import consts from "../consts";

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
    // document.addEventListener("mousedown", startMove);
    // document.addEventListener("mousemove", execMove);
    // document.addEventListener("touchstart", startMove);
    // document.addEventListener("touchmove", execMove);
    // document.addEventListener('mouseup', endMove);
    // document.addEventListener('touchend', endMove);
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
            // myChart2.resize();
            // myChart3.resize();
        })
    }
}

/**
 * 初始化图表
 */
function initChart() {
    echarts.registerMap('world', world as any);
    myChart1 = echarts.init(document.getElementById('map1'));
    // myChart2 = echarts.init(document.getElementById('map2'));
    // myChart3 = echarts.init(document.getElementById('map3'));

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
            scaleLimit: {
                min: 1,
                max: 5
            },
            nameMap: VideoMetaData.getEchartsNameMap(),
            regions: VideoMetaData.getEchartsExistRegions(),
        },
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart1.setOption(option);
    // myChart2.setOption(option);
    // myChart3.setOption(option);
    refreshChatColor();

    const clickFn = (params: any) => {
        const video: any = VideoMetaData.getVideoByAreaName(params.name);

        if (video && video.bvid) {
            window.open(consts.BiliBiliUrl + video.bvid, "_blank");
        }
    };

    // 点击事件
    myChart1.on("click", clickFn)
    myChart1.on("georoam", (e: any) => {
        // author: https://blog.csdn.net/qq_44706619/article/details/130665934
        // 获取当前地图的位置信息
        // 处理程序代码
        let geoComp = myChart1.getModel().getComponent('geo');
        let boundingCoords = geoComp.coordinateSystem.getBoundingRect();
        let options = myChart1.getOption();//获得option对象
        let center = options.geo[0].center
        let dx = Math.max(center[0] - boundingCoords.x, 0, boundingCoords.x + boundingCoords.width - center[0]);
        let dy = Math.max(center[1] - boundingCoords.y, 0, boundingCoords.y + boundingCoords.height - center[1]);
        let distancePercentage = [(dx / boundingCoords.width) * 100, (dy / boundingCoords.height) * 100];
        // console.log('distancePercentage:', distancePercentage);
        //求出极值了
        let percent = 95
        let percentEdge = 0.95
        let leftX = boundingCoords.x + percentEdge * boundingCoords.width
        let rightX = boundingCoords.x - (percentEdge - 1) * boundingCoords.width
        let topY = boundingCoords.y + percentEdge * boundingCoords.height
        let bottomY = boundingCoords.y - (percentEdge - 1) * boundingCoords.height
        // console.log('极值',leftX,rightX,topY,bottomY)
        let limitCenter = [];
        //方法一：需要控制移动的时候geo的center。来实现限制拖拽到盒子外部。
        //那么需要利用当前的地图的center（而不是geo可变的center）计算出一个标准值。
        //例如：默认center距离左边50%，那么预期是想当拖拽到距离左边<=10%的时候不给拖动了，就设置geo的center为此时center的值
        //需要算是center距离左边10%的时候的坐标，然后赋值到geo上应该可以实现
        // console.log('发生的回复',center[0] - boundingCoords.x, 0, boundingCoords.x + boundingCoords.width - center[0])
        if (distancePercentage[0] > percent || distancePercentage[1] > percent) {
            // options.geo[0].center = options.center
            // myChart1.setOption(options);//设置option   // 情况是超过这个范围会自动复原位
            // limitCenter = []
            // return

            if (!limitCenter.length) {
                // console.log('跳出了')
                let diyCenter = options.geo[0].center
                if (options.geo[0].center[0] > leftX) {
                    diyCenter[0] = leftX
                    if (distancePercentage[1] > percent && options.geo[0].center[1] > topY) {   //往左滑
                        // console.log('左下角')
                        diyCenter[1] = topY
                    } else if (distancePercentage[1] > percent && options.geo[0].center[1] < bottomY) {
                        // console.log('左上角')
                        diyCenter[1] = bottomY
                    }
                    options.geo[0].center = diyCenter
                    myChart1.setOption(options);
                    return
                } else if (options.geo[0].center[0] < rightX) {
                    diyCenter[0] = rightX
                    if (distancePercentage[1] > percent && options.geo[0].center[1] > topY) {   //往左滑
                        // console.log('右下角')
                        diyCenter[1] = topY
                    } else if (distancePercentage[1] > percent && options.geo[0].center[1] < bottomY) {
                        // console.log('右上角')
                        diyCenter[1] = bottomY
                    }
                    options.geo[0].center = diyCenter
                    myChart1.setOption(options);
                    return
                } else if (options.geo[0].center[1] > topY) {
                    diyCenter[1] = topY
                    options.geo[0].center = diyCenter
                    myChart1.setOption(options);
                    return
                } else if (options.geo[0].center[1] < bottomY) {
                    diyCenter[1] = bottomY
                    options.geo[0].center = diyCenter
                    myChart1.setOption(options);
                    return
                } else {
                    // options.geo[0].center = options.center
                    // myChart1.setOption(options);
                    // return
                }
            } else {
                options.geo[0].center = limitCenter
                myChart1.setOption(options);//设置option
                return
            }
            // myChart1.setOption(options);//设置option  // 情况是边缘连续横向、竖向有些卡顿感
            return
        } else if (Math.floor(distancePercentage[0]) == percent || Math.floor(distancePercentage[1]) == percent || Math.ceil(distancePercentage[0]) == percent || Math.ceil(distancePercentage[1]) == percent) {
            limitCenter = center || ['50%', '50%']
        } else if (distancePercentage[0] < percent && distancePercentage[1] < percent) {
            limitCenter = []
        }
        if (limitCenter.length) {
            options.geo[0].center = limitCenter
            myChart1.setOption(options);
        }
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

    myChart1.setOption(color);
    // myChart2.setOption(color);
    // myChart3.setOption(color);
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
        <div class="map" id="map1"/>
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