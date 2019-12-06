import {desiginwidth} from "./config"
import ready from "document-ready"


export let init = () => {
    ready(()=>{
    })
}

export let complete = () => {
    ready(()=>{
        document.getElementById("load").style.display = 'none';
        document.getElementById("maincont").style.display = 'block';
        // document.getElementById("musicicon").style.display = 'block';
    })
}

export let update = (p, delay = 1) => {
    ready(()=>{
        document.getElementById("perc_txt").innerHTML = p + "%";
        if (p >= 100 && delay > 0) {
            setTimeout(() => {
                complete();
            }, delay);
        }
    })
}

export default {
    init,
    complete,
    update
}