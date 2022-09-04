<script>
  import Greet from "./lib/Greet.svelte";
  let files = [];
  $: if(files.length>=1){
    let container = document.getElementsByClassName("container")
    container[0].style="padding-top:1vh";
  }
</script>

<main class="container">
  <div class="row">
    <Greet bind:files={files}/>
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
