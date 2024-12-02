import { engine, UiCanvasInformation } from "@dcl/sdk/ecs"

let timer = 0
let canvasInfoTimer = 0.5
let scaleSystemAlreadyAdded = false

export let scaleFactor = 1

export function UIScaleUpdate() {

  if (scaleSystemAlreadyAdded) return
  scaleSystemAlreadyAdded = true

  engine.addSystem((dt) => {
    timer += dt

    if (timer <= canvasInfoTimer) return
    timer = 0

    const uiCanvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)

    if (!uiCanvasInfo) return

    const newScaleFactor = Math.min(uiCanvasInfo.width / 1920, uiCanvasInfo.height / 1080)

    if (newScaleFactor !== scaleFactor) {
      scaleFactor = newScaleFactor
      console.log('NEW UI scaleFactor: ', scaleFactor)
    }
  })

}