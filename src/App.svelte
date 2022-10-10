<script>

  import Greet from "./lib/Greet.svelte";
  import Msg from "./lib/Msg.svelte";

  let files = [];
  let Data = [];

  //test random DEM
  // import { onMount } from "svelte";
  //   import {createVector} from "./core/Geovector"
  // import {random_DEM} from "./core/WebGL/random_DEM"
  // onMount(()=>{
  //   let v = random_DEM(200,[-1,20],0)
  //   console.log(v)
  //   Data.push(createVector(v,[1,200,200]))
  // })

  $: if (files.length >= 1 || Data.length >= 1) {
    let container = document.getElementsByClassName("container");
    if (container.length > 0) {
      container[0].style = "padding-top:1vh";
    }
  } else {
    let container = document.getElementsByClassName("container");
    if (container.length > 0) {
      container[0].style = "padding-top:40vh";
    }
  }

  let click = (event) => {
    if (event.button == 2) {
      console.log(event);
    }
  };
</script>

<main class="container" on:mousedown={click}>
  <div id="message_window"><Msg /></div>
  <div class="row">
    <Greet bind:files bind:Data />
  </div>
</main>

<style>
  #message_window {
    z-index: 100;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .logo.vite:hover {
    filter: drop-shadow(0 0 2em #747bff);
  }

  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00);
  }
</style>
