<script>
    export let variables;
    export let selected_var;
</script>

<select bind:value={selected_var}>
    {#each variables as variable}
        <option value={variable.name}>
            {variable.name}
        </option>
    {/each}
</select>

<style lang="scss"></style>
