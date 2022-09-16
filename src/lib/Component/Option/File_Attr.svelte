<script>
    import AttributesTable from "./Component/AttributesTable.svelte";
    export let files;
    export let Data
    let remove_file=async ()=>{
        await files[0].remove_file()
        files=[]
        Data=[]
    }
    let remove_data=()=>{
        Data=[]
    }
</script>

{#if files.length > 0 && files[0].attributes}
    <AttributesTable attributes={files[0].attributes} />
    <button class="warning" on:click={remove_file}>重新读取其他文件</button>
{:else}
    <p>This is a JSON Data.</p>
    <button class="warning" on:click={remove_data}>重新读取其他文件</button>
{/if}

<style lang="scss">
    .warning{background-color: rgba(255,40,40,0.4);
    margin-top: 0.625rem;}

</style>
