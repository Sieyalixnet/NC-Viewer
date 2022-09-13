<script>
    import Slider from "./Component/Slider.svelte";
    import { new_ } from "../../../utils/utils";
import { scale } from "svelte/transition";
    export let Data = [];
    export let matrix;
    let drawScene = () => {
        Data[0].render()
        Data[0].saveCam(matrix);
    };
    let fieldOfViewRadians_default = { max: 360, min: 0, step: 1 };
    let translation_default = { max: 360, min: -360, step: 1 };
    let rotation_default = { max: 360, min: -360, step: 1 };
    let scale_default = { max: 5, min: 0, step: 0.1 };
    let camPos_default = { max: 360, min: -360, step: 1 };
    let orthoUnits_default = { max: 150, min: 0, step: 1 };

    let translation_labels=["translationX", "translationY","translationZ"]
    let rotation_labels=["rotationX","rotationY","rotationZ"]
    let scale_labels=["scaleX","scaleY","scaleZ"]
    let camPos_labels=["camPositionX","camPositionY","camPositionZ"]

    let reset_cam = () => {
        let default_cam = Data[0].OptionalAttributes.default_cam;
        console.log(default_cam);
        Data[0].OptionalAttributes.saved_cam = undefined;
        for (let item in Data[0].OptionalAttributes.default_cam) {
            console.log(item);
            matrix[item] =
                typeof default_cam[item] == "object"
                    ? new_(default_cam[item])//Object will be refered. We should make a deep
                    : default_cam[item];
        }
        matrix = matrix;
        drawScene();
    };
</script>

<div class="webgl3dController_class">
    {#if !!matrix}
        {#each translation_labels as label,index}
        <Slider
            on:drawScene={drawScene}
            bind:attr={translation_default}
            bind:value={matrix.translation[index]}
            label={label}
        />            
        {/each}
        {#each rotation_labels as label,index}
        <Slider
            on:drawScene={drawScene}
            bind:attr={rotation_default}
            bind:value={matrix.rotation[index]}
            label={label}
        />            
        {/each}
        {#each scale_labels as label,index}
        <Slider
            on:drawScene={drawScene}
            bind:attr={scale_default}
            bind:value={matrix.scale[index]}
            label={label}
        />            
        {/each}
        {#each camPos_labels as label,index}
        <Slider
            on:drawScene={drawScene}
            bind:attr={camPos_default}
            bind:value={matrix.camPos[index]}
            label={label}
        />            
        {/each}
        <Slider
            on:drawScene={drawScene}
            bind:attr={fieldOfViewRadians_default}
            bind:value={matrix.fieldOfViewRadians}
            label="fieldOfViewRadians"
        />
        <Slider
            on:drawScene={drawScene}
            bind:attr={orthoUnits_default}
            bind:value={matrix.orthoUnits}
            label="OrthoUnits"
        />

        <button on:click={reset_cam}>重置镜头</button>
    {/if}
</div>

<style lang="scss">
    .webgl3dController_class {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-end;
    }
</style>
