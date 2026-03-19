import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';


if ( WEBGL.isWebGL2Available() ) {

    window.addEventListener( 'resize', ( ) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix( );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.render( scene, camera );
    }, false );

    const scene = new THREE.Scene();
    
    const renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 0, 0, 400 );


    // Cubo rojo
    const geometry = new THREE.BoxGeometry( 100, 100, 100 );
    const material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    const box = new THREE.Mesh( geometry, material );
    box.position.set( -150, 0, -500 );
    scene.add( box );


    // Cilindro azul
    const geometry2 = new THREE.CylinderGeometry( 50, 50, 100, 32 );
    const material2 = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
    const cylinder = new THREE.Mesh( geometry2, material2 );    
    cylinder.position.set( 0, 0, -500 );
    cylinder.rotation.set( Math.PI / 5, Math.PI / 5, 0 );
    scene.add( cylinder );

    // Esfera azul
    const geometry3 = new THREE.SphereGeometry( 50, 32, 32 );
    const material3 = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const sphere = new THREE.Mesh( geometry3, material3 );
    sphere.position.set( 150, 0, -500 );
    scene.add( sphere );
    
    renderer.render( scene, camera );


}

