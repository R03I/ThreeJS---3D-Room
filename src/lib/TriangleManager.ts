import * as THREE from 'three';

export class TriangleManager {
    private scene: THREE.Scene;
    private material: THREE.MeshBasicMaterial;

    constructor(scene: THREE.Scene, color: number = 0xFF3F3F) {
        this.scene = scene;
        this.material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide
        });
    }

    // Create a single triangle and return it
    public createTriangle(position: THREE.Vector3, scale: THREE.Vector3, rotation: THREE.Euler = new THREE.Euler(0, 0, 0)): THREE.Mesh {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            0, 1, 0,
            -1, -1, 0,
            1, -1, 0
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const triangleMesh = new THREE.Mesh(geometry, this.material);
        triangleMesh.position.copy(position);
        triangleMesh.scale.copy(scale);
        triangleMesh.rotation.copy(rotation);

        return triangleMesh;
    }

    // Create single triangle and add it to the scene
    public createTriangles(triangleData: { position: THREE.Vector3, scale: THREE.Vector3, rotation?: THREE.Euler }[]): THREE.Mesh[] {
        const triangles = triangleData.map(data => this.createTriangle(data.position, data.scale, data.rotation));
        triangles.forEach(triangle => this.scene.add(triangle));
        return triangles;
    }
}
