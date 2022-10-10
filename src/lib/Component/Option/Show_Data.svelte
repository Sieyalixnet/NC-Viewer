<script>
    import { isNumber } from "../../../utils/utils";
    import ColorSelect from "./Show_Data/Color_Select.svelte";
    import ChannelSelect from "./Show_Data/Channel_Select.svelte";
    import GridDEM from "./Show_Data/Grid_DEM.svelte";
    import IsofaceDem from "./Show_Data/Isoface_DEM.svelte";
    import Reshape from "./Show_Data/Reshape.svelte";
    export let Data = [];
    let color_array = ["#000000", "#ffffff"]; //for color interpretation
    let value_array = [0, 1]; //for color interpretation
    let color_value_percent = true;
    let selected_range = 0;
    let default_value_to_value;
    let renderType ="buffers"
    let graph="TRIANGLES"

    let graph_switch = ()=>{
        graph=graph=="TRIANGLES"?"LINES":"TRIANGLES"
    }
    let renderType_switch = ()=>{
        renderType=renderType=="buffers"?"indices":"buffers"
    }    
    //PARTS: init Store to show message
    import { msg,message } from "../../store";
    import { tick } from "svelte";
    let msgs;
    const unsubscribe_msg = msg.subscribe((v) => {
        msgs = v;
    });
    function put_message(type, text) {
        msgs.push(message(type, text));
        msg.set(msgs);
    }
    function remove_message(second) {
        let s = 0;
        if (second) {
            s = second*1000;
        }
        setTimeout(() => {
            if (msgs.length > 0) {
                msgs.shift();
            }
            msg.set(msgs);
        }, s);
    }
    //----------------------------

    let set_default_value = (e) => {
        let { default_v } = e.detail;
        //get the details before the click event
        default_value_to_value = default_v;
    };

    let show_3D = async () => {
        let attr = {
            color_array,
            value_array,
            color_value_percent,
            default_value_to_value,
        };
        Data[0].clearBufferIndex();
        Data[0].render3D(selected_range, attr,renderType,graph);
        if (Data[0].grid) {
            Data[0].renderGrid();
        }
        if (Data[0].surface) {
            Data[0].renderSurface();
        }
        Data=Data
        
    };
    let downloadJSON = async () => {
        put_message("message", "正在保存");
        let filename = await Data[0].json_to_download();
        remove_message()
        put_message("message", `已保存到下载目录，文件名为${filename}`);
        remove_message(2.5)
    };
</script>

{#if Data[0].shape.length>=3}
<div id="Show_Data_Content">
    <div class="show_data_option">
        <ColorSelect
            bind:color_value_percent
            bind:color_array
            bind:value_array
        />
    </div>
    <div class="show_data_option">
        <GridDEM bind:Data />
    </div>
    <div class="show_data_option">
        <IsofaceDem bind:Data />
    </div>
    <div class="show_data_option">
        <ChannelSelect
            bind:Data
            bind:selected_range
            on:set_default_value={set_default_value}
            on:auto_render={show_3D}
        />
    </div>
    <div class="show_data_option">
        <button on:click={graph_switch}
        >图形:
        {#if graph=="TRIANGLES"}
            实体
        {:else}
            线段
        {/if}
    </button>
    <button on:click={renderType_switch}
    >渲染:
    {#if renderType=="buffers"}
        快速
    {:else}
        稳定
    {/if}
</button>
        <button on:click={show_3D}>渲染</button>
        <button on:click={downloadJSON}>下载JSON</button>
    </div>
    <div class="show_data_option">
        <Reshape bind:Data></Reshape>
    </div>
</div>
{:else}
<div><p>这不是一个有效的数据(数据应在3个维度或以上)。请通过以下组件改变形状。</p></div>
<div>
<Reshape bind:Data></Reshape>
</div>
{/if}

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
    }
</style>
