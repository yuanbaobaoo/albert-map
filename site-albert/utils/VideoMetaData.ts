import names from "../names.json"
import sidebar from "../.vitepress/sidebar";

export class VideoMetaData {
    /**
     * 获取地区英文-中文对照表
     */
    public static getEchartsNameMap() {
        let map: any = {};

        for (let key in names) {
            map[key] = names[key].name;
        }

        return map;
    }

    /**
     * 获取存在的地区信息
     */
    public static getExistsRegions() {
        let exists: any[] = [];

        sidebar.forEach((k, v) => {
            if (!k.isVideos) {
                return ;
            }

            k.items.forEach(v => {
                exists.push(v);
            });
        });

        return exists;
    }

    /**
     * 获取已经存在的地区
     */
    public static getEchartsExistRegions() {
        let highlight = [];


        sidebar.forEach((k, v) => {
            if (!k.isVideos) {
                return ;
            }

            k.items.forEach(v => {
                highlight.push({
                    name: v.text,
                    label: {
                        show: false,
                    },
                    itemStyle: {
                        areaColor: '#578F03',
                    }
                })
            });
        });

        return highlight;
    }

    /**
     * 根据地区名称获取视频信息
     * @param name
     */
    public static getVideoByAreaName(name: string) {
        let video = {};

        if (name) {
            sidebar.forEach((v: any) => {
                if (!v.isVideos) {
                    return ;
                }

                v.items.forEach((v2: any) => {
                    if (v2.text == name) {
                        video = v2;
                    }
                });
            });
        }

        return video;
    }

}