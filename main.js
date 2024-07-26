import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// VR Button
document.body.appendChild(VRButton.createButton(renderer));

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Box Geometry
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(geometry, material);
scene.add(box);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

// Set camera position
camera.position.set(0, 1.6, 3);
controls.update();

// VR Controllers
const controller1 = renderer.xr.getController(0);
const controller2 = renderer.xr.getController(1);
scene.add(controller1);
scene.add(controller2);

// Controller Models
const controllerModelFactory = new XRControllerModelFactory();
const controllerGrip1 = renderer.xr.getControllerGrip(0);
controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
scene.add(controllerGrip1);

const controllerGrip2 = renderer.xr.getControllerGrip(1);
controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
scene.add(controllerGrip2);

// Event Listeners for VR Controller Actions
controller1.addEventListener('selectstart', () => {
    box.material.color.setHex(Math.random() * 0xffffff);
});
controller1.addEventListener('squeezestart', () => {
    box.scale.set(1.5, 1.5, 1.5);
});
controller1.addEventListener('selectend', () => {
    box.material.color.setHex(Math.random() * 0xffffff);
});
controller1.addEventListener('squeezeend', () => {
    box.scale.set(1, 1, 1);
});

controller2.addEventListener('selectstart', () => {
    box.material.color.setHex(Math.random() * 0xffffff);
});
controller2.addEventListener('squeezestart', () => {
    box.scale.set(2, 2, 2);
});
controller2.addEventListener('selectend', () => {
    box.material.color.setHex(Math.random() * 0xffffff);
});
controller2.addEventListener('squeezeend', () => {
    box.scale.set(1, 1, 1);
});

// Handling Joystick/Thumbstick Movements for Camera Control
function handleController(controller) {
    if (controller.inputSource && controller.inputSource.gamepad) {
        const thumbstick = controller.inputSource.gamepad.axes;
        const movementSpeed = 0.05;

        if (thumbstick[2] < -0.5) {
            camera.position.z -= movementSpeed; // Move forward
        }
        if (thumbstick[2] > 0.5) {
            camera.position.z += movementSpeed; // Move backward
        }
        if (thumbstick[0] < -0.5) {
            camera.position.x -= movementSpeed; // Move left
        }
        if (thumbstick[0] > 0.5) {
            camera.position.x += movementSpeed; // Move right
        }
    }
}

// Animation Loop
function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    handleController(controller1);
    handleController(controller2);
    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
