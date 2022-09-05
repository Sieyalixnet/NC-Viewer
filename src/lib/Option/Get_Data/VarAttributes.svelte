<script>
    import { map_object_to_array } from "../../../utils/utils";
    import { onMount } from "svelte";
    import AttributesTable from "../Component/AttributesTable.svelte";
    export let variables;
    // let attrs = map_object_to_array(variables.attributes)
    //onMount(()=>console.log(variables.attributes))
    let attrs = variables.map((x) => x.attributes);
    // attrs = attrs.map(x=>map_object_to_array(x))
    // onMount(()=>console.log(attrs))
</script>

{#each variables as variable, index}
    <h1>{index + 1}. {variable.name}</h1>
    <AttributesTable attributes={variable.attributes} />
{/each}

<style lang="scss"></style>
