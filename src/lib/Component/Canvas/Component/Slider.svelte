<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let value = 0;
    export let attr = { min: 0, max: 360, step: 1 };
    export let label = "Default Label";

    let change = () => {
        dispatch("drawScene");
    };
</script>

<div class="WebGLSlider">
    <p>{label}</p>
    <input
        type="range"
        min={attr.min}
        max={attr.max}
        step={attr.step}
        on:change={change}
        bind:value
    />
    <input
        on:change={change}
        step={attr.step}
        type="number"
        bind:value
    />
</div>

<style lang="scss">
    .WebGLSlider {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        p {
            min-width: 50px;
            display: inline-block;
            margin: 0px 0px;
        }
        input[type="range"] {
            width: 100px;
            box-shadow: 0 0 0;
            padding: 0px;
        }
        input[type="number"] {
            max-width: 70px;
            padding: 0;
            text-align: center;
        }
    }
</style>
