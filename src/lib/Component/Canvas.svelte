<script>
    import WebGl3DController from "./Canvas/WebGL3D_Controller.svelte";
    import MouseMenu from "./Canvas/Component/MouseMenu.svelte";
    import { writeBinaryFile,BaseDirectory } from '@tauri-apps/api/fs';
    import { tick } from "svelte";
    import { fade } from "svelte/transition";
    export let Data = [];
    import { msg,message } from "../store";
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
    // ----------------------------
    let left = 0; //right click event variable
    let top = 0; //right click event variable
    let controller_show=false
    let menushow = false;

    let matrix;
    let Z_param; //A parameter to check the rotation degree. Because the calculation of translation should be converse if we are on the opposite of the object.
    $: if (Data.length >= 1 && Data[0]["renderWebGL"]) {
        matrix = Data[0].renderWebGL.matrix;
    }
    $: if (matrix) {
        Z_param =
            Math.floor(Math.abs((matrix.rotation[2] + 90) / 180)) % 2 == 0
                ? 1
                : -1;
    }
    let switch_controller = ()=>{
        controller_show = !controller_show

    }
    let download_image = async () =>{
        drawScene()
        let filename = "Geovector_"+(Date.now().toString()) +".png"
        let canvas = document.getElementById("MainCanvas");
        canvas.toBlob(async (blob)=>{
            let u8a = await blob.arrayBuffer()
            await writeBinaryFile(filename, u8a, { dir: BaseDirectory.Download });
            put_message("message",`已保存至下载目录，文件名为${filename}`)
            remove_message(2)
        })

    }

    let drawScene = () => {
        Data[0].render();
        Data[0].saveCam(matrix);
    };
    let init_screenX;
    let init_screenY;
    let mouse_down_state = false;
    let mouse_down_button = 0;
    let handleMousedown = (e) => {
        if (!matrix) {
            return;
        }
        menushow = false;
        if (e.button != 2) {
            init_screenX = e.screenX;
            init_screenY = e.screenY;
            mouse_down_state = true;
            mouse_down_button = e.button;
        } else {
            menushow = true;
            tick().then(() => {
                left = e.clientX;
                top = e.clientY;
            });

        }
    };
    let handleMouseUp = (e) => {
        if (!matrix) {
            return;
        }
        init_screenX = 0;
        init_screenY = 0;
        mouse_down_state = false;
    };
    let handleMousemove = (e) => {
        if (!matrix) {
            return;
        }
        if (!mouse_down_state) {
            return;
        }
        let delta_X = Math.round((e.screenX - init_screenX) / 10);
        let delta_Y = Math.round((e.screenY - init_screenY) / 10);
        if (mouse_down_button == 0) {
            //left key
            matrix.rotation[0] += delta_Y;
            matrix.rotation[2] += delta_X;
        } else if (mouse_down_button == 1) {
            //mid key
            matrix.translation[1] -= Z_param * delta_Y;
            matrix.translation[0] += Z_param * delta_X;
        }
        init_screenX = e.screenX;
        init_screenY = e.screenY;

        matrix = matrix;
        drawScene();
    };
    let handleWheel = (e) => {
        if (!matrix) {
            return;
        }

        if (matrix.Ortho_Radians > 0) {
            if (e.deltaY > 0) {
                matrix.Ortho_Radians += 1;
            } else {
                if (matrix.Ortho_Radians > 1) {
                    matrix.Ortho_Radians -= 1;
                }
            }
        } 
        matrix = matrix;
        drawScene();
    };

    let handleKeydown = (e) => {
        if (!matrix) {
            return;
        }
        let key = e.key.toLowerCase();
        if (key == "w") {
            matrix.translation[1] += Z_param * 2;
        }
        if (key == "s") {
            matrix.translation[1] -= Z_param * 2;
        }
        if (key == "a") {
            matrix.translation[0] -= Z_param * 2;
        }
        if (key == "d") {
            matrix.translation[0] += Z_param * 2;
        }
        if (key == "q") {
            matrix.translation[2] -= 2;
        }
        if (key == "e") {
            matrix.translation[2] += 2;
        }
        if (key == "arrowright") {
            matrix.camPos[0] += 2;
        }
        if (key == "arrowleft") {
            matrix.camPos[0] -= 2;
        }
        if (key == "arrowup") {
            matrix.camPos[1] += 2;
        }
        if (key == "arrowdown") {
            matrix.camPos[1] -= 2;
        }
        matrix = matrix;
        drawScene();
    };
</script>

<svelte:window on:keydown={handleKeydown} />

{#if menushow}
    <div id="menu" in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
        <MouseMenu bind:left bind:top >
            <button on:click={switch_controller}>{#if controller_show}隐藏{:else}显示{/if}控制栏</button>
            <button on:click={download_image }>下载图像</button>
            
        </MouseMenu>
    </div>
{/if}
<div id="MainCanvasDiv">
    {#if controller_show}
    <div id="webglController" in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
        <WebGl3DController bind:Data bind:matrix />
    </div>
    {/if}
    <canvas
        id="MainCanvas"
        height="400"
        width="800"
        on:mousedown={handleMousedown}
        on:mousemove={handleMousemove}
        on:mouseup={handleMouseUp}
        on:mousewheel={handleWheel}
    />
</div>

<style lang="scss">
    #menu{
        button{
            width: 100% !important;
            border-radius: 0;
        }

    }
    #MainCanvasDiv {
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.4);

        #webglController {
            position: absolute;
            right: 0px;
            top: 0px;
            padding: 0 0 5px 5px;
            border-left: solid 1px rgba(255, 255, 255, 0.4);
            border-bottom: solid 1px rgba(255, 255, 255, 0.4);
            background-color: rgba(0,0,0, 0.4);
        }
    }
</style>
