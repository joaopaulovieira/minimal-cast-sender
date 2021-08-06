<script>
	import Header from './components/Header.svelte'
	import Card from './components/Card.svelte'
	import MediaList from './components/MediaList.svelte'
	import CustomMediaConfig from './components/CustomMediaConfig.svelte'
	import ReceiverConfig from './components/ReceiverConfig.svelte'

	let castAvailabilityStatus = false

	window['__onGCastApiAvailable'] = isAvailable => {
		castAvailabilityStatus = isAvailable
  }
</script>

<Header {castAvailabilityStatus}/>
<main class="content helvetica">
	<Card --cardMaxWidth='50%'>
		<ReceiverConfig/>
	</Card>
	<Card --cardMaxWidth='50%'>
		<MediaList/>
	</Card>
	<Card --cardMaxWidth='50%'>
		<CustomMediaConfig/>
	</Card>
</main>