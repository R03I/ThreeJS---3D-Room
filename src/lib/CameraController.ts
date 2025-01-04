import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RaycasterHandler } from './RaycasterHandler';

export class CameraController {
    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private raycasterHandler: RaycasterHandler;
    private resetButton: HTMLButtonElement;
    private scrollContainer: HTMLDivElement;
    private initialCameraPosition: THREE.Vector3;
    private initialScenePosition: THREE.Vector3;
    private initialSceneRotation: THREE.Euler;
    private targetCameraPosition: THREE.Vector3;
    private targetScenePosition: THREE.Vector3;
    private targetSceneRotation: THREE.Euler;
    private isMovingCamera: boolean;
    private CAMERA_LERP_FACTOR: number;
    private SCENE_LERP_FACTOR: number;
    private BOUNDS: { minY: number, maxY: number };

    constructor(camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, controls: OrbitControls, raycasterHandler: RaycasterHandler, resetButton: HTMLButtonElement, scrollContainer: HTMLDivElement) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.controls = controls;
        this.raycasterHandler = raycasterHandler;
        this.resetButton = resetButton;
        this.scrollContainer = scrollContainer;
        this.initialCameraPosition = new THREE.Vector3(0, 6, 8.5);
        this.initialScenePosition = new THREE.Vector3(0, 0, 0);
        this.initialSceneRotation = new THREE.Euler(0, 1.3, 0);
        this.targetCameraPosition = new THREE.Vector3();
        this.targetScenePosition = new THREE.Vector3();
        this.targetSceneRotation = new THREE.Euler();
        this.isMovingCamera = false;
        this.CAMERA_LERP_FACTOR = 0.02;
        this.SCENE_LERP_FACTOR = 0.02;
        this.BOUNDS = { minY: 1.2, maxY: 7 };

        this.initResetButton();
        this.initEventListeners();
    }

    public setDefaultPositions() {
        this.camera.position.copy(this.initialCameraPosition);
        this.scene.position.copy(this.initialScenePosition);
        this.scene.rotation.copy(this.initialSceneRotation);
    }

    private initResetButton() {
        this.resetButton.addEventListener('click', () => {
            this.scrollContainer.style.display = 'none';
            this.isMovingCamera = true;
            this.targetCameraPosition.copy(this.initialCameraPosition);
            this.targetScenePosition.copy(this.initialScenePosition);
            this.targetSceneRotation.copy(this.initialSceneRotation);
            this.controls.enabled = false;
        });
    }

    private initEventListeners() {
        window.addEventListener('click', (event) => {
            this.onClick(event);
        });
    }

    private onClick(event: MouseEvent) {
        this.raycasterHandler.updateMousePosition(event);
        this.raycasterHandler.setFromCamera(this.raycasterHandler.getMouse(), this.camera);
        // Add your object intersection logic here
    }

    public update() {
        if (this.isMovingCamera) {
            this.camera.position.lerp(this.targetCameraPosition, this.CAMERA_LERP_FACTOR);
            this.scene.position.lerp(this.targetScenePosition, this.SCENE_LERP_FACTOR);
            this.scene.rotation.x += (this.targetSceneRotation.x - this.scene.rotation.x) * this.SCENE_LERP_FACTOR;
            this.scene.rotation.y += (this.targetSceneRotation.y - this.scene.rotation.y) * this.SCENE_LERP_FACTOR;
            this.scene.rotation.z += (this.targetSceneRotation.z - this.scene.rotation.z) * this.SCENE_LERP_FACTOR;

            this.resetButton.style.display = this.camera.position.distanceTo(this.initialCameraPosition) > 0.1 ? 'block' : 'none';

            if (this.camera.position.distanceTo(this.targetCameraPosition) < 0.01 && this.scene.position.distanceTo(this.targetScenePosition) < 0.01) {
                this.isMovingCamera = false;
                if (this.targetCameraPosition.equals(this.initialCameraPosition)) {
                    this.controls.enabled = true;
                }
            }
        }

        this.camera.position.y = Math.max(this.BOUNDS.minY, Math.min(this.BOUNDS.maxY, this.camera.position.y));
        this.controls.update();
    }

    public setTargetPositions(cameraPosition: THREE.Vector3, scenePosition: THREE.Vector3, sceneRotation: THREE.Euler) {
        this.isMovingCamera = true;
        this.targetCameraPosition.copy(cameraPosition);
        this.targetScenePosition.copy(scenePosition);
        this.targetSceneRotation.copy(sceneRotation);
        this.controls.enabled = false;
    }
}
