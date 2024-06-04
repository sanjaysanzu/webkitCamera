
function webkitCamera() {

    // Determines if the flip camera button should be visible (default: true)
    let showFlipButton = true;

    // Allows the user to crop the image after capturing (default: true)
    let shouldAllowCrop = true;

    // Sets the default camera to the front-facing camera (default: true)
    let useFrontCamera = true;

    // Sets the initial width for the camera or related UI element (default: 50)
    let width = 50;

    // Sets the initial barderwidth for the camera while displaying (default: 80) 
    let barderwidth = 30;

    // Sets the initial barderColor to yellow
    let barderColor = 'yellow';

    // Minimum size of the cropped image in pixels (default: 256)
    let minSize = 256;

    // Set to true to allow double-tap zooming, false to prevent it (default: false)
    let allowDoubleTapZoom = false;

    // Set to true to enable zoom functionality, false to disable it (default: true)
    let enableZoom = true;

    // Set to true to enable touch interactions, false to disable them (default: true)
    let enableTouch = true;

    // Set to true to enable rotation functionality, false to disable it (default: true)
    let enableRotation = true;

    // Variable to determine the shape (default: "Multi")
    let cropType = "Multi"; // Change this value to "circle" or "rectangle" based on your needs

    // Define the format in which the result should be obtained. It can be either 'base64' or 'byteArray'.
    let getResult = 'base64';


    // Pomise object

    let imagePromise

    var cameraApp = {
        showFlipButton: function (value) { // FIXME: Srinidhi: Rename to: showFlipButton
            showFlipButton = value;
            return this;
        },
        shouldAllowCrop: function (value) { // FIXME: Srinidhi: Rename to: shouldAllowCrop
            shouldAllowCrop = value;
            return this;
        },
        useFrontCamera: function (value) {  // FIXME: Srinidhi: Rename to: useFrontCamera
            useFrontCamera = value;
            return this;
        },
        setWidth: function (value) {
            width = value;
            return this;
        },
        enableZoom: function (value) { // FIXME: Srinidhi: Rename to: enableZoom
            enableZoom = value;
            return this;
        },
        setMinSize: function (value) { // FIXME: Srinidhi: Rename to: setMinSize
            minSize = value;
            return this;
        },
        enableTouch: function (value) { // FIXME: Srinidhi: Rename to: enableTouch
            enableTouch = value;
            return this;
        },
        enableRotation: function (value) { // FIXME: Srinidhi: Rename to: enableRotation
            enableRotation = value;
            return this;
        },
        setCropType: function (value) { // FIXME: Srinidhi: Rename to: setCropType
            cropType = value;
            return this;
        },
        setBarderColor: function (value) {
            barderColor = value;
            return this;
        },
        allowDoubleTapZoom: function (value) {
            allowDoubleTapZoom = value;
            return this;
        },
        setBarderwidth: function (value) {
            barderwidth = value;
            return this;
        },

        initialize: function async() {
            imagePromise = new Promise((resolve, reject) => {
                if (
                    !"mediaDevices" in navigator ||
                    !"getUserMedia" in navigator.mediaDevices
                ) {
                    alert("Camera API is not available in your browser");
                    return;
                }

                // Creating a ink element for font-awesome
                // var link = document.createElement('link');
                // link.rel = 'stylesheet';
                // link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css';

                const button = document.getElementById('cameraButton');
                button.style.display = 'none';

                // Main div continer
                const cameraModel = document.createElement('div');
                cameraModel.style.position = 'absolute'
                cameraModel.setAttribute('id', 'cameraModel')
                cameraModel.style.width = '100%';

                // Video element
                var videoWrapper = document.createElement("div");
                videoWrapper.style.position = 'relative';
                var video = document.createElement("video");
                video.setAttribute("autoplay", true);
                video.setAttribute("playsinline", true);
                video.setAttribute("id", "video");
                videoWrapper.appendChild(video);


                var drawCanvas = document.createElement("canvas");
                drawCanvas.setAttribute("id", "drawCanvas");
                drawCanvas.style.position = 'absolute';
                drawCanvas.style.top = '-3px';
                drawCanvas.style.left = '0';
                drawCanvas.style.width = '100%';
                drawCanvas.style.height = '100%';
                videoWrapper.appendChild(drawCanvas);

                // Image capturing buttons div
                var cameraButtons = document.createElement("div");
                cameraButtons.setAttribute("id", "camera-buttons");

                // Capuring image button
                var captureButton = document.createElement("button");
                captureButton.setAttribute("id", "btnScreenshot");

                // Camera flip Icon
                var btnChangeCamera = document.createElement("button");
                btnChangeCamera.setAttribute("id", "btnChangeCamera");
                var imgFlip = document.createElement("i");
                imgFlip.className = 'fas fa-sync';
                btnChangeCamera.appendChild(imgFlip);

                cameraButtons.appendChild(captureButton);
                cameraButtons.appendChild(btnChangeCamera);

                // Container hold the image
                var screenshotsContainer = document.createElement("div");
                screenshotsContainer.setAttribute("id", "image");

                // Canvas
                var canvas = document.createElement("canvas");
                canvas.setAttribute("id", "canvas");

                // Second div contaier which in inside cameraModel div
                var mainContainer = document.createElement("div");
                mainContainer.classList.add("main-container");

                // Control buttons div container for controlling cropper
                var controlButtonsDiv = document.createElement("div");
                controlButtonsDiv.setAttribute("id", "controlButtonsDiv");
                // cancel button
                var cancel = document.createElement("button");
                // Added id for this button
                cancel.setAttribute("id", "btnCancel");
                cancel.innerHTML = 'Recapture'
                controlButtonsDiv.appendChild(cancel);

                // Acceptance button
                var acceptImage = document.createElement("button");
                // Added id for this button
                acceptImage.setAttribute("id", "btnAccept");
                acceptImage.innerHTML = 'Accept'
                controlButtonsDiv.appendChild(acceptImage);

                // Third div to control the size of the video and buttons
                var sizeContainer = document.createElement("div");
                sizeContainer.style.position = 'relative'
                sizeContainer.setAttribute('id', 'size')

                // Image element
                const img = document.createElement("img");

                mainContainer.appendChild(videoWrapper);
                mainContainer.appendChild(cameraButtons);
                mainContainer.appendChild(screenshotsContainer);
                mainContainer.appendChild(controlButtonsDiv)
                mainContainer.appendChild(canvas);
                sizeContainer.appendChild(mainContainer)
                cameraModel.appendChild(sizeContainer)
                document.body.appendChild(cameraModel);

                var constraints = {
                    video: { facingMode: "user" },
                };

                const drawLine = () => {
                    const canvas = document.getElementById('drawCanvas');
                    const ctx = canvas.getContext('2d');
                    ctx.strokeStyle = barderColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    // Drawing a rectangle border with space on left and right sides
                    ctx.rect(barderwidth, 0, canvas.width - 2 * barderwidth, canvas.height);
                    ctx.stroke();
                };

                // Capturing the image
                captureButton.onclick = function () {
                    dismissVideo();
                    if (screenshotsContainer.firstChild) {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        canvas.getContext("2d").drawImage(video, 0, 0, fixedWidth, fixedHeight);
                        img.src = canvas.toDataURL("image/png");

                        let byteCharacters = atob(img.src.split(',')[1]);
                        let byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        let byteArray = new Uint8Array(byteNumbers);
                        console.log("Bytes", byteArray);
                        screenshotsContainer.replaceChild(img, screenshotsContainer.firstChild);
                    } else {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        canvas.getContext("2d").drawImage(video, 0, 0);
                        img.src = canvas.toDataURL("image/png");
                       
                        let byteCharacters = atob(img.src.split(',')[1]);
                        let byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        let byteArray = new Uint8Array(byteNumbers);
                    }
                };

                // Switching camera
                btnChangeCamera.addEventListener("click", function () {
                    useFrontCamera = !useFrontCamera;
                    initializeCamera();
                });

                cancel.addEventListener("click", function () {
                    reCapture();
                    hideControlButtonsDiv()
                })

                acceptImage.addEventListener("click", function () {
                    mainContainer.style.display = 'none';
                    document.head.removeChild(style);
                    document.body.removeChild(cameraModel);
                    // Calling image cropper function
                    cropped(img.src);

                })

                function reCapture() {
                    videoWrapper.style.display = "block";
                    cameraButtons.style.display = "flex";
                    canvas.style.display = "none"
                }
                function hideControlButtonsDiv() {
                    drawLine()
                    controlButtonsDiv.style.display = "none"
                    if (showFlipButton == false) {
                        btnChangeCamera.style.display = "none"
                    }
                }

                function dismissVideo() {
                    videoWrapper.style.display = "none";
                    cameraButtons.style.display = "none";
                    canvas.style.display = "block"
                    controlButtonsDiv.style.display = "flex"
                    if (shouldAllowCrop == false) {
                        acceptImage.style.display = "none"
                    }
                }

                let videoStream;
                function stopVideoStream() {
                    if (videoStream) {
                        videoStream.getTracks().forEach((track) => {
                            track.stop();
                        });
                    }
                }

                // Initialize camera
                async function initializeCamera() {
                    stopVideoStream();
                    constraints.video.facingMode = useFrontCamera ? "user" : "environment";

                    try {
                        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
                        video.srcObject = videoStream;
                        video.play();

                    } catch (err) {
                        alert("Could not access the camera");
                    }
                }

                initializeCamera();
                hideControlButtonsDiv();

                // Adding CSS styles
                const css = `
            /* Mobile view */
            @media screen and (max-width: 768px) {
                .main-container {
                    width: 100%;
                }
                body {
                    overflow-x: hidden;
                }
                #size {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 10px;
                    margin-left:-5px;
                    margin-top:20px;
                }
                
                #camera-buttons {
                    height: 160px; 
                    background-color: black; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    width: 100%;
                    margin-top: -5px;
                }
                
                #btnScreenshot {
                    width: 75px; 
                    height: 75px; 
                    background-color: white; 
                    border-radius: 50%;  
                    margin: 0 auto; 
                    margin-left: 40%; 
                    cursor: pointer;
                    border:5px solid grey
                }
                
                #btnChangeCamera {
                    width: 50px; 
                    height: 50px; 
                    background-color: white; 
                    border-radius: 50%;   
                    float: right; 
                    cursor: pointer; 
                    font-size: 13px;
                    margin-right:30px;

                }
                
                #video {
                    width: 100%;
                    
                }
                
                #canvas {
                    width: 100%;
                }
                
                #controlButtonsDiv{
                    justify-content: space-between;
                    margin-bottom:2px;
                }
                #btnCancel{
                    background-color: red;
                    color: white;
                    border: none;
                    padding: 5px 15px;
                    font-size: 12px;
                    cursor: pointer;
                    border-radius: 6px;
                    transition: background-color 0.3s;
            }
            #btnAccept{
                    background-color: green;
                    color: white;
                    border: none;
                    padding: 5px 15px;
                    font-size: 12px;
                    cursor: pointer;
                    border-radius: 6px;
                    transition: background-color 0.3s;
            }
            #cameraModel{
                
            }
            }
    
            /* Larger screens */
    
            @media screen and (min-width: 769px) {
            .main-container {
                width: ${width}%;
             }
             body {
                overflow-x: hidden;
            }
        
          }

            @media screen and (min-width: 769px) {
            #size {
                display: flex;
                justify-content: center;
                align-items: center;
                
            }
        
            #camera-buttons {
                height: 60px;
                background-color: black;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                margin-top: -5px;
            }
        
            #video {
                width: 100%;
                height: 50%;
            }
        
            #btnScreenshot {
                width: 45px;
                height: 45px;
                background-color: white;
                border-radius: 50%;
                margin: 0 auto;
                margin-left: 49%;
                cursor: pointer;
                display: inline-block;
                border:5px solid grey
            }
        
            #btnChangeCamera {
                width: 37px;
                height: 37px;
                background-color: white;
                border-radius: 50%;
                float: right;
                cursor: pointer;
                font-size: 15px;
                margin-right:10px
            }
        
            #canvas {
                width: 100%;
            }
            #cameraModel{
                //  overflow-y:auto;
                //  height: 100%;
            }
            #controlButtonsDiv{
                    justify-content: space-between;
                    margin-bottom:2px;
            }
            #btnCancel{
                    background-color: red;
                    color: white;
                    border: none;
                    padding: 5px 15px;
                    font-size: 12px;
                    cursor: pointer;
                    border-radius: 6px;
                    transition: background-color 0.3s;
            }
            #btnAccept{
                    background-color: green;
                    color: white;
                    border: none;
                    padding: 5px 15px;
                    font-size: 12px;
                    cursor: pointer;
                    border-radius: 6px;
                    transition: background-color 0.3s;
            }
        }
        `;
                const style = document.createElement('style');
                style.appendChild(document.createTextNode(css));
                document.head.appendChild(style);
              //  document.head.appendChild(link);

                // -----------------------------------------------------------Crop functionality -------------------------------------------------------

                function cropped(imagess) {
                    let style = document.createElement('style');
                    style.textContent = `
                body, html {
                height: 100%;
                margin: 0;
                padding: 0;
                background: black;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
        
            .controls {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                pointer-events: none;
            }
        
            .controls button,
            .controls select {
                pointer-events: auto;
                background-color: black;
                color: white;
                padding: 13px 18px; /* Larger button size for better touch interaction */
                font-size: 14px; /* Larger font size for better readability */
                border-radius: 10%;
            }
        
            .top-right {
                position: absolute;
                top: 10px;
                right: 10px;
            }
        
            .top-left {
                position: absolute;
                top: 10px;
                left: 10px;
            }
        
            .bottom-left {
                position: absolute;
                bottom: 10px;
                left: 10px;
            }
        
            .bottom-right {
                position: absolute;
                bottom: 10px;
                right: 10px;
            }
        
            .image-container-wrapper {
                max-width: 90vw;
                max-height: 90vh;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: visible;
            }
        
            .image-container {
                position: relative;
                width: 100%;
                height: 100%;
            }
        
            canvas {
                width: 100%;
                height: 100%;
                display: block;
            }
        
            .overlay {
                position: absolute;
                border: 2px solid yellow;
                cursor: move;
                touch-action: none;
                z-index: 1;
            }
        
            .corner {
                position: absolute;
                width: 15px;
                height: 15px;
                background-color: yellow;
                border-radius: 50%;
            }
        
            .corner.top-left {
                top: -7.5px;
                left: -7.5px;
            }
        
            .corner.top-right {
                top: -7.5px;
                right: -7.5px;
            }
        
            .corner.bottom-left {
                bottom: -7.5px;
                left: -7.5px;
            }
        
            .corner.bottom-right {
                bottom: -7.5px;
                right: -7.5px;
            }
        
            .overlay-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                pointer-events: none;
            }
        
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0, 0, 0, 0.8);
            }
        
            .modal-content {
                background-color: #fefefe;
                margin: 5% auto;
                padding: 20px;
                border: 1px solid #888;
                width: 80%;
                max-width: 600px;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
        
            .cropped-image {
                max-width: 100%;
                max-height: 70vh;
                margin-top: 20px; /* Added margin to separate image from buttons */
            }
        
            .modal-buttons {
                position: relative;
                width: 100%;
                text-align: right;
                display: flex;
                justify-content: end;
            }
        
            /* Media query for iOS devices */
            @media screen and (max-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {
                .controls button {
                    padding: 13px 18px; /* Larger button size for better touch interaction */
                    font-size: 14px; /* Larger font size for better readability */
                    border-radius: 10%;
                }
            }

            @media screen and (max-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {
                .controls select {
                    padding: 13px 18px; /* Larger button size for better touch interaction */
                    font-size: 14px; /* Larger font size for better readability */
                    border-radius: 10%;
                }
            }
            `;
                    document.head.appendChild(style);

                    let controls = document.createElement('div');
                    controls.id='controls';
                    controls.className = 'controls';
                    controls.innerHTML = `
            <div id="dropdownContainer" class="top-left">
                <select id="shapeSelect" onchange="selectShape()">
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
            </select>
            </div>
            <div class="top-right">
                <button id="cropButton" ><i class="fas fa-check"></i></button>
                <button id="cancelCrop" ><i class="fas fa-times"></i></button>
            </div>
            <div class="bottom-left">
                <button id="rotateLeftButton" onclick="rotateImage(-90)"><i class="fas fa-undo"></i></button>
                <button id="rotateRightButton" onclick="rotateImage(90)"><i class="fas fa-redo"></i></button>
            </div>
            <div class="bottom-right">
                <button id="zoomInButton" onclick="zoomImage(1.2)"><i class="fas fa-search-plus"></i></button>
                <button id="zoomOutButton" onclick="zoomImage(0.8)"><i class="fas fa-search-minus"></i></button>
            </div>
            `;
                    document.body.appendChild(controls);

                    let imageContainerWrapper = document.createElement('div');
                    imageContainerWrapper.className = 'image-container-wrapper';
                    imageContainerWrapper.innerHTML = `
            <div class="image-container">
                <div class="overlay-background"></div>
                <canvas id="canvas"></canvas>
                <div class="overlay">
                    <div class="corner top-left"></div>
                    <div class="corner top-right"></div>
                    <div class="corner bottom-left"></div>
                    <div class="corner bottom-right"></div>
                </div>
            </div>
            `;
                    document.body.appendChild(imageContainerWrapper);

                    let customModal = document.createElement('div');
                    customModal.id = 'customModal';
                    customModal.className = 'modal';
                    customModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-buttons">
                    <button id="downloadButton" class="" role="button">Save</button>
                <button id="close" class="close-Btn"><i class="fas fa-times"></i></button>

                </div>
                <img id="croppedImagePreview" class="cropped-image" src="" alt="Cropped Image">
            </div>
            `;
                    document.body.appendChild(customModal);

                    // Function to download the cropped image
                    function downloadCroppedImage() {

                        try {
                            // Get the cropped image from the preview
                            let imgSrc = document.getElementById('croppedImagePreview').src;
                            let finalResultdata

                            // Create a temporary link element
                            let downloadLink = document.createElement('a');
                            downloadLink.href = imgSrc;
                            downloadLink.download = 'cropped_image.png'; // Set the filename for download
                            

                            if (getResult === 'base64') {
                                finalResultdata = imgSrc
                            } else if (getResult === 'byteArray') {
                                let byteCharacters = atob(imgSrc.split(',')[1]);
                                let byteNumbers = new Array(byteCharacters.length);
                                for (let i = 0; i < byteCharacters.length; i++) {
                                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                                }
                                let byteArray = new Uint8Array(byteNumbers);
                                finalResultdata = byteArray
                            }

                            res = {
                                "ImageData": finalResultdata,
                                "ImageName": downloadLink.download
                            }
                            resolve(res);
                            document.head.removeChild(style);
                            document.body.removeChild(controls);
                            document.body.removeChild(imageContainerWrapper);
                            document.body.removeChild(customModal);
                            button.style.display = 'block';
                        } catch (error) {
                            reject(error);
                        }
                    }

                    // Function to show or hide the dropdown and make changes
                    function toggleDropdown() {
                        var dropdownContainer = document.getElementById('dropdownContainer');
                        var shapeSelect = document.getElementById('shapeSelect');

                        if (cropType === 'rectangle' || cropType === 'circle') {
                            dropdownContainer.style.display = 'none';
                            shapeSelect.value = cropType;  // Update the selected option based on cropType
                            selectShape(); // Call the function immediately
                        } else if (cropType === 'Multi') {
                            dropdownContainer.style.display = 'block';
                        }
                    }

                    // Function called when the shape is selected or the page loads
                    window.selectShape = function () {
                        var shapeSelect = document.getElementById('shapeSelect');
                        var cropType = shapeSelect.value; // Update cropType based on the selected value
                        var overlay = document.querySelector('.overlay'); // Ensure overlay is selected correctly

                        if (overlay && cropType === "circle") {
                            overlay.style.borderRadius = "50%";
                        } else if (overlay && cropType === "rectangle") {
                            overlay.style.borderRadius = "0%";
                        }
                        console.log('Shape selected:', cropType);
                    };

                    // Initial call to set the correct visibility and state
                    toggleDropdown();

                    // Event listener for the download button
                    document.getElementById('downloadButton').addEventListener('click', downloadCroppedImage);

                    let canvas = document.getElementById("canvas");
                    let ctx = canvas.getContext("2d");
                    let imageObj = new Image();
                    let overlay = document.querySelector('.overlay');
                    let overlayBackground = document.querySelector('.overlay-background');
                    let angle = 0;
                    let zoomFactor = 1;  // Initial zoom factor
                    let translateX = 0, translateY = 0; // Initial translation values
                    let isDragging = false;
                    let startX, startY;

                    let capturedImg = imagess;

                    imageObj.crossOrigin = "Anonymous";

                    imageObj.onload = function () {
                        if (imageObj.width * imageObj.height > 16777216) {
                            let scaleDownFactor = Math.sqrt((16777216) / (imageObj.width * imageObj.height));
                            imageObj.width *= scaleDownFactor;
                            imageObj.height *= scaleDownFactor;
                        }
                        drawImage();
                        toggleRotateButtons();
                        displayZoomControls();
                    };
                    imageObj.src = capturedImg; // Update image URL

                    // Function to draw the image on the canvas
                    function drawImage() {
                        let radians = angle * Math.PI / 180;
                        let sin = Math.abs(Math.sin(radians));
                        let cos = Math.abs(Math.cos(radians));

                        let imageWidth = cos * imageObj.width + sin * imageObj.height;
                        let imageHeight = sin * imageObj.width + cos * imageObj.height;

                        // Check if the image dimensions exceed the maximum limit
                        if (imageWidth * imageHeight > 16777216) {
                            let scaleDownFactor = Math.sqrt((16777216) / (imageWidth * imageHeight));
                            imageWidth *= scaleDownFactor;
                            imageHeight *= scaleDownFactor;
                        }

                        let scaleX = (window.innerWidth / imageWidth) * zoomFactor;
                        let scaleY = (window.innerHeight / imageHeight) * zoomFactor;
                        let scaleToFit = Math.min(scaleX, scaleY);

                        console.log("Canvas dimensions: " + canvas.width + " x " + canvas.height);
                        console.log("Image dimensions: width x height = " + (imageWidth * imageHeight));

                        let canvasWidth = imageWidth * scaleToFit;
                        let canvasHeight = imageHeight * scaleToFit;

                        canvas.width = canvasWidth;
                        canvas.height = canvasHeight;

                        ctx.setTransform(scaleToFit, 0, 0, scaleToFit, canvasWidth / 2, canvasHeight / 2);
                        ctx.rotate(radians);
                        ctx.drawImage(imageObj, -imageObj.width / 2, -imageObj.height / 2);

                        ctx.setTransform(1, 0, 0, 1, 0, 0);

                        initializeOverlay();
                    }

                    function initializeOverlay() {
                        let containerRect = document.querySelector('.image-container-wrapper').getBoundingClientRect();
                        overlay.style.width = `${containerRect.width - 4}px`;
                        overlay.style.height = `${containerRect.height - 4}px`;
                        overlay.style.top = '0px';
                        overlay.style.left = '0px';

                        setupOverlayInteractions(containerRect.width - 4, containerRect.height - 4);
                    }

                    function setupOverlayInteractions(width, height) {
                        if ($.data(overlay, 'ui-resizable')) {
                            $(overlay).resizable('destroy');
                        }
                        if ($.data(overlay, 'ui-draggable')) {
                            $(overlay).draggable('destroy');
                        }

                        // Set up resizable
                        $(overlay).resizable({
                            containment: "parent",
                            handles: 'n, e, s, w, ne, se, sw, nw',
                            minWidth: minSize,
                            minHeight: minSize,
                            resize: function (event, ui) {
                                console.log("height and width", event);
                                if (event.target.clientHeight == minSize && event.target.clientWidth == minSize) {
                                    alert(`Minimum height and width should be ${minSize}`);
                                    console.log("height and width", event);
                                }
                                updateOverlayBackground(ui.position, ui.size);
                            }
                        });

                        // Set up draggable
                        $(overlay).draggable({
                            containment: "parent",
                            drag: function (event, ui) {
                                updateOverlayBackground(ui.position, { width: ui.helper.width(), height: ui.helper.height() });
                            }
                        });

                        updateOverlayBackground({ top: '0px', left: '0px' }, { width, height });
                    }

                    function updateOverlayBackground(position, size) {
                        let left = parseFloat(position.left) || 0;
                        let top = parseFloat(position.top) || 0;
                        let width = parseFloat(size.width) || 0;
                        let height = parseFloat(size.height) || 0;

                        overlayBackground.style.clipPath = `polygon(
                        0 0, 
                        0 100%, 
                        ${left}px 100%, 
                        ${left}px ${top}px, 
                        ${left + width}px ${top}px, 
                        ${left + width}px ${top + height}px, 
                        ${left}px ${top + height}px, 
                        ${left}px 100%, 
                        100% 100%, 
                        100% 0
                    )`;
                    }

                    // Function to zoom the image by a given factor
                    window.zoomImage = function (factor) {
                        if (enableZoom) {
                            zoomFactor *= factor;
                            drawImageZoom();
                            displayZoomControls(true);
                        } else {
                            displayZoomControls(false);
                        }
                    };

                    function displayZoomControls() {
                        const zoomInButton = document.getElementById('zoomInButton');
                        const zoomOutButton = document.getElementById('zoomOutButton');
                        if (enableZoom) {
                            zoomInButton.style.display = 'inline';
                            zoomOutButton.style.display = 'inline';
                        } else {
                            zoomInButton.style.display = 'none';
                            zoomOutButton.style.display = 'none';
                        }
                    }

                    // Function to draw the image with zoom and rotation
                    function drawImageZoom() {
                        let radians = angle * Math.PI / 180;
                        let sin = Math.abs(Math.sin(radians));
                        let cos = Math.abs(Math.cos(radians));

                        let imageWidth = cos * imageObj.width + sin * imageObj.height;
                        let imageHeight = sin * imageObj.width + cos * imageObj.height;

                        // Check if the image dimensions exceed the maximum allowed area
                        if (imageWidth * imageHeight > 16777216) {
                            let scaleDownFactor = Math.sqrt((16777216) / (imageWidth * imageHeight));
                            imageWidth *= scaleDownFactor;
                            imageHeight *= scaleDownFactor;
                        }

                        let scaleX = (canvas.width / imageWidth) * zoomFactor;
                        let scaleY = (canvas.height / imageHeight) * zoomFactor;
                        let scaleToFit = Math.min(scaleX, scaleY);

                        // Clear the canvas and draw the image with zoom and rotation
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.save();
                        ctx.translate(canvas.width / 2 + translateX, canvas.height / 2 + translateY);
                        ctx.scale(scaleToFit, scaleToFit);
                        ctx.rotate(radians);
                        ctx.drawImage(imageObj, -imageObj.width / 2, -imageObj.height / 2);
                        ctx.restore();

                        console.log("Image dimensions after zoom: width = " + imageWidth + ", height = " + imageHeight);
                    }

                    // Event listener for mouse interaction on the canvas
                    canvas.addEventListener('mousedown', function (e) {
                        let startX = e.clientX;
                        let startY = e.clientY;
                        let dragged = false;

                        function onMouseMove(e) {
                            let dx = e.clientX - startX;
                            let dy = e.clientY - startY;
                            translateX += dx;
                            translateY += dy;
                            startX = e.clientX;
                            startY = e.clientY;
                            drawImageZoom();
                            dragged = true;
                        }

                        function onMouseUp() {
                            canvas.removeEventListener('mousemove', onMouseMove);
                            canvas.removeEventListener('mouseup', onMouseUp);
                            if (!dragged) {
                                // Implement clicking logic if necessary
                            }
                        }

                        canvas.addEventListener('mousemove', onMouseMove);
                        canvas.addEventListener('mouseup', onMouseUp);
                    });

                    // Configuration for enabling touch interactions
                    if (enableTouch) {
                        let initialDistance = null;
                        let initialZoom = zoomFactor;

                        // Event listener for touch interaction on the canvas
                        canvas.addEventListener('touchstart', function (e) {
                            if (e.touches.length === 2) {
                                e.preventDefault(); // Prevent default touch behavior
                                isDragging = true; // Disable dragging with two fingers
                                // Calculate the distance between two touch points
                                initialDistance = Math.sqrt(
                                    (e.touches[0].clientX - e.touches[1].clientX) ** 2 +
                                    (e.touches[0].clientY - e.touches[1].clientY) ** 2
                                );
                                initialZoom = zoomFactor;
                            } else if (e.touches.length === 1) {
                                isDragging = true;
                                startX = e.touches[0].clientX;
                                startY = e.touches[0].clientY;
                            }
                        });

                        canvas.addEventListener('touchmove', function (e) {
                            if (e.touches.length === 2 && initialDistance !== null) {
                                e.preventDefault(); // Prevent default touch behavior
                                // Calculate new distance between touch points
                                const newDistance = Math.sqrt(
                                    (e.touches[0].clientX - e.touches[1].clientX) ** 2 +
                                    (e.touches[0].clientY - e.touches[1].clientY) ** 2
                                );
                                // Calculate the scale factor
                                const scaleFactor = newDistance / initialDistance;
                                zoomFactor = initialZoom * scaleFactor;
                                drawImageZoom();
                            } else if (isDragging && e.touches.length === 1) {
                                e.preventDefault(); // Prevent default touch behavior
                                let dx = e.touches[0].clientX - startX;
                                let dy = e.touches[0].clientY - startY;
                                translateX += dx;
                                translateY += dy;
                                startX = e.touches[0].clientX;
                                startY = e.touches[0].clientY;
                                drawImageZoom();
                            }
                        });

                        canvas.addEventListener('touchend', function (e) {
                            isDragging = false;
                            initialDistance = null; // Reset initial distance for pinch zoom
                        });

                        // Configurable double-tap zooming prevention
                        let lastTouchEnd = 0;

                        document.addEventListener('touchend', function (event) {
                            const now = (new Date()).getTime();
                            if (!allowDoubleTapZoom && (now - lastTouchEnd <= 300)) {
                                event.preventDefault();
                            }
                            lastTouchEnd = now;
                        }, false);
                    }

                    function toggleRotateButtons() {
                        const rotateLeftButton = document.getElementById('rotateLeftButton');
                        const rotateRightButton = document.getElementById('rotateRightButton');
                        if (enableRotation) {
                            rotateLeftButton.style.display = 'inline';
                            rotateRightButton.style.display = 'inline';
                        } else {
                            rotateLeftButton.style.display = 'none';
                            rotateRightButton.style.display = 'none';
                        }
                    }

                    window.rotateImage = function (deg) {
                        if (enableRotation) {
                            // Check if height is greater than width after rotation
                            let rotatedHeight = Math.abs(Math.cos((angle + deg) * Math.PI / 180) * imageObj.width) + Math.abs(Math.sin((angle + deg) * Math.PI / 180) * imageObj.height);
                            let rotatedWidth = Math.abs(Math.sin((angle + deg) * Math.PI / 180) * imageObj.width) + Math.abs(Math.cos((angle + deg) * Math.PI / 180) * imageObj.height);

                            if (rotatedHeight > rotatedWidth) {
                                // Display custom alert
                                let confirmation = confirm("Not recommended to rotate image height greater than width");
                                if (confirmation) {
                                    // If confirmed, proceed with rotation
                                    angle = (angle + deg) % 360;
                                    drawImage();
                                } else {
                                    // If canceled, do nothing
                                }
                            } else {
                                // If no issue with rotation, proceed directly
                                angle = (angle + deg) % 360;
                                drawImage();
                            }

                            // FIXME: Check whether we can base this on an event instead of a timeout.

                            // This should be done after redrawing the image and possibly resizing the overlay.
                            // setTimeout(function () {
                                initializeOverlay();
                            // }, 100); // Delay might be needed for the DOM updates to settle
                        }
                    }

                    //Crop functionality for rectangle and circle
                    document.getElementById('cropButton').addEventListener('click', function () {
                        let cropType = document.getElementById("shapeSelect").value;
                        let canvasRect = canvas.getBoundingClientRect();
                        let bounds = overlay.getBoundingClientRect();

                        let scaleX = canvas.width / canvasRect.width;
                        let scaleY = canvas.height / canvasRect.height;

                        let cropX = (bounds.left - canvasRect.left) * scaleX;
                        let cropY = (bounds.top - canvasRect.top) * scaleY;
                        let cropWidth = bounds.width * scaleX;
                        let cropHeight = bounds.height * scaleY;

                        let croppedCanvas = document.createElement("canvas");
                        let croppedCtx = croppedCanvas.getContext("2d");
                        croppedCanvas.width = cropWidth;
                        croppedCanvas.height = cropHeight;

                        if (cropType === "rectangle") {
                            croppedCtx.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
                        } else if (cropType === "circle") {
                            let rx = cropWidth / 2; // Radius along x-axis
                            let ry = cropHeight / 2; // Radius along y-axis
                            let cx = rx; // Center along x-axis
                            let cy = ry; // Center along y-axis

                            croppedCtx.save(); // Save the current context state
                            croppedCtx.beginPath();
                            croppedCtx.translate(cx, cy); // Translate to the center of the ellipse
                            croppedCtx.scale(1, ry / rx); // Scale to make the circle an ellipse
                            croppedCtx.arc(0, 0, rx, 0, Math.PI * 2);
                            croppedCtx.closePath();
                            croppedCtx.restore(); // Restore the previous context state
                            croppedCtx.clip();

                            croppedCtx.drawImage(
                                canvas,
                                cropX,
                                cropY,
                                cropWidth,
                                cropHeight,
                                0,
                                0,
                                cropWidth,
                                cropHeight
                            );
                        }

                        let img = new Image();
                        let base64Data = croppedCanvas.toDataURL("image/png");
                        img.src = base64Data;
                        // console.log("Base64", base64Data);

                        let byteCharacters = atob(base64Data.split(',')[1]);
                        let byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        let byteArray = new Uint8Array(byteNumbers);
                        // console.log("Bytes", byteArray);

                        // Set the src attribute of the cropped image preview
                        document.getElementById('croppedImagePreview').src = img.src;

                        // Show the modal
                        document.getElementById('customModal').style.display = "block";
                    });

                    document.getElementById('cancelCrop').addEventListener('click', function () {
                        document.head.removeChild(style);
                        document.body.removeChild(controls);
                        document.body.removeChild(imageContainerWrapper);
                        document.body.removeChild(customModal);
                        cameraApp.initialize();
                    });


                    // Close the modal when the close button or outside the modal content is clicked
                    document.getElementsByClassName('close-Btn')[0].addEventListener('click', function () {
                        document.getElementById('customModal').style.display = "none";
                    });

                    window.onclick = function (event) {
                        var modal = document.getElementById('customModal');
                        if (event.target == modal) {
                            modal.style.display = "none";
                        }
                    }

                    addEventListener("resize", (event) => {
                        initializeOverlay();
                        console.log("resize");
                    });

                    onresize = (event) => { };
                };
            });
            return imagePromise
        }
    };
    return cameraApp;
}
module.exports = webkitCamera;
