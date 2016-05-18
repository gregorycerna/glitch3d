'use strict';

var twistAxis = ['x', 'y', 'z',];

var sinAxis = ['x', 'y', 'z'];
var sinType = ['rotate', 'translate'];
var sinAxis2 = ['x', 'y', 'z'];

function degs(radians) {return radians * 180 / Math.PI;}
function radians(degrees) {return degrees * Math.PI / 180;}


function TwistGlitch(twistAxis) {
  this.axis = twistAxis;
  this.deg = 0;
  this.offset = 0;
  this.oldDeg = 0;
  this.oldOffset = 0;
  this.xSize = modelParams['xSize'];
  this.ySize = modelParams['ySize'];
  this.zSize = modelParams['zSize'];
};

TwistGlitch.prototype.glitch = function () {
  var verts = ogMesh.geometry.vertices;
  var matrix = new THREE.Matrix4();
  if(this.axis == 'x')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeRotationX(radians(this.deg*verts[i].x/this.xSize+this.offset)));
  else if (this.axis == 'y')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeRotationY(radians(this.deg*verts[i].y/this.ySize+this.offset)));
  else if (this.axis == 'z')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeRotationZ(radians(this.deg*verts[i].z/this.zSize+this.offset)));

  this.oldDeg = this.deg;
  this.oldOffset = this.offset;
};
TwistGlitch.prototype.unglitch = function() {
  var verts = ogMesh.geometry.vertices;
  var matrix = new THREE.Matrix4();
  if(this.axis == 'x')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeRotationX(radians(-this.oldDeg*verts[i].x/this.xSize-this.oldOffset)));
  else if (this.axis == 'y')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeRotationY(radians(-this.oldDeg*verts[i].y/this.ySize-this.oldOffset)));
  else if (this.axis == 'z')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeRotationZ(radians(-this.oldDeg*verts[i].z/this.zSize-this.oldOffset)));
};
/*
var sinParams = {
  freq : 1,
  ampl : 1,
  offset : 0,
  x : 'off',
  y : 'off',
  z : 'off',
};
*/
function SinGlitch (sAxis, sType, sAxis2 = '') {
  this.axis = sAxis;
  this.type = sType;
  this.axis2 = sAxis2;

  this.freq = 0;
  this.ampl = 0;
  this.offset = 0;

  this.oldFreq = 0;
  this.oldAmpl = 0;
  this.oldOffset = 0;

  this.xSize = modelParams['xSize'];
  this.ySize = modelParams['ySize'];
  this.zSize = modelParams['zSize'];

};

SinGlitch.prototype.glitch = function() {
  var verts = ogMesh.geometry.vertices;
  var matrix = new THREE.Matrix4();
  var piFreq = this.freq * 2 * Math.PI;
  if (this.type == 'rotate') {

    if (this.axis == 'x') {
      for (var i = 0; i < verts.length; i++)
        verts[i].applyMatrix4(matrix.makeRotationX(this.ampl*Math.sin(piFreq*verts[i].x/this.xSize+this.offset)));
    }
    else if (this.axis == 'y') {
      for (var i = 0; i < verts.length; i++)
        verts[i].applyMatrix4(matrix.makeRotationY(this.ampl*Math.sin(piFreq*verts[i].y/this.ySize+this.offset)));
    }
    else if (this.axis == 'z') {
      for (var i = 0; i < verts.length; i++)
        verts[i].applyMatrix4(matrix.makeRotationZ(this.ampl*Math.sin(piFreq*verts[i].z/this.zSize+this.offset)));
    }
  } else if (this.type == 'translate'){

    if (this.axis == 'x') {
      if (this.axis2 == 'y') {
        for (var i = 0; i < verts.length; i++)
          verts[i].applyMatrix4(matrix.makeTranslation(0, this.ampl*Math.sin(piFreq*verts[i].x/this.xSize+this.offset), 0));
      } else if (this.axis2 == 'z') {
        for (var i = 0; i < verts.length; i++)
          verts[i].applyMatrix4(matrix.makeTranslation(0, 0, this.ampl*Math.sin(piFreq*verts[i].x/this.xSize+this.offset)));
      }
    } else if (this.axis == 'y') {
      if (this.axis2 == 'x') {
        for (var i = 0; i < verts.length; i++)
          verts[i].applyMatrix4(matrix.makeTranslation(this.ampl*Math.sin(piFreq*verts[i].y/this.ySize+this.offset), 0, 0));
      } else if (this.axis2 == 'z') {
        for (var i = 0; i < verts.length; i++)
          verts[i].applyMatrix4(matrix.makeTranslation(0, 0, this.ampl*Math.sin(piFreq*verts[i].y/this.ySize+this.offset)));
      }
    } else if (this.axis == 'z') {
      if (this.axis2 == 'x') {
        for (var i = 0; i < verts.length; i++)
          verts[i].applyMatrix4(matrix.makeTranslation(this.ampl*Math.sin(piFreq*verts[i].z/this.zSize+this.offset), 0, 0));
      } else if (this.axis2 == 'y') {
        for (var i = 0; i < verts.length; i++)
          verts[i].applyMatrix4(matrix.makeTranslation(0, this.ampl*Math.sin(piFreq*verts[i].z/this.zSize+this.offset), 0));
      }
    }
  }
  this.oldFreq = this.freq;
  this.oldAmpl = this.ampl;
  this.oldOffset = this.offset;
};
SinGlitch.prototype.unglitch = function() {
  var verts = ogMesh.geometry.vertices;
  var matrix = new THREE.Matrix4();
  var piFreq = this.oldFreq * 2 * Math.PI;
  if (this.type == 'rotate') {
    if (this.axis == 'x') {
      for (var i = 0; i < verts.length; i++)
        verts[i].applyMatrix4(matrix.makeRotationX(-this.oldAmpl*Math.sin(piFreq*verts[i].x/this.xSize+this.oldOffset)));
    } else if (this.axis == 'y') {
      for (var i = 0; i < verts.length; i++)
        verts[i].applyMatrix4(matrix.makeRotationY(-this.oldAmpl*Math.sin(piFreq*verts[i].y/this.ySize+this.oldOffset)));
    } else if (this.axis == 'z') {
      for (var i = 0; i < verts.length; i++)
        verts[i].applyMatrix4(matrix.makeRotationZ(-this.oldAmpl*Math.sin(piFreq*verts[i].z/this.zSize+this.oldOffset)));
    }
  } else if (this.type == 'translate'){
    if (this.axis == 'x') {
      if (this.axis2 == 'y') {
        for (var i = 0; i < verts.length; i++)
          verts[i].applyMatrix4(matrix.makeTranslation(0, -this.oldAmpl*Math.sin(piFreq*verts[i].x/this.xSize+this.oldOffset), 0));
      } else if (this.axis2 == 'z') {
        for (var i = 0; i < verts.length; i++)
          verts[i].applyMatrix4(matrix.makeTranslation(0, 0, -this.oldAmpl*Math.sin(piFreq*verts[i].x/this.xSize+this.oldOffset)));
      }
    } else if (this.axis == 'y') {
      if (this.axis2 == 'x') {
        for (var i = 0; i < verts.length; i++)
          verts[i].applyMatrix4(matrix.makeTranslation(-this.oldAmpl*Math.sin(piFreq*verts[i].y/this.ySize+this.oldOffset), 0, 0));
      } else if (this.axis2 == 'z') {
        for (var i = 0; i < verts.length; i++)
          verts[i].applyMatrix4(matrix.makeTranslation(0, 0, -this.oldAmpl*Math.sin(piFreq*verts[i].y/this.ySize+this.oldOffset)));
      }
    } else if (this.axis == 'z') {
      if (this.axis2 == 'x') {
        for (var i = 0; i < verts.length; i++)
          verts[i].applyMatrix4(matrix.makeTranslation(-this.oldAmpl*Math.sin(piFreq*verts[i].z/this.zSize+this.oldOffset), 0, 0));
      } else if (this.axis2 == 'y') {
        for (var i = 0; i < verts.length; i++)
          verts[i].applyMatrix4(matrix.makeTranslation(0, -this.oldAmpl*Math.sin(piFreq*verts[i].z/this.zSize+this.oldOffset), 0));
      }
    }
  }
};

/*
function updateMesh() {
  sine(ogMesh);
  twist(ogMesh);
}

function twist() {
  var verts = ogMesh.geometry.vertices;
  var x = twistParams['x'], oldX = twistParams['oldX'];
  var y = twistParams['y'], oldY = twistParams['oldY'];
  var z = twistParams['z'], oldZ = twistParams['oldZ'];
  var xSize = modelParams['xSize'];
  var ySize = modelParams['ySize'];
  var zSize = modelParams['zSize'];
  var offset = twistParams['offset'];
  var oldOffset = twistParams['oldOffset'];
  var matrix = new THREE.Matrix4();

  for (var i = 0; i < verts.length; i++) {
    verts[i].applyMatrix4(matrix.makeRotationZ(radians(-oldZ*verts[i].z/zSize-oldOffset)));
    verts[i].applyMatrix4(matrix.makeRotationY(radians(-oldY*verts[i].y/ySize-oldOffset)));
    verts[i].applyMatrix4(matrix.makeRotationX(radians(-oldX*verts[i].x/xSize-oldOffset)));
    verts[i].applyMatrix4(matrix.makeRotationX(radians(x*verts[i].x/xSize+offset)));
    verts[i].applyMatrix4(matrix.makeRotationY(radians(y*verts[i].y/ySize+offset)));
    verts[i].applyMatrix4(matrix.makeRotationZ(radians(z*verts[i].z/zSize+offset)));
  }
  ogMesh.geometry.verticesNeedUpdate = true;
  twistParams['oldX'] = twistParams['x'];
  twistParams['oldY'] = twistParams['y'];
  twistParams['oldZ'] = twistParams['z'];
  twistParams['oldOffset'] = twistParams['offset'];
}
*/
function sine() {
  var verts = ogMesh.geometry.vertices;
  var x = sinParams['x'];
  var y = sinParams['y'];
  var z = sinParams['z'];
  var xSize = modelParams['xSize'];
  var ySize = modelParams['ySize'];
  var zSize = modelParams['zSize'];
  var freq = sinParams['freq']*2*Math.PI;
  var ampl = sinParams['ampl'];
  var offset = sinParams['offset'];
  var matrix = new THREE.Matrix4();

  if(x == 'rotate')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeRotationX(ampl*Math.sin(freq*verts[i].x/xSize+offset)));
  if(x == 'translate wrt Y')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeTranslation(0, ampl*Math.sin(freq*verts[i].x/xSize+offset), 0));
  if(x == 'translate wrt Z')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeTranslation(0, 0, ampl*Math.sin(freq*verts[i].x/xSize+offset)));

  if(y == 'rotate')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeRotationY(ampl*Math.sin(freq*verts[i].y/ySize+offset)));
  if(y == 'translate wrt X')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeTranslation(ampl*Math.sin(freq*verts[i].y/ySize+offset), 0, 0));
  if(y == 'translate wrt Z')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeTranslation(0, 0, ampl*Math.sin(freq*verts[i].y/ySize+offset)));

  if(z == 'rotate')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeRotationZ(ampl*Math.sin(freq*verts[i].z/zSize+offset)));
  if(z == 'translate wrt X')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeTranslation(ampl*Math.sin(freq*verts[i].z/zSize+offset), 0, 0));
  if(z == 'translate wrt Y')
    for (var i = 0; i < verts.length; i++)
      verts[i].applyMatrix4(matrix.makeTranslation(0, ampl*Math.sin(freq*verts[i].z/zSize+offset), 0));

  ogMesh.geometry.verticesNeedUpdate = true;
}
//*/
