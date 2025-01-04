import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class ControlManager {
    private controls: OrbitControls;

    constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.target.set(0, 2, 0); // Set orbit center higher
        this.controls.enableDamping = true; // smooth camera movement
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 14;
        this.controls.update();
    }

    public update() {
        this.controls.update();
    }

    public getControls() {
        return this.controls;
    }
}
