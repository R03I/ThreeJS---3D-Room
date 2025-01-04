import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export class ObjectManager {
    private scene: THREE.Scene;
    private textureLoader: THREE.TextureLoader;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.textureLoader = new THREE.TextureLoader();
    }

    public loadObject(mtlPath: string, objPath: string, scale: THREE.Vector3, position: THREE.Vector3, rotation: THREE.Euler, texturePath?: string|null, callback?: (object: THREE.Object3D) => void) {
        const mtlLoader = new MTLLoader();
        mtlLoader.load(mtlPath, (materials) => {
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(objPath, (object) => {
                object.scale.copy(scale);
                object.position.copy(position);
                object.rotation.copy(rotation);

                object.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        const material = child.material;

                        material.transparent = true;
                        material.opacity = 1.0;
                        material.alphaTest = 0;
                        material.needsUpdate = true;
                        material.metalness= 0;
                        material.roughness= 0;
                    }
                    if (child instanceof THREE.Group) {
                        // Csoport gyermekeinek módosítása
                        child.traverse((groupChild) => {
                            if (groupChild instanceof THREE.Mesh) {
                                const material = groupChild.material as THREE.MeshStandardMaterial;
                                
                                material.transparent = true;
                                material.opacity = 1.0;
                                material.alphaTest = 0;
                                material.needsUpdate = true;
                                material.metalness = 0;
                                material.roughness = 0;
                            }
                        });
                    }
                });

                if (callback) {
                    callback(object);
                }

                this.scene.add(object);
            });
        });
    }

    public createScreenPlane(geometry: THREE.PlaneGeometry, material: THREE.MeshBasicMaterial, position: THREE.Vector3, rotation: THREE.Euler) {
        const screenPlane = new THREE.Mesh(geometry, material);
        screenPlane.position.copy(position);
        screenPlane.rotation.copy(rotation);
        this.scene.add(screenPlane);
    }

    public createClickablePlane(geometry: THREE.PlaneGeometry, material: THREE.MeshBasicMaterial, position: THREE.Vector3, rotation: THREE.Euler) {
        const clickPlane = new THREE.Mesh(geometry, material);
        clickPlane.position.copy(position);
        clickPlane.rotation.copy(rotation);
        this.scene.add(clickPlane);
    }

    public adjustMaterialProperties(object: THREE.Object3D) {
        object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({
                    color: 0x808080,
                    shininess: 30,
                    specular: 0x444444,
                    reflectivity: 1,
                    transparent: true,
                    side: THREE.DoubleSide
                });
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }
}
