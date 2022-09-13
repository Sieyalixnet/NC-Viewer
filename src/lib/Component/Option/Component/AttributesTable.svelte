<script>
    import { onMount } from "svelte";

    import { map_object_to_array } from "../../../../utils/utils";
    export let attributes;
    let data = map_object_to_array(attributes);
    // console.log(data)
    // onMount(() => {
    // });
</script>

<div class="tableContent">
    <table>
        <tr>
            <th>Name</th>
            <th>Value</th>
        </tr>
        {#each data as item (item.k+item.v)}
            <tr>
                <td>{item.k}</td>
                <td>{item.v}</td>
            </tr>
        {/each}
    </table>
</div>

<style lang="scss">
    .tableContent {
        display: flex;
        justify-content: center;
        align-items: center;
        table {
            display: block;
            border-collapse: collapse;
            
            th,
            td {
                min-width: 16.25rem;
                border: 1px solid rgba(255, 255, 255, 0.7);
            }
        }
    }
</style>
