import * as THREE from 'https://cdn.skypack.dev/three@0.140.0'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);
camera.position.z = 70;

const dl = new THREE.DirectionalLight(0xffffff,3);
const al = new THREE.AmbientLight(0xffffff, 0.9);
dl.position.set(-1, 2, 25);
scene.add(dl);
scene.add(al);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const renderTargetOptions = {
    format: THREE.RGBAFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
}

const sphereRenderTarget = new THREE.WebGLCubeRenderTarget(1024, renderTargetOptions);
const sphereCamera = new THREE.CubeCamera(0.1, 1000, sphereRenderTarget);

const spherePivot = new THREE.Object3D();
const sphereGeo = new THREE.SphereGeometry(2.5, 64, 24);
const sphereMat = new THREE.MeshPhongMaterial({
    color:0xffffff,
    envMap:sphereRenderTarget.texture,
    reflectivity: 0.9
});
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
spherePivot.add(sphereMesh);
spherePivot.add(sphereCamera);
spherePivot.position.set(0,0,0);
scene.add(spherePivot);

const torusKnotRenderTarget = new THREE.WebGLCubeRenderTarget(1024, renderTargetOptions);
const torusKnotCamera = new THREE.CubeCamera(0.1, 1000, torusKnotRenderTarget);

const torusKnotPivot = new THREE.Object3D();
const torusKnotGeo = new THREE.TorusKnotGeometry(10, 1.5, 128, 16);
const torusKnotMat = new THREE.MeshPhongMaterial({
    color:0xffffff,
    envMap:torusKnotRenderTarget.texture,
    reflectivity: 0.9
});
const torusKnotMesh = new THREE.Mesh(torusKnotGeo, torusKnotMat);
torusKnotPivot.add(torusKnotMesh);
torusKnotPivot.add(torusKnotCamera);
torusKnotPivot.position.set(0,0,0);
scene.add(torusKnotPivot);

const torusRenderTarget = new THREE.WebGLCubeRenderTarget(2048, renderTargetOptions);

const torusCamera1 = new THREE.CubeCamera(0.1, 1000, torusRenderTarget);

const torusPivot1 = new THREE.Object3D();
const torusGeometry1 = new THREE.TorusGeometry(5, 0.5, 24, 64);
const torusMaterial1 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    envMap:torusRenderTarget.texture, reflectivity: 0.95
});
const torusMesh1 = new THREE.Mesh(torusGeometry1, torusMaterial1);

torusPivot1.add(torusMesh1);
torusPivot1.add(torusCamera1);
scene.add(torusPivot1);

const torusCamera2 = new THREE.CubeCamera(0.1, 1000, torusRenderTarget);

const torusPivot2 = new THREE.Object3D();
const torusGeometry2 = new THREE.TorusGeometry(7, 0.5, 24, 64);
const torusMaterial2 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    envMap:torusRenderTarget.texture, reflectivity: 0.95
});
const torusMesh2 = new THREE.Mesh(torusGeometry2, torusMaterial2);

torusPivot2.add(torusMesh2);
torusPivot2.add(torusCamera2);
scene.add(torusPivot2);

function onResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize);

renderer.setAnimationLoop(animation);

function animation(time) {
    time *= 0.001;

    scene.traverse(obj => {
        if(obj instanceof THREE.Object3D){
            // console.log(obj);
            const mesh = obj.children[0];
            const cubeCamera = obj.children[1];
            // console.log(obj.children[0], obj.children[1]);
            // console.log(mesh instanceof THREE.Mesh);
            if(mesh instanceof THREE.Mesh && cubeCamera instanceof THREE.CubeCamera){
                mesh.visible = false;
                cubeCamera.update(renderer, scene);
                mesh.visible = true;
                // console.log('test');
            }
        }
    });

    torusKnotMesh.rotation.x = time;
    torusKnotMesh.rotation.z = time;
    torusMesh1.rotation.y = time;
    torusMesh2.rotation.x = -time;
    
    renderer.render(scene, camera);
}