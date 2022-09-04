<script>
  import { invoke } from "@tauri-apps/api/tauri";
  import LoadFile from "./Component/LoadFile.svelte";
  import Navigation from "./Component/Navigation.svelte";
  import GetData from "./Option/Get_Data.svelte";
  import Canvas from "./Component/Canvas.svelte";
  import FileAttr from "./Option/File_Attr.svelte";
  import Log from "./Option/Log.svelte";
  import { fade, fly } from "svelte/transition";
  import { createFileManager } from "../core/FileManager.js";
  export let files;
  let selected = "File";
  let index = 0;
  let greetMsg = "";
 let Box_Height;
 let Box_Width;
  // $: Box_Scroll_Width=Box_Width>=793?"overflow-x:scroll;":"overflow-x:hidden;";
  $: Box_Scroll_Height=Box_Height>=200?"overflow-y:scroll;":"overflow-y:hidden;";
//  $:Box_Scroll=Box_Scroll_Width+Box_Scroll_Height;
  function readhis() {
    greetMsg = files[0].history;
  }
  function test() {
    console.log(document.getElementById("box"))
  }
  function getvar() {
    console.log(files[0].variables);
  }
  async function greet() {
    let a = await invoke("greet", {});
    console.log(a["aa"]);
  }
  async function get_value() {
    let slice = [[0, 1], [], []];
    console.log(await files[0].get_values("precip", slice));
  }
  function get_data(e) {
    let slice = e.detail.slice
    let name = e.detail.name
    let time = Date.now()
    files[0].get_values(name, slice).then(()=>{console.log(Date.now()-time)})
    //console.log(await files[0].get_values(name, slice));
  }
</script>

<div id="MainContent">
  {#if files.length == 0}
    <LoadFile bind:files />
  {/if}

  {#if files.length >= 1}
    <div in:fade>
      <Canvas />
      <Navigation bind:selected />
      <!--such reactive height can not be same level-->
      <div id="box" style={Box_Scroll_Height} >
                <div bind:clientHeight={Box_Height} >

        {#if selected=="Log"}
        <div in:fade >
        <Log bind:files></Log>
        </div>
        {:else if selected=="Get_Data"}
        <GetData bind:files on:get_data={get_data}></GetData>
        {:else if selected=="File"}
        <div in:fade>
        <FileAttr bind:files ></FileAttr>
        </div>
        {:else if selected=="Render"}
        <p>Render</p>
        {/if}
        </div>
      </div>
    </div>
    <!-- <div>        <input id="greet-input" placeholder="Enter a index..." />

        <button on:click={test}> get value </button>
        <button on:click={() => readhis()}> get his </button>
        <button on:click={() => getvar()}> get var </button>
        <button on:click={get_value}> get value </button></div> -->
  {/if}
</div>

<style lang="scss">
  #MainContent {
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    #box{
      background-color: rgba(60,60,60,0.8);
      border-radius: 5px;
      padding:5px;
      max-height: 200px;
      max-width: 793px;
    }
  }
</style>
