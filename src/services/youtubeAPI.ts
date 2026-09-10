import axios from "axios";

import {
    type Channel,
    type Category,
} from "../helpers/manageStorage";
import {
    type YoutubeChannelIdResponse,
    type YoutubeChannelInfoResponse,
    type YoutubePlaylistItemsResponse,
    type YoutubeVideoPlayerResponse,
} from "./types";

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

    setAPIKey(key: string) {
        this.API_KEY = key
    }
    getChannelIdByUsername(username: string) {
        return api.get<YoutubeChannelIdResponse>(`/channels?part=snippet&forHandle=${username}&key=${this.API_KEY}`)
    }
    getChannelInfo(channelId: string) {
        return api.get<YoutubeChannelInfoResponse>(`/channels?id=${channelId}&key=${this.API_KEY}&part=snippet,contentDetails`) //TODO: maybe getChannelIdByUsername and getChannelInfo can be mutualized by just using the forHandle instead of id
    }
    getPlaylistItems(playlistId: string) {
        return api.get<YoutubePlaylistItemsResponse>(`/playlistItems?part=snippet&playlistId=${playlistId}&key=${this.API_KEY}`)
    }
    getVideoPlayer(videoId: string) {
        return api.get<YoutubeVideoPlayerResponse>(`/videos?part=player&id=${videoId}&key=${this.API_KEY}`)
    }
    // helper method
    async getChannelIDfromURL(url: string): Promise<string> {
        const path = new URL(url).pathname;
        const subUrl = path.substring(1)
        const userName = subUrl
        try {
            const resp = await this.getChannelIdByUsername(userName);
            const channel = resp.data.items?.[0];
            if (!channel) {
                throw new Error("Invalid channel URL");
            }
            return channel.id;
        } catch (err) {
            console.log(err);

            throw new Error("Invalid channel URL");
        }
    }
    async fetchChannelInfo(channelID: string, category: Category):Promise<Channel>{
        try {
            const resp = await this.getChannelInfo(channelID);
            const item = resp.data.items?.[0];
            if (!item) {
                throw new Error("Channel not found");
            }
            const details = item.contentDetails;
            const info = item.snippet;
            const fullChannelObj: Channel = {
                category: category,
                channelId: channelID,
                uploadPlaylistId: details.relatedPlaylists.uploads,
                name: info.title,
                description: info.description,
                country: info.country,
                defaultAvatrUrl: info.thumbnails.default.url,
                mediumAvatarUrl: info.thumbnails.medium.url,
                highAvatarUrl: info.thumbnails.high.url,
                nbVideoToRetrieve: 1,
                hiddenVideos: [],
            };
            return fullChannelObj;
        } catch (e) {
            throw new Error("Channel not found");
        }
    };
}
export default new YoutubeAPI();