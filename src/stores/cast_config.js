import { VIDEO_LIST } from '../utils'
import { writable } from 'svelte/store'

const defaultConfig = {
  source: VIDEO_LIST.mp4.source,
  mimeType: VIDEO_LIST.mp4.mimeType,
  receiverApplicationId : 'CC1AD845',
  autoJoinPolicy: 'origin_scoped',
  androidReceiverCompatible: true,
  startWithAutoPlay: true
}

export let configStore = writable(defaultConfig)