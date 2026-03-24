import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

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
    camera.position.set( 100, 0, 800 );

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
    
    // Creamos el shader de sol
    const NOISEMAP = '../textures/sun_noise.png';
    const SUNMAP = '../textures/sun.png';
    const sunTextureLoader = new THREE.TextureLoader( );
    const uniforms = {
        "fogDensity": { value: 0 },
        "fogColor": { value: new THREE.Vector3( 0, 0, 0 ) },
        "time": { value: 1.0 },
        "uvScale": { value: new THREE.Vector2( 3.0, 1.0 ) },
        "texture1": { value: sunTextureLoader.load( NOISEMAP ) },
        "texture2": { value: sunTextureLoader.load( SUNMAP ) }
    };

    uniforms[ "texture1" ].value.wrapS = uniforms[ "texture1" ].value.wrapT = THREE.RepeatWrapping;
    uniforms[ "texture2" ].value.wrapS = uniforms[ "texture2" ].value.wrapT = THREE.RepeatWrapping;
    
    const vertexShader = require( '../shaders/vertex.glsl' );
    const fragmentShader = require( '../shaders/fragment.glsl' );

    const sunMaterial = new THREE.ShaderMaterial( {
        uniforms,
        vertexShader,
        fragmentShader
    } );
    // Creamos una esfera para el sol en el mismo punto que la luz, 5 veces el tamaño de la tierra y le ponemos el shader creado
    const sunGeometry = new THREE.SphereGeometry( earthSize * 5, 32, 32 );
    const sun = new THREE.Mesh( sunGeometry, sunMaterial );
    sun.position.set( 800, 0, 0 );
    scene.add( sun );


    // ISS modelo 3D
    const modelUrl = "../models/iss.dae";
    let iss;

    const loadingManager = new THREE.LoadingManager( ( ) => {

        scene.add( iss );
        console.log( 'Model loaded' );
    } );

    const loader = new ColladaLoader( loadingManager );
    loader.load( modelUrl, ( collada ) => {

        iss = collada.scene;
        iss.scale.x = iss.scale.y = iss.scale.z = 0.3;
        iss.rotation.set( Math.PI / 5, Math.PI / 5, 0 );
        iss.updateMatrix( );
    } );

    //Añadimos una luz de tipo PointLight que incida de forma lateral sobre las esferas
    const light = new THREE.PointLight( 0xffffff, 600000 );
    light.position.set( 800, 0, 0);
    scene.add( light );
    

    renderer.render( scene, camera );

    const clock = new THREE.Clock( );

    function animate( ) {

        const delta = clock.getDelta( ); // Elapsed time in seconds

        // UPDATE THE SCENE ACCORDING TO THE ELAPSED TIME
        const rotation = ( delta * Math.PI * 2 ) / 24;
        sphere.rotation.y += rotation;
        atmosphere.rotation.y += rotation * 0.95;

        // Animamos la rotación de la luna alrededor de la tierra a una velocidad de 28 dias
        const moonRotation = ( delta * Math.PI * 2 ) / 28;
        moonGroup.rotation.y += moonRotation;

        // Animamos el shader del sol
        uniforms[ "time" ].value += 0.2 * delta;

        // Añadimos la rotacion del sol sobre su eje a una velocidad de 27 dias
        const sunRotation = ( delta * Math.PI * 2 ) / 27;
        sun.rotation.y += sunRotation;
        

        // Render the scene
        renderer.render( scene, camera );

        // Request the browser to execute the animation-rendering loop
        requestAnimationFrame( animate );
    };

    animate( );


}