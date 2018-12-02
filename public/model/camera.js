import {
    Util
} from "../util/util.js";

var _instance ;
class Camera {
    constructor() {
        
    }
    static getInstance() {
        if (!_instance){
            _instance = new Camera();
        } 
        return _instance;
    }
    init(parentEle, exportEle,rootElement) {
        
        this.parentEle = parentEle;
        this.exportEle = exportEle;
        this.rootElement = rootElement;

        Util.clearChildNodes(this.parentEle);
        this.parentEle.innerHTML = _html;
        this.video = document.querySelector('#camera-stream');
        this.image = document.querySelector('#snap');
        this.start_camera = document.querySelector('#start-camera');
        this.controls = document.querySelector('.controls');
        this.take_photo_btn = document.querySelector('#take-photo');
        this.delete_photo_btn = document.querySelector('#delete-photo');
        this.save_photo_btn = document.querySelector('#save-photo');
        this.error_message = document.querySelector('#error-message');


        // The getUserMedia interface is used for handling camera input.
        // Some browsers need a prefix so here we're covering all the options
        navigator.getMedia = (
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia
        );


        if (!navigator.getMedia) {
            displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
        } else {
            // Request the camera.
            let video1 = this.video;
            navigator.getMedia({
                    video: true
                },
                // Success Callback
                function (stream) {

                    // Create an object URL for the video stream and
                    // set it as src of our HTLM video element.
                    video1.src = window.URL.createObjectURL(stream);

                    // Play the video element to start the stream.
                    video1.play();
                    video1.onplay = function () {
                        showVideo();
                    };

                },
                // Error Callback
                function (err) {
                    displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
                }
            );
        }
        // Mobile browsers cannot play video without user input,
        // so here we're using a button to start it manually.
        this.start_camera.addEventListener("click", function (e) {
            e.preventDefault();
            // Start video playback manually.
            video.play();
            showVideo();

        });
        this.takePhotoAction = this.takePhotoAction.bind(this);
        this.take_photo_btn.addEventListener("click", this.takePhotoAction );
    
        this.deletePhotoAction = this.deletePhotoAction.bind(this);
        this.delete_photo_btn.addEventListener("click",this.deletePhotoAction );

        this.savePhotoAction = this.savePhotoAction.bind(this);
        this.save_photo_btn.addEventListener("click",this.savePhotoAction );

    }

    savePhotoAction(e){
        console.log("save button");
        console.log(this.image.src);
        const imgSrc = this.image.src ; 
        
        const output = `
        <div class="image-container">
            <img class="thumbnail" src="${imgSrc}"> </img>
        </div>`;

        this.exportEle.innerHTML = output;
        this.destroy();
    }
    takePhotoAction(e){

        e.preventDefault();

        let snap = this.takeSnapshot();
        // Show image. 
        this.image.setAttribute("src", snap);

        this.image.classList.add("visible");
 
        // Enable delete and save buttons
        // delete_photo_btn.classList.remove("disabled");
        // save_photo_btn.classList.remove("disabled");

        this.delete_photo_btn.classList.remove("invisible");

        this.save_photo_btn.classList.remove("invisible");
        // Set the href attribute of the save button to the snap url.
        this.save_photo_btn.href = snap;

        // Pause video playback of stream.
        this.video.pause();

    }
    deletePhotoAction(e) {

        e.preventDefault();

       
        this.backToDefault();
        // Resume playback of stream.
        this.video.play();

    }
    backToDefault(){
         // Hide image.
         this.image.setAttribute('src', "");
         this.image.classList.remove("visible");
 
         // Disable delete and save buttons
         // delete_photo_btn.classList.add("disabled");
         // save_photo_btn.classList.add("disabled");
         this.delete_photo_btn.classList.add("invisible");
         this.save_photo_btn.classList.add("invisible");
 
         this.take_photo_btn.classList.remove("invisible");
    }
    takeSnapshot() {
        // Here we're using a trick that involves a hidden canvas element.  

        var hidden_canvas = document.querySelector('canvas'),
            context = hidden_canvas.getContext('2d');

        let width = this.video.videoWidth,
            height = this.video.videoHeight;

        if (width && height) {

            // Setup a canvas with the same dimensions as the video.
            hidden_canvas.width = width;
            hidden_canvas.height = height;

            // Make a copy of the current frame in the video on the canvas.
            context.drawImage(this.video, 0, 0, width, height);

            // Turn the canvas image into a dataURL that can be used as a src for our photo.
            return hidden_canvas.toDataURL('image/png');
        }
    }
  
    
    destroy() {
       this.backToDefault();
       _instance = null;
       this.rootElement.classList.add("d-none");

    }

}
const _html = `<div id="camera-panel-reveal" class="demo-container mdl-grid panel">
<div class="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--8-col padding-20">
    <div class="container">
        <div class="app">
            <a href="#" id="start-camera" class="visible">Touch here to start the app.</a>
            <video muted id="camera-stream"></video>
            <img id="snap">
            <p id="error-message"></p>
            <div class="controls">
                <a href="#" id="delete-photo" title="Delete Photo" class="invisible"><i class="fas fa-times-circle"></i></a>
                <a href="#" id="take-photo" title="Take Photo"><i class="far fa-circle"></i></a>
                <a href="#" id="save-photo" title="Save Photo" class="invisible"><i class="fas fa-check-circle"></i></a>
            </div>
            <!-- Hidden canvas element. Used for taking snapshot of video. -->
            <canvas width="578" height="200" id="canvas-snap"></canvas>
        </div>
    </div>
</div>
</div>`;




function displayErrorMessage(error_msg, error) {
    let error_message = document.querySelector('#error-message');

    error = error || "";
    if (error) {
        console.error(error);
    }

    error_message.innerText = error_msg;

    hideUI();
    error_message.classList.add("visible");
}
function showVideo() {
    let video = document.querySelector('#camera-stream'),
    controls = document.querySelector('.controls');
    hideUI();
    video.classList.add("visible");
    controls.classList.add("visible");
}

function hideUI() {
    // Helper function for clearing the app UI.
    var video = document.querySelector('#camera-stream'),
    start_camera = document.querySelector('#start-camera'),
    controls = document.querySelector('.controls'),
    error_message = document.querySelector('#error-message');

    controls.classList.remove("visible");
    start_camera.classList.remove("visible");
    video.classList.remove("visible");
    snap.classList.remove("visible");
    error_message.classList.remove("visible");
}
export {Camera};