import {defineConfig} from 'vitepress'
import sidebar from "./sidebar";
import env from "../../env";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: "/",
    title: "电图宝",
    appearance: false,
    lastUpdated: true,
    description: env.DESC,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: '指南', link: '/'},
            {text: '栏目：《电子地图册》', link: '/albert'},
            {text: '关于我们', link: '/about'},
        ],

        // 搜索
        search: {
            provider: 'local'
        },

        // socialLinks
        socialLinks: [
            { icon: 'github', link: env.GITHUB_URL },
        ],

        // 左侧菜单
        sidebar: sidebar
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler"
                }
            }
        },
    },
    head: [
        [
            'meta',
            {name: "viewport", content: "width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=0"}
        ],
    ],
    outDir: "./dist",
})
