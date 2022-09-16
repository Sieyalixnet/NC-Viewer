import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';
export async function downloadJSON(content,filename) {
    await writeTextFile(filename, content, { dir: BaseDirectory.Download });
    }