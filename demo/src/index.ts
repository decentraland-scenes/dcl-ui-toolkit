import {
  engine,
  executeTask,
  InputAction,
  Material,
  MeshCollider,
  MeshRenderer,
  pointerEventsSystem,
  Transform
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { setupUi } from './ui'
import { announcement } from './ui-entities/Announcement'
import { centerImage } from './ui-entities/CenterImage'
import { cornerLabel } from './ui-entities/CornerLabel'
import { customPrompt } from './ui-entities/CustomPrompt'
import { fillInPrompt } from './ui-entities/FillInPrompt'
import { largeIcon, mediumIcon, smallIcon } from './ui-entities/Icons'
import { loadingIcon } from './ui-entities/LoadingIcon'
import { okPrompt } from './ui-entities/OkPrompt'
import { optionPrompt } from './ui-entities/OptionPrompt'
import { uiBar } from './ui-entities/UiBar'
import { uiCounter } from './ui-entities/UiCounter'
export * from '@dcl/sdk'



executeTask(async function () {


  const announcement_cube = new Cube(
    'Announcement',
    Vector3.create(3, 1, 3),
    (bool: boolean) => {
      if (bool) {
        
        announcement.hide()
      } else {
        announcement.show()
      }
    }
  )
  

  const counter_cube = new Cube(
    'Counter',
    Vector3.create(3, 1, 6),
    (bool: boolean) => {
      if (bool) {
        uiCounter.hide()
      } else {
        uiCounter.show()
        uiCounter.increase()
      }
  
    }
  )
  

  const cornerLabel_cube = new Cube(
    'CornerLabel',
    Vector3.create(3, 1, 9),
    (bool: boolean) => {
      if (bool) {
        cornerLabel.hide()
      } else {
        cornerLabel.show()
      }
  
    }
  )
  
  
  const uibar_cube = new Cube(
    'UIBar',
    Vector3.create(3, 1, 12),
    (bool: boolean) => {
      if (bool) {
        uiBar.hide()
      } else {
        uiBar.show()
      }
  
    }
  )
  
  
  const icon_cube = new Cube(
    'Icon',
    Vector3.create(3, 1, 15),
    (bool: boolean) => {
      if (bool) {
        smallIcon.hide()
        mediumIcon.hide()
        largeIcon.hide()
      } else {
        smallIcon.show()
        mediumIcon.show()
        largeIcon.show()
      }
  
    }
  )
  
  
  const loadingicon_cube = new Cube(
    'LoadingIcon',
    Vector3.create(15, 1, 3),
    (bool: boolean) => {
      if (bool) {
        loadingIcon.hide()
      } else {
        loadingIcon.show()
      }
  
    }
  )


  const centerImage_cube = new Cube(
    'CenterImage',
    Vector3.create(12, 1, 3),
    (bool: boolean) => {
      if (bool) {
        centerImage.hide()
      } else {
        centerImage.show()
      }
  
    }
  )
  

  const okPrompt_cube = new Cube(
    'OkPrompt',
    Vector3.create(9, 1, 3),
    (bool: boolean) => {
      if (bool) {
        okPrompt.hide()
      } else {
        okPrompt.show()
      }
  
    }
  ) 
  
  
  const optionPrompt_cube = new Cube(
    'OptionPrompt',
    Vector3.create(6, 1, 3),
    (bool: boolean) => {
      if (bool) {
        optionPrompt.hide()
      } else {
        optionPrompt.show()
      }
  
    }
  )
  

  const fillInPrompt_cube = new Cube(
    'FillInPrompt',
    Vector3.create(9, 1, 15),
    (bool: boolean) => {
      if (bool) {
        fillInPrompt.hide()
      } else {
        fillInPrompt.show()
      }
  
    }
  )
  

  const customPrompt_cube = new Cube(
    'CustomPrompt',
    Vector3.create(6, 1, 15),
    (bool: boolean) => {
      if (bool) {
        customPrompt.hide()
      } else {
        customPrompt.show()
      }
  
    }
  )

  
})

setupUi()





export class Cube {

  private is_active;
  private ent;

  constructor(name: string, position: Vector3, private callback: (bool: boolean) => void) {

    const cube = engine.addEntity()
    MeshRenderer.setBox(cube)
    MeshCollider.setBox(cube)

    Material.setPbrMaterial(cube, {
      albedoColor: Color4.White(),
      metallic: 0.8,
      roughness: 0.1
    })

    Transform.create(cube, {
      position: position,
      scale: Vector3.create(1, 1, 1)
    })

    pointerEventsSystem.onPointerDown(
      cube,
      this.activate_cube.bind(this),
      {
        button: InputAction.IA_PRIMARY,
        hoverText: name
      }
    );

    this.ent = cube;
    this.is_active = false;

  };


  public activate_cube() {
    this.callback(this.is_active);
    if (this.is_active) {
      this.turn_off();
    } else {
      this.turn_on();
    }
    this.is_active = !this.is_active;
  }

  public turn_off() {
    Material.setPbrMaterial(this.ent, {
      albedoColor: Color4.White(),
      metallic: 0.8,
      roughness: 0.1
    })
  }

  public turn_on() {
    Material.setPbrMaterial(this.ent, {
      albedoColor: Color4.Red(),
      metallic: 0.8,
      roughness: 0.1
    })
  }
}