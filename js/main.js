// Remove imports when using CDN approach
// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

console.log("Three.js script loaded");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Add a simple cube to verify scene rendering
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Rest of your code...
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let object;
let controls;
let objToRender = 'MocapMan';

// Instantiate a loader for the .gltf file
const loader = new THREE.GLTFLoader();

// Load the file
loader.load(
  `./models/${objToRender}.gltf`,
  function (gltf) {
    console.log("Model loaded successfully");
    object = gltf.scene;
    
    // Scale and position the model if needed
    object.scale.set(1, 1, 1); // Adjust scale if model is too large/small
    object.position.set(0, 0, 0); // Center the model
    
    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error("Error loading model:", error);
  }
);

// Move camera closer
camera.position.z = 5; // Start closer to see if anything renders

// Rest of your code...
// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

// Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Set how far the camera will be from the 3D model
camera.position.z = objToRender === "dino" ? 25 : 500;

// Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); // top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);

// This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "dino") {
  controls = new OrbitControls(camera, renderer.domElement);
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  // Here we could add some code to update the scene, adding some automatic movement

  // Make the eye move
  if (object && objToRender === "eye") {
    // I've played with the constants here until it looked good 
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }
  renderer.render(scene, camera);
}

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

// Start the 3D rendering
animate();
console.log("Animation started");