import ReactEcs, { Label, ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import * as ui from '@dcl-sdk/ui-utils'


export function setupUi() {
  ReactEcsRenderer.setUiRenderer(() => [
    ...ui.render(),
    <Label
      key='test'
      value='Custom label'
      textAlign='top-left'
      fontSize={20}
      uiTransform={{position: {'left': '5%', top: '30%'}}}
    />
  ])
}
