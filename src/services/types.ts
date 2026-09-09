/**
 * Response shapes for the external APIs this app calls.
 *
 * These are deliberately narrow: they declare only the fields actually read by
 * the app, not the full upstream schemas. They give compile-time shape checking
 * over `resp.data`; they are not runtime validation, so a contract change
 * upstream still surfaces as a runtime error rather than a type error.
 */

interface YoutubeThumbnail {
    url: string;
}

interface YoutubeThumbnails {
    default: YoutubeThumbnail;
    medium: YoutubeThumbnail;
    high: YoutubeThumbnail;
}

/** `GET /channels?part=snippet&forHandle=…` — only `items[].id` is read. */
export interface YoutubeChannelIdResponse {
    items?: Array<{ id: string }>;
}

/** `GET /channels?part=snippet,contentDetails&id=…` */
export interface YoutubeChannelInfoResponse {
    items?: Array<{
        contentDetails: {
            relatedPlaylists: {
                uploads: string;
            };
        };
        snippet: {
            title: string;
            description: string;
            country: string;
            thumbnails: YoutubeThumbnails;
        };
    }>;
}

/** `GET /playlistItems?part=snippet&playlistId=…` */
export interface YoutubePlaylistItemsResponse {
    items?: Array<{
        snippet: {
            title: string;
            thumbnails: {
                medium: YoutubeThumbnail;
            };
            resourceId: {
                videoId: string;
            };
        };
    }>;
}

/** `GET /videos?part=player&id=…` */
export interface YoutubeVideoPlayerResponse {
    items?: Array<{
        player: {
            embedHtml: string;
        };
    }>;
}

/** open-meteo `/v1/forecast` with `current` + `daily` temperature params. */
export interface OpenMeteoForecastResponse {
    current: {
        temperature_2m: number;
    };
    current_units: {
        temperature_2m: string;
    };
    daily: {
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
    daily_units: {
        temperature_2m_max: string;
    };
}
