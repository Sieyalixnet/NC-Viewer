<script>
    import WebGl3DController from "./Canvas/WebGL3D_Controller.svelte";
    import MouseMenu from "./Canvas/Component/MouseMenu.svelte";
    import { tick } from "svelte";
    import { fade } from "svelte/transition";
    export let Data = [];
    let left = 0; //right click event variable
    let top = 0; //right click event variable
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

            console.log(left);
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
        if (matrix.orthoUnits == 0) {
            if (e.deltaY > 0) {
                matrix.fieldOfViewRadians += 1;
            } else {
                if (matrix.fieldOfViewRadians > 1) {
                    matrix.fieldOfViewRadians -= 1;
                }
            }
        } else {
            if (e.deltaY > 0) {
                matrix.orthoUnits += 1;
            } else {
                if (matrix.orthoUnits > 1) {
                    matrix.orthoUnits -= 1;
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
    <div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
        <MouseMenu bind:left bind:top />
    </div>
{/if}
<div id="MainCanvasDiv">
    <div id="webglController">
        <WebGl3DController bind:Data bind:matrix />
    </div>
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
    #MainCanvasDiv {
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.4);

        #webglController {
            position: absolute;
            right: 0px;
            top: 0px;
            padding: 0 0 5px 5px;
            box-shadow: 0px 0px 2px rgba(255, 255, 255, 0.4);
        }
    }
</style>
