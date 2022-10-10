<script>
    import { isNumber } from "../../../../../utils/utils";
    export let Data;
    export let selected_range;
    let max=0;
    let min=0
    import { createEventDispatcher, tick } from "svelte";
    const dispatch = createEventDispatcher();
    let auto_render_event = () => {
        if (auto_render) {
            dispatch("auto_render");
        }
    };

    let range_3dimension;
    let range_3dimension_boolen;
    let auto_render = false;
    $: if (Data[0] && Data[0].shape.length == 3) {
        range_3dimension = Data[0].shape[0] - 1;
        range_3dimension_boolen = isNumber(range_3dimension);
    }
    $: if(Data[0] && Data[0].shape.length == 3 && isNumber(selected_range)){
        max = Math.round(Data[0].max_value(selected_range)*1000)/1000
        min = Math.round(Data[0].min_value(selected_range)*1000)/1000
    }
    let auto_render_switch = () => {
        auto_render = !auto_render;
    };
</script>

{#if range_3dimension_boolen && Data[0].slice && Data[0].slice[0]["name"]}
    <div>
        
        <h3>The 3rd Dimension: {Data[0].slice[0]["name"]}</h3>
        <div>
            <input
                bind:value={selected_range}
                type="range"
                min="0"
                max={range_3dimension}
                step="1"
                on:change={auto_render_event}
            />
            <button on:click={auto_render_switch}
                >自动渲染:
                {#if auto_render}
                    开启
                {:else}
                    关闭
                {/if}
            </button>
        </div>
        <div>
            <input
                type="number"
                bind:value={selected_range}
                min="0"
                max={range_3dimension}
                step="1"
                on:change={auto_render_event}
                style="display:inline-block;margin-right:0.3125rem;"
            />
            {#if Data[0].slice.length > 0 && Data[0].slice[0]["value"]}
                {Data[0].slice[0]["value"][selected_range]}
            {/if}
        </div>
        <div>
            max:{max}, min:{min}
        </div>
    </div>
{/if}

<style lang="scss">
</style>
