<script>
    import { msg } from "./store";
    let msgs;
    const unsubscribe_msg = msg.subscribe((v) => {
        msgs = v;
    });
    let map_type_CHN = {
        "warning":"警告",
        "message":"消息",
        "error":"错误"
    }
</script>

<style lang="scss">
    #message{
        background-color: rgba(0,0,0,0.7);
        width: 600px;
        min-height: 200px;
        max-height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        border: solid 2px rgba(255,255,255,0.7);
        border-radius: 3rem;
    }
</style>

{#if msgs.length>0}
<div id="message">
<h1>{map_type_CHN[msgs[0].type]}</h1>
<p>{msgs[0].text}</p>
</div>
{/if}