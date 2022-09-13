import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';
export async function downloadJSON(content) {
    let filename= "Geovector_"+(Date.now().toString())+".JSON"
    await writeTextFile(filename, content, { dir: BaseDirectory.Download });
    }