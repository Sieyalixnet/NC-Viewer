<script>
  import { readTextFile } from "@tauri-apps/api/fs";
  import { open } from "@tauri-apps/api/dialog";
  import { appDir } from "@tauri-apps/api/path";
  import { createGeovectorFromJSON } from "../../core/Geovector.js";
  import { createFileManager } from "../../core/FileManager.js";
  export let Data = [];
  export let files = [];
  //PARTS: init Store to show message
  import { msg, message } from "../store";
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
      s = second * 1000;
    }
    setTimeout(() => {
      if (msgs.length > 0) {
        msgs.shift();
      }
      msg.set(msgs);
    }, s);
  }
  //----------------------------
  let path = "./test.JSON";
  let browser = async () => {
    const selected = await open({
      directory: false,
      multiple: false,
      filters: [
        {
          name: "NetCDF or JSON",
          extensions: ["json", "nc"],
        },
      ],
      defaultPath: await appDir(),
    });
    path = selected;
  };

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
      Data.push(createGeovectorFromJSON(vec.files[0]));
      Data = Data;
    } catch (e) {
      put_message(
        "error",
        "This software can not read this JSON file. You should make a format JSON file from geovector or this software."
      );
      console.log(e);
    }
  };

  let readfile = async () => {
    let file = createFileManager(path);
    let msg = await file.init();
    if (file.index == 9999 || file.index == 10000) {
      put_message("error", "This is not a valid NC file. ");
      remove_message(3);
      return;
    }
    if (msg != "") {
      put_message("error", "There are some errors occured:\n " + msg);
      remove_message(3);
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
    <button on:click={browser}>浏览</button>
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
