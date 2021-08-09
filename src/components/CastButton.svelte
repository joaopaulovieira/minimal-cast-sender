<script>
  import { fade } from 'svelte/transition'
  import { configStore } from '../stores/cast_config'
  
    // Logic to interact with the Cast Sender SDK
  const setupRemotePlayer = () => {
    let mediaInfo = new chrome.cast.media.MediaInfo($configStore.source, $configStore.mimeType)
    mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED
    mediaInfo.metadata = new chrome.cast.media.TvShowMediaMetadata()

    let request = new chrome.cast.media.LoadRequest(mediaInfo)

    request.currentTime = 0
    request.autoplay = $configStore.startWithAutoPlay
    let session = cast.framework.CastContext.getInstance().getCurrentSession()

    session.loadMedia(request)
    .then(
      () => console.log('Remote media loaded'),
      errorCode => console.log('Remote media load error: ', errorCode),
    )
  }

  const onReceiverConnectStateChanged = remotePlayer => {
    if (cast && cast.framework && remotePlayer.isConnected) {
      console.log('Receiver connected')
      return setupRemotePlayer()
    }
    console.log('Receiver not connected')
  }

  const onMediaInfoChanged = ev => {
    console.log('MEDIA_INFO_CHANGED event triggered: ', ev)
    // Use the current session to get an up to date media status.
    let session = cast.framework.CastContext.getInstance().getCurrentSession()
    if (!session) return
    console.log('current session: ', session)
    // Contains information about the playing media including currentTime.
    let mediaStatus = session.getMediaSession()
    if (!mediaStatus) return
    console.log('current mediaStatus: ', mediaStatus)
    // mediaStatus also contains the mediaInfo containing metadata and other
    // information about the in progress content.
    let mediaInfo = mediaStatus.media
    console.log('current mediaInfo: ', mediaInfo)
  }

  const setupCast = () => {
    console.log($configStore)
    cast.framework.CastContext.getInstance().setOptions($configStore)
    const remotePlayer = new cast.framework.RemotePlayer()

    window.receiverController = new cast.framework.RemotePlayerController(remotePlayer)
    window.receiverController.addEventListener(
      cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
      () => { onReceiverConnectStateChanged(remotePlayer) },
    )
    
    window.receiverController.addEventListener(
      cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
      onMediaInfoChanged,
    )
  }
</script>

<button
    is="google-cast-button"
    transition:fade={{ duration: 1000 }}
    on:mousedown={setupCast}
    on:touchstart={setupCast}>
</button>

<style>
  button {
    display: flex !important;
    width: 40px;
  }
</style>