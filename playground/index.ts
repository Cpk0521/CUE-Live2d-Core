// run this to tell git not to track this file
// git update-index --skip-worktree test/playground/index.ts

import { Application, Ticker } from 'pixi.js';
import { Live2DModel } from '../src';

// Live2DModel.registerTicker(Ticker);

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const modelURL = 'https://raw.githubusercontent.com/Cpk0521/CUE-live2d-Viewer/main/live2d/001/001_001/001.model3.json';
let model : any;


async function main() {
    const app = new Application({
        resizeTo: window,
        view: canvas,
    });
    (window as any).app = app;

    model = await Live2DModel.from(modelURL);
    model.anchor.set(0)
    model.position.set(0);
    model.scale.set(0.25)
    app.stage.addChild(model);
}

main().then(()=>{
    window.addEventListener('click', ()=>{
        model.playVoice('https://raw.githubusercontent.com/Cpk0521/CueStoryResource/main/voice/link/Link_101/link_101_003.mp3');
    });
});

// function checkbox(name: string, onChange: (checked: boolean) => void) {
//     const id = name.replace(/\W/g, '').toLowerCase();

//     document.getElementById('control')!.innerHTML += `
// <p>
//   <input type="checkbox" id="${id}">
//   <label for="${id}">${name}</label>
// </p>`;

//     const checkbox = document.getElementById(id) as HTMLInputElement;

//     checkbox.addEventListener('change', (ev) => {
//         onChange(checkbox.checked);
//     });

//     onChange(checkbox.checked);
// }
