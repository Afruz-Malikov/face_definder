const fs = require('fs');
const canvas = require('canvas');
const faceapi = require('@vladmandic/face-api');

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

async function loadModels() {
  if (modelsLoaded) return;
  const modelPath = './models';
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  modelsLoaded = true;
}

async function detectFace(filePath) {
  await loadModels();
  const img = await canvas.loadImage(filePath);
  const detection = await faceapi.detectSingleFace(img);
  console.log('Face detection result:', detection);
  return !!detection;
}

module.exports = { detectFace };
