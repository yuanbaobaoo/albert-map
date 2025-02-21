import env from "../../env";

export default [
    {
        text: '关于我们',
        items: [
            {text: '这个网站是什么？', link: '/about'},
            {text: '怎么反馈？', link: '/feedback'},
            {text: '如何加入我们？', link: '/join'},
            {text: '维护记录', link: '/version'},
        ]
    },
    {
        text: '小王Albert',
        collapsed: true,
        items: [
            {text: '电子地图册', link: env.ALBERT_URL},
        ]
    }
]
