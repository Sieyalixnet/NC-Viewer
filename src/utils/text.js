export function downloadJSON(content) {
        var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        let objectURL = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = objectURL;
        a.setAttribute(
            "download",
            `GeoVectorData_${String(Date.now())}.JSON`
        );
        a.click();
        URL.revokeObjectURL(objectURL);
        blob=null
        if(a){a.remove()}
    }