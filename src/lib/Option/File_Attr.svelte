<script>
    import AttributesTable from "./Component/AttributesTable.svelte";
    export let files;
</script>

<AttributesTable attributes={files[0].attributes} />

<style lang="scss"></style>
