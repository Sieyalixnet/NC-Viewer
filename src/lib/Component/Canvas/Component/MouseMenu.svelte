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
        z-index: 100;
        background-color: black;
        min-height: 200px;
        min-width: 200px;
    }

</style>


<div id="mousemenu" ></div>