<script>
  import { readTextFile } from "@tauri-apps/api/fs";
  import { createGeovectorFromJSON } from "../../core/Geovector.js";
  import { createFileManager } from "../../core/FileManager.js";
  export let Data = [];
  export let files = [];
  //let path = "F:\\Programme\\0Project\\NC_GUI\\test.nc";
  let path =
    "F:\\Programme\\0Project\\NC_GUI\\GeoVectorData_1662942541640.JSON";

  let check_file = async () => {
    if (path.toLowerCase().endsWith(".nc")) {
      await readfile();
    } else if (path.toLowerCase().endsWith(".json")) {
      await readJSON();
    }
  };
  let readJSON = async () => {
    let vec;
    try {
      vec = await readTextFile(path);
      vec = JSON.parse(vec);
      console.log(vec)
      Data.push(createGeovectorFromJSON(vec.files[0]));
      Data=Data
    } catch (e) {
      console.log(e);
    }
  };

  let readfile = async () => {
    let file = createFileManager(path);
    await file.init();
    if (file.index == 9999 || file.index == 10000) {
      alert("This is not a valid NC file. ");
      return;
    }
    files.push(file);
    files = files;
  };
</script>

<div class="row">
  <h1>Input a NC format File</h1>
  <div class="inputs">
    <input
      id="greet-input"
      placeholder="Enter a path of NC format file"
      bind:value={path}
    />
    <button>浏览</button>
    <button on:click={check_file}> 确认 </button>
  </div>
</div>

<style lang="scss">
  .row {
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .inputs {
      width: 100%;
      input {
        width: 60%;
      }
    }
  }
</style>
