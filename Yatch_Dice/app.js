import * as THREE from 'https://cdn.skypack.dev/three@0.133';
import threejsOrbitControls from 'https://cdn.skypack.dev/threejs-orbit-controls';
import {FontLoader} from "https://cdn.skypack.dev/three@0.133/examples/jsm/loaders/FontLoader.js";
import {TextGeometry} from "https://cdn.skypack.dev/three@0.133/examples/jsm/geometries/TextGeometry.js";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

// Camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);
// camera.position.y = 12;
camera.position.set(0, 12, 2);
camera.rotation.x = Math.PI / -2;
camera.lookAt(0, 0, 0);

// Light
const pl = new THREE.PointLight(0xffffff, 0.6);
const al = new THREE.AmbientLight(0xffffff, 0.6);
const dl = new THREE.DirectionalLight(0xffffff, 1);
pl.position.set(0, 5, 0);
dl.position.set(0, 10, -10);
scene.add(pl);
scene.add(al);
scene.add(dl);

// Renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new threejsOrbitControls(camera, renderer.domElement);

// Summon Dice Functions
function SetDotPos(dotPosx, dotPosy, dotPosz, dotColor, size){
    let dotMesh;
    dotMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(size/10, size/10, 0.01, 32),
        new THREE.MeshPhongMaterial({color:dotColor})
    );
    dotMesh.position.set(dotPosx, dotPosy, dotPosz);
    return dotMesh;
}

function SummonDot(size, dotColor, i){
    const dotGroup = new THREE.Group;
    if(i%2){
        dotGroup.add(SetDotPos(0, 0, 0, dotColor, size));
    }
    if(i > 1 && i <= 6){
        dotGroup.add(SetDotPos(size/4, 0, -size/4, dotColor, size));
        dotGroup.add(SetDotPos(-size/4, 0, size/4, dotColor, size));
    }
    if(i > 3 && i <= 6){
        dotGroup.add(SetDotPos(size/4, 0, size/4, dotColor, size));
        dotGroup.add(SetDotPos(-size/4, 0, -size/4, dotColor, size));
    }
    if(i == 6){
        dotGroup.add(SetDotPos(size/4, 0, 0, dotColor, size));
        dotGroup.add(SetDotPos(-size/4, 0, 0, dotColor, size));
    }
    switch(i){
        case 1:
            dotGroup.position.set(0, size/2, 0);
            break;
        case 2:
            dotGroup.rotation.x = Math.PI / 2;
            dotGroup.position.set(0, 0, size/2);
            break;
        case 3:
            dotGroup.rotation.z = Math.PI / 2;
            dotGroup.position.set(size/2, 0, 0);
            break;
        case 4:
            dotGroup.rotation.z = Math.PI / -2;
            dotGroup.position.set(-size/2, 0, 0);
            break;
        case 5:
            dotGroup.rotation.x = Math.PI / -2;
            dotGroup.position.set(0, 0, -size/2);
            break;
        case 6:
            dotGroup.position.set(0, -size/2, 0);
            break;
    }
    return dotGroup;
}

function SummonDice(diceColor = 0xffffff, dotColor = 0xff0000, size = 1, posx = 0, posy = 0, posz = 0){
    const diceGroup = new THREE.Group();
    // diceBody
    const diceGeo = new THREE.BoxGeometry(size, size, size);
    const diceMat = new THREE.MeshPhongMaterial({color:diceColor});
    const diceMesh = new THREE.Mesh(diceGeo, diceMat);
    // diceDot
    for(let i = 1; i <= 6; i++){
        diceGroup.add(SummonDot(size, dotColor, i));
    }
    diceGroup.add(diceMesh);
    diceGroup.position.set(posx, posy, posz);
    return diceGroup;
}

// Summon Text Function
let textMesh;
const categoriesTextGroup = new THREE.Group();

function SummonCategoriesText(str, posx = 0, posy = 0, posz = 0, siz = 1, textColor = 0x000000) {
    const loader = new FontLoader();
    loader.load('./font/Teko_Bold.json', font => {
        const textGeo = new TextGeometry(str, {
            font: font,
            size: 0.5 * siz,
            height: 0.1,
            curveSegments: 10,
            bevelEnabled: true,
            bevelThickness: 0,
            bevelSize: 0.0001,
            bevelOffset: 0,
            bevelSegments: 1
        });
        textMesh = new THREE.Mesh(textGeo, new THREE.MeshPhongMaterial({color:textColor}));
        textMesh.position.set(posx, posy, posz);
        textMesh.rotation.x = Math.PI / -2;
        categoriesTextGroup.add(textMesh);
    });
}

const pSignTextGroup = new THREE.Group();
function SummonPlayerSignText(str, posx = 0, posy = 0, posz = 0, siz = 1, textColor = 0xffffff) {
    const loader = new FontLoader();
    loader.load('./font/Teko_Bold.json', font => {
        const textGeo = new TextGeometry(str, {
            font: font,
            size: 0.5 * siz,
            height: 0.1,
            curveSegments: 10,
            bevelEnabled: true,
            bevelThickness: 0,
            bevelSize: 0.0001,
            bevelOffset: 0,
            bevelSegments: 1
        });
        textGeo.center();
        textMesh = new THREE.Mesh(textGeo, new THREE.MeshPhongMaterial({color:textColor}));
        textMesh.position.set(posx, posy, posz);
        textMesh.rotation.x = Math.PI / -2;
        pSignTextGroup.add(textMesh);
    });
}

const tableGroup = new THREE.Group();

function SummonCell(cellColor = 0xffffff, cwdth, chght, posx, posy, posz){
    const tableCellMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(cwdth, chght),
        new THREE.MeshPhongMaterial({
            color:cellColor,
            side : THREE.DoubleSide
        })
    );
    tableCellMesh.rotation.x = Math.PI / 2;
    tableCellMesh.position.set(posx, posy, posz);
    return tableCellMesh;
}

function SummonTableCells(cellColor = 0xffffff, bodyColor = 0x000000, wdth, hght, cwdth, chght, dstnc, num, posx, posy, posz){
    const tableCellGroup = new THREE.Group();
    const tableCellBodyMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(wdth, hght),
        new THREE.MeshPhongMaterial({
            color:bodyColor,
            side:THREE.DoubleSide
        })
    );

    for(let i = 0; i < num; i++){
        tableCellGroup.add(SummonCell(cellColor, cwdth, chght, 0, 0.01, dstnc * i - hght/2 + dstnc/2));
    }

    // Add Categories to tableGroup
    tableCellBodyMesh.rotation.x = Math.PI / 2;

    // Add tableCellBody to tableGroup
    tableCellGroup.add(tableCellBodyMesh);
    tableCellGroup.position.set(posx, posy, posz);
    tableGroup.add(tableCellGroup);
}

function SummonCategories(textColor = 0x000000){
    const categoriesGroup = new THREE.Group();
    SummonCategoriesText('Categories', 0, 0, 0, 0.7, textColor = textColor); //
    SummonCategoriesText('Aces', 0.7, 0, 0.7, 1, textColor = textColor);
    SummonCategoriesText('Deuces', 0.7, 0 ,1.4, 1, textColor = textColor);
    SummonCategoriesText('Threes', 0.7, 0 , 2.1, 1, textColor = textColor);
    SummonCategoriesText('Fours', 0.7, 0 , 2.8, 1, textColor = textColor);
    SummonCategoriesText('Fives', 0.7, 0 , 3.5, 1, textColor = textColor);
    SummonCategoriesText('Sixes', 0.7, 0 , 4.2, 1, textColor = textColor); //
    SummonCategoriesText('Subtotal', 0, 0, 4.9, 0.7, textColor = textColor);
    SummonCategoriesText('+35 Bonus', 0, 0, 5.6, 1, textColor = textColor);
    SummonCategoriesText('Bonus if     -     are over 63 points', 0, 0, 6.03 , 0.7, textColor = textColor);
    SummonCategoriesText('Choice', 0.7, 0, 6.8, 1, textColor = textColor); //
    SummonCategoriesText('4 of a Kind', 0.7, 0, 7.5, 1, textColor = textColor);
    SummonCategoriesText('Full House', 0.7, 0, 8.2, 1, textColor = textColor);
    SummonCategoriesText('S. Straight', 0.7, 0, 8.9, 1, textColor = textColor);
    SummonCategoriesText('L. Straight', 0.7, 0, 9.6, 1, textColor = textColor);
    SummonCategoriesText('Yacht', 0.7, 0, 10.3, 1, textColor = textColor);
    SummonCategoriesText('Total', 0.7, 0, 11, 1, textColor = textColor); //
    
    // Summon Categories
    categoriesGroup.add(categoriesTextGroup);
    categoriesGroup.position.set(-3.5, 0, -5);
    tableGroup.add(categoriesGroup);
}

const pSignGroup = new THREE.Group();
function SummonPlayerSign(playerSignColor = 0xff0000, str, posx){
    const pSignMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.9),
        new THREE.MeshPhongMaterial({
            color:playerSignColor,
            side: THREE.DoubleSide
        })
    );
    pSignMesh.rotation.x = Math.PI / -2;
    pSignMesh.position.x = posx;
    pSignGroup.add(pSignMesh);
    SummonPlayerSignText(str, posx, 0.01, 0, 1, 0xffffff);
    pSignGroup.add(pSignTextGroup);
    // pSignGroup.position.set(1, 0.02,-3.5);
    pSignGroup.position.set(0, 0.01, -5.5);
}

// Summon Score Table Function
function SummonTable(tableColor = 0xffffff, textColor = 0x000000, posx = 0, posy = 0, posz = -15, size = 8){
    const tableMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(size, size*1.6),
        new THREE.MeshPhongMaterial({
            color:tableColor,
            side: THREE.DoubleSide
        })
    );
    SummonCategories(textColor);
    SummonTableCells(0xffffff, 0x000000, 1.5, 5.6, 1.4, 0.6, 0.7, 8, 1.0, 0.01, -2.15);
    SummonTableCells(0xffffff, 0x000000, 1.5, 5.6, 1.4, 0.6, 0.7, 8, 2.6, 0.01, -2.15);

    SummonTableCells(0xffffff, 0x000000, 1.5, 4.9, 1.4, 0.6, 0.7, 7, 1.0, 0.01, 3.65);
    SummonTableCells(0xffffff, 0x000000, 1.5, 4.9, 1.4, 0.6, 0.7, 7, 2.6, 0.01, 3.65);

    // Add tableMesh to tableGroup
    SummonPlayerSign(0xff0000, 'p1', 1);
    SummonPlayerSign(0xff0000, 'p2', 2.6);
    tableGroup.add(pSignGroup);
    tableMesh.rotation.x = Math.PI/2;
    tableGroup.add(tableMesh);
    tableGroup.position.set(posx, posy, posz);
    return tableGroup;
}


// Summon Score Table
const table = SummonTable(0xffffff, 0x000000, 0, 0, -15, 8);
scene.add(table);

// Summon Dice
const dices = [
    SummonDice(0xffffff, 0x000000, 1, -4, 0, 0),
    SummonDice(0xffffff, 0x000000, 1, -2, 0, 0),
    SummonDice(0xffffff, 0x000000, 1, 0, 0, 0),
    SummonDice(0xffffff, 0x000000, 1, 2, 0, 0),
    SummonDice(0xffffff, 0x000000, 1, 4, 0, 0)
];
scene.add(dices[0]);
scene.add(dices[1]);
scene.add(dices[2]);
scene.add(dices[3]);
scene.add(dices[4]);

// Checking Point
const cpGroup = new THREE.Group();
const cpMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0, 0.2, 0.6, 32),
    new THREE.MeshPhongMaterial({color:0xff0000})
);
const cpBarMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.6, 32),
    new THREE.MeshPhongMaterial({color:0xff0000})
)
cpBarMesh.rotation.x = Math.PI / 2;
cpMesh.rotation.x = Math.PI / 2;
cpBarMesh.position.z = -0.6;
cpGroup.add(cpMesh);
cpGroup.add(cpBarMesh);
scene.add(cpGroup);

// CheckBox
let checkBoxes = [1, 1, 1, 1, 1];

// Summon Dice CheckBox Function
SetCheckBox();
function SetCheckBox(){
    for(let i = 0; i < 5; i++){
        const checkBoxMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.3, 0.3),
            new THREE.MeshPhongMaterial({color:checkBoxes[i] === 0 ? 0xff0000 : 0x00ff00})
        );
        checkBoxMesh.position.set(-4 + i * 2, 0, 1);
        scene.add(checkBoxMesh);
    }
}

// Check Box Function
function CheckBox(index){
    if(!firstRoll){ // First rolling the dices must be rolling all the dices.
        if(checkBoxes[index] === 0) checkBoxes[index] = 1;
        else checkBoxes[index] = 0;
        SetCheckBox();
    }
}

// Rendering
renderer.setAnimationLoop(animation);

let isEnter = false;
let diceNumber = [1, 1, 1, 1, 1];
let firstRoll = true;

let count = 3;

let moveSpeed = 0.1;

let cpPosx = 0;

function animation(){
    // categoriesTextGroup.rotation.x += 0.01;
    if(isEnter){
        for(let i = 0; i < 5; i++){
            if(checkBoxes[i] === 1){
                let diceRes = Math.floor(Math.random() * 6) + 1;
                let choose1 = Math.floor(Math.random()* 2);
                let choose2 = Math.floor(Math.random() * 4);
                switch(diceRes){
                    case 1:
                        dices[i].rotation.set(0, Math.PI / 2 * Math.floor(Math.random() * 4), 0);
                        break;
                    case 2:
                        dices[i].rotation.set(Math.PI/-2, 0, Math.PI * Math.floor(Math.random() * 2));
                        break;
                    case 3:
                        dices[i].rotation.set(Math.PI/2 * (1 + choose1 * 2),  Math.PI / 2 * (1 + choose1 * 2), 0);
                        break;
                    case 4:
                        switch(choose2){
                            case 0: dices[i].rotation.set(0, 0, Math.PI/-2);
                                break;
                            case 1: dices[i].rotation.set(Math.PI/2, Math.PI/-2, 0);
                                break;
                            case 2: dices[i].rotation.set(Math.PI, 0, Math.PI/2);
                                break;
                            case 3: dices[i].rotation.set(Math.PI/2 * 3, Math.PI/2, 0);
                                break;
                        }
                        break;
                    case 5: dices[i].rotation.set(Math.PI / 2, 0, Math.PI / 2 * choose2);
                        break;
                    case 6: dices[i].rotation.set(Math.PI, Math.PI * choose1, 0);
                        break;
                }
                diceNumber[i] = diceRes;
            }
        }
        
        console.log(diceNumber);
        isEnter = false;
        checkBoxes = [0, 0, 0, 0, 0];
        SetCheckBox();
        firstRoll = false;
    }
    if(count === 0){
        scene.remove(cpGroup);
        camera.position.z -= moveSpeed;
        camera.position.y += moveSpeed * 1.6;
        table.position.z += moveSpeed * 1.4;
        moveSpeed *= 0.98;
    }
    cpGroup.position.set(-4 + cpPosx * 2, 0, -1.5);
    renderer.render(scene, camera);
}

// KeyDown or Click Event
window.addEventListener('keydown', e => {
    const code = e.code;
    if(count !== 0)
        switch(code){
            case 'ArrowLeft':
                if(cpPosx) cpPosx--;
                break;
            case 'ArrowRight':
                if(cpPosx < 4) cpPosx++;
                    break;
            case 'Space':
                CheckBox(cpPosx);
                break;
            case 'Enter':
                let chck = 0;
                checkBoxes.forEach((value) => {
                    if(value == 1){
                        chck = 1;
                    }
                });
                if(chck === 1) {isEnter = true; count--;}
                else {count = 0};
        }
    else{ // You rolled the dice for count!
        switch(code){
            case 'ArrowUp':
                break;
            case 'ArrowDown':
                break;
            case 'Enter':

        }
    }
});
