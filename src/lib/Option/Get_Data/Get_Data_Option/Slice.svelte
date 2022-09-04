<script>
    import { onMount } from "svelte";
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
    let last_select_input = [];
    let variable;
    // onMount(() => {
    //     console.log(variables, selected_var);
    // });
    $: if (selected_element) {
        let all_inputs = document.getElementsByClassName("slice_input");
        if (selected_element.type == "number") {
            for (let el of all_inputs) {
                // @ts-ignore
                el.style = "box-shadow:0 0 0px";
            }
            selected_element.style = "box-shadow:0 0 10px #f00";
        }
    }
    let confirm = () => {
        variable = variables.find((x) => x.name == selected_var);
    };
    let test = () => {
        console.log(last_select_input);
    };
    let get_data = () => {
        dispatch("get_data", { slice: slice, name: variable.name });
    };
</script>

<!-- {variable.dimensions_len} -->

<button on:click={confirm}>确认</button>
<button on:click={test}>test</button>
<button on:click={get_data}>获取数据</button>
{#if variable}
    {#each variable.dimensions_len as dimension_len, index}
        <h3>{variable.dimensions_name[index]}</h3>
        <SliceSelect
            bind:last_select_input
            bind:dimension_len
            bind:dimension_name={variable.dimensions_name[index]}
            bind:dimension_slice={slice[index]}
            bind:slice_helper={slice_helpers[variable.dimensions_name[index]]}
            bind:selected_element
        />
        {#if last_select_input.length == 2 && slice[index].length > 0}
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
