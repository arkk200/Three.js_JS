import * as THREE from 'https://cdn.skypack.dev/three@0.140.0'
import threejsOrbitControls from 'https://cdn.skypack.dev/threejs-orbit-controls';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 4, 9);

// Renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new threejsOrbitControls(camera, renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(-1, 2, 4);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.2));

// RenderTarget
const renderTargetOptions = {
    format: THREE.RGBAFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
}

const sphereRenderTarget = new THREE.WebGLCubeRenderTarget(512, renderTargetOptions);
const sphereCamera = new THREE.CubeCamera(0.1, 1000, sphereRenderTarget);
const spherePivot = new THREE.Object3D();

const cylinderRenderTarget = new THREE.WebGLCubeRenderTarget(2048, renderTargetOptions);
const cylinderCamera = new THREE.CubeCamera(0.1, 1000, cylinderRenderTarget);
const cylinderPivot = new THREE.Object3D();

const torusRenderTarget = new THREE.WebGLCubeRenderTarget(2048, renderTargetOptions);
const torusCamera = new THREE.CubeCamera(0.1, 1000, torusRenderTarget);
const torusPivot = new THREE.Object3D();

const planeRenderTarget = new THREE.WebGLCubeRenderTarget(2048, renderTargetOptions);
const planeCamera = new THREE.CubeCamera(0.1, 1000, planeRenderTarget);
const planePivot = new THREE.Object3D();

// Model
// Sphere
const sphereGeometry = new THREE.SphereGeometry(1.5);
const sphereMaterail = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    envMap: sphereRenderTarget.texture, reflectivity: 0.95
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterail);

spherePivot.add(sphere);
spherePivot.add(sphereCamera);
spherePivot.position.set(1, 0, 1);
scene.add(spherePivot);

// Cylinder
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 1, 3, 32);
const cylinderMaterail = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    envMap: cylinderRenderTarget.texture, reflectivity: 0.95
});
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterail);

cylinderPivot.add(cylinder);
cylinderPivot.add(cylinderCamera);
cylinderPivot.position.set(-1, 0, -1);
scene.add(cylinderPivot);

const torusGeometry = new THREE.TorusGeometry(4, 0.5, 24, 64);
const torusMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    envMap:torusRenderTarget.texture, reflectivity: 0.95
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.rotation.x = Math.PI / 2;

torusPivot.add(torus);
torusPivot.add(torusCamera);
scene.add(torusPivot);
torus.name = "torus";

const planeGeometry = new THREE.PlaneGeometry(12, 12);
const planeMaterail = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    envMap: planeRenderTarget.texture, reflectivity:0.95
});
const plane = new THREE.Mesh(planeGeometry, planeMaterail);
planePivot.add(plane);
planePivot.add(planeCamera);
plane.rotation.x = -Math.PI / 2;
planePivot.position.y = -4.8;
scene.add(planePivot);

// Rendering
renderer.setAnimationLoop(animate);

function animate(time){
    time *= 0.001;

    scene.traverse(obj => {
        if(obj instanceof THREE.Object3D){
            const mesh = obj.children[0];
            const cubeCamera = obj.children[1];
            // console.log(mesh instanceof THREE.Mesh)
            if(mesh instanceof THREE.Mesh && cubeCamera instanceof THREE.CubeCamera){
                mesh.visible = false;
                cubeCamera.update(renderer, scene);
                mesh.visible = true;
            }
        }
    });

    const torus = scene.getObjectByName("torus");
    if(torus){
        torus.rotation.x = Math.sin(time);
    }
    controls.update();
    renderer.render(scene, camera);
}