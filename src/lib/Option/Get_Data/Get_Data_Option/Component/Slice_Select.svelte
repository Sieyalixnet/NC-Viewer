<script>
    export let dimension_len = 0;
    export let dimension_name = "";
    export let dimension_slice = [];
    export let slice_helper = [];
    export let selected_element;
    //this two vars are for determine which input is selected
    export let last_select_input;

    let select_option; //id, is also equal to length
    $: if (select_option && select_option != 0) {
        dimension_slice = new Array(select_option).fill(0);
    } else {
        dimension_slice = [];
    }
    let handle_click = (value) => {
        last_select_input = [dimension_name, value];
        console.log(last_select_input);
    };
    let handle_click_selectElement = (event) => {
        selected_element = event.target;
    };
    let options = [
        { id: 0, name: "default" },
        { id: 1, name: "Start" },
        { id: 2, name: "Start End" },
        { id: 3, name: "Start End Step" },
    ];
    let names = ["Start", "End", "Step"];
</script>

<div class="Slice_Select">
    <select bind:value={select_option}>
        {#each options as option}
            <option value={option.id}>
                {option.name}
            </option>
        {/each}
    </select>
    <div class="Dimension">
        {#each dimension_slice as slice_text, id}
            <div on:click={handle_click_selectElement}>
                <p style="display: inline-block;">{names[id]}:</p>
                <input
                    type="number"
                    class="slice_input"
                    on:click={() => {
                        handle_click(id);
                    }}
                    bind:value={dimension_slice[id]}
                />
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .Slice_Select {
        .Dimension {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            div {
                margin-right: 1.25rem;
                p {
                    margin-right: 0.3125rem;
                }
                input {
                    width: 3.125rem;
                }
            }
        }
    }
</style>
