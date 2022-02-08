import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'; // THREE.js를 사용하기 위한 패키지 추가.
// import * as dat from 'https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js'; // gui 컨트롤러 생성.
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'; // 사용자 컨트롤러를 위한 패키지 추가.
// import { gsap } from 'https://unpkg.com/gsap@3.9.1/index.js'; // 애니메이션 스무스하게 표현하기.

// textures.
const earth_daymap_8k_base_color = base_color;

// 1. 백틱으로 묶어두고 void main()을 하게된다면 안에 내용 값을 브라우저는 독자적 프로그램으로 인식하고 프로그램을 실행 시켜준다.
// 2. vertex shader 는 표면 캔바스에 그리기위한 점들의 집합체이다. 이 집합체는 하나의 공간을 만들고 내부 fragment shader를 그릴수 있는 뼈대를 제공해준다.
// 3. fragment shader는 vertex shader로 잡아준 뼈대 안의 공간을 의미한다. 그 공간을 2D vector값을 가진 uv에 색 또는 이미지를 칠할수있다.

// #region don't use third party programs only use custom shaders.

// custom vertex shader.
const MY_VERTEX_SHADER = `
varying vec2 vertexUV;
varying vec3 vertexNormal;
void main()
{
    vertexUV = uv;
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
// custom Fragment shader.
const MY_FRAGMENT_SHADER = `
uniform sampler2D globeTexture;
varying vec2 vertexUV;
varying vec3 vertexNormal;
void main()
{
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(0.25, 0.75, 1.0) * pow(intensity, 1.5);
    gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 1.0);
}
`;
// custom Atmosphere vertex shader.
const MY_ATMOSPHERE_VERTEX_SHADER = `
varying vec3 vertexNormal;
void main()
{
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.9);
}
`;
// custom Atmosphere fragment shader.
const MY_ATMOSPHERE_FRAGMENT_SHADER = `
varying vec3 vertexNormal;
void main()
{
    float intensity = pow(0.6 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
}
`;

// #endregion
class App{
    // THREE.js 구조 설계.
    constructor(){
     
        const divContainer = document.querySelector("#webg1-container");
        this._divContainer = divContainer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);

        // Three.js를 사용하기 위해 렌더링 방식을 정희 및 모니터 디바이스 픽셀 균형을 가져오고 #webg1-container 안에 그리기를 설정.
        // 안티 알리아스 활성화된다.
        const renderer = new THREE.WebGLRenderer({antialias : true});
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        // THREE.js setup functions.
        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        this._setupRaycaster();

        // Three.js 리사이징 가능 설정.
        window.onresize = this.resize.bind(this);
        this.resize();
        // Three.js 초당 프레임 마다 애니메이션 설정.
        requestAnimationFrame(this.render.bind(this));


    }


    // THREE.js 유저의 마우스를 통한 카메라 컨트롤러.
    _setupControls(){
        const controls = new OrbitControls(this._camera, this._divContainer);
        controls.enablePan = false;
        controls.enableZoom = true;
        controls.zoomSpeed = 0.35;
        controls.minDistance = 2.5;
        controls.maxDistance = 3.75;
        controls.update();
    }

    // THREE.js 라이트 셋업.
    _setupLight(){
        // const color = 0xFFFFFF;
        // const intensity = 1000;
        // const light = new THREE.DirectionalLight(color, intensity);
        // light.position.set(3, 60, 60);
        // this._scene.add(light);
    }

    // THREE.js 카메라 셋업.
    _setupCamera(){
        const fov = 40;
        const aspect = (window.innerWidth / window.innerHeight);  // the canvas default
        const near = 0.01;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 3.5;
        this._camera = camera;
    }

    // THREE.js 3D 모델 셋업.
    _setupModel(){
        const textureLoader = new THREE.TextureLoader();
        //color
        const colorTexture = textureLoader.load(earth_daymap_8k_base_color);
        colorTexture.encoding = THREE.sRGBEncoding
        // #region create a sphere.
        const sphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(1, 64, 64),
            new THREE.ShaderMaterial({
                vertexShader : MY_VERTEX_SHADER,
                fragmentShader : MY_FRAGMENT_SHADER,
                uniforms : {
                    globeTexture: {
                        value : colorTexture 
                    } 
                }
            })
        );
        // #endregion

        // #region create an Atmosphere.

        const Atmosphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(1, 64, 64),
            new THREE.ShaderMaterial({
                vertexShader : MY_ATMOSPHERE_VERTEX_SHADER,
                fragmentShader : MY_ATMOSPHERE_FRAGMENT_SHADER,
                blending : THREE.AdditiveBlending,
                side : THREE.BackSide
            })
        )

        Atmosphere.scale.set(1.1,1.1,1.1);

        // #endregion

        // #region add pin Mesh.

        // 1. fox_news Mesh settings.
        const fox_mesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(0.015 ,64, 64),
            new THREE.MeshBasicMaterial({ color : 0xff0000 }),
        );
        this._foxmesh = fox_mesh;
        // 2. nittere_news Mesh settings.
        const nittere_mesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(0.015 ,64, 64),
            new THREE.MeshBasicMaterial({ color : 0xffff00 })
        );
        this._nitteremesh = nittere_mesh;
        // 3. mbc Mesh settings.
        const mbc_mesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(0.015 ,64, 64),
            new THREE.MeshBasicMaterial({ color : 0xffffff })
        );
        this._mbcmesh = mbc_mesh;
        // 4. cctv Mesh settings.
        const cctv_mesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(0.015 ,64, 64),
            new THREE.MeshBasicMaterial({ color : 0x00ff00 })
        );
        this._cctv_mesh = cctv_mesh;
        // 5. bbc Mesh settings.
        const bbc_mesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(0.015 ,64, 64),
            new THREE.MeshBasicMaterial({ color : 0x00ffff })
        );
        this._bbc_mesh = bbc_mesh;
        // location Cylindrical coordinates function.

        function convertLatLngToCartesian(p)
        {
            const lat = (p.lat) * Math.PI / 180;
            const lng = (p.lng) * Math.PI / 180;
            
            const x = Math.cos(lng) * Math.sin(lat);
            const y = Math.sin(lng) * Math.sin(lat);
            const z = Math.cos(lat);

            return { x,y,z }
        }

        // world wide news latitute lists.

        const fox_news_location = { lat : 40.730610, lng : 73.935242 }; // USA fox news.
        const nittere_news_location = { lat :  121.952832, lng : 136.939478 }; // japan nittere news.
        const mbc_news_location = { lat :  128.952832, lng : 127.939478 }; // korea mbc news.
        const cctv_news_location = { lat :  132.952832, lng : 117.939478 }; // china cctv news.
        const bbc_news_location = { lat : 89.430610, lng : 51.935242 }; // uk bbc news.

        // get [ fox news ] space world matrix position.
        const fox_new_pos = convertLatLngToCartesian(fox_news_location);
        // get [ nittere news ] space world matrix position.
        const nittere_pos = convertLatLngToCartesian(nittere_news_location);
        // get [ mbc news ] space world matrix position.
        const mbc_pos = convertLatLngToCartesian(mbc_news_location);
        // get [ cctv news ] space world matrix position.
        const cctv_pos = convertLatLngToCartesian(cctv_news_location);
        // get [ cctv news ] space world matrix position.
        const bbc_pos = convertLatLngToCartesian(bbc_news_location);

        // set [ fox news ] space world matrix position.
        fox_mesh.position.set(fox_new_pos.x, fox_new_pos.y, fox_new_pos.z);
        // set [ nittere news ] space world matrix position.
        nittere_mesh.position.set(nittere_pos.x, nittere_pos.y, nittere_pos.z);
        // set [ mbc news ] space world matrix position.
        mbc_mesh.position.set(mbc_pos.x, mbc_pos.y, mbc_pos.z);
        // set [ cctv news ] space world matrix position.
        cctv_mesh.position.set(cctv_pos.x, cctv_pos.y, cctv_pos.z);
        // set [ bbc news ] space world matrix position.
        bbc_mesh.position.set(bbc_pos.x, bbc_pos.y, bbc_pos.z);


        this._scene.add(fox_mesh);
        this._scene.add(nittere_mesh);
        this._scene.add(mbc_mesh);
        this._scene.add(cctv_mesh);
        this._scene.add(bbc_mesh);

        // #endregion

        // #region grouping earth meshes.



        const group = new THREE.Group;
        group.add(sphere);
        group.add(Atmosphere);

        // located place mesh add settings.
        group.add(fox_mesh);
        group.add(nittere_mesh);
        group.add(mbc_mesh);
        group.add(cctv_mesh);
        group.add(bbc_mesh);

        this._scene.add(group);
        this.earth_group = group;
        
        // #endregion

    }

    // THREE.js Raycast Interaction. python 함수와 함꼐 연결해야할 파트 !!!!!!
    _setupRaycaster(){
        const pointer = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();

        function onPointerMove( event ) {

            // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components
        
            pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
        }

        window.addEventListener('mousemove', (e) => onPointerMove(e));

        // mouse click.
        let currentMesh = null;
        const mouseClick = () =>{
            if(this._currentMesh)
            {
                switch (this._currentMesh.object)
                {
                    case this._bbc_mesh:
                        show_news('EK');
                        break;
                    
                    case this._foxmesh:
                        show_news('America');
                        break;
                    
                    case this._cctv_mesh:
                        show_news('China');
                        break;

                    case this._mbcmesh:
                        show_news('Korea');
                        break;

                    case this._nitteremesh:
                        show_news('Japan');
                        break;
                    
                    default:
                        console.log('올바른 국가를 선택해 주세요.');
                        break;
                }
            }
        }
        window.addEventListener('click', () => mouseClick());

        const mesh_collections = [this._foxmesh, this._nitteremesh, this._mbcmesh, this._cctv_mesh, this._bbc_mesh]

        this._raycaster = raycaster;
        this._pointer = pointer;
        this._mesh_collections = mesh_collections;
        this._currentMesh = currentMesh;

    }

    // THREE.js 리사이즈.
    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    // THREE.js 카메라 시점에서 렌더링을 하라는 명령이다.
    render(time){

        //raycaster setup.
        this._raycaster.setFromCamera(this._pointer, this._camera);
        const raycasterCollections = this._raycaster.intersectObjects(this._mesh_collections);
        
        // 메쉬 레이캐스팅이 비활성화 일떄.
        for (const original of this._mesh_collections)
        {
            original.material.color.set("red");
            original.scale.set(1, 1, 1);
        }
        // 메쉬 레이캐스팅이 활성화 일떄.
        for (const collection of raycasterCollections)
        {
            collection.object.material.color.set('pink');
            collection.object.scale.set(1.25, 1.25, 1.25);
        }

        if (raycasterCollections.length)
        {
            this._currentMesh = raycasterCollections[0];
        }
        else
        {
            this._currentMesh = null;
        }

        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    // THREE.js 모델을 시간값과  곱하여 회전 시킨다.
    update(time){
        time *= 0.00005; // secound unit
        this.earth_group.rotation.y = time;
    }
}

// 윈도우가 실행 되었을 때 App constructor 함수값이 실행된다.
window.onload = function(){
    new App();
}
