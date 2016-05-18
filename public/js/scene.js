'use strict';

var scene, camera, renderer, controls;
var ogMesh, referenceMesh;
var xAxis, yAxis, zAxis;

var CAMERA = {
  fov : 45,
  near : 1,
  far : 1000,
  zoomX : 0,
  zoomY : 30,
  zoomZ : 80,
};

var CONTROLS = {
  enabled : true,
  userPan : true,
  userPanSpeed : 1,
  minDistance : 10.0,
  maxDistance : 200.0,
  maxPolarAngle : (Math.PI/180) * 80,
};

var RENDERER = {
  antialias : false,
  alpha: true
};

var modelParams = {
  scale : 1,
  spin : true,
  swap : true,
  xSize : 0,
  ySize : 0,
  zSize : 0,
  name : 'sappho',
  export : function() {
    var exporter = new THREE.OBJExporter();
    var result = exporter.parse(scene);
    post('/', result);
  },
  refresh : function() {
    scene.remove(ogMesh);
    ogMesh.geometry.dispose();/*
    twistParams['offset'] = 0;
    twistParams['x'] = 0;
    twistParams['y'] = 0;
    twistParams['z'] = 0;
    twistParams['oldOffset'] = 0;
    twistParams['oldX'] = 0;
    twistParams['oldY'] = 0;
    twistParams['oldZ'] = 0;
    sinParams['freq'] = 1;
    sinParams['ampl'] = 1;
    sinParams['offset'] = 0;
    sinParams['x'] = 'off';
    sinParams['y'] = 'off';
    sinParams['z'] = 'off';
    for (var i in gui.__folders)
      if(gui.__folders.hasOwnProperty(i))
        for (var j in gui.__folders[i].__controllers)
          if(gui.__folders[i].__controllers.hasOwnProperty(j))
            gui.__folders[i].__controllers[j].updateDisplay();
*/
    loadModel(modelParams['name']);
  }
};

function loadModel (modelName) {
  var loader = new THREE.STLLoader();
  var meshPath = 'models/'+modelName+'.stl';
  loader.load(meshPath, function (bufferGeometry) {
    var material = new THREE.MeshNormalMaterial();
    var geometry;
    if (bufferGeometry instanceof THREE.BufferGeometry) {
      geometry = new THREE.Geometry().fromBufferGeometry(bufferGeometry);
    } else {
      geometry = bufferGeometry;
    }
    ogMesh = new THREE.Mesh(geometry, material);

    ogMesh.position.set(0,0,0);
    ogMesh.geometry.dynamic = true;
    ogMesh.geometry.computeBoundingBox();
    ogMesh.geometry.center();
    calculateSize();
    //meshCopy = new THREE.Mesh(ogMesh.geometry.clone(), ogMesh.material);
    var scale = modelParams['scale'];
    ogMesh.scale.set(scale, scale, scale);
    if(modelParams['swap'] == true) {
      swapYZ();
    }
    scene.add(ogMesh);
    //calculateSize();
    //referenceMesh = new THREE.Mesh(ogMesh.geometry.clone(), ogMesh.material);
    //scene.add(referenceMesh);

  });
}

function addAxes() {
  xAxis = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial({color: 0xff0000}));
  yAxis = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial({color: 0x00ff00}));
  zAxis = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial({color: 0x0000ff}));

  xAxis.geometry.vertices.push(new THREE.Vector3(-15, 0, 0));
  xAxis.geometry.vertices.push(new THREE.Vector3( 15, 0, 0));
  yAxis.geometry.vertices.push(new THREE.Vector3(0, -15, 0));
  yAxis.geometry.vertices.push(new THREE.Vector3(0,  15, 0));
  zAxis.geometry.vertices.push(new THREE.Vector3(0, 0, -15));
  zAxis.geometry.vertices.push(new THREE.Vector3(0, 0,  15));
  scene.add(xAxis);
  scene.add(yAxis);
  scene.add(zAxis);
}

function addLights() {
  var lightAmbient = new THREE.AmbientLight(0x666666);
  var lightSource = new THREE.PointLight(0x888888);
  lightSource.position.set(0, 50, 80);
  scene.add(lightAmbient);
  scene.add(lightSource);
}

function renderScene() {
  if (ogMesh == null) {
  } else {
    var rotate = 0.02;
    if (modelParams['spin'] == true){
      ogMesh.rotation.y += rotate;
      xAxis.rotation.y += rotate;
      yAxis.rotation.y += rotate;
      zAxis.rotation.y += rotate;
    }
  }
  renderer.render( scene, camera );
}

function animateScene() {
  window.requestAnimationFrame(animateScene);
  renderScene();
  controls.update();
}

function resizeWindow() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function addToDOM(object) {
  var container = document.getElementById('canvas-body');
  container.appendChild(object);
}

function swapYZ () {
  var verts = ogMesh.geometry.vertices;
  var matrix = new THREE.Matrix4();
  if(modelParams['swap'] == true) {
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeRotationX(-Math.PI/2));
  } else {
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeRotationX(Math.PI/2));
  }
  ogMesh.geometry.verticesNeedUpdate = true;
//  updateMesh();
}

function calculateSize() {
  var verts = ogMesh.geometry.vertices;
  var minX = 0, maxX = 0;
  var minY = 0, maxY = 0;
  var minZ = 0, maxZ = 0;
  for (var i = 0; i < verts.length; i++) {
    var vert = verts[i];
    if (vert.x >= maxX) maxX = vert.x;
    if (vert.x <  minX) minX = vert.x;
    if (vert.y >= maxY) maxY = vert.y;
    if (vert.y <  minY) minY = vert.y;
    if (vert.z >= maxZ) maxZ = vert.z;
    if (vert.z <  minZ) minZ = vert.z;
  }
  modelParams['xSize'] = maxX - minX;
  modelParams['ySize'] = maxY - minY;
  modelParams['zSize'] = maxZ - minZ;
}

function initializeScene() {

  // Scene and window resize listener
  scene = new THREE.Scene();
  var canvasWidth  = window.innerWidth;
  var canvasHeight = window.innerHeight;
  window.addEventListener('resize', resizeWindow, false);

  // Camera and set initial view
  var aspectRatio  = canvasWidth/canvasHeight;
  camera = new THREE.PerspectiveCamera( CAMERA.fov, aspectRatio, CAMERA.near, CAMERA.far );
  camera.position.set( CAMERA.zoomX, CAMERA.zoomY, CAMERA.zoomZ );
  //console.log(scene.position);
  camera.lookAt(scene.position);
  scene.add(camera);

  // Add WebGL renderer to DOM
  renderer = new THREE.WebGLRenderer(RENDERER);
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor(0xddeeee);
  addToDOM(renderer.domElement);

  // OrbitControls using mouse
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  for (var key in CONTROLS) { controls[key] = CONTROLS[key]; }
  controls.addEventListener('change', renderScene);

  createGui();
  addAxes();
  addLights();
  loadModel(modelParams['name']);
}
