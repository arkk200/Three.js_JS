import * as THREE from 'https://cdn.skypack.dev/three@0.140.0'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
)
camera.position.z = 60;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pointLight = new THREE.PointLight(0xffffff, 1);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
pointLight.position.set(0, 0, 11);
scene.add(pointLight);
scene.add(ambientLight);

const renderTargetOptions = {
    format: THREE.RGBAFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
}
const watchRenderTarget = new THREE.WebGLCubeRenderTarget(1024, renderTargetOptions);
const watchCamera = new THREE.CubeCamera(0.1, 1000, watchRenderTarget);
const watchPivot = new THREE.Object3D();

const watchGeo = new THREE.CylinderGeometry(8, 9, 1, 40);
const watchMat = new THREE.MeshPhongMaterial({
    color:0xffd700,
    envMap: watchRenderTarget.texture,
    reflectivity: 0.6
})
const watchMesh = new THREE.Mesh(watchGeo, watchMat);
watchPivot.add(watchMesh);
watchPivot.add(watchCamera);
watchPivot.position.z = 10;
watchMesh.rotation.x = Math.PI / 2;
scene.add(watchPivot);

renderer.setAnimationLoop(animation);

function animation() {
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
    })
    renderer.render(scene, camera);
}