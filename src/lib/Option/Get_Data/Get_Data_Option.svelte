<script>
    import SelectVar from "./Get_Data_Option/Select_Var.svelte";
    import Slice from "./Get_Data_Option/Slice.svelte";
    export let variables;
    let slice_helpers = {};
    for (let variable of variables) {
        if (variable["slice_helper"]) {
            slice_helpers[variable["name"]] = variable["slice_helper"];
        }
    }

    let selected_var = "";
    let attrs = variables.map((x) => x.attributes);
</script>

<SelectVar bind:variables bind:selected_var />
<Slice bind:variables bind:selected_var bind:slice_helpers on:get_data />

<style lang="scss"></style>
