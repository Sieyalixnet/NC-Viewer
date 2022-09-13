<script>
    import { fade } from "svelte/transition";
    import SelectVar from "./Get_Data_Option/Select_Var.svelte";
    import Slice from "./Get_Data_Option/Slice.svelte";
    export let variables;
    let slice_helpers = {};
    for (let variable of variables) {//take the slice_helper from the variable and convert them to an object. It will be used in the children component Slice_helper.svelte
        if (variable["slice_helper"]) {
            slice_helpers[variable["name"]] = variable["slice_helper"];
        }
    }

    let selected_var = "";
    let attrs = variables.map((x) => x.attributes);
</script>

<div class="Get_Data_Option" in:fade>
<SelectVar bind:variables bind:selected_var />
<Slice bind:variables bind:selected_var bind:slice_helpers on:get_data />
</div>
<style lang="scss">
    .Get_Data_Option{
        margin-top: 0.9375rem;

    }
</style>
