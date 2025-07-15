// api.js

// Internal map of episode video links
const EpisodeVideoService = {
    getVideoUrl(episodeNumber) {
        const urlMap = {
            1: "https://dms.uom.lk/s/RKpdyKwCJjHLBFQ",
            2: "https://dms.uom.lk/s/kj26qPpys4p3ji7",
            3: "",
            4: "",
            5: "",
            6: ""
        };
        return urlMap[episodeNumber] || "";
    },

    getDownloadUrl(episodeNumber) {
        const baseUrl = this.getVideoUrl(episodeNumber);
        return baseUrl ? `${baseUrl}/download` : "";
    }
};
