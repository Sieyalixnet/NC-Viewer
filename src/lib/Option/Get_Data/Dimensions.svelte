<script>
    import { onMount } from "svelte";
    export let variables;
    // onMount(() => console.log(variables));
</script>

{#each variables as variable, i}
    <div class="variable">
        <h1>{i + 1}. {variable.name}</h1>

        <div class="dimension">
            <table>
                <tr>
                    <th>Dimension</th>
                    <th>Name</th>
                    <th>length</th>
                </tr>
                {#each variable.dimensions_name as _, _i}
                    <tr>
                        <td>{_i}</td>
                        <td>{variable.dimensions_name[_i]}</td>
                        <td>{variable.dimensions_len[_i]}</td>
                    </tr>
                {/each}
            </table>
        </div>
    </div>
{/each}

<style lang="scss">
    .variable {
        display: flex;
        flex-direction: column;
        .dimension {
            display: flex;
            justify-content: center;
            align-items: center;
            table {
                display: block;
                border-collapse: collapse;

                th,
                td {
                    padding: 0.3125rem 0.625rem;
                    border: 1px solid rgba(255, 255, 255, 0.7);
                }
            }
        }
    }
</style>
