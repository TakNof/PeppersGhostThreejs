import * as THREE from "three";

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { PeppersGhostEffect } from 'three/addons/effects/PeppersGhostEffect.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const clock = new THREE.Clock();
let mixer;

const loader = new FBXLoader();
loader.load( 'Walking.fbx', function ( object ) {

    mixer = new THREE.AnimationMixer( object );

    const action = mixer.clipAction( object.animations[ 0 ] );
    action.play();

    object.traverse( function ( child ) {

        if ( child.isMesh ) {

            child.castShadow = true;
            child.receiveShadow = true;
        }

    } );

    object.scale.set(0.1,0.1,0.1);
    object.position.z = -20;
    object.position.y = -20;

    scene.add( object );

} );



scene.add(createLight(0xFFFFFF, 1, {x: 0, y: 50, z: 20}));
scene.add(createLight(0xFFFFFF, 1, {x: 0, y: 50, z: 40}))

camera.position.y = 0;

scene.position.y = camera.position.y;

const effect = new PeppersGhostEffect( renderer );
effect.setSize( window.innerWidth, window.innerHeight );
effect.cameraDistance = 50;
effect.setSize(window.innerWidth, window.innerHeight);

window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    effect.setSize( window.innerWidth, window.innerHeight );
}

let t = 0;
function animate() {
	requestAnimationFrame( animate );

    t += 0.01;

    const delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );

    effect.render( scene, camera );
    // controls.update();
}
animate();

function createTexture(rute, height = 1, width = 1){
    let texture = new THREE.TextureLoader().load(rute);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(height, width); 

    return texture;
}

function createLight(color, intensity, position = {x: 0, y: 0, z: 0}){
    let light = new THREE.PointLight(color, intensity);
    light.position.set(position.x, position.y, position.z);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024; // default
    light.shadow.mapSize.height = 1024; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    light.shadow.focus = 1; // default
    return light;
}
