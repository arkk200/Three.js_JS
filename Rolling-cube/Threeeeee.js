import *  as THREE from 'https://cdn.skypack.dev/three@0.140.0'

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);
camera.position.z = 10;

// Renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Geometry
const boxGeometry = new THREE.BoxGeometry(3, 3, 3);

// Material
const boxMaterial = new THREE.MeshStandardMaterial({color:0xff0000});

// Mesh
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

// Light
const pointLight = new THREE.PointLight(0xffffff, 1);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
pointLight.position.set(7, 7, 5);
scene.add(pointLight);
scene.add(ambientLight);

// Resize
function onResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize);

// Animation
renderer.setAnimationLoop(animation);

function animation() {
    boxMesh.rotation.x += 0.01;
    boxMesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}