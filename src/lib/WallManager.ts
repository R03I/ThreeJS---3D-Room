import * as THREE from 'three';

export class WallManager {
    private scene: THREE.Scene;
    private wallTexture: THREE.Texture;

    constructor(scene: THREE.Scene, wallTexture: THREE.Texture) {
        this.scene = scene;
        this.wallTexture = wallTexture;
    }

    public createWalls() {
        // Inner walls
        this.createInnerWalls();
        // Outer matrix walls
        this.createMatrixWalls();
    }

    private createInnerWalls() {
        this.createWall(10, 7.5, new THREE.Vector3(0, 3.75, -5)); // Back wall
        this.createWall(10, 7.5, new THREE.Vector3(-5, 3.75, 0), new THREE.Euler(0, Math.PI / 2, 0)); // Left wall
        this.createWall(10, 7.5, new THREE.Vector3(5, 3.75, 0), new THREE.Euler(0, -Math.PI / 2, 0)); // Right wall
        this.createWall(10, 7.5, new THREE.Vector3(0, 3.75, 5), new THREE.Euler(0, Math.PI, 0)); // Front wall
        this.createWall(10, 10, new THREE.Vector3(0, 7.5, 0), new THREE.Euler(Math.PI / 2, 0, 0)); // Ceiling
    }

    private createMatrixWalls() {
        const video = document.createElement('video');
        video.src = 'textures/wall/matrix.mp4';
        video.loop = true;
        video.muted = true;
        video.play();

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.wrapS = THREE.RepeatWrapping;
        videoTexture.wrapT = THREE.RepeatWrapping;
        videoTexture.repeat.set(4, 4);

        const matrixMaterial = new THREE.MeshBasicMaterial({
            map: videoTexture,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });

        // Módosított falak méretei és pozíciói
        const walls = [
            // Back wall - magasabb (32.5 egység) és lejjebb pozicionálva
            { pos: [0, 6.25, -15], rot: [0, 0, 0], size: [30, 32.5, 0.1] },
            // Front wall - magasabb és lejjebb
            { pos: [0, 6.25, 15], rot: [0, 0, 0], size: [30, 32.5, 0.1] },
            // Left wall - magasabb és lejjebb
            { pos: [-15, 6.25, 0], rot: [0, Math.PI / 2, 0], size: [30, 32.5, 0.1] },
            // Right wall - magasabb és lejjebb
            { pos: [15, 6.25, 0], rot: [0, Math.PI / 2, 0], size: [30, 32.5, 0.1] },
            // Floor - marad ugyanott
            { pos: [0, -10, 0], rot: [-Math.PI / 2, 0, 0], size: [30, 30, 0.1] },
            // Ceiling - marad ugyanott
            { pos: [0, 22.5, 0], rot: [Math.PI / 2, 0, 0], size: [30, 30, 0.1] }
        ];

        walls.forEach(wall => {
            const geometry = new THREE.BoxGeometry(wall.size[0], wall.size[1], wall.size[2]);
            const mesh = new THREE.Mesh(geometry, matrixMaterial);
            mesh.position.set(wall.pos[0], wall.pos[1], wall.pos[2]);
            mesh.rotation.set(wall.rot[0], wall.rot[1], wall.rot[2]);
            this.scene.add(mesh);
        });
    }

    public createWall(width: number, height: number, position: THREE.Vector3, rotation: THREE.Euler = new THREE.Euler(0, 0, 0)) {
        const wallGeometry = new THREE.PlaneGeometry(width, height);
        const wall = new THREE.Mesh(wallGeometry, new THREE.MeshStandardMaterial({
            map: this.wallTexture,
            roughness: 0.8,
            metalness: 0.2
        }));
        wall.position.copy(position);
        wall.rotation.copy(rotation);
        this.scene.add(wall);
    }
}
