<script>
    import AttributesTable from "./Component/AttributesTable.svelte";
    export let files;
</script>

{#if files.length > 0 && files[0].attributes}
    <AttributesTable attributes={files[0].attributes} />
{:else}
    <p>This is a JSON Data.</p>
{/if}

<style lang="scss"></style>
