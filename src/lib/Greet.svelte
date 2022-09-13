<script>
  import { invoke } from "@tauri-apps/api/tauri";
  import { readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
  import LoadFile from "./Component/LoadFile.svelte";
  import Navigation from "./Component/Navigation.svelte";
  import Canvas from "./Component/Canvas.svelte";
  import Option from "./Component/Option.svelte";
  import { fade, fly } from "svelte/transition";
  import { createFileManager } from "../core/FileManager.js";
  import { createVector } from "../core/Geovector.js";
  import { get_attr_pass_geovector, slice_check } from "../utils/utils";
  export let files = [];
  export let Data = [];
  let selected = "File";
  let index = 0;
  let greetMsg = "";

  // $: Box_Scroll_Width=Box_Width>=793?"overflow-x:scroll;":"overflow-x:hidden;";
  $: isExistData = Data.length > 0;
  $: isExistFile = files.length > 0;

  //  $:Box_Scroll=Box_Scroll_Width+Box_Scroll_Height;
  let readhis = () => {
    greetMsg = files[0].history;
  };
  let test = () => {
    console.log(document.getElementById("box"));
  };
  let getvar = () => {
    files[0].add_history("abcde").then(() => {
      console.log("add");
    });
  };
  let greet = async () => {
    let a = await invoke("greet", {});
    console.log(a["aa"]);
  };
  let get_data = (e) => {
    let slice = e.detail.slice;
    let name = e.detail.name;
    let information_pass_geovector = e.detail.information_pass_geovector;
    if (!slice_check(slice)) {
      alert(
        "The ends of slice should be larger than the starts. And all the value of slice should be >= 0."
      );
      return;
    }
    let time = Date.now();
    files[0]
      .save_values(name, slice)
      .then(() => {
        return readTextFile("./temp");
      })
      .then((v) => {
        let data = JSON.parse(v);
        let temp_data = createVector(data["data"], data["shape"]);
        temp_data.set_attr(
          "slice",
          get_attr_pass_geovector(slice, information_pass_geovector)
        );
        console.log(temp_data);
        console.log(temp_data["slice"]);
        Data.push(temp_data);
        Data = Data;
      })
      .then(() => {
        console.log(Data);
        console.log(Date.now() - time);
      });
    //console.log(await files[0].get_values(name, slice));
  };
</script>

<div id="MainContent">
  {isExistData}
  {isExistFile}
  {#if files.length == 0 && Data.length == 0}
    <LoadFile bind:files bind:Data />
  {/if}

  {#if files.length >= 1 || Data.length >= 1}
    <div in:fade>
      <Canvas bind:Data />
      <Navigation bind:selected bind:isExistData bind:isExistFile />
      <Option bind:Data bind:files on:get_data={get_data} bind:selected></Option>
      <!--such reactive height can not be same level-->
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
  }
</style>
