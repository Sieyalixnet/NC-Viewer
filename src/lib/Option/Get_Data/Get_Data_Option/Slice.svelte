<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Dimensions from "../Dimensions.svelte";
    import SliceSelect from "./Component/Slice_Select.svelte";
    import { createEventDispatcher } from "svelte";
    import SliceHelper from "./Component/Slice_helper.svelte";
    const dispatch = createEventDispatcher();

    export let variables;
    export let selected_var;
    export let slice = [];
    export let slice_helpers = {};
    let selected_element = null;
    let last_select_input = [];//["dimension name", the index of selected input of this dimension]
    let variable;
    // onMount(() => {
    //     console.log(variables, selected_var);
    // });
    $: if (selected_element) {
        let all_inputs = document.getElementsByClassName("slice_input");
        if (selected_element.type == "number") {
            for (let el of all_inputs) {
                // @ts-ignore
                el.style = "box-shadow:0 0 10px rgba(0,0,0,0)";
            }
            selected_element.style = "box-shadow:0 0 10px rgba(255,150,150,0.8);transition:box-shadow 0.2s ease-in-out;";
        }
    }
    let confirm = () => {
        variable = variables.find((x) => x.name == selected_var);
        slice = new Array(variable.dimension_len).fill([])
    };
    let test = () => {
        console.log(last_select_input);
    };
    let get_data = () => {
        dispatch("get_data", { slice: slice, name: variable.name });
    };
</script>

<!-- {variable.dimensions_len} -->
{slice}
<button on:click={confirm}>查看该维度</button>
{#if slice.length!=0}<button on:click={get_data}>获取数据</button>{/if}
<button on:click={test}>test</button>
{#if variable}
    {#each variable.dimensions_len as _, index}
        <h3>{variable.dimensions_name[index]}</h3>
        <SliceSelect
            bind:last_select_input
            bind:dimension_len={variable.dimensions_len[index]}
            bind:dimension_name={variable.dimensions_name[index]}
            bind:dimension_slice={slice[index]}
            bind:slice_helper={slice_helpers[variable.dimensions_name[index]]}
            bind:selected_element
        />
        {#if last_select_input.length == 2 }
            <SliceHelper
                bind:last_select_input
                bind:dimension_name={variable.dimensions_name[index]}
                bind:dimensions_name={variable.dimensions_name}
                bind:slice_helpers
                bind:slice
            />
        {/if}
    {/each}
{/if}

<style lang="scss"></style>
