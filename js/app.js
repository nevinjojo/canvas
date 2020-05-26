let previousDrawings = []; // List of drawings fetched from Firebase
let currentDrawings = []; // List of drawings from current session
let speed = 25; // Speed at which the previous drawings are drawn
let history = 400; // Number of previous drawings drawn on canvas
let primaryKey = 0; // Key of the DB document with the drawings
let db; // Firebase Database
let previousDrawingsTriggered = false;
let count = 0;
let endOfTheLine = 1;
let brushStrokeSize = 5;
let strokeSetting, brush;

fetchPreviousDrawings();

// Fetch drawings from Firebase and add it to list
function fetchPreviousDrawings() {
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

  // Fetch last X number of drawings from Firebase DB and add it to list
  db = firebase.database();
  let recentLines = db.ref('lines').limitToLast(history);
  recentLines.on('child_added', function (data) {
    if (primaryKey !== data.key) {
      previousDrawings.push(data.val());
    }
  });
}


// Creates canvas, set brush stroke settings etc
function setup() {
  let canvas = createCanvas(document.body.scrollWidth, document.body.scrollHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '1');
  rectMode(CENTER);
  ellipseMode(CENTER);
  brush = select('#brush');
  brush.style('opacity', 1);
  brush.style('width', brushStrokeSize + 'px');
  brush.style('height', brushStrokeSize + 'px');
  strokeSetting = {
    style: brushStrokeSize,
    color: "#000000",
    points: []
  };
}


// Adjusts canvas size on window resize
function windowResized() {
  resizeCanvas(document.body.scrollWidth, document.body.scrollHeight);
}


function draw() {
  brush.position(mouseX - strokeSetting.style / 2, mouseY - strokeSetting.style / 2);

  // Decrease speed after each drawing
  if (speed > 2) {
    speed -= 0.001;
  } else {
    speed = 2;
  }

  if (mouseIsPressed) {
    //brush.style('opacity', 0);
    stroke(strokeSetting.color);
    strokeWeight(strokeSetting.style);
    line(pmouseX, pmouseY, mouseX, mouseY);
    strokeSetting.points.push({x: mouseX, y: mouseY});
  }

  if (previousDrawingsTriggered && previousDrawings.length !== 0) {
    let thisLine = previousDrawings[0];
    endOfTheLine = thisLine.points.length - speed;
    count += drawSegment(thisLine, count, speed);
    if (count >= endOfTheLine) {
      count = 0;
      previousDrawings.shift();
    }
  }
}


function drawLine(object) {
  let points = object.points;
  stroke(object.color);
  strokeWeight(object.style);
  for (let i = 1; i < points.length; i++) {
    line(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
  }
}


function drawSegment(object, index, speed) {
  let points = object.points;
  stroke(object.color);
  strokeWeight(object.style);
  mySpeed = int(speed);
  if (points.length - 1 <= mySpeed) {
    mySpeed = int(points.length - 1);
  }
  for (let i = 0; i < mySpeed; i++) {
    line(points[index + i].x, points[index + i].y, points[index + 1 + i].x, points[index + 1 + i].y);
  }
  return mySpeed;
}


function pushLine(object) {
  if (object.points.length != 0) {
    pushedLine = db.ref('lines/').push();
    primaryKey = pushedLine.key;
    pushedLine.set({
      style: object.style,
      color: object.color,
      points: object.points
    });
  }
  strokeSetting.points = [];
}


function mouseReleased() {
  if (window.matchMedia("(max-width: 768px)").matches) {
  } else {
    pushLine(strokeSetting);
    brush.style('opacity', 0);
  }
}


// Adjusts brush size on mouse wheel event
// function mouseWheel(event) {
//   scrolling = true;
//   strokeSetting.style += event.delta / 100;
//   strokeSetting.style = constrain(strokeSetting.style, 1, 500);
//   brush.style('opacity', 1);
//   brush.style('width', strokeSetting.style + 'px');
//   brush.style('height', strokeSetting.style + 'px');
// }


// Change brush size on key press
function keyTyped() {
  if (key == '[') {
    strokeSetting.style -= 10;
    strokeSetting.style = constrain(strokeSetting.style, 1, 500);
    brush.style('opacity', 1);
    brush.style('width', strokeSetting.style + 'px');
    brush.style('height', strokeSetting.style + 'px');
  } else if (key == ']') {
    strokeSetting.style += 10;
    strokeSetting.style = constrain(strokeSetting.style, 1, 500);
    brush.style('opacity', 1);
    brush.style('width', strokeSetting.style + 'px');
    brush.style('height', strokeSetting.style + 'px');
  }
}
