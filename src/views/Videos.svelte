<script>
  import youtubeAPI from "../services/youtubeAPI";
  function lol() {
    youtubeAPI
      .getPlaylistID("UCW5YeuERMmlnqo4oq8vwUpg")
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
</script>

{@html '\u003ciframe width="480" height="270" src="https://www.youtube.com/embed/BKQVqzhnP8I" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen\u003e\u003c/iframe\u003e'}
<button on:click={lol}>click</button>
