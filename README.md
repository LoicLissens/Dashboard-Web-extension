Into chrome extension menu, load unpacked extension and chose the public folder
Installing dependenies: `npm install`, then `npm run build`

White mode was forced by adding `<html lang="en" data-theme="light">` in the `index.html`

(tedious but remporary) [find channel id ](https://mixedanalytics.com/blog/find-a-youtube-channel-id/) or
`curl -s url_of_yt_channel | grep -o 'https://www.youtube.com/channel/[^"]*' | head -n 1 | awk -F/ '{print $NF}'`
or `source chanelid.bash`then `get_yt_channel_id "link" `