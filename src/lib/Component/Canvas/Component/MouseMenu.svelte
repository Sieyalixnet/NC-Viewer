<script>
import { element } from "svelte/internal";


export let top=0;
export let left=0;
$:if(document.querySelector("#mousemenu")){
    document.querySelector("#mousemenu").style=`top:${top}px;left:${left}px;`
console.log(top,left)

}
</script>


<style lang="scss">
    #mousemenu{
        position:absolute;
        z-index: 10;
        background-color: rgba(0,0,0,0.9);
        min-width: 200px;
        box-shadow: 0 0 3px rgba(255,255,255,0.8);
    }

</style>


<div id="mousemenu" >
    <slot></slot>
</div>