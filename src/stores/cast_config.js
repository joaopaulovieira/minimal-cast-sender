import { writable } from 'svelte/store'

const defaultConfig = {
  source: '',
  mimeType: '',
  receiverApplicationId : 'CC1AD845',
  autoJoinPolicy: 'origin_scoped',
  androidReceiverCompatible: true,
  startWithAutoPlay: true
}

export let configStore = writable(defaultConfig)