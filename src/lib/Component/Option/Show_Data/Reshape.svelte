<script>
    import { fade } from "svelte/transition";
    import Hidden from "./Component/Hidden.svelte";
    export let Data=[];

    let hidden = true;
    let title = "改变形状";
    //PARTS: init Store to show message
    import { msg,message } from "../../../store";
    import { tick } from "svelte";
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

    let reshape_dimension = [-1, 0, 0];
    let reshape =()=>{
        let msg = Data[0].reshape_to(reshape_dimension);
        Data=Data
        if(msg["e"]){put_message("error","发生了错误，为:"+msg["e"])} else if(msg["shape"]) {put_message("message","成功改变形状, 为: "+String(msg["shape"]))}
        remove_message(2)
    }
</script>

<Hidden bind:hidden bind:title></Hidden>
{#if !hidden}
<div class="reshape" in:fade out:fade={{ duration: 100 }}>
    <div class="row">
        <div>
            <p>行数</p>
            <input type="number" bind:value={reshape_dimension[1]} />
        </div>
        <div>
            <p>列数</p>
            <input type="number" bind:value={reshape_dimension[2]} />
        </div>
        <div>
            <button on:click={reshape}>改变形状(Reshape)</button>
        </div>
    </div>
    <div class="row">
        <div>
            <div>
                <p>现在的形状为: </p>
                {#each Data[0].shape as shape}
                <p>{shape},</p>
                {/each}
            </div>
        </div>
    </div>
</div>
{/if}

<style lang="scss">
    .reshape {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        input {
            max-width: 60px;
        }
        .row {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            div {
                p,
                input {
                    display: inline-block;
                }
            }
        }
    }
</style>
