

var $canvas_id = "my_canvas";


function translate(m, x, y) {

  var $trans = new Array();
  $trans[0] = [1, 0, 0];
  $trans[1] = [0, 1, 0];
  $trans[2] = [x, y, 1];

  return matrixMultiply(m, $trans);
}

function rotate(m, angle) {

  var $rotate = new Array();

  $rotate[0] = [Math.cos(angle), Math.sin(angle), 0];
  $rotate[1] = [-Math.sin(angle), Math.cos(angle), 0];
  $rotate[2] = [0, 0, 1];

  return matrixMultiply(m, $rotate);
}

function scale(m, factor) {


  var $line = "factor: " + factor;
  //console.log($line);

  var $scale = new Array();

  $scale[0] = [factor, 0, 0];
  $scale[1] = [0, factor, 0];
  $scale[2] = [0, 0, 1];

  return matrixMultiply(m, $scale);
}

// This is quicker to compute than getLength
function getSquareLength(x1, y1, x2, y2) {

  
  return (x1-x2) * (x1-x2) + (y1-y2) * (y1-y2);

}

function getLength(x1, y1, x2, y2) {

  return Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2));
}

// Angle of x, y from the origin (0,0)
function getRadians(x, y) {

  var p = normalize(x, y);

  if (p.x >= 0 && p.y >= 0) {

    return Math.acos(p.x);
  }

  if (p.x < 0 && p.y >= 0) {

    return Math.acos(p.y) + Math.PI/2;
  }

  if (p.x < 0 && p.y < 0) {

    return Math.asin(-p.y) + Math.PI;
  }

  if (p.x >= 0 && p.y < 0) {

    return Math.asin(p.x) + Math.PI * (3/2);
  }
}

function getRadiansBetweenPoints(x1, y1, x2, y2) {

  return getRadians(x2 - x1, y2 - y1);
}

// Returns points where the radius is 1. 
function normalize(x, y) {

  var dist;

  dist = getLength(0, 0, x, y);
   
  return { x: x / dist, y: y/ dist };

}

function rowByColumn(m1, m2, row, column) {

  var $dotProduct = 0;

  for (var $i = 0; $i < m2.length; $i++) {
    $dotProduct += m1[row][$i] * m2[$i][column];
  }

  return $dotProduct;
}

function matrixMultiply(m1, m2) {

  var $result = new Array();

  for (var $row = 0; $row < m1.length; $row++) {
    $result[$row] = new Array();
    for (var $column = 0; $column < m2.length; $column++) {

      $result[$row][$column] = rowByColumn(m1, m2, $row, $column);
    }
  }

  return $result;
}

function printMatrix(m) {

  for (var $row = 0; $row < m.length; $row++)  {

    var $line = $row + ":";

    for (var $column = 0 ; $column < m[$row].length; $column++) {

      $line = $line + " " + m[$row][$column];
    } 
    console.log($line);

  }
}
