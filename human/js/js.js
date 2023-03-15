if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, cameraTarget, scene, renderer, texture;

var mesh, clothe1, clothe2;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
	camera.position.set( 3, 1, 3 );

	cameraTarget = new THREE.Vector3( 0, 0.3, 0 );

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x72645b, 2, 15 );


	// Ground

	var plane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( 40, 40 ),
		new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
	);
	plane.rotation.x = -Math.PI/2;
	plane.position.y = -1;
	//scene.add( plane );

	plane.receiveShadow = true;


	// ASCII file

	var loader = new THREE.STLLoader();
	loader.load( './objects/human_b.stl', function ( geometry ) {

		var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
		mesh = new THREE.Mesh( geometry, material );

		//mesh.position.set( 0, - 0.25, 0.6 );
		//mesh.rotation.set( 0, - Math.PI / 2, 0 );
		mesh.scale.set( 0.01, 0.01, 0.01 );

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		scene.add( mesh );

	} );

	var material = new THREE.MeshPhongMaterial( { color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );

	//////////////////////////////
	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {

		console.log( item, loaded, total );

	};

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	var onError = function ( xhr ) {
	};

	var texture = new THREE.Texture();
	var loader = new THREE.ImageLoader( manager );
	loader.load( './human/objects/d026_NM.jpg', function ( image ) {

		texture.image = image;
		texture.needsUpdate = true;

	} );

	var clothe_loader = new THREE.OBJLoader(manager);
	clothe_loader.load( './human/objects/female_dress.obj', function ( object ) {
		clothe1 = object;
		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material.map = texture;

			}

		} );

		object.position.set( 0, -1.2, 0.03 );
		object.scale.set(0.00122, 0.00122, 0.00122);
		scene.add( object );
		clothe1.visible = false;

	}, onProgress, onError );
	//////////////////////////////////


	//////////////////////////////////
	var manager2 = new THREE.LoadingManager();
	manager2.onProgress = function ( item, loaded, total ) {

		console.log( item, loaded, total );

	};

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	var onError = function ( xhr ) {
	};

	texture = new THREE.Texture();
	loader = new THREE.ImageLoader( manager2 );
	loader.load( './objects/d025.jpg', function ( image ) {

		texture.image = image;
		texture.needsUpdate = true;

	} );

	clothe_loader = new THREE.OBJLoader(manager2);
	clothe_loader.load( './objects/dress25.obj', function ( object ) {
		clothe2 = object;
		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material.map = texture;

			}

		} );

		object.position.set( 0, -1.2, 0.03 );
		object.scale.set(0.00122, 0.00122, 0.00122);
		scene.add( object );

	}, onProgress, onError );
	//////////////////////////////////////////////

	// Lights

	scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

	addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
	addShadowedLight( 0.5, 1, -1, 0xffaa00, 1 );
	// renderer

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( scene.fog.color );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.renderReverseSided = false;

	container.appendChild( renderer.domElement );

	// stats

	stats = new Stats();
	container.appendChild( stats.dom );

	//
	controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

	window.addEventListener( 'resize', onWindowResize, false );

}

function addShadowedLight( x, y, z, color, intensity ) {

	var directionalLight = new THREE.DirectionalLight( color, intensity );
	directionalLight.position.set( x, y, z );
	scene.add( directionalLight );

	directionalLight.castShadow = true;

	var d = 1;
	directionalLight.shadow.camera.left = -d;
	directionalLight.shadow.camera.right = d;
	directionalLight.shadow.camera.top = d;
	directionalLight.shadow.camera.bottom = -d;

	directionalLight.shadow.camera.near = 1;
	directionalLight.shadow.camera.far = 4;

	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;

	directionalLight.shadow.bias = -0.005;

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {

	var timer = Date.now() * 0.0005;

	// camera.position.x = Math.cos( timer ) * 3;
	// camera.position.z = Math.sin( timer ) * 3;

	camera.lookAt( cameraTarget );

	renderer.render( scene, camera );

}

function dress_hide(id) {
	if (id == 1) {
		clothe1.visible = true;
		clothe2.visible = false;
	} else {
		clothe1.visible = false;
		clothe2.visible = true;
	}
}