import { UIObject } from "../ui-entities/UIObject"

let components = new Set<UIObject>

export function createComponent<T extends new (...args: any[]) => UIObject>(
    Component: T,
    args: {[k in keyof ConstructorParameters<T>[0]] : ConstructorParameters<T>[0][k]}
) : InstanceType<T> {
    const tmp = new Component(args)
    components.add(tmp)
    return tmp as InstanceType<T>
}

export function destroyComponent(comp: UIObject) {
    components.delete(comp)
}

export function render() {
    return Array(...components).map((c, i) => c.render('' + i))
}
