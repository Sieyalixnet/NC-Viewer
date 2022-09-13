<script>
    import ColorBlock from "./Color_Select/Color_Block.svelte";
    export let color_array;
    export let value_array;
    export let color_value_percent;
     let indeces = new Array(100).fill(0).map((_,i)=>{return i})
    let plus = (e) => {
        color_array.push("#000000");
        value_array.push(1);
        color_array = color_array;
        value_array = value_array;
    };
    let switch_value_percent    =()=>{
        color_value_percent=!color_value_percent
    }
    let splice = (e) => {
        let i = e.detail.i
        color_array.splice(i, 1);
        value_array.splice(i, 1);   
        color_array = color_array;
        value_array = value_array;
    };
</script>

<div class="color_select">
    <div class="color_select_control"  >
    <button on:click|stopPropagation={plus}>增加</button> 
    <button on:click|stopPropagation={switch_value_percent}>
        {#if color_value_percent}
            百分比
        {:else}
            数值
        {/if}
        </button> 
    </div>
    {#each color_array as _, i}
        <ColorBlock
            bind:color={color_array[i]}
            bind:value={value_array[i]} 
            bind:i={indeces[i]}
            bind:color_value_percent
            on:splice={splice}

        />
    {/each}
   
</div>

<style lang="scss">
    .color_select {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding: 0.3125rem;
        .color_select_control{
            display: flex; 
            flex-direction:column; 
            button{
                min-width: 6.25rem;

            }

        }
    }
</style>
