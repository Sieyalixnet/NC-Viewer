<script>
    import { isNumber } from "../../../utils/utils";
    import ColorSelect from "./Show_Data/Color_Select.svelte";
    import DefaultValue from "./Show_Data/Default_value.svelte";
    export let Data = [];
    let color_array = ["#000000", "#ffffff"]; //for color interpretation
    let value_array = [0, 1]; //for color interpretation
    let color_value_percent = true;
    let auto_render = false;
    let default_value_to_value;
    let selected_range = 0;

    let range_3dimension;
    let range_3dimension_boolen;
    $: if (Data[0] && Data[0].shape.length == 3) {
        range_3dimension = Data[0].shape[0] - 1;
        range_3dimension_boolen = isNumber(range_3dimension);
    }
    let set_default_value = (e) => {
        let { default_v } = e.detail;
        //get the details before the click event
        default_value_to_value = default_v;
    };

    let show_3D = () => {
        let attr = {
            color_array,
            value_array,
            color_value_percent,
            default_value_to_value,
        };
        Data[0].clearBufferIndex()
        Data[0].render3D(selected_range, attr);
        Data[0].renderGrid();
        Data = Data;
    };
    let downloadJSON = async () => {
        await Data[0].json_to_download();
        alert("已保存");
    };
    let auto_render_switch = () => {
        auto_render = !auto_render;
    };
    let auto_render_event = () => {
        if (auto_render) {
            show_3D();
        }
    };
</script>

<div id="Show_Data_Content">
    <div class="show_data_option">
        <ColorSelect
            bind:color_value_percent
            bind:color_array
            bind:value_array
        />
    </div>
    <div class="show_data_option default_select_option">
        <div><DefaultValue on:set_default_value={set_default_value} /></div>
        {#if range_3dimension_boolen}
            <div>
                <h3>The 3rd Dimension: {Data[0].slice[0]["name"]}</h3>
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
                    {#if Data[0].slice.length > 0}
                        {Data[0].slice[0]["value"][selected_range]}
                    {/if}
                </div>
            </div>
        {/if}
    </div>
    <div class="show_data_option">
        <button on:click={show_3D}>渲染</button>
        <button on:click={downloadJSON}>下载JSON</button>
    </div>
</div>

<style lang="scss">
    #Show_Data_Content {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .show_data_option {
            background-color: rgba(0, 0, 0, 0.3);
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
            width: 80%;
            padding: 0.625rem 0;
            margin-bottom: 0.625rem;
        }
        .default_select_option {
            display: flex;
            flex-direction: row;
            align-items: center;
            div {
                flex: 1;
            }
        }
    }
</style>
