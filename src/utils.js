export const VIDEO_LIST = {
  mp4: {
    source: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4',
    mimeType: 'video/mp4',
  },
  hls: {
    source: 'https://multiplatform-f.akamaihd.net/i/multi/april11/sintel/sintel-hd_,512x288_450_b,640x360_700_b,768x432_1000_b,1024x576_1400_m,.mp4.csmil/master.m3u8',
    mimeType: 'application/x-mpegurl',
  },
  dash: {
    source: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
    mimeType: 'application/dash+xml',
  },
}
