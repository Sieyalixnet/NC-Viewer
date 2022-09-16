<script>
    import DefaultValue from "./Channel_Select/Default_value.svelte";
    import ChannelAutoRender from "./Channel_Select/Channel_Auto_Render.svelte";
    import Hidden from "./Component/Hidden.svelte";
    import { fade } from "svelte/transition";
    export let Data;
    export let selected_range;

    let hidden = false;
    let title = "选择通道";
</script>

<Hidden bind:hidden bind:title></Hidden>
{#if !hidden}
<div class="default_select_option" in:fade out:fade={{duration:100}}>
    <div><DefaultValue on:set_default_value /></div>
    <div>
        <ChannelAutoRender bind:Data bind:selected_range on:auto_render />
    </div>

</div>
{/if}

<style lang="scss">
    .default_select_option {
        display: flex;
        flex-direction: row;
        align-items: center;
        div {
            flex: 1;
        }
    }
</style>
