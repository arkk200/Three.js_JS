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
camera.position.z = 1;

// Light
const pl = new THREE.PointLight(0xffffff, 0.9);
const al = new THREE.AmbientLight(0xffffff, 1.9);

pl.position.set(0, 0, 0);

scene.add(pl);
scene.add(al);

// Renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new threejsOrbitControls(camera, renderer.domElement);

// RenderTargetOptions
const renderTargetOptions = {
    format: THREE.RGBAFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
};

// RenderTarget, CubeCamera, Object3D


// Group

// Geometry
const boxGeo = new THREE.BoxGeometry(1,1,1);

// Material
const boxMat = new THREE.MeshStandardMaterial({color:0x222222});

// Mesh
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
boxMesh.position.set(3, 0, 0);

for(let i = 0; i < 6; i++){
    SummonPlaneMirror(Math.sin(Math.PI/3 * i) * -15, 0, Math.cos(Math.PI/3 * i) * -15, 17, 40, i%2 ? 0x222250 : 0x552220, i * 60)
}
SummonCylinderMirror(0, -20, 0, 18, 1, 64, 0x204420, 0);
SummonCylinderMirror(0, 20, 0, 18, 1, 64, 0x204420, 0);

scene.add(boxMesh);

// Functions
function SummonPlaneMirror(posx, posy, posz, wdth, hght, colr, rotate){
    const planeRenderTarget = new THREE.WebGLCubeRenderTarget(512, renderTargetOptions);
    const planeCamera = new THREE.CubeCamera(0.1, 1000, planeRenderTarget);
    const planePivot = new THREE.Object3D();

    const planeGeo = new THREE.PlaneGeometry(wdth, hght);

    const planeMat = new THREE.MeshPhongMaterial({
        color:colr,
        side: THREE.DoubleSide,
        envMap: planeRenderTarget.texture,
        reflectivity: 0.9
    });

    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.rotation.y = rotate * Math.PI / 180;

    planePivot.add(planeMesh);
    planePivot.add(planeCamera);
    planePivot.position.set(posx,posy,posz);

    scene.add(planePivot);
}
function SummonCylinderMirror(posx, posy, posz, rad, hght, radSeg, colr, rotate){
    const cylinderRenderTarget = new THREE.WebGLCubeRenderTarget(1024, renderTargetOptions);
    const cylinderCamera = new THREE.CubeCamera(0.1, 1000, cylinderRenderTarget);
    const cylinderPivot = new THREE.Object3D();

    const cylinderGeo = new THREE.CylinderGeometry(rad, rad, hght, radSeg);
    const cylinderMat = new THREE.MeshPhongMaterial({
        color:colr,
        side: THREE.DoubleSide,
        envMap: cylinderRenderTarget.texture,
        reflectivity: 0.9
    });

    const cylinderMesh = new THREE.Mesh(cylinderGeo, cylinderMat);
    cylinderMesh.rotation.x = rotate * Math.PI / 180;
    
    cylinderPivot.add(cylinderMesh);
    cylinderPivot.add(cylinderCamera);

    cylinderPivot.position.set(posx, posy, posz);
    
    scene.add(cylinderPivot);
}

// Resize
window.addEventListener('resize', OnResize);

function OnResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Rendering
renderer.setAnimationLoop(animation);

function animation(time){
    time *= 0.001;
    scene.traverse(obj => {
        if(obj instanceof THREE.Object3D){
            const mesh = obj.children[0];
            const cubeCamera = obj.children[1];
            if(mesh instanceof THREE.Mesh && cubeCamera instanceof THREE.CubeCamera){
                mesh.visible = false;
                cubeCamera.update(renderer, scene);
                mesh.visible = true;
            }
        }
    });
    boxMesh.position.set(Math.sin(Math.PI/3 * time) * 3, 0, Math.cos(Math.PI/3 * time) * -3);
    boxMesh.rotation.y = Math.PI / -3 * time;
    renderer.render(scene, camera);
}
