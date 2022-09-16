<script>
    import { get_array_start_end_delta } from "../../../../utils/utils";
    import Hidden from "./Component/Hidden.svelte";
    import { fade } from "svelte/transition";
    export let Data = [];
    let hidden = true;
    let title = "网格";
    let grid_exist = false;
    $: if(Data[0] && Data[0].grid){
        grid_exist = true
    } else {grid_exist= false}
    let precision = 2.5;
    let al = 0;
    let lat = [-90, 90]; //start, end, delta
    let lat_delta = 30;
    let lon = [-180, 180];
    let lon_delta = 30;
    let set_grid = () => {
        console.log(0)
        if (Data[0]) {
            let lat_final = lat
                .map((x, _, a) => {
                    return x - a[0];
                })
                .map((x) => x / precision);
            let lon_final = lon
                .map((x, _, a) => {
                    return x - a[0];
                })
                .map((x) => x / precision);
            let y = get_array_start_end_delta(
                lat_final[0],
                lat_final[1],
                lat_delta / precision,
                true
            );
            let x = get_array_start_end_delta(
                lon_final[0],
                lon_final[1],
                lon_delta / precision,
                true
            );
            let z = [al];
            let grid = {
                x,
                y,
                z,
            };
            Data[0].set_attr("grid", grid);
            Data=Data
        }
    };
    let remove_grid = () => {
        if (Data[0]) {
            Data[0].set_attr("grid", undefined);
            Data=Data
        }
    };
</script>

<Hidden bind:hidden bind:title></Hidden>
{#if !hidden}
<div class="grid" in:fade out:fade={{duration:100}}>
    <div class="row">
        <div >
            <p>精度</p>
            <input type="number" bind:value={precision} />
        </div>
        <div>
            <p>高度</p>
            <input type="number" bind:value={al} />
        </div>
    </div>
    <div class="row">
        <div >
            <p>纬度起始</p>
            <input type="number" bind:value={lat[0]} />
        </div>
        <div>
            <p>纬度结束</p>
            <input type="number" bind:value={lat[1]} />
        </div>
        <div>
            <p>间隔</p>
            <input type="number" bind:value={lat_delta} />
        </div>
    </div>
    <div class="row">
        <div >
            <p>经度起始</p>
            <input type="number" bind:value={lon[0]} />
        </div>
        <div>
            <p>经度结束</p>
            <input type="number" bind:value={lon[1]} />
        </div>
        <div>
            <p>间隔</p>
            <input type="number" bind:value={lon_delta} />
        </div>
    </div>
    <div class="row">
        <div>
            <button on:click={set_grid}>确认</button>
            {#if grid_exist}
            <button on:click={remove_grid}>删除网格</button>
            {/if}
        </div>
    </div>
</div>
{/if}


<style lang="scss">
    .grid {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        input {
            max-width: 60px;
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
