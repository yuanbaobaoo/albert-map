import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "电图宝",
    description: "小王Albert的电子地图 | 小王Albert的电子地图 · 在线版 | 世界地图 | 中国地图 | 电子地图 | 王骁Albert | 东盟十国 | 西非 | 中东 | 马格里布",
    lastUpdated: true,
    outDir: "./dist",
    base: "/",
    srcExclude: [
        '**/README.md'
    ],
    head: [
        [
            'meta',
            {name: "viewport", content: "width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=0"}
        ],
    ],
    appearance: false,
    themeConfig: {
        // 标题左侧logo
        logo: "",

        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: '指南', link: '/'},
            {text: '栏目：《电子地图册》', link: '/albert'},
            {text: '栏目：《三国·东汉篇》', link: '/csmy'},
            {text: '关于我们', link: '/about'},
        ],

        // 搜索
        search: {
            provider: 'local'
        },

        // socialLinks
        socialLinks: [
            { icon: 'github', link: 'https://github.com/yuanbaobaoo/v-map-wiki' },
        ]
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler"
                }
            }
        },
    }
})
