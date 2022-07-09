import * as THREE from 'https://cdn.skypack.dev/three@0.140.0'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333)

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth/window.innerHeight,
    0.1,
    50000
);
camera.position.set(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const skyboxImage = "corona";

// ["./img/corona_ft.png", ...];
function createPathStrings(filename){
    const basePath = "./img/";
    const baseFilename = basePath + filename;
    const fileType = ".png";
    const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
    // 배열.map(sides.map)은 배열의 값을 매개변수(side)를 통해
    // 값을 전달받고 그대로 반환하여 새로운 배열을 만든다.
    const pathStrings = sides.map(side => {
        return baseFilename + "_" + side + fileType;
    });
    return pathStrings;
}

function createMaterialArray(filename){
    // ["./img/corona_ft.png", ...];
    const skyboxImagepaths = createPathStrings(filename);

    const materialArray = skyboxImagepaths.map(image => {
        let texture = new THREE.TextureLoader().load(image);
        return new THREE.MeshBasicMaterial({map:texture, side:THREE.BackSide});
    });

    return materialArray;
}


const materialArray = createMaterialArray(skyboxImage);
const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
const skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);
animate();



function animate(){
    skybox.rotation.x += 0.001;
    skybox.rotation.y += 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}