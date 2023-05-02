import * as ui from '@dcl-sdk/ui-utils'

export const okPrompt = new ui.OkPrompt({
  text: 'This is an Ok Prompt',
  onAccept: () => {
    okPrompt.hide()
    console.log('okPrompt onAccept')
  },
  onClose: () => console.log('close okPrompt____________'),
})

// okPrompt.show()