// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let midX;
let midY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  myCanvas.parent("canvas-container");
  video = createCapture(VIDEO);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
  windowResized();
  
}

function modelReady() {
  console.log("Model Loaded");
}

function draw() {
  midX = (width - video.width)/2;
  midY = (height - video.height)/2;
  push();
  translate(midX, midY);
  image(video, 0, 0, video.width, video.width * video.height / video.width);
  
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  pop();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(0, 255, 0);
        strokeWeight(1);
        stroke(0,0,0);
        textAlign(CENTER,CENTER);
        text("SEM",keypoint.position.x, keypoint.position.y);
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
      stroke(255, 0, 0);
      strokeWeight(10);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

// Resize the canvas when the
// browser's size changes.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
