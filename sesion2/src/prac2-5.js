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

    const mapUrl = "../textures/earth.png";   // The file used as texture
    const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
    const map = textureLoader.load( mapUrl, ( loaded ) => { renderer.render( scene, camera ); } );
    const material = new THREE.MeshPhongMaterial( { map: map } );
    
    // Creamos una esfera y le ponemos la textura de la tierra
    const earthSize = 50;
    const geometry = new THREE.SphereGeometry( earthSize, 32, 32 );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.rotation.set( Math.PI / 5, Math.PI / 5, 0 );
    sphere.position.set( 0, 0, -100 );
    

    // Creamos la textura de la atmosfera y la aplicamos a una esfera un poco más grande que la de la tierra
    const mapUrl2 = "../textures/atmosphere.png";   // The file used as texture
    const map2 = textureLoader.load( mapUrl2, ( loaded ) => { renderer.render( scene, camera ); } );
    const material2 = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map: map2, transparent: true } );
    const geometry2 = new THREE.SphereGeometry( earthSize + 1, 32, 32 );
    const atmosphere = new THREE.Mesh( geometry2, material2 );
    atmosphere.rotation.set( Math.PI / 5, Math.PI / 5, 0 );
    atmosphere.position.set( 0, 0, -100 );
    
    
    // Añadimos la esfera de la tierra y la atmosfera a un grupo y lo rotamos 0.36 radianes sobre el eje z
    const earthGroup = new THREE.Group();
    earthGroup.add( sphere );
    earthGroup.add( atmosphere );
    earthGroup.rotation.z = 0.36;

    scene.add( earthGroup );
    
    // Añadimos la esfera de la luna, a una escala 0.27 respecto a la tierra, y a una distancia de 150 unidades a la tierra
    const moonMapUrl = '../textures/moon.png';
    const moonMap = textureLoader.load( moonMapUrl, ( loaded ) => { renderer.render( scene, camera ); } );
    const moon_material = new THREE.MeshLambertMaterial( { map: moonMap, color: 0x888888 } );
    
    const geometry3 = new THREE.SphereGeometry( earthSize * 0.27, 32, 32 );
    const moon = new THREE.Mesh( geometry3, moon_material );
    const distance = 60000;

    // Move the Moon away from the coordinate origin (the Earth)
    // NOT TO SCALE. Real value: Math.sqrt( distance * distance / 2 )
    moon.position.set( Math.sqrt( distance / 2 ), 0, -Math.sqrt( distance / 2 ) );
    
    // Rotate the Moon to face visible side to the Earth (tidal locking)
    moon.rotation.y = Math.PI;

    // Moon should rotate around the Earth: an Object3D is needed
    const moonGroup = new THREE.Object3D( );
    moonGroup.add( moon );

    // The Moon orbit is a bit tilted
    moonGroup.rotation.x = 0.089

    scene.add( moonGroup );
    

    //Añadimos una luz de tipo PointLight que incida de forma lateral sobre las esferas
    const light = new THREE.PointLight( 0xffffff, 100000 );
    light.position.set( 50, 0, 100 );
    scene.add( light );
    

    renderer.render( scene, camera );


}