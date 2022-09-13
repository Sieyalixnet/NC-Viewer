<script>
    import FileAttr from "./Option/File_Attr.svelte";
    import Log from "./Option/Log.svelte";
    import GetData from "./Option/Get_Data.svelte";
    import ShowData from "./Option/Show_Data.svelte";
    import { fade } from "svelte/transition";
    export let Data = [];
    export let files = [];
    export let selected = "File";
    let Box_Height;
    $: Box_Scroll_Height =
        Box_Height >= 200 ? "overflow-y:scroll;" : "overflow-y:hidden;";
</script>

<div id="box" style={Box_Scroll_Height}>
    <div bind:clientHeight={Box_Height}>
        {#if selected == "Log"}
            <div in:fade>
                <Log bind:files />
            </div>
        {:else if selected == "Get_Data"}
            <GetData bind:files on:get_data />
        {:else if selected == "File"}
            <div in:fade>
                <FileAttr bind:files />
            </div>
        {:else if selected == "Render"}
            <ShowData bind:Data />
        {/if}
    </div>
</div>

<style lang="scss">
    #box {
        background-color: rgba(60, 60, 60, 0.8);
        border-radius: 5px;
        padding: 5px;
        max-height: 200px;
        max-width: 793px;
    }
</style>
