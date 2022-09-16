<script>
    export let  title = "未命名";
    export let hidden = false;
    let switch_hide= ()=>{
        hidden = !hidden
    }
</script>

<style lang="scss">
    .hidden{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        h4,button{
            display: block;
            margin:0;
        }
        h4{flex:20;}
        button{
            flex:1;
            max-width: 3.125rem;
            padding:0 5px;
        }
        user-select: none;
    }

</style>


<div class="hidden">
    <h4>{title}</h4>
    <button on:click={switch_hide}>
        {#if hidden}
        +
        {:else}
        -
        {/if}
    </button>
</div>
