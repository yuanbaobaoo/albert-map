import {defineConfig} from 'vitepress'
import Sidebar from "./sidebar";
import compile from "./compile";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "小王Albert的电子地图册(Online)",
    description: "小王Albert的电子地图 | 小王Albert的电子地图 · 在线版 | 世界地图 | 中国地图 | 电子地图 | 王骁Albert | 东盟十国 | 西非 | 中东 | 马格里布",
    lastUpdated: true,
    outDir: "./dist",
    base: compile.BASE,
    srcExclude: [
        '**/README.md'
    ],
    themeConfig: {
        // 标题左侧logo
        logo: "",

        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: '地图', link: '/'},
            {text: '小王AlbertB站主页', link: 'https://space.bilibili.com/1140672573'},
            {text: '东盟十国', link: '/docs/videos-ASEAN?a=菲律宾'},
            {text: '中亚五国', link: '/docs/videos-CentralAsia?a=吉尔吉斯斯坦'},
            {text: '中东系列', link: '/docs/videos-MiddleEast?a=卡塔尔'},
            {text: '马格里布', link: '/docs/videos-Maghreb?a=利比亚'},
            {text: '西非系列', link: '/docs/videos-WestAfrica?a=马里'},
            {text: '关于我们', link: '/docs/about'},
        ],

        // 搜索
        search: {
            provider: 'local'
        },

        // 菜单
        sidebar: Sidebar,

        // 不展示右侧大纲，该配置只控制右侧大纲是否展示，但是其父容器仍然会存在
        // 如果不想让右侧大纲容器占宽度，则需要手动处理（例如：通过css）
        outline: false
    }
})
