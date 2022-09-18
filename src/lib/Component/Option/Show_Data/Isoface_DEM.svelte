<script>
    import { get_array_start_end_delta, HexToRGB } from "../../../../utils/utils";
    import Hidden from "./Component/Hidden.svelte";
    import { fade } from "svelte/transition";
    export let Data = [];
    let hidden = true;
    let title = "等值面";
    let surface_exist = false;
    $: if(Data[0] && Data[0].surface){
        surface_exist = true
    } else {surface_exist= false}


    let value = [10, 30]; //start, end, delta
    let value_delta = 10;
    let color = "#ffffff";
    let alpha = 0.1;

    let set_grid = () => {

        if (Data[0]) {
            let z = get_array_start_end_delta(
                value[0],
                value[1],
                value_delta,
                true
            );
            let color_final = HexToRGB(color)//Hex-> Unsigned8Array
            color_final.push(Math.floor( 256*alpha))
            let surface = {
                z,
                color_final
            };
            Data[0].set_attr("surface", surface);
            Data=Data
        }
    };
    let remove_grid = () => {
        if (Data[0]) {
            Data[0].set_attr("surface", undefined);
            Data=Data
        }
    };
</script>

<Hidden bind:hidden bind:title></Hidden>
{#if !hidden}
<div class="isoface" in:fade out:fade={{duration:100}}>
    <div class="row">
        <div >
            <p>起始值</p>
            <input type="number" bind:value={value[0]} />
        </div>
        <div>
            <p>结束值</p>
            <input type="number" bind:value={value[1]} />
        </div>
        <div>
            <p>间隔</p>
            <input type="number" bind:value={value_delta} />
        </div>
    </div>
    <div class="row">
        <div >
            <p>颜色</p>
            <input type="color" bind:value={color} />
        </div>
        <div>
            <p>透明度</p>
            <input type="number" bind:value={alpha} />
        </div>
    </div>
    <div class="row">
        <div>
            <button on:click={set_grid}>确认</button>
            {#if surface_exist}
            <button on:click={remove_grid}>删除等值面</button>
            {/if}
        </div>
    </div>
</div>
{/if}


<style lang="scss">
    .isoface {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        input {
            max-width: 60px;
        }
        input[type="color"] {
            padding: 0px;
            display: block;
        }
        .row {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            div {
                p,
                input {
                    display: inline-block;
                }
            }
        }
    }
</style>
