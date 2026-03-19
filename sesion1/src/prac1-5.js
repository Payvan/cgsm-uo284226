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
    camera.position.set( 50, 0, 400 );


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
    

    // Casa 2D
    const geometry4 = new THREE.BufferGeometry();

    const vertices = new Float32Array([
        // Vertices exteriores
        0, 0, 0, 
        100, 0, 0,
        100, 80, 0,
        50, 130, 0,  
        0, 80, 0,  

        // Puerta
        38, 0, 0,
        62, 0, 0,
        62, 38, 0,
        38, 38, 0,

        // Ventana izquierda
        10, 44, 0, 
        30, 44, 0,  
        30, 65, 0,
        10, 65, 0,

        // Ventana derecha
        70, 44, 0,
        90, 44, 0,
        90, 65, 0,
        70, 65, 0,

        //Vértices para rodear los huecos
        0, 38, 0,
        100, 38, 0,
        0, 44, 0,
        100, 44, 0,
        0, 65, 0,
        100, 65, 0, 
    ]);

    const indices = [
    
        // Zona izquierda de la puerta
        0, 5, 8,
        0, 8, 17,
        // Zona derecha de la puerta
        6, 1, 18,
        6, 18, 7,

        // Franja entre puerta y ventanas
        17, 18, 20,
        17, 20, 19,

    
        // Zona izquierda de la ventana izquierda
        19, 9,  12,
        19, 12, 21,
        // Zona entre las dos ventanas
        10, 13, 16,
        10, 16, 11,
        // Zona derecha de la ventana derecha
        14, 20, 22,
        14, 22, 15,

        // Franja sobre las ventanas
        21, 22, 2,
        21, 2,  4,

        // Tejado
        4, 2, 3,
    ];


    geometry4.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry4.setIndex( indices );
    

    const material4 = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    const house = new THREE.Mesh( geometry4, material4 );
    house.position.set( 200, -50, -300 );
    scene.add( house );
    renderer.render( scene, camera );


}

