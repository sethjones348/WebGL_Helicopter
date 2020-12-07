/**
 * Using a hierarchical object in three.js.  This is similar
 * to HierarchyWithTree.js.  Each piece of the robot is
 * contained within a dummy object that is unscaled and only
 * rotates about its own center.  The visible object can then
 * be scaled without affecting the scales of its child
 * objects, and it can be shifted within the dummy object
 * to make it appear to rotate about a point other than its
 * center.
 *
 * Use a/A, s/S, t/T to rotate arm, shoulder, or torso.
 */
var helicopterBodyDummy;
var landingPadDummy;
var rotorHubDummy;
var rotorBlade1Dummy;
var rotorBlade2Dummy;
var backRotor;
var increment = 15;
var object;
var scene;

//translate keypress events to strings
//from http://javascript.info/tutorial/keyboard-events
function getChar(event) {
if (event.which == null) {
 return String.fromCharCode(event.keyCode) // IE
} else if (event.which!=0 && event.charCode!=0) {
 return String.fromCharCode(event.which)   // the rest
} else {
 return null // special key
}
}

function handleKeyPress(event)
{
  var ch = getChar(event);
  switch(ch)
  {
  case 'y':
    helicopterBodyDummy.rotateY(15 * Math.PI / 180);
    break;
  case 'Y':
    helicopterBodyDummy.rotateY(-15 * Math.PI / 180);
    break;
  case 'p':
    rotorBlade1Dummy.rotateY(-15 * Math.PI / 180);
    rotorBlade2Dummy.rotateY(-15 * Math.PI / 180);
    break;
  case 'P':
    rotorBlade1Dummy.rotateY(15 * Math.PI / 180);
    rotorBlade2Dummy.rotateY(15 * Math.PI / 180);
    break;
  case 'r':
    increment += 5;
    break;
  case 'R':
    increment += -5;
    break;
  case 'w':
    helicopterBodyDummy.position.set(helicopterBodyDummy.position.x, helicopterBodyDummy.position.y + 1, helicopterBodyDummy.position.z);
    break;
  case 'a':
    helicopterBodyDummy.position.set(helicopterBodyDummy.position.x, helicopterBodyDummy.position.y, helicopterBodyDummy.position.z - 1);
    break;
  case 's':
    helicopterBodyDummy.position.set(helicopterBodyDummy.position.x, helicopterBodyDummy.position.y - 1, helicopterBodyDummy.position.z);
    break;
  case 'd':
    helicopterBodyDummy.position.set(helicopterBodyDummy.position.x, helicopterBodyDummy.position.y, helicopterBodyDummy.position.z + 1);
    break;
  case 'f':
    helicopterBodyDummy.position.set(helicopterBodyDummy.position.x + 1, helicopterBodyDummy.position.y, helicopterBodyDummy.position.z);
    break;
  case 'b':
    helicopterBodyDummy.position.set(helicopterBodyDummy.position.x -1, helicopterBodyDummy.position.y, helicopterBodyDummy.position.z);
    break;
    default:
      return;
  }
}

function start()
{
  window.onkeypress = handleKeyPress;

  scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1.5, 0.1, 1000 );
  camera.position.x = 20;
  camera.position.y = 20;
  camera.position.z = 20;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var ourCanvas = document.getElementById('theCanvas');

  var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});
  renderer.setClearColor(0xffffff);

  let controls = new THREE.OrbitControls(camera, ourCanvas);
  controls.addEventListener('change', renderer);

  let materialArray = [];

  let texture_ft = new THREE.TextureLoader().load('./images/arid2_ft.jpg');
  let texture_bk = new THREE.TextureLoader().load('./images/arid2_bk.jpg');
  let texture_up = new THREE.TextureLoader().load('./images/arid2_up.jpg');
  let texture_dn = new THREE.TextureLoader().load('./images/arid2_dn.jpg');
  let texture_rt = new THREE.TextureLoader().load('./images/arid2_rt.jpg');
  let texture_lf = new THREE.TextureLoader().load('./images/arid2_lf.jpg');
  
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_up}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_rt}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_lf}));

  for(let i=0; i<6; i++){
    materialArray[i].side = THREE.BackSide;
  }

  let skyBoxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
  let skyBox = new THREE.Mesh(skyBoxGeo, materialArray);
  scene.add(skyBox);


  landingPadDummy = new THREE.Object3D();

  var landingPad = makeRectangle();
  landingPad.position.set(0, -5, 0);
  landingPad.scale.set(20, 0.5, 20);
  landingPad.material = getLandingPadTexture();
  landingPadDummy.add(landingPad);

  var tower = makeTower();
  scene.add(tower);

  helicopterBodyDummy = new THREE.Object3D();

  var helicopterBody = makeRectangle();
  helicopterBody.position.set(0, -1, 0);
  helicopterBody.scale.set(6, 3.5, 3.5)
  helicopterBody.material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
  helicopterBodyDummy.add(helicopterBody);

  var cockpit = makeCylinder(1.75, 3.49);
  cockpit.rotateX(Math.PI/2);
  cockpit.material = new THREE.MeshLambertMaterial( { color: 0x0 } );
  cockpit.position.set(3, -1, 0);
  cockpit.scale.set(1.5, 1, 1);
  helicopterBodyDummy.add(cockpit);

  var helicopterBack = makeCylinder(1.75, 3.49);
  helicopterBack.rotateX(Math.PI/2);
  helicopterBack.material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
  helicopterBack.position.set(-3, -1, 0);
  helicopterBack.scale.set(0.5, 1, 1);
  helicopterBodyDummy.add(helicopterBack);

  var helicopterTail = makeRectangle();
  helicopterTail.position.set(-5, 0, 0);
  helicopterTail.scale.set(8, 1, 0.5);
  helicopterTail.material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
  helicopterBodyDummy.add(helicopterTail);

  var helicopterTailTip = makeRectangle();
  helicopterTailTip.position.set(-8.75, 1, 0);
  helicopterTailTip.scale.set(0.5, 2, 0.5);
  helicopterTailTip.material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
  helicopterBodyDummy.add(helicopterTailTip);

  var backRotorDummy = new THREE.Object3D();
  helicopterBodyDummy.add(backRotorDummy);

  backRotor = makeRotor();
  backRotor.rotateZ(90 * Math.PI / 180);
  backRotor.rotateX(90 * Math.PI / 180);
  backRotor.position.set(-8.75, 2, 0.25);
  backRotor.scale.set(1.5, 0.25, 0.25);
  backRotorDummy.add(backRotor);

  rotorHubDummy = new THREE.Object3D();
  rotorHubDummy.position.set(0, 1.5, 0);
  helicopterBodyDummy.add(rotorHubDummy);

  var rotorHub = makeRotatorHub();
  rotorHub.scale.set(1, 2, 1);
  rotorHub.rotateZ(90 * Math.PI / 180);
  rotorHubDummy.add(rotorHub);

  var rotorHubTip = makeRotorHubTip();
  rotorHubTip.position.set(1, 0, 0);
  rotorHubDummy.add(rotorHubTip);

  rotorBlade1Dummy = new THREE.Object3D();
  rotorHubDummy.add(rotorBlade1Dummy);
  
  var rotorBlade1 = makeRotor()
  rotorBlade1.rotateZ(90 * Math.PI / 180);
  rotorBlade1.position.set(0.25, 2, 0);
  rotorBlade1.scale.set(4, 0.5, 0.5);
  rotorBlade1Dummy.add(rotorBlade1);

  rotorBlade2Dummy = new THREE.Object3D();
  rotorHubDummy.add(rotorBlade2Dummy);

  var rotorBlade2 = makeRotor()
  rotorBlade2.rotateZ(90 * Math.PI / 180);
  rotorBlade2.position.set(0.25, -2, 0);
  rotorBlade2.scale.set(4, 0.5, 0.5);
  rotorBlade2Dummy.add(rotorBlade2);

  rotorHubDummy.rotateZ(Math.PI/2);

  var leg1 = makeRectangle();
  leg1.scale.set(0.5, 0.5, 4);
  leg1.position.set(0, -2.5, 1.49);
  leg1.rotateX(90 * Math.PI/180);
  helicopterBodyDummy.add(leg1);

  var leg2 = makeRectangle();
  leg2.scale.set(0.5, 0.5, 4);
  leg2.position.set(0, -2.5, -1.49);
  leg2.rotateX(90 * Math.PI/180);
  helicopterBodyDummy.add(leg2);

  var foot1 = makeRectangle();
  foot1.scale.set(4, 0.5, 0.5);
  foot1.position.set(0, -4.5, 1.49);
  foot1.rotateX(90 * Math.PI/180);
  helicopterBodyDummy.add(foot1);

  var foot2 = makeRectangle();
  foot2.scale.set(4, 0.5, 0.5);
  foot2.position.set(0, -4.5, -1.49);
  foot2.rotateX(90 * Math.PI/180);
  helicopterBodyDummy.add(foot2);

  // add torso dummy to the scene
  scene.add( helicopterBodyDummy );
  scene.add( landingPadDummy );

  var light = new THREE.PointLight(0xffffff, 1.0);
  light.position.set(2, 3, 5);
  scene.add(light);

  light = new THREE.AmbientLight(0x555555);
  scene.add(light);

  var towerLight = new THREE.PointLight(0xffffff);
  light.position.set(-100,200,100);
  scene.add(towerLight);

  var render = function () {
    rotorHubDummy.rotateX(increment *  Math.PI / 180);
    backRotor.rotateY(-increment * Math.PI / 180)

    requestAnimationFrame( render );
    renderer.render(scene, camera);
  };

  render();
}

function makeRotatorHub() {
  var geometry = new THREE.CylinderBufferGeometry(1, 0.75, 1, 50);
  var material = new THREE.MeshLambertMaterial( { color: 0x3e3e3e } );

  return new THREE.Mesh(geometry, material);
}

function makeRectangle() {
  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshLambertMaterial( { color: 0x3e3e3e } );

  return new THREE.Mesh(geometry, material);
}

function makeCylinder(radius, height){
	var geometry = new THREE.CylinderBufferGeometry(radius, radius, height, 50);
	var material = new THREE.MeshLambertMaterial( { color: 0xbbbbbb } );

	return new THREE.Mesh(geometry, material);
}

function makeRotorHubTip() {
  var geometry = new THREE.SphereBufferGeometry(0.75, 30, 30);
  var material = new THREE.MeshLambertMaterial( { color: 0xbbbbbb } );
  
  return new THREE.Mesh(geometry, material);
}

function makeRotor() {
  var geometry = new THREE.CylinderBufferGeometry(1, 1, 1, 50);
  var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
  
  return new THREE.Mesh(geometry, material);
}

function getLandingPadTexture() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('./images/landingPad.jpg');    
  
  return new THREE.MeshLambertMaterial({ map:texture });
}

function makeTower() {

  function loadModel() {

    object.traverse( function ( child ) {

      if ( child.isMesh ) child.material.map = texture;

    } );

    object.position.y = -500;
    object.scale.x = 20;
    object.scale.y = 145;
    object.scale.z = 20;
    scene.add(object);

  }

  const manager = new THREE.LoadingManager( loadModel );

  manager.onProgress = function ( item, loaded, total ) {

    console.log( item, loaded, total );
    
  };

  // texture
  const textureLoader = new THREE.TextureLoader( manager );
  const texture = textureLoader.load( 'OBJ/Specular.jpeg' );

  // model

  function onProgress( xhr ) {

    if ( xhr.lengthComputable ) {

      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

    }

  }

  function onError() {}

  const loader = new THREE.OBJLoader( manager );
  loader.load( './OBJ/War_Tower.obj', function ( obj ) {

    object = obj;

  }, onProgress, onError );
  
}
