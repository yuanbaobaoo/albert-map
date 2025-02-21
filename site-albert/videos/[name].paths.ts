import {VideoMetaData} from "../utils/VideoMetaData";

export default {
    paths() {
        const params = [];
        const exits = VideoMetaData.getExistsRegions();

        for (let item of exits) {
            params.push({
                params: {name: item.text}
            })
        }

        return params
    }
}