import * as THREE from 'three';

export class RaycasterHandler {
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;

    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    public setFromCamera(mouse: THREE.Vector2, camera: THREE.Camera) {
        this.raycaster.setFromCamera(mouse, camera);
    }

    public intersectObject(object: THREE.Object3D, recursive: boolean = false) {
        return this.raycaster.intersectObject(object, recursive);
    }

    public updateMousePosition(event: MouseEvent) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    public getMouse() {
        return this.mouse;
    }
}
