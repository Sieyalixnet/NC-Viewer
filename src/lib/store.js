import { writable } from 'svelte/store';

export function message(type,text){
    if(type!=="warning"&&type!=="message"&&type!=="error"){return;}
    return {type,text}
}

export const msg = writable([]);

