<script>
    export let last_select_input;
    export let dimension_name;
    export let dimensions_name; //all the dimension name
    export let slice_helpers;
    export let slice;
    let last_select_index;
    let last_select_value;
    $: if (last_select_input.length == 2) {
        last_select_index = [
            dimensions_name.indexOf(last_select_input[0]),
            last_select_input[1],
        ];
        last_select_value_exist();
    }

    let selected_slice_helper;
    let selected_value;
    let last_select_value_exist = () => {
        try {
            last_select_value =
                slice[last_select_index[0]][last_select_index[1]];
        } catch (e) {
            last_select_value = undefined;
        }
    };
    let update_value = () => {
        if (selected_value) {
            let value = selected_slice_helper.indexOf(selected_value);
            slice[last_select_index[0]][last_select_index[1]] = value;
            slice = slice;
        }
    };
</script>

<select bind:value={selected_slice_helper}>
    {#each slice_helpers[dimension_name] as helper}
        <option value={helper.v}>
            {helper.k}
        </option>
    {/each}
</select>

{#if Array.isArray(selected_slice_helper) && !isNaN(last_select_value)}
    <select bind:value={selected_value}>
        {#each selected_slice_helper as value}
            <option {value}>
                {value}
            </option>
        {/each}
    </select>
{/if}

<button on:click={update_value}>确认</button>

<style lang="scss"></style>
