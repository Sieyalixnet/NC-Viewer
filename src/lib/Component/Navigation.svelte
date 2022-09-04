<script>
    export let selected;
    let map = [
        { k: "文件", v: "File", selected: true },
        { k: "获取", v: "Get_Data", selected: false },
        { k: "查看", v: "Render", selected: false },
        { k: "日志", v: "Log", selected: false },
    ];
    function select(item) {
        selected = item.v;
        for (let i of map) {
            if (i.v != selected) {
                i.selected = false;
            } else {
                i.selected = true;
            }
        }
        map = map;
    }
</script>

<div class="nav">
    {#each map as item (item.v)}
        <div>
            <button
                class:selected={item.selected}
                on:click={() => {
                    select(item);
                }}>{item.k}</button
            >
        </div>
    {/each}
</div>

<style lang="scss">
    .nav {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin: 0.625rem 0;
        button{ 
            margin-right: 0.3125rem;

        }
        .selected {
            background-color: saddlebrown;
            box-shadow: 0 0 5px rgba(180,180,255,0.7);
        }
    }
</style>
