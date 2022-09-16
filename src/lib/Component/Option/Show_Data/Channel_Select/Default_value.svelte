<script>
    let default_v;
    let checked=false;
        import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    let set_default_value = () => {
            dispatch("set_default_value", { default_v });
    };
    let click=()=>{
        default_v=undefined
        set_default_value()
    }
    let p_click=()=>{default_v=undefined;checked=!checked;set_default_value()}
</script>
<div>
<input type="checkbox" on:click={click} bind:checked={checked}>
<p  on:click={p_click}>缺省值转换为</p>
{#if checked}
    <input type="number" on:change={set_default_value} bind:value={default_v}>
{/if}
</div>
<style lang="scss">

    input,p{ display: inline-block;}
    input[type="number"]{width: 6.25rem}
    input[type="checkbox"]{cursor: pointer;}
    p{cursor: pointer;}
</style>
