<script>
  import Greet from "./lib/Greet.svelte";
  let files = [];
  let Data = [];
  $: if(files.length>=1 || Data.length>=1){
    let container = document.getElementsByClassName("container")
    container[0].style="padding-top:1vh";
  }
  let click = (event) =>{
    if(event.button==2){
    console.log(event)}

  }
</script>

<main class="container"  on:mousedown={click}>
  <div class="row">
    <Greet bind:files bind:Data/>
  </div>
</main>

<style>
  .logo.vite:hover {
    filter: drop-shadow(0 0 2em #747bff);
  }

  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00);
  }
</style>
