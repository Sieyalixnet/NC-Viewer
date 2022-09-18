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
  //PARTS: init Store to show message
  import { msg,message } from "./store";
  let msgs;
  const unsubscribe_msg = msg.subscribe((v) => {
      msgs = v;
  });
  function put_message(type, text) {
      msgs.push(message(type, text));
      msg.set(msgs);
  }
  function remove_message(second) {
      let s = 0;
      if (second) {
          s = second*1000;
      }
      setTimeout(() => {
          if (msgs.length > 0) {
              msgs.shift();
          }
          msg.set(msgs);
      }, s);
  }
  //----------------------------

  export let files = [];
  export let Data = [];
  let selected = "File";

  $: isExistData = Data.length > 0;
  $: isExistFile = files.length > 0;

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
    put_message("message","正在读取文件，请等待。如果等待时间过长，请检查是否以管理员权限运行本软件(右键-以管理员身份运行)(必须打开管理员权限)，并且切勿一次读取过多数据(在 获取 中限定维度的读取范围)。")
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
        // console.log(temp_data);
        Data = []
        Data.push(temp_data);
        Data = Data;
        remove_message()
      })
      // .then(() => {
      //   console.log(Data);
      //   console.log(Date.now() - time);
      // });
  };
</script>

<div id="MainContent">
  {#if files.length == 0 && Data.length == 0}
    <LoadFile bind:files bind:Data />
  {/if}

  {#if files.length >= 1 || Data.length >= 1}
    <div in:fade>
      <Canvas bind:Data />
      <Navigation bind:selected bind:isExistData bind:isExistFile />
      <Option bind:Data bind:files on:get_data={get_data} bind:selected></Option>
    </div>
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
