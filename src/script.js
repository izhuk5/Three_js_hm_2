import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons";
import GUI from "lil-gui";

// Base
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Model
const gltfLoader = new GLTFLoader();

gltfLoader.load("/models/Room/room.gltf", gltf => {
  gltf.scene.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(gltf.scene);
});

//Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0,
    roughness: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// Lights
const ambientLight = new THREE.AmbientLight("white", 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 4);
directionalLight.position.set(1, 0.8, 0.3);
directionalLight.castShadow = true;

directionalLight.shadow.mapSize.width = 10240;
directionalLight.shadow.mapSize.height = 10240;

console.log(directionalLight.shadow.mapSize);

scene.add(directionalLight);

// Light Helpers
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2,
  "red"
);
scene.add(directionalLightHelper);

// GUI Lights
const lightFolder = gui.addFolder('Directional light');
lightFolder.add(directionalLight, 'intensity', 0, 10, 0.001).name('Intensity');
lightFolder.add(directionalLight.position, 'x', -5, 5, 0.001).name('Position X');
lightFolder.add(directionalLight.position, 'y', -5, 5, 0.001).name('Position Y');
lightFolder.add(directionalLight.position, 'z', -5, 5, 0.001).name('Position Z');
lightFolder.close();


// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Camera
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
