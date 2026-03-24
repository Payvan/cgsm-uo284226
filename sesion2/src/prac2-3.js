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
    sphere.position.set( 0, 0, -100 );
    scene.add( sphere );


    // Creamos la textura de la atmosfera y la aplicamos a una esfera un poco más grande que la de la tierra
    const mapUrl2 = "../textures/atmosphere.png";   // The file used as texture
    const map2 = textureLoader.load( mapUrl2, ( loaded ) => { renderer.render( scene, camera ); } );
    const material2 = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map: map2, transparent: true } );
    const geometry2 = new THREE.SphereGeometry( 51, 32, 32 );
    const atmosphere = new THREE.Mesh( geometry2, material2 );
    atmosphere.rotation.set( Math.PI / 5, Math.PI / 5, 0 );
    atmosphere.position.set( 0, 0, -100 );
    scene.add( atmosphere );

    //Añadimos una luz de tipo PointLight que incida de forma lateral sobre las esferas
    const light = new THREE.PointLight( 0xffffff, 100000 );
    light.position.set( 150, 0, 0 );
    scene.add( light );

    renderer.render( scene, camera );


}