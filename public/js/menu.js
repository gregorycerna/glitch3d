'use strict';

var gui, twistFolder, sinFolder, glitchFolder;
var axis2;

var guiControls = {
  test : 0,
  glitches : [],
  twistAxis : 'x',
  newTwistGlitch : function() {
      var newFolder = glitchFolder.addFolder('twist along the '+guiControls['twistAxis']+' axis');
      var newGlitch = new TwistGlitch(guiControls['twistAxis']);
      guiControls['glitches'].push(newGlitch);
      newFolder.add(newGlitch, 'deg', -360, 360).name('degrees').step(1).onChange(applyGlitches);
      newFolder.add(newGlitch, 'offset', -360, 360).step(1).onChange(applyGlitches);
      newFolder.open();
  },

  sinAxis : 'x',
  sinType : 'rotate',
  sinAxis2 : 'y',
  newSinGlitch : function () {
    if (guiControls['sinType'] == 'translate' && guiControls['sinAxis'] == guiControls['sinAxis2']){
    } else {
      var folderName, newGlitch;
      if (guiControls['sinType'] == 'rotate'){
        folderName = 'rotational sin along the ' + guiControls['sinAxis'] + ' axis';
        newGlitch = new SinGlitch(guiControls['sinAxis'], guiControls['sinType']);
      } else {
        folderName = 'sin along the ' + guiControls['sinAxis'] + ' axis in the ' + guiControls['sinAxis2'] + ' direction';
        newGlitch = new SinGlitch(guiControls['sinAxis'], guiControls['sinType'], guiControls['sinAxis2']);
      }
      var newFolder = glitchFolder.addFolder(folderName);
      guiControls['glitches'].push(newGlitch);
      newFolder.add(newGlitch, 'freq', -20, 20).name('frequency').onChange(applyGlitches);
      newFolder.add(newGlitch, 'ampl', -20, 20).name('amplitude').onChange(applyGlitches);
      newFolder.add(newGlitch, 'offset').onChange(applyGlitches);
      newFolder.open();
    }
  },
};
function applyGlitches() {
  var glitches = guiControls['glitches'];
  //console.log(glitches);
  for (var i = glitches.length - 1; i >= 0; i--)
      glitches[i].unglitch();
  for (var i = 0; i < glitches.length; i++)
    glitches[i].glitch();
  ogMesh.geometry.verticesNeedUpdate = true;
};

function createGui() {
  gui = new dat.GUI( {height: 5 * 32 - 1} );

  var modelFolder = gui.addFolder('Model Options');
  twistFolder = gui.addFolder('Create Twist Glitches');
  sinFolder = gui.addFolder('Create Sin Glitches');
  glitchFolder = gui.addFolder('Glitch List');

  modelFolder.add(modelParams, 'scale', 0, 2)
              .name('Scale Model')
              .onFinishChange(function (val) {ogMesh.scale.set(val, val, val);});
  modelFolder.add(modelParams, 'spin')
              .name('Spin Model');
  modelFolder.add(modelParams, 'swap')
              .name('Swap Y-Z Axes')
              .onFinishChange(swapYZ);
  modelFolder.add(modelParams, 'name', ['sappho', 'ares', 'hand', 'nineface', 'skull', 'head'])
              .name('Model Name')
              .onFinishChange(modelParams['refresh']);
  modelFolder.add(modelParams, 'refresh')
              .name('Reload Model');
  modelFolder.add(modelParams, 'export')
              .name('Export Model');

  modelFolder.open();

/*
  twistFolder.add(twistParams, 'x', -360, 360)
              .name('X Axis (red)')
              .step(1)
              .onChange(twist);
  twistFolder.add(twistParams, 'y', -360, 360)
              .name('Y Axis (green)')
              .step(1)
              .onChange(twist);
  twistFolder.add(twistParams, 'z', -360, 360)
              .name('Z Axis (blue)')
              .step(1)
              .onChange(twist);
  twistFolder.add(twistParams, 'offset', -90, 90)
              .name('Twist Offset')
              .step(1)
              .onChange(twist);

  //twistFolder.open();

  sinFolder.add(sinParams, 'freq', -10, 10)
            .name('Frequency')
            .onFinishChange(sine);
  sinFolder.add(sinParams, 'ampl',-10, 10)
            .name('Amplitude')
            .onFinishChange(sine);
  sinFolder.add(sinParams, 'offset', -Math.PI, Math.PI)
            .name('Sin Offset')
            .onFinishChange(sine);
  sinFolder.add(sinParams, 'x', ['off', 'rotate', 'translate wrt Y', 'translate wrt Z'])
            .name('X Axis')
            .onFinishChange(sine);
  sinFolder.add(sinParams, 'y', ['off', 'rotate', 'translate wrt X', 'translate wrt Z'])
            .name('Y Axis')
            .onFinishChange(sine);
  sinFolder.add(sinParams, 'z', ['off', 'rotate', 'translate wrt X', 'translate wrt Y'])
            .name('Z Axis')
            .onFinishChange(sine);

  //sinFolder.open();*/


  twistFolder.add(guiControls, 'twistAxis', twistAxis);
  twistFolder.add(guiControls, 'newTwistGlitch').name("Add Twist Glitch");
  twistFolder.open();


  sinFolder.add(guiControls, 'sinAxis', sinAxis);
  sinFolder.add(guiControls, 'sinType', sinType).onChange(function(value) {
    if(value == 'translate')
      axis2 = sinFolder.add(guiControls, 'sinAxis2', sinAxis2).name('translate along');
    else
      sinFolder.remove(axis2);
  });
  sinFolder.add(guiControls, 'newSinGlitch').name("Add Sin Glitch");
  sinFolder.open();
  glitchFolder.open();
};
