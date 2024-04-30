function get_yt_channel_id() {
    local url=$1
    curl -s $url | grep -o 'https://www.youtube.com/channel/[^"]*' | head -n 1 | awk -F/ '{print $NF}'
}