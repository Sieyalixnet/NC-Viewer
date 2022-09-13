<script>
    export let color;
    export let value;
    export let i;
    export let color_value_percent;
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    let splice = () => {
            dispatch("splice", { i: i });

    };
</script>

<div class="color_block" >
    <div class="color_block_first_line">
    <input type="color" bind:value={color} />
    <button on:click|stopPropagation={splice}>x</button>
    </div>
    {#if color_value_percent}
    <input type="number" bind:value max="1" min="0" step="0.01" />
    {:else}
    <input type="number" bind:value step="0.01" />
    {/if}
</div>

<style lang="scss">
    .color_block {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: 0.3125rem;
        .color_block_first_line{
            display: flex;
            flex-direction: row;
            align-items: center;

        }
        input {
            border-radius: 0px;
            padding: 0.3125rem;
            border: 0;
        }
        input[type="number"] {
            max-width: 54px;
        }
        button{padding: 0 3px;height: 27px;border-radius: 0px;border: 0;}
        input[type="color"] {
            padding: 0px;
            display: block;
        }
    }
</style>
