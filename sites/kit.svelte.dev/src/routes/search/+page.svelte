<script>
	import SearchResults from '$lib/search/SearchResults.svelte';

	/** @type {import('./$types').Data} */
	export let data;
</script>

<svelte:head>
	<title>Search • SvelteKit</title>
</svelte:head>

<main>
	<form>
		<input name="q" value={data.query} placeholder="Search" spellcheck="false" />
	</form>

	<SearchResults results={data.results} query={data.query} />
</main>

<style>
	main {
		max-width: 48rem;
		margin: 0 auto;
		padding: 8rem 1rem;
	}

	form {
		--size: 4rem;
		position: relative;
		width: 100%;
		height: var(--size);
		margin: 0 0 2em 0;
	}

	input {
		display: block;
		width: 100%;
		height: 100%;
		font-family: inherit;
		font-size: inherit;
		border: 1px solid #ccc;
		border-radius: var(--border-r);
		padding-left: var(--size);
		border-radius: var(--size);
		background: no-repeat 1rem 50% / 2rem 2rem url($lib/icons/search.svg);
	}
</style>
