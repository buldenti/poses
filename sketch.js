// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

// Create a constraints object.
let video;
let poseNet;
let poses = [];
let midX;
let midY;
let myCanvas;
let hueChange = 0;
let hueDirection = 1;
let heartSize = 40;
let s = 200;
let scaleFactor = 1;
let firstH = 480;

function setup() {
  video = createCapture(VIDEO);
  myCanvas = createCanvas(windowWidth, firstH);
  myCanvas.parent("canvas-container");
  colorMode(HSB);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
  reloadPage();
  setTimeout(setScaleFactor, 10000);
}

function modelReady() {
  console.log("Model Loaded");
  console.log(deviceOrientation);
  resizeCanvas(video.width * scaleFactor, video.height * scaleFactor);
}

function draw() {
  // video.resize(video.width * 1.5, video.height *1.5);

  push();
  scale(scaleFactor);
  image(video, 0, 0, video.width, (video.width * video.height) / video.width);
  // We can call both functions to draw all keypoints and the skeletons
  drawSkeleton();
  drawKeypoints();

  pop();

  hueChange = hueChange + hueDirection;

  if (hueChange >= 255 || hueChange <= 0) {
    hueDirection = hueDirection * -1;
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        strokeWeight(1);

        stroke(hueChange, 255, 255);
        fill(24, 200, 200, 50);
        heart(keypoint.position.x, keypoint.position.y - heartSize / 3, heartSize);
        fill(100, 255, 255);
        stroke(0, 0, 0);
        textAlign(CENTER, CENTER);
        text("SEM", keypoint.position.x, keypoint.position.y);
        textSize(15);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(hueChange, 255, 255);
      strokeWeight(10);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function setScaleFactor() {
  if (video.width) {
    if (windowWidth <= 640) {
      scaleFactor = 1;
    }
    if (windowWidth > 641 && windowWidth <= 1280) {
      scaleFactor = 1 + video.width / windowWidth;
      console.log("scale" + scaleFactor);
    } else if (windowWidth > 1280 && windowWidth <= 1920) {
      scaleFactor = 2 + video.width / windowWidth;
    } else if (windowWidth > 1920 && windowWidth <= 2560) {
      scaleFactor = 3 + video.width / windowWidth;
    } else if (windowWidth > 2560 && windowWidth <= 3841) {
      scaleFactor = 4;
    }
  }
  resizeCanvas(video.width * scaleFactor, video.height * scaleFactor);
}

// Resize the canvas when the
// browser's size changes.
function windowResized() {
  setScaleFactor();
  resizeCanvas(video.width * scaleFactor, video.height * scaleFactor);
}

function reloadPage() {
  // The last "domLoading" Time //

  var currentDocumentTimestamp = new Date(performance.timing.domLoading).getTime();

  // Current Time //

  var now = Date.now();

  // Ten Seconds //

  var tenSec = 10 * 1000;

  // Plus Ten Seconds //

  var plusTenSec = currentDocumentTimestamp + tenSec;

  if (now > plusTenSec) {
    location.reload(true);
  } else {
  }
}

// heart function from Mithru
// https://editor.p5js.org/Mithru/sketches/Hk1N1mMQg
function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}
