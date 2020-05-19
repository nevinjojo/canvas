
new ClipboardJS('#email');

// document.getElementById("email").addEventListener("click", copied);

// function copied{
//   document.getElementById("email").innerHTML = "copied to clipboard";
// }


// Initialize Firebase
let firebaseConfig = {
  apiKey: "AIzaSyAL3B-8cSbqHNis87os2m78bKNITh94n04",
  authDomain: "canvas-10910.firebaseapp.com",
  databaseURL: "https://canvas-10910.firebaseio.com",
  projectId: "canvas-10910",
  storageBucket: "canvas-10910.appspot.com",
  messagingSenderId: "314355101940",
  appId: "1:314355101940:web:d577fc720b50c641e9aea1"
};
firebase.initializeApp(firebaseConfig);

var emailClicked = false;

var newLines = [];
var newLineCount = 1;
var oldLines = [];
var count = 0;
var endOfTheLine = 1;
var speed = 30;
var history = 100;
var pKey = 0;
var database = firebase.database();
//database.ref('lines').set({});
var recentLines = database.ref('lines').limitToLast(500);

recentLines.on('child_added', function (data) {
  //drawLine(data.val());
  //console.log("pLine",pLine);
  //console.log("newLine",data.key);
  if (pKey != data.key) {
    oldLines.push(data.val());
    //console.log("newLine!");
  } else {
    console.log("thats your own line");
  }
});

let colors = ["#111111", "#4AC3BE", "#FCC0C0", "#4C657E", "#BEF2FF", "#1BF5AF", "#FDC8AA", "#FF304F", "#118DF0", "#7DB9B3", "#5A5AFF", "#653481"];

let colors3 = ["#E6CAA9", "#191718", "#342A20", "#E73E32", "#5A905D", "#3A81CB", "#FCEF4F", "#ECD6C0", "#ED87A6"];

let colors2 = ["#111111", "#FFFFFF"];

let myStroke;

let pLine;
let myLine;

let brush;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  ellipseMode(CENTER);
  brush = select('#brush');

  //fill(255);
  // strokeCap(PROJECT);
  // strokeJoin(ROUND);
  $("#email").click(function () {
    if (emailClicked) {
      $(this).text("nevin.jojo@icloud.com");
      emailClicked = !emailClicked;
    } else {
      //console.log("clicked");
      $(this).text("Copied to clipboard!");
      emailClicked = !emailClicked;
    }
  });

  console.log("old", oldLines);

  myStroke = floor(random(1, 30));
  brush.style('opacity', 1);
  brush.style('width', myStroke + 'px');
  brush.style('height', myStroke + 'px');

  myLine = {

    style: myStroke,
    color: colors[int(random(colors.length))],
    points: []

  };
}

function draw() {

  brush.position(mouseX - myLine.style / 2, mouseY - myLine.style / 2);

  if (speed > 2) {
    speed -= 0.001;
  } else {
    speed = 2;
  }

  if (mouseIsPressed) {
    //brush.style('opacity', 0);
    stroke(myLine.color);
    strokeWeight(myLine.style);
    //console.log(line);
    line(pmouseX, pmouseY, mouseX, mouseY);
    myLine.points.push({ x: mouseX, y: mouseY });
  }

  if (oldLines.length != 0) {

    var thisLine = oldLines[0];

    endOfTheLine = thisLine.points.length - speed;

    count += drawSegment(thisLine, count, speed);

    if (count >= endOfTheLine) {
      count = 0;
      oldLines.shift();
    }
  }
}

function drawLine(object) {
  var points = object.points;
  stroke(object.color);
  strokeWeight(object.style);
  for (var i = 1; i < points.length; i++) {
    line(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
  }
}

function drawSegment(object, index, speed) {
  //console.log("drawing");
  var points = object.points;
  stroke(object.color);
  //stroke(colors[int(random(colors.length))]);
  //stroke(0);
  strokeWeight(object.style);
  //strokeWeight(1);
  mySpeed = int(speed);

  if (points.length - 1 <= mySpeed) {
    mySpeed = int(points.length - 1);
  }

  for (var i = 0; i < mySpeed; i++) {
    line(points[index + i].x, points[index + i].y, points[index + 1 + i].x, points[index + 1 + i].y);
  }

  return mySpeed;
}

function pushLine(object) {

  if (object.points.length != 0) {

    pushedLine = database.ref('lines/').push();
    pKey = pushedLine.key;

    pushedLine.set({
      style: object.style,
      color: object.color,
      points: object.points
    });

    //console.log("push",pushedLine.key);
  }

  myLine.points = [];
  //myLine.color = colors[int(random(colors.length))];
  //myLine.color = 0;

}

function mouseReleased() {
  if (window.matchMedia("(max-width: 768px)").matches) {

    /* The viewport is less than, or equal to, 700 pixels wide */
  } else {
    console.log(window.matchMedia("(max-width: 768px)").matches);
    pushLine(myLine);
    brush.style('opacity', 0);
    /* The viewport is greater than 700 pixels wide */
  }
}

function mouseWheel(event) {
  //println(event.delta);
  //pos += event.delta;
  scrolling = true;
  myLine.style += event.delta / 100;
  //myStroke += event.delta/100;
  //myStroke = constrain(myStroke, 1, 500);
  myLine.style = constrain(myLine.style, 1, 500);
  brush.style('opacity', 1);
  brush.style('width', myLine.style + 'px');
  brush.style('height', myLine.style + 'px');
}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }


function keyTyped() {
  console.log('keyPressed');
  console.log(key);

  if (key == '[') {

    myLine.style -= 1;
    myLine.style = constrain(myLine.style, 1, 500);
    brush.style('opacity', 1);
    brush.style('width', myLine.style + 'px');
    brush.style('height', myLine.style + 'px');
  }
  if (key == ']') {
    console.log(key);
    myLine.style += 1;
    myLine.style = constrain(myLine.style, 1, 500);
    brush.style('opacity', 1);
    brush.style('width', myLine.style + 'px');
    brush.style('height', myLine.style + 'px');
  }
  if (key < 10 && key >= 0) {
    myLine.color = colors[key];
  } else {}
}
