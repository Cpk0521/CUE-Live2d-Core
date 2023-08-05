# pixi-live2d-display

![GitHub package.json version](https://img.shields.io/github/package-json/v/guansss/pixi-live2d-display?style=flat-square)
![Cubism version](https://img.shields.io/badge/Cubism-3/4-ff69b4?style=flat-square)

本項目是魔改於[pixi-live2d-display](https://github.com/guansss/pixi-live2d-display)

#### Requirements

-   PixiJS: >7
-   @PIXI/Sound: ^4

---

#### 修改內容

-  支持 pixiJS v7
-  不再使用PIXI.Ticker 而是改用 PIXI.Contaioner本身的autoUpdateTransform method
-  方便自定義的Sound Manager(支持 @PIXI/Sound)
-  增加了 Live2DModel.playVoice() method
-  ~~刪除了我不會用到的功能~~

---

示例的 Live2D 模型 Shizuku (Cubism 2.1) 和 Haru (Cubism 4) 遵守 Live2D 的
[Free Material License](https://www.live2d.com/eula/live2d-free-material-license-agreement_en.html)