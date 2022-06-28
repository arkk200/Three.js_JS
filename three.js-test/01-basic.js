import * as THREE from 'https://cdn.skypack.dev/three@0.140.0'

class App {
    constructor() {
        // id가 webgl-container인 div 요소를 얻어와서 divContainer 상수에 저장해둠
        const divContainer = document.querySelector("#webgl-container");
        // divContainer를 클래스의 필드로 정의함
        // 필드로 정의한 이유는 divContainer를 this._divContainer로 다른 메서드에서 참조할수 있도록 하기 위함 
        this._divContainer = divContainer;
        
        // renderer 객체 생성
        // three.js 라이브러리의 WebGL1Renderer 클래스로 생성 가능
        // 다양한 옵션 설정 가능 (antialias: true => 활성화시켜주면 3차원 장면이 렌더링 될때 오브젝트들의 경계선이 계단 현상 없이 부드럽게 표현됨)
        const renderer = new THREE.WebGL1Renderer({ antialias: true });
        //setPixelRatio 메서드 호출해 Pixel의 Ratio값 설정(window.devicePixelRatio로)
        renderer.setPixelRatio(window.devicePixelRatio);
        // domElement를 id가 webgl-container인 divContainer의 자식으로 추가함
        // renderer.domElement는 캔버스 타입의 돔 객체
        divContainer.appendChild(renderer.domElement);
        // renderer를 다른 메서드에서 참조할수 있도록 this._renderer로 정의함
        this._renderer = renderer;
        
        // scene 객체 생성
        // three.js 라이브러리의 Scene 클래스로 생성 가능
        const scene = new THREE.Scene();
        // scene 객체를 필드화 시켜서 app 클래스의 다른 메서드에서도 참조 가능하게 함
        this._scene = scene;
        
        
        /*아직 정의 안한 메서드, 일단 정의되어 있다고 가정하고 입력한 것임*/
        // 카메라 객체를 구성
        this._setupCamera();
        // light를 설정
        this._setupLight();
        // 3차원 모델 설정
        this._setupModel();

        // 창 크기가 변경되면 발생하는 onresize 이벤트
        // onresize 이벤트에 이 클래스의 resize method를 지정하고 있음
        // resize이벤트가 필요한 이유는 renderer나 camera는 창 크기가 변경될 때마다 크기에 맞게 속성 값을 재설정 해줘야함
        // resize이벤트에 resize 메서드를 지정할때 bind를 사용해서 지정함
        // -> resize 메서드 안에서 this가 가리키는 객체가 이벤트 객체가 아닌 이 app 클래스의 객체가 되도록 하기 위함
        window.onresize = this.resize.bind(this);
        // resize 메서드를 창크기 변경시 발생하는 resize이벤트와 상관없이 생성자에서 한번 무조건 호출해줌
        // 렌더러나 카메라의 속성을 창 크기에 맞게 설정해줌
        this.resize();
        
        // render 메서드를 requestAnimationFrame이라는 API에 넘겨줘서 호출하고 있음
        // render 메서드는 실제로 3차원 그래픽 장면을 만들어주는 method
        // 이 메서드를 requestAnimationFrame에 넘겨줘서 requestAnimationFrame은 적당한 시점에 또한 최대한 빠르게 이 render 메서드를 호출해줌
        // render 메서드를 bind를 통해서 넘겨주고 있음 -> render 메서드의 코드 안에서 사용되는 this가 이 app클래스의 객체를 가르키도록 하기 위함
        requestAnimationFrame(this.render.bind(this));
    }
    _setupCamera() {
        // three.js가 3차원 그래픽을 출력할 영역에 대한 가로,세로 크기를 얻어옴
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        // 얻어온 크기로 카메라 객체를 생성함
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.z=2;
        // 생성된 카메라 객체를 다른 메서드에서 사용할 수 있도록 this._camera라는 필드로 정의함
        this._camera = camera;
    }

    _setupLight() {
        // 광원 생성위해서는 광원의 색상과 세기값이 필요함
        const color = 0xffffff;
        const intensity = 1;
        // 광원 생성
        const light = new THREE.DirectionalLight(color, intensity);
        // 광원의 위치 세팅
        light.position.set(-1, 2, 4);
        // 생성한 광원을 scene 객체의 구성요소로 추가함
        this._scene.add(light);
    }
    _setupModel() {
        // 정육면체 형상을 정의하기 위해 BoxGeometry 클래스를 이용해 geometry 객체 생성
        // BoxGeometry는 3개의 인자값을 갖는데, (가로, 세로, 깊이) 
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        // 파란색 계열의 재질을 생성하기 위함
        const material = new THREE.MeshPhongMaterial({color: 0x44a88});
          
        // geometry, material 객체를 통해서 Mesh가 생성됨
        // 생성한 mesh를 cube라는 상수에 담음
        const cube = new THREE.Mesh(geometry, material);
      
        // cube를 scene 객체의 구성요소로 추가
        this._scene.add(cube);
        // cube를 다른 메서드에서 참조할 수 있도록 this._cube로 필드화 해줌 
        this._cube = cube;
    }
    resize() {
        // this._divContainer 의 크기를 얻어옴
        // this._divContainer 는 id가 webgl-container인 div
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        
        // 그 div 크기 얻어와서 카메라의 속성값 설정해줌
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        
        // 렌더러의 크기 설정해줌
        this._renderer.setSize(width, height);
    }
    render(time) {
        // 렌더러가 scene을 카메라의 시점을 이용해 렌더링 하라는 코드
        this._renderer.render(this._scene, this._camera);
        // update 메서드 안에서 속성값을 변경함(애니메이션 효과)
        this.update(time);
        // render 메서드가 무한으로 반복해서 호출될 수 있도록 함(적당한 시점에 최대한 빠르게)
        requestAnimationFrame(this.render.bind(this));
    }
    update(time) {
        // 전달받은 time에 0.001을 곱해 ms단위를 s단위로 변환해줌
        time *= 0.001;
        // this._cubes: _setupModel에서 만들어둔 정육면체 mesh
        // 이 큐브의 x, y축의 회전값에 time값을 지정
        // 시간은 계속 변하니까 x, y축으로 큐브가 계속 회전함
        this._cube.rotation.x = time;
        this._cube.rotation.y = time;
    }
    
}

window.onload = function() {
    new App();
}