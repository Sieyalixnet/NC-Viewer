<script>
  import { invoke } from "@tauri-apps/api/tauri";
  import { fade, fly } from "svelte/transition";
  import { createFileManager } from "../../core/FileManager.js";

  export let files = [];
  let path = "F:\\Programme\\0Project\\NC_GUI\\test.nc";

  let readfile = async ()=> {
    let file = createFileManager(path);
    await file.init()
    if(file.index==9999 || file.index==10000){alert("This is not a valid NC file. ");return;}
    console.log(file)
    files.push(file);
    files = files;

  }
</script>

    <div class="row" >
      <h1>Input a NC format File</h1>
      <div class="inputs">
        <input
          id="greet-input"
          placeholder="Enter a path of NC format file"
          bind:value={path}
        />
        <button>浏览</button>
        <button on:click={readfile}> 确认 </button>
      </div>
    </div>


<style lang="scss">
  .row {
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .inputs{
      width: 100%;
    input {
      width: 60%;
    }}
  }
</style>
