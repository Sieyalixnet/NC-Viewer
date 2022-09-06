<script>
    //import { onMount } from "svelte";
    export let files;
    // console.log(files);
    let log = files[0].history;
    let update = () => {
        if (log != files[0].history) {
            log = files[0].history;
        }
    };
</script>

<textarea on:scroll={update} value={log} cols="30" rows="10" />

<style lang="scss">
    textarea {
        width: 95%;
        height: 11.25rem;
        background-color: rgba(40, 40, 40, 0.8);
        color: burlywood;
    }
</style>
