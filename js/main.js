var scene;
var camera;
var renderer;
var cameraControl;
var raycaster;
var mouse = new THREE.Vector2();
var INTERSECTED;
var objects = [];

var material = new THREE.MeshPhongMaterial({
    specular: 0x222222,
    shininess: 335,
});

var material2 = new THREE.MeshBasicMaterial({
    color: 0xffffff
});


function createRenderer(){
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.antialias = true;
    renderer.shadowMap.enabled = true;
}

function createCamera(){
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth/window.innerHeight,
        0.1, 1000);
    camera.position.x = -1.653598529895672;
    camera.position.y = 4.551449199245734;
    camera.position.z = 23.271225195262303;
    camera.lookAt(scene.position);

    cameraControl = new THREE.OrbitControls(camera);
}

function createLight(){
    var light = new THREE.HemisphereLight( 0xf6f6f7, 0x737475, 1 );
    scene.add(light);

}

function loadModel(){

    var material2 = new THREE.MeshBasicMaterial({
        color: 0x000000
    });

    var loader = new THREE.OBJLoader();
    loader.load('assets/3d/WikipediaGlobeFrontCleanup.obj', function(object){ //
        object.traverse(function(child){
           if(child instanceof THREE.Mesh){
               child.material = material2;
               if(!child.name.startsWith("Letter")){
                   //console.log('detected');
                   child.material = material;
               }
           }
        });
        objects.push(object);
        scene.add(object);
        $('.lds-circle').hide();
        initialCameraAnimation();
    },
        // called when loading is in progresses
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );

        })
}

function init(){
    scene = new THREE.Scene();

    createRenderer();
    createCamera();
    loadModel();
    createLight();


    raycaster = new THREE.Raycaster();

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    document.body.appendChild(renderer.domElement);
    render();
}

function render(){

    // find intersections
    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( objects,true );


    // Si la souris est sur 1 ou plusieurs objets
    if ( intersects.length > 0 ) {

        // Si on a déja pointé un objet mais qu'il est différent de l'actuel = changement
        if ( INTERSECTED != intersects[0].object ) {

            if ( INTERSECTED ) {
                if(!INTERSECTED.name.startsWith("Letter")) {
                    INTERSECTED.material = material;
                }
            }

            INTERSECTED = intersects[0].object;

            if(!INTERSECTED.name.startsWith("Letter")) {

                INTERSECTED.currentMat = INTERSECTED.material;
                //INTERSECTED.material.emissive.setHex( 0x0000ff );
                INTERSECTED.material = material2;
                console.log(INTERSECTED);
            }else{
                console.log(INTERSECTED);
                console.log(INTERSECTED.parent);
            }
        }

    } else { //sinon, on reste sur le meme objet
        //si il est déjà setté
        if ( INTERSECTED ) {
            if(!INTERSECTED.name.startsWith("Letter")) {
                INTERSECTED.material = material;
            }
        }
        INTERSECTED = null;
    }

    TWEEN.update();
    cameraControl.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    //console.log(mouse);
}

function initialCameraAnimation(){

        var from = {
            x: -1.9390962373240408,
            y: -1.7412455589894171,
            z: 22.43034707011225
        };

        var to = {
            x: -1.7580389878229858,
            y: 4.811267298128241,
            z: 18.67066012709722
        };

        var tween = new TWEEN.Tween(from)
            .to(to, 3000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function () {
                camera.position.set(this.x, this.y, this.z);
                camera.lookAt(new THREE.Vector3(0, 0, 0));
            })
            .onComplete(function () {
                camera.lookAt(new THREE.Vector3(0, 0, 0));
            })
            .start();
}

function returnToInitialPosition(){

    var from = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };

    var to = {
        x: -1.7580389878229858,
        y: 4.811267298128241,
        z: 18.67066012709722
    };

    var tween = new TWEEN.Tween(from)
        .to(to, 3000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function () {
            camera.position.set(this.x, this.y, this.z);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        })
        .onComplete(function () {
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        })
        .start();
}

$('h1').click(function(){
    returnToInitialPosition();
});

init();
