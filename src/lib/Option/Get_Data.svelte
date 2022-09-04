<script>
    import VarAttributes from "./Get_Data/VarAttributes.svelte";
    import Dimensions from "./Get_Data/Dimensions.svelte";
    import { fade, fly } from "svelte/transition";
    import GetDataOption from "./Get_Data/Get_Data_Option.svelte";
    export let files;
    let file = files[0];
    let { variables } = file;
    let selected = "Attributes";
    let map = [
        { k: "属性", v: "Attributes", selected: true },
        { k: "维度", v: "Dimension", selected: false },
        { k: "获取", v: "Get", selected: false },
    ];
    function select(item) {
        selected = item.v;
        for (let i of map) {
            if (i.v != selected) {
                i.selected = false;
            } else {
                i.selected = true;
            }
        }
        map = map;
    }
</script>

<div id="GetDataContent">
    <div class="GetDataNav">
        {#each map as item (item.v)}
            <div>
                <button
                    class:selected={item.selected}
                    on:click={() => {
                        select(item);
                    }}>{item.k}</button
                >
            </div>
        {/each}
    </div>
    <div class="GetDataDetails">
        {#if selected == "Attributes"}
            <div in:fade>
                <VarAttributes bind:variables />
            </div>
        {:else if selected == "Dimension"}
            <div in:fade>
                <Dimensions bind:variables />
            </div>
        {:else if selected == "Get"}
            <GetDataOption bind:variables on:get_data />
        {/if}
    </div>
</div>

<style lang="scss">
    #GetDataContent {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;

        .GetDataNav {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;

            margin: 0.625rem 0;
            button {
                margin-bottom: 0.3125rem;
                height: 32px;
                padding: 5px 20px;
            }
            .selected {
                background-color: rgb(199, 118, 60);
                box-shadow: 0 0 5px rgba(180, 180, 255, 0.7);
            }
        }
        .GetDataDetails {
            flex: 5;
            min-height: 190px;
            width: 650px;
            overflow: hidden;
            background-color: rgba(40, 40, 40, 0.8);
        }
    }
</style>
