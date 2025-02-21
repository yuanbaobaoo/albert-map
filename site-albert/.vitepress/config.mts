import {defineConfig} from 'vitepress'
import Sidebar from "./sidebar";
import env from "../../env";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: "/albert",
    title: "电图宝",
    description: env.DESC,
    appearance: false,
    lastUpdated: true,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: '首页', link: env.MAIN_URL},
            {text: '地图', link: '/'},
            {
                text: '视频',
                items: [
                    {text: '东盟十国', link: '/videos/菲律宾'},
                    {text: '中亚五国', link: '/videos/吉尔吉斯斯坦'},
                    {text: '中东系列', link: '/videos/卡塔尔'},
                    {text: '马格里布', link: '/videos/利比亚'},
                    {text: '西非系列', link: '/videos/马里'}
                ]
            },
            {text: '关于我们', link: env.MAIN_URL + "/about"},
        ],

        // 搜索
        search: {
            provider: 'local'
        },

        // 菜单
        sidebar: Sidebar,

        // 不展示右侧大纲，该配置只控制右侧大纲是否展示，但是其父容器仍然会存在
        // 如果不想让右侧大纲容器占宽度，则需要手动处理（例如：通过css）
        outline: false,

        // 编辑链接
        editLink: {
            pattern: env.GITHUB_URL,
            text: '在GitHub上编辑此页'
        },

        // socialLinks
        socialLinks: [
            { icon: 'github', link: env.GITHUB_URL },
        ]
    },
    head: [
        [
            'meta',
            {name: "viewport", content: "width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=0"}
        ],
    ],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler"
                }
            }
        },
    },
    outDir: "./dist",

})
