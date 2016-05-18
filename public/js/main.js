/*-------JSHint Directives-------*/
/* global THREE, dat             */
/*-------------------------------*/
'use strict';

function post(path, file) {
  var method = "post";
  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  var hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", "model");
  hiddenField.setAttribute("value", file);

  form.appendChild(hiddenField);

  document.body.appendChild(form);
  form.submit();
}

initializeScene();
animateScene();
