const video = document.getElementById("video");
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(KameraAc());

//Kamea açma
function KameraAc() {
  //  return false;
  navigator.getUserMedia(
    {
      video: {},
    },
    (stream) => (video.srcObject = stream),
    (err) => console.log(err)
  );
}

//duygu kontrolü tespit etmek
video.addEventListener("play", () =>{
  // yüzde herhangi bir değişiklik var mı kontrol et
  
  // Yüzü tanıma 
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const boxSize = {
    width :video.width,
    height :video.height
  };
  //Yüzü belirleme
  faceapi.matchDimensions(canvas, boxSize)
  setInterval( async () => {
   // asenkron işlem : 
   // await kullanılacak 
   const detections = await faceapi.detectAllFaces(
     video,
     new faceapi.TinyFaceDetectorOptions()
   )
   .withFaceLandmarks() // yüz hatlarımızı belirtme
   .withFaceExpressions()
  //canvası temizle
  canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);

   const resizeDetections = faceapi.resizeResults(detections,boxSize)
   //console.log(detections);
    faceapi.draw.drawDetections(canvas,resizeDetections);
    faceapi.draw.drawFaceLandmarks(canvas,resizeDetections);
    faceapi.draw.drawFaceExpressions(canvas,resizeDetections);
    
  }, 100)
})

