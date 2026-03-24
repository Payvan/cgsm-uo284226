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
    camera.position.set( 0, 0, 300 );

    const mapUrl = "../textures/earth.png";   // The file used as texture
    const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
    const map = textureLoader.load( mapUrl, ( loaded ) => { renderer.render( scene, camera ); } );
    const material = new THREE.MeshPhongMaterial( { map: map } );
    
    // Creamos una esfera y le ponemos la textura de la tierra
    const geometry = new THREE.SphereGeometry( 50, 32, 32 );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.rotation.set( Math.PI / 5, Math.PI / 5, 0 );
    sphere.position.set( 0, 0, -300 );
    scene.add( sphere );

    //Añadimos una luz de tipo PointLight que incida de forma lateral sobre las esferas
    const light = new THREE.PointLight( 0xffffff, 100000 );
    light.position.set( 150, 0, 0 );
    scene.add( light );

    renderer.render( scene, camera );


}