import axios from "axios";
const api = axios.create({
    baseURL: 'https://youtube.googleapis.com/youtube/v3',
    headers: {
        'content-type': 'application/json',
    }
})
const API_KEY = process.env.YOUTUBE_API_KEY
class YoutubeAPI {
    // It's only possible to retrieve data on channel with youtube ID channel
    getChannelIDs(channelId) {
        return api.get(`/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`)
    }
    getChannelInfo(channelId) {
        return api.get(`/channels?part=snippet&id=${channelId}&key=${API_KEY}`)
    }
    getPlaylistItems(playlistId) {
        return api.get(`/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}`)
    }
    getVideoPlayer(videoId) {
        return api.get(`/videos?part=player&id=${videoId}&key=${API_KEY}`)
    }
}
export default new YoutubeAPI();