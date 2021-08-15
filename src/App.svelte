<script>
	import { castAvailabilityStatus } from './stores/cast_status'

	import Header from './components/Header.svelte'
	import Card from './components/Card.svelte'
	import MediaConfig from './components/MediaConfig.svelte'
	import ReceiverConfig from './components/ReceiverConfig.svelte'

	window['__onGCastApiAvailable'] = isAvailable => {
		$castAvailabilityStatus = isAvailable
  }
</script>

<Header/>
<main class="content helvetica">
	<div class="card-wrapper">
		<Card --cardMaxWidth='50%'>
			<MediaConfig/>
		</Card>
		<Card --cardMaxWidth='50%'>
			<ReceiverConfig/>
		</Card>
	</div>
</main>