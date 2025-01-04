import * as THREE from 'three';

export class LightManager {
    private scene: THREE.Scene;
    private ceilingLight: THREE.PointLight;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.ceilingLight = new THREE.PointLight(0xffffff, 0.3);
        this.ceilingLight.position.set(0.1, 7, 0.1);
        this.ceilingLight.castShadow = true;
        this.ceilingLight.name = 'ceilingLight';
        this.scene.add(this.ceilingLight);
    }

    public createAmbientLight(color: number, intensity: number) {
        const ambientLight = new THREE.AmbientLight(color, intensity);
        this.scene.add(ambientLight);
    }

    public createDirectionalLight(color: number, intensity: number, position: THREE.Vector3) {
        const directionalLight = new THREE.DirectionalLight(color, intensity);
        directionalLight.position.copy(position);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    public toggleCeilingLight() {
        this.ceilingLight.visible = !this.ceilingLight.visible;
    }

    public createLights() {
        this.createAmbientLight(0xffffff, 0.6);
        this.createDirectionalLight(0xffffff, 0.5, new THREE.Vector3(0, 0.3, 0));
    }
}
