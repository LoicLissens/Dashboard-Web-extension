import axios from "axios";
const api = axios.create({
    baseURL: 'https://youtube.googleapis.com/youtube/v3',
    headers: {
        'content-type': 'application/json',
    }
})
class YoutubeAPI {
    private API_KEY: string | undefined;
    constructor() {
        this.API_KEY = undefined
    }

    setAPIKey(key:string) {
        this.API_KEY = key
    }
    // It's only possible to retrieve data on channel with youtube ID channel
    getChannelIDs(channelId:string) {
        return api.get(`/channels?part=contentDetails&id=${channelId}&key=${this.API_KEY}`)
    }
    getChannelInfo(channelId:string) {
        return api.get(`/channels?part=snippet&id=${channelId}&key=${this.API_KEY}`)
    }
    getPlaylistItems(playlistId:string) {
        return api.get(`/playlistItems?part=snippet&playlistId=${playlistId}&key=${this.API_KEY}`)
    }
    getVideoPlayer(videoId:string) {
        return api.get(`/videos?part=player&id=${videoId}&key=${this.API_KEY}`)
    }
}
export default new YoutubeAPI();