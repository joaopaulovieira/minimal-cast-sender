<script>
  import { VIDEO_LIST } from '../utils'
  import { configStore } from '../stores/cast_config'

  const updateVideoConfig = media => {
    const parsedMedia = JSON.parse(media)
    const { source, mimeType } = parsedMedia
    $configStore = { ...$configStore, source, mimeType }
  }
</script>

<h4>Default Medias</h4>
<div class="videos-list">
  <div class="videos-list__option">
    <input
    type="radio"
    id="mp4_video"
    name="option"
    value={JSON.stringify(VIDEO_LIST.mp4)}
    on:input={ e => updateVideoConfig(e.currentTarget.value) }
    checked>
    <label for="mp4_video">MP4 media</label>
  </div>
  <div class="videos-list__option">
    <input
    type="radio"
    id="m3u8_video"
    name="option"
    value={JSON.stringify(VIDEO_LIST.hls)}
    on:input={ e => updateVideoConfig(e.currentTarget.value) }>
    <label for="m3u8_video">HLS media</label>
  </div>
  <div class="videos-list__option">
    <input
    type="radio"
    id="mpd_video"
    name="option"
    value={JSON.stringify(VIDEO_LIST.dash)}
    on:input={ e => updateVideoConfig(e.currentTarget.value) }>
    <label for="mpd_video">DASH media</label>
  </div>
</div>

<style>
  h4 {
    margin-bottom: 10px;
  }
  
  .videos-list {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .videos-list__option {
    display: flex;
    align-items: center;
    margin-right: 5px;
  }

  input {
    margin-right: 10px;
  }
</style>