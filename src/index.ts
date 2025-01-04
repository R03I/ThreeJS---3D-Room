import * as THREE from 'three';
import { CameraController } from './lib/CameraController';
import { RaycasterHandler } from './lib/RaycasterHandler';
import { ObjectManager } from './lib/ObjectManager';
import { WebElements } from './lib/WebElements';
import { TriangleManager } from './lib/TriangleManager';
import { WallManager } from './lib/WallManager';
import { LightManager } from './lib/LightManager';
import { ControlManager } from './lib/ControlManager';
import * as CANNON from 'cannon-es';
import * as TWEEN from '@tweenjs/tween.js';

const raycasterHandler = new RaycasterHandler();
let laptopMesh: THREE.Object3D | null = null;
let monitorMesh: THREE.Object3D | null = null;
let switchMesh: THREE.Object3D | null = null;
let catMesh: THREE.Object3D | null = null;
let laptopClickPlane: THREE.Mesh;
let colaMesh: THREE.Object3D | null = null;

const neonColors = [0xFF3F3F, 0x3FFF3F, 0x3F3FFF, 0xFFFF3F, 0x808080]; // Neon colors and grey for off

// Add HTML button
const resetButton = WebElements.createButton('Reset View', `
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: none;
`, () => {
    // Reset view logic
});
document.body.appendChild(resetButton);

// SCENE
const scene = new THREE.Scene();
const objectManager = new ObjectManager(scene);
const triangleManager = new TriangleManager(scene);
const textureLoader = new THREE.TextureLoader();
const wallTexture = textureLoader.load('textures/wall/white_painted_diff.jpg');
const wallManager = new WallManager(scene, wallTexture);
const lightManager = new LightManager(scene);
scene.background = new THREE.Color(0xa8def0);
const clock = new THREE.Clock();

// Texture Loader
const floorDiffuseMap = textureLoader.load('textures/floor/oak_diff.jpg');
const floorAoMap = textureLoader.load('textures/floor/oak_ao.jpg');
const floorDispMap = textureLoader.load('textures/floor/oak_disp.png');
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(4, 4);

objectManager.loadObject('models/mtl/flower.mtl', 'models/obj/flower.obj', new THREE.Vector3(2, 2, 2), new THREE.Vector3(2, 2.73, -4), new THREE.Euler(0, 0, 0));
objectManager.loadObject('models/mtl/MyDesk.mtl', 'models/obj/MyDesk.obj', new THREE.Vector3(2.5, 2.5, 2.5), new THREE.Vector3(0, 0, -3.6), new THREE.Euler(0, Math.PI / -2, 0));
objectManager.loadObject('models/mtl/Laptop.mtl', 'models/obj/Laptop.obj', new THREE.Vector3(1, 1, 1), new THREE.Vector3(0.4, 2.34, -3.2), new THREE.Euler(0, -1.8, 0), null, (object: THREE.Object3D) => {
    laptopMesh = object;
});
objectManager.loadObject('models/mtl/Monitor.mtl', 'models/obj/Monitor.obj', new THREE.Vector3(2.5, 2.2, 2.2), new THREE.Vector3(-1.3, 2.78, -4.1), new THREE.Euler(0, 0.1, 0), null, (object: THREE.Object3D) => {
    monitorMesh = object;
});
objectManager.loadObject('models/mtl/chair.mtl', 'models/obj/chair.obj', new THREE.Vector3(5.5, 5.5, 5.5), new THREE.Vector3(0.7, 0.10, -2.2), new THREE.Euler(0, 0, 0), null);
objectManager.loadObject('models/mtl/switch.mtl', 'models/obj/switch.obj', new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(4.80, 3.14, -1.2), new THREE.Euler(Math.PI, Math.PI, 0), null, (object: THREE.Object3D) => {
    switchMesh = object;
});
objectManager.loadObject('models/mtl/cat.mtl', 'models/obj/cat.obj', new THREE.Vector3(0.3, 0.3, 0.3), new THREE.Vector3(-0.2, 1.414, -1.3), new THREE.Euler(0, Math.PI / 2, 0), null, (object: THREE.Object3D) => {
    catMesh = object;
});
objectManager.loadObject('models/mtl/bedSingle.mtl', 'models/obj/bedSingle.obj', new THREE.Vector3(4, 4, 4), new THREE.Vector3(-0.4, 0.10, 6.5), new THREE.Euler(0, Math.PI * 1.5, 0), null);
objectManager.loadObject('models/mtl/wardrobe.mtl', 'models/obj/wardrobe.obj', new THREE.Vector3(1.4, 1.4, 1.4), new THREE.Vector3(2.7, 0.20, 4.4), new THREE.Euler(0, Math.PI, 0), null);
objectManager.loadObject('models/mtl/doorway.mtl', 'models/obj/doorway.obj', new THREE.Vector3(4.5, 4.5, 4.5), new THREE.Vector3(4.8, 0.10, -0.7), new THREE.Euler(0, Math.PI / 2, 0), null);
objectManager.loadObject('models/mtl/nintendo.mtl', 'models/obj/nintendo.obj', new THREE.Vector3(1.3, 1.3, 1.3), new THREE.Vector3(-1.1, 2.38, -3.1), new THREE.Euler(Math.PI/2, 0, 0.2), null);
objectManager.loadObject('models/mtl/flower2.mtl', 'models/obj/flower2.obj', new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(-3.9, 1.1, -3.5), new THREE.Euler(0, 0, 0), null);


// Create screen plane
const screenGeometry = new THREE.PlaneGeometry(2.17, 1.05);
const screenMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load('textures/monitor/screen.jpg'),
    transparent: true,
    opacity: 1
});
objectManager.createScreenPlane(screenGeometry, screenMaterial, new THREE.Vector3(-1.29, 3.32, -4.05), new THREE.Euler(0, 0.1, 0));

// Create laptop screen plane with video texture
const video = document.createElement('video');
video.src = 'textures/laptop/screen.mp4'; // Path to your video file
video.loop = true;
video.muted = true;
video.play();

const videoTexture = new THREE.VideoTexture(video);
const laptopScreenGeometry = new THREE.PlaneGeometry(1.325, 0.849);
const laptopScreenMaterial = new THREE.MeshBasicMaterial({ 
    map: videoTexture,
    transparent: true,
    opacity: 1
});
objectManager.createScreenPlane(laptopScreenGeometry, laptopScreenMaterial, new THREE.Vector3(0.57, 2.84, -3.811), new THREE.Euler(-0.08, -0.23, -0.015));

// Create clickable plane for laptop screen
//const laptopClickPlaneGeometry = new THREE.PlaneGeometry(0.2, 0.1);
//const laptopClickPlaneMaterial = new THREE.MeshBasicMaterial({ 
    //map: textureLoader.load('textures/button/next.png'),
    //transparent: true,
    //opacity: 1
//});
//laptopClickPlane = new THREE.Mesh(laptopClickPlaneGeometry, laptopClickPlaneMaterial);
//laptopClickPlane.position.set(1.04, 2.5, -3.673);
//laptopClickPlane.rotation.set(-0.08, -0.23, -0.015);
//scene.add(laptopClickPlane);

// Create scrollable container
const scrollContainer = WebElements.createScrollableContainer('textures/laptop/full_screen.png', `
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px 10px;
    background: #ff0000;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
`);
document.body.appendChild(scrollContainer);

// CAMERA
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 5);
camera.setRotationFromEuler(new THREE.Euler(0, 1.3, 0));
camera.lookAt(0, 2, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CONTROLS
const controlManager = new ControlManager(camera, renderer);
const controls = controlManager.getControls();

// LIGHTS
lightManager.createLights();

// WALLS
wallManager.createWalls();

// FLOOR
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorDiffuseMap,
    aoMap: floorAoMap,
    displacementMap: floorDispMap,
    displacementScale: 0.1,
    roughness: 0.4,
    metalness: 0.2
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Add camera bounds constants
const BOUNDS = {
    minY: 1.2,  // Minimum height above floor
    maxY: 7     // Maximum height (optional, remove if you want unlimited upward movement)
};

const triangleData = [
    { position: new THREE.Vector3(3, 3, -4.95), scale: new THREE.Vector3(0.5, 0.5, 0.5) },
    { position: new THREE.Vector3(3.5, 4.01, -4.95), scale: new THREE.Vector3(0.5, 0.5, 0.5) },
    { position: new THREE.Vector3(4.02, 3.01, -4.95), scale: new THREE.Vector3(0.5, 0.5, 0.5) },
    { position: new THREE.Vector3(3.51, 3, -4.95), scale: new THREE.Vector3(0.5, 0.5, 0.5), rotation: new THREE.Euler(0, 0, Math.PI) },
    { position: new THREE.Vector3(2.99, 4.01, -4.95), scale: new THREE.Vector3(0.5, 0.5, 0.5), rotation: new THREE.Euler(0, 0, Math.PI) },
    { position: new THREE.Vector3(2.48, 4.01, -4.95), scale: new THREE.Vector3(0.5, 0.5, 0.5) },
    { position: new THREE.Vector3(2.48, 3, -4.95), scale: new THREE.Vector3(0.5, 0.5, 0.5), rotation: new THREE.Euler(0, 0, Math.PI) },
    { position: new THREE.Vector3(1.97, 3, -4.95), scale: new THREE.Vector3(0.5, 0.5, 0.5) }
];

const triangles = triangleManager.createTriangles(triangleData);

// Create matrix background
const matrixCanvas = document.createElement('canvas');
matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;
const matrixContext = matrixCanvas.getContext('2d');
document.body.appendChild(matrixCanvas);

const matrixColumns = Math.floor(matrixCanvas.width / 20);
const matrixDrops = Array(matrixColumns).fill(1);

function drawMatrix() {
    if(!matrixContext) return;
    matrixContext.fillStyle = 'rgba(0, 0, 0, 0.05)';
    matrixContext.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    matrixContext.fillStyle = '#0F0';
    matrixContext.font = '20px monospace';

    for (let i = 0; i < matrixDrops.length; i++) {
        const text = Math.random() > 0.5 ? '0' : '1';
        matrixContext.fillText(text, i * 20, matrixDrops[i] * 20);

        if (matrixDrops[i] * 20 > matrixCanvas.height && Math.random() > 0.975) {
            matrixDrops[i] = 0;
        }

        matrixDrops[i]++;
    }
}

function animateMatrix() {
    drawMatrix();
    requestAnimationFrame(animateMatrix);
}

animateMatrix();

// Initialize Cannon.js world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Create floor physics body
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({ mass: 0 });
floorBody.addShape(floorShape);
floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(floorBody);

const wallBodies: CANNON.Body[] = [];
const wallData = [
    // Inner walls
    { position: new THREE.Vector3(0, 2.5, -5), size: new THREE.Vector3(10, 5, 0.1) },
    { position: new THREE.Vector3(0, 2.5, 5), size: new THREE.Vector3(10, 5, 0.1) },
    { position: new THREE.Vector3(-5, 2.5, 0), size: new THREE.Vector3(0.1, 5, 10) },
    { position: new THREE.Vector3(5, 2.5, 0), size: new THREE.Vector3(0.1, 5, 10) },
    // Outer walls
    { position: new THREE.Vector3(0, 2.5, -10), size: new THREE.Vector3(20, 5, 0.1) },
    { position: new THREE.Vector3(0, 2.5, 10), size: new THREE.Vector3(20, 5, 0.1) },
    { position: new THREE.Vector3(-10, 2.5, 0), size: new THREE.Vector3(0.1, 5, 20) },
    { position: new THREE.Vector3(10, 2.5, 0), size: new THREE.Vector3(0.1, 5, 20) }
];

wallData.forEach(wall => {
    const wallShape = new CANNON.Box(new CANNON.Vec3(wall.size.x / 2, wall.size.y / 2, wall.size.z / 2));
    const wallBody = new CANNON.Body({ mass: 0 });
    wallBody.addShape(wallShape);
    wallBody.position.copy(wall.position as unknown as CANNON.Vec3);
    world.addBody(wallBody);
    wallBodies.push(wallBody);
});

// Create cola bottle physics body
let colaBody: CANNON.Body | null = null;
objectManager.loadObject('models/mtl/CHAHIN_BOTTLE_OF_SODA.mtl', 'models/obj/CHAHIN_BOTTLE_OF_SODA.obj', new THREE.Vector3(0.4, 0.4, 0.4), new THREE.Vector3(1.7, 2.92, -2.5), new THREE.Euler(0, 0, 0), null, (object: THREE.Object3D) => {
    colaMesh = object;
    const colaShape = new CANNON.Box(new CANNON.Vec3(0.2, 0.2, 0.2));
    colaBody = new CANNON.Body({ mass: 1 });
    colaBody.addShape(colaShape);
    colaBody.position.set(2.3, 2.92, -2.5);
    colaBody.type = CANNON.Body.STATIC; // Set the body type to static initially
    world.addBody(colaBody);
});

// Update click event listener
let colaClicked = false; // Add a flag to track if the cola bottle has been clicked

window.addEventListener('click', (event) => {
    if (!laptopMesh || !monitorMesh || !switchMesh || !catMesh || !colaMesh || !colaBody ) return;
    
    raycasterHandler.updateMousePosition(event);
    raycasterHandler.setFromCamera(raycasterHandler.getMouse(), camera);
    const laptopIntersects = raycasterHandler.intersectObject(laptopMesh, true);
    const monitorIntersects = raycasterHandler.intersectObject(monitorMesh, true);
    const switchIntersects = raycasterHandler.intersectObject(switchMesh, true);
    const catIntersects = raycasterHandler.intersectObject(catMesh, true);
    const colaIntersects = raycasterHandler.intersectObject(colaMesh, true);
    //const planeIntersects = raycasterHandler.intersectObject(laptopClickPlane);

    if (laptopIntersects.length > 0 || monitorIntersects.length > 0) {
        resetButton.style.display = 'block';
        
        if (laptopIntersects.length > 0) {
            cameraController.setTargetPositions(
                new THREE.Vector3(0.09, 1.69, 5.92),
                new THREE.Vector3(0.3, -2.0, 5.9),
                new THREE.Euler(0.4, 0.2, 0)
            );
        } else {
            cameraController.setTargetPositions(
                new THREE.Vector3(-1.4, 1.69, 6.9),
                new THREE.Vector3(-0.5, -2.4, 8.3),
                new THREE.Euler(0.2, -0.2, 0.03)
            );
        }
    }

    //if (planeIntersects.length > 0) {
        //scrollContainer.style.display = 'block';
    //}

    if (switchIntersects.length > 0) {
        lightManager.toggleCeilingLight();
        switchMesh.rotation.x += Math.PI; // Rotate the switch by 180 degrees
    }

    if (catIntersects.length > 0) {
        catMesh.rotation.y += Math.PI; // Rotate the cat by 180 degrees
    }

    if (colaIntersects.length > 0 && colaClicked === false) {
        colaBody!.type = CANNON.Body.DYNAMIC; // Change the body type to dynamic to enable gravity
        colaBody!.velocity.set(1, 2, 0.5); // Apply initial upward and forward velocity
        colaBody!.angularVelocity.set(0, 0, Math.PI / 2); // Apply angular velocity to rotate by 90 degrees
        colaClicked = true; // Set the flag to true to disable further clicks
    }
});

// Ensure renderer listens for clicks
triangles.forEach((triangleMesh: THREE.Mesh) => {
    triangleMesh.userData.colorIndex = 0;
    const light = new THREE.PointLight(neonColors[triangleMesh.userData.colorIndex], 1, 5);
    light.position.copy(triangleMesh.position);
    scene.add(light);
    triangleMesh.userData.light = light;

    triangleMesh.addEventListener('click', () => {
        triangleMesh.userData.colorIndex = (triangleMesh.userData.colorIndex + 1) % neonColors.length;
        const newColor = neonColors[triangleMesh.userData.colorIndex];
        (triangleMesh.material as THREE.MeshBasicMaterial).color.set(newColor);
        triangleMesh.userData.light.color.set(newColor);
    });
});

renderer.domElement.addEventListener('click', (event) => {
    raycasterHandler.updateMousePosition(event);
    raycasterHandler.setFromCamera(raycasterHandler.getMouse(), camera);
    triangles.forEach((triangleMesh: THREE.Mesh) => {
        const intersects = raycasterHandler.intersectObject(triangleMesh, true);
        if (intersects.length > 0) {
            const currentColor = (triangleMesh.material as THREE.MeshBasicMaterial).color.getHex();

            // Find the current color's index in the neonColors array
            let currentColorIndex = neonColors.indexOf(currentColor);

            // If the current color is found in the array, cycle to the next color
            let nextColorIndex = (currentColorIndex + 1) % neonColors.length;

            // Set the new color from the neonColors array
            triangleMesh.material = new THREE.MeshBasicMaterial({ color: neonColors[nextColorIndex], side: THREE.DoubleSide });

            triangleMesh.userData.colorIndex = (triangleMesh.userData.colorIndex + 1) % neonColors.length;
            const newColor = neonColors[triangleMesh.userData.colorIndex];
            (triangleMesh.material as THREE.MeshBasicMaterial).color.set(newColor);
            if(nextColorIndex === 4) {
                triangleMesh.userData.light.intensity = 0;
            }else{
                triangleMesh.userData.light.intensity = 1;
                triangleMesh.userData.light.color.set(newColor);
            }
        }
    });
});

let lightIntensityDirection = 1;

function animateLightIntensity() {
    const ceilingLight = scene.getObjectByName('ceilingLight') as THREE.PointLight;
    if (ceilingLight) {
        ceilingLight.intensity += lightIntensityDirection * 0.01;
        if (ceilingLight.intensity > 1.2 || ceilingLight.intensity < 0.8) {
            lightIntensityDirection *= -1;
        }
    }
    requestAnimationFrame(animateLightIntensity);
}

animateLightIntensity();

const cameraController = new CameraController(camera, scene, renderer, controls, raycasterHandler, resetButton, scrollContainer);
cameraController.setDefaultPositions();
// Animation loop
function animate() {
    requestAnimationFrame(animate);
    cameraController.update();
    controlManager.update();
    TWEEN.update();
    world.step(1 / 60);

    // Update cola mesh position and rotation
    if (colaMesh && colaBody) {
        colaMesh.position.copy(colaBody.position as unknown as THREE.Vector3);
        colaMesh.quaternion.copy(colaBody.quaternion as unknown as THREE.Quaternion);
    }

    renderer.render(scene, camera);

    // Show matrix background when zoomed out to the maximum distance
    if (camera.position.distanceTo(new THREE.Vector3(0, 6, 5)) > 10) {
        matrixCanvas.style.display = 'block';
    } else {
        matrixCanvas.style.display = 'none';
    }
}
animate();