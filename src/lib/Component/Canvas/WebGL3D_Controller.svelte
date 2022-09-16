<script>
    import Slider from "./Component/Slider.svelte";
    import Checkbox from "../Option/Component/checkbox.svelte";
    import { new_ } from "../../../utils/utils";
    import Hidden from "../Option/Show_Data/Component/Hidden.svelte";
    export let Data = [];
    export let matrix;

    let switch_ortho = ()=>{matrix.ortho=!matrix.ortho;drawScene()}

    let drawScene = () => {
        Data[0].render()
        Data[0].saveCam(matrix);
    };
    let fieldOfViewRadians_default = { max: 360, min: 0, step: 1 };
    let translation_default = { max: 360, min: -360, step: 1 };
    let rotation_default = { max: 360, min: -360, step: 1 };
    let scale_default = { max: 5, min: 0, step: 0.1 };
    let camPos_default = { max: 360, min: -360, step: 1 };

    let translation_labels=["translationX", "translationY","translationZ"]
    let rotation_labels=["rotationX","rotationY","rotationZ"]
    let scale_labels=["scaleX","scaleY","scaleZ"]
    let camPos_labels=["camPositionX","camPositionY","camPositionZ"]

    let selected= "translation";
    let nav_options=[
        {k:"translation",v:"平移"},
        {k:"rotation",v:"旋转"},
        {k:"scale",v:"缩放"},
        {k:"camPos",v:"镜头位置"},
        {k:"projection",v:"投影"}
    ]


    let reset_cam = () => {
        let default_cam = Data[0].OptionalAttributes.default_cam;
        console.log(default_cam);
        Data[0].OptionalAttributes.saved_cam = undefined;
        for (let item in Data[0].OptionalAttributes.default_cam) {
            matrix[item] =
                typeof default_cam[item] == "object"
                    ? new_(default_cam[item])//Object will be refered. We should make a deep copy
                    : default_cam[item];
        }
        matrix = matrix;
        drawScene();
    };
</script>

<div >

    {#if !!matrix}
    <select bind:value={selected}>
        {#each nav_options as option}
            <option value={option.k}>
                {option.v}
            </option>
        {/each}
    </select>
    <div class="webgl3dController_option">

        {#if selected=="translation"}
        {#each translation_labels as label,index}
        <Slider
            on:drawScene={drawScene}
            bind:attr={translation_default}
            bind:value={matrix.translation[index]}
            label={label}
        />            
        {/each}
        {/if}
        {#if selected=="rotation"}
        {#each rotation_labels as label,index}
        <Slider
            on:drawScene={drawScene}
            bind:attr={rotation_default}
            bind:value={matrix.rotation[index]}
            label={label}
        />            
        {/each}
        {/if}
        {#if selected=="scale"}
        {#each scale_labels as label,index}
        <Slider
            on:drawScene={drawScene}
            bind:attr={scale_default}
            bind:value={matrix.scale[index]}
            label={label}
        />            
        {/each}
        {/if}
        {#if selected=="camPos"}
        {#each camPos_labels as label,index}
        <Slider
            on:drawScene={drawScene}
            bind:attr={camPos_default}
            bind:value={matrix.camPos[index]}
            label={label}
        />            
        {/each}
        {/if}
        {#if selected=="projection"}
        <Slider
            on:drawScene={drawScene}
            bind:attr={fieldOfViewRadians_default}
            bind:value={matrix.Ortho_Radians}
            label="Ortho_Radians"
        />
        
        <button on:click={switch_ortho}>投影: {#if matrix.ortho}正射{:else}透视{/if}</button>
        {/if}
    </div>
        <button on:click={reset_cam}>重置</button>

    {/if}
</div>

    <style lang="scss">
        .webgl3dController_option {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        min-width: 17.5rem;
        margin-bottom: 0.3125rem;
    }
</style>
