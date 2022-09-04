<script>
    import { onMount } from "svelte";
    export let files;
    let log = "";
    onMount(() => {
        // console.log(files);
        log = files[0].history;
    });
</script>

<textarea value={log} cols="30" rows="10" />

<style lang="scss">
    textarea {
        width: 95%;
        height: 11.25rem;
        background-color: rgba(40, 40, 40, 0.8);
        color: burlywood;
    }
</style>
