<script>
    import { tick } from "svelte";

    export let label = "default label";
    export let checked = false;
    let p_click = () => {
        checked = !checked;
    };
</script>

<div>
    <input type="checkbox" bind:checked />
    <p on:click={p_click}>{label}</p>
</div>

<style lang="scss">
    input,
    p {
        display: inline-block;
    }
    input[type="checkbox"] {
        cursor: pointer;
    }
    p {
        cursor: pointer;
    }
</style>
