function ImageUpload(divId, options = {}) {
    this.divId = divId;
    this.options = options;
    this.appendServerImage = function(serverImage, imageName, imageId) {

        var imageItem = document.createElement('div');
        imageItem.className = "iu-image-item iu-image-item-style " + imageName;
        imageItem.setAttribute('data-image-id', imageId);
        var imageUploaded = document.createElement('img');
        imageUploaded.setAttribute("src", serverImage);
        imageUploaded.className = 'iu-image-placeholder';
        checkMethodExists('setImagesWidthAndHeight', imageUploaded);
        imageUploaded.setAttribute('draggable', false);
        imageUploaded.setAttribute("alt", imageName);
        imageItem.appendChild(imageUploaded);


        var selectOrderOption = returnOptionValue('selectOrder');
        if (selectOrderOption == true) {
            var selectElements = gallery.getElementsByClassName('iu-select-number');
            var selectElementLength = selectElements.length;

            var selectDiv = document.createElement('div');
            selectDiv.className = "iu-custom-select";
            var selectNumber = document.createElement('select');
            if (returnOptionValue('customSelect') == true) {
                selectNumber.classList.add('iu-display-none');
            }
            selectNumber.addEventListener('focus', function() {
                selectNumberChange(event);
            });
            selectNumber.classList.add('iu-select-number');
            selectDiv.appendChild(selectNumber);
            imageItem.appendChild(selectDiv);
            selectDiv.addEventListener('mousedown', function() {
                selectClick(event);
            });
            //add option for new image select
            for (var i = 0; i < selectElementLength + 1; i++) {
                var option = document.createElement('option');
                option.text = i + 1;
                selectNumber.add(option);
                if (i == selectElementLength) {
                    option.selected = true;
                }
            }
            //Add 1 more option for existed select
            for (var j = 0; j < selectElementLength; j++) {
                var option = document.createElement('option');
                option.text = selectElementLength + 1;
                selectElements[j].add(option);
            }
            var customSelectDiv = selectDiv.parentNode.getElementsByClassName('iu-custom-select');
            _this.customSelect(customSelectDiv);
            var selectDivCollection = gallery.getElementsByClassName('iu-custom-select');
            _this.customSelect(selectDivCollection);
        }

        //Add image order number to image
        var imageOrderNumberClass = gallery.getElementsByClassName("iu-image-order-number");
        var imageOrderLength = imageOrderNumberClass.length;

        var imageOrderNumber = document.createElement('div');
        imageOrderNumber.className = 'iu-image-order-number';
        var imageNumber;
        if (imageOrderLength == 0) {
            imageOrderNumber.innerHTML = 1;
            imageNumber = 1;
        }
        else {
            var lastImageNumber = imageOrderNumberClass[imageOrderLength-1].innerHTML;
            imageNumber = Number(lastImageNumber) + 1;
            imageOrderNumber.innerHTML = imageNumber;
        }
        imageItem.appendChild(imageOrderNumber);


        //Add close button to image
        var closeButton = document.createElement('div');
        closeButton.className = "iu-close-button";
        var closeIcon = document.createElement('div');
        closeIcon.innerHTML = '&times;';
        closeIcon.className = 'iu-close-icon';
        closeButton.appendChild(closeIcon);
        closeButton.addEventListener("mousedown", function() {
            deleteImage(event);
        });
        imageItem.appendChild(closeButton);


        galleryAppend(imageItem);
        addEventListenerForDragElement(imageItem);
        _this.customSelectScrollBar();
    };


    //Function to add a little flash box at the bottom right of screen to alert
    //customer the action they just do like drag image, delete image or change order of image
    this.addFlashBox = function(text, timeout, backgroundColor) {
        var oldFlashBox = document.getElementsByClassName('iu-flash-box')[0];
        if (oldFlashBox) {
            oldFlashBox.remove();
        }
        var flashBox = document.createElement('div');
        flashBox.className = 'iu-flash-box';
        flashBox.style.backgroundColor = backgroundColor;
        flashBox.innerHTML = text;
        document.body.appendChild(flashBox);
        setTimeout(function(){
            flashBox.remove();
        }, timeout);
    };

    this.fadeOutEffect = function(elmnt) {
        var fadeEffect = setInterval(function () {
            if (!elmnt.style.opacity) {
                elmnt.style.opacity = 1;
            }
            if (elmnt.style.opacity > 0) {
                elmnt.style.opacity -= 0.1;
            } else {
                clearInterval(fadeEffect);
                elmnt.remove();
            }
        }, 100);
    };

    this.customSelect = function(customSelectDiv) {
        if (returnOptionValue('customSelect') == true) {
            var customSelectDivLength = customSelectDiv.length;
            for (var i = 0; i < customSelectDivLength; i++) {
                if (customSelectDiv[i].getElementsByClassName('iu-select-selected').length) {
                    customSelectDiv[i].getElementsByClassName('iu-select-selected')[0].remove();
                    customSelectDiv[i].getElementsByClassName('iu-select-items')[0].remove();
                }

                var selElmnt = customSelectDiv[i].getElementsByTagName("select")[0];
                var selElmntOptionLength = selElmnt.length;
                /* For each element, create a new DIV that will act as the selected item: */
                var selectedReplacement = document.createElement('div');
                selectedReplacement.setAttribute('class', 'iu-select-selected');
                selectedReplacement.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
                customSelectDiv[i].appendChild(selectedReplacement);
                /* For each element, create a new DIV that will contain the option list: */
                var divForOptionList = document.createElement("DIV");
                divForOptionList.setAttribute('class', 'iu-select-items iu-select-hide');

                createOptionList(selElmnt, selElmntOptionLength, divForOptionList);
                customSelectDiv[i].appendChild(divForOptionList);
                /*when the select box is clicked, close any other select boxes,
                and open/close the current select box:*/
                selectedReplacement.addEventListener("click", function(e) {
                    e.stopPropagation();
                    closeAllSelect(this);
                    this.nextSibling.classList.toggle("iu-select-hide");
                    this.classList.toggle("iu-select-arrow-active");
                });
            }
            /*a function that will close all select boxes in the document,
              except the current select box:*/
              function closeAllSelect(elmnt) {
                 var x, y, i, xl, yl, arrNo = [];
                 x = document.getElementsByClassName("iu-select-items");
                 y = document.getElementsByClassName("iu-select-selected");
                 xl = x.length;
                 yl = y.length;
                 for (i = 0; i < yl; i++) {
                   if (elmnt == y[i]) {
                     arrNo.push(i)
                   } else {
                     y[i].classList.remove("iu-select-arrow-active");
                   }
                 }
                 for (i = 0; i < xl; i++) {
                   if (arrNo.indexOf(i)) {
                     x[i].classList.add("iu-select-hide");
                   }
                 }
              }
              /*if the user clicks anywhere outside the select box,
                then close all select boxes:*/
            document.addEventListener("click", closeAllSelect);
        }
    }


    //Function to add scroll bar to custom select when number of options over maxCustomSelectOptions
    this.customSelectScrollBar = function(newElmnt = null) {
        if (returnOptionValue('selectOrder') == true && returnOptionValue('customSelect') == true) {
            var maxCustomSelectOptions = returnOptionValue('maxCustomSelectOptions');
            var imageItemLength = gallery.getElementsByClassName('iu-image-item').length;
            var customSelectItems = gallery.getElementsByClassName('iu-select-items');
            var selectSelectedElmnt = gallery.getElementsByClassName('iu-select-selected');
            if (imageItemLength > maxCustomSelectOptions) {
                //If new Element exists like move element or select position
                // for element. Then add scroll Bar to only new element
                if (newElmnt) {
                    var newCustomSelectItems = newElmnt.getElementsByClassName('iu-select-items')[0];
                    newCustomSelectItems.style.overflowY = 'auto';
                    newCustomSelectItems.style.height = maxCustomSelectOptions * selectSelectedElmnt[0].offsetHeight + 'px';
                }
                //Add scroll to all elements like when people add image or delete image.
                else {
                    for (var i = 0; i < customSelectItems.length; i++) {
                        customSelectItems[i].style.overflowY = 'auto';
                        customSelectItems[i].style.height = maxCustomSelectOptions * selectSelectedElmnt[0].offsetHeight + 'px';
                    }
                }
            }
        }
    }

    this.defaultOptions = {
        //Div Id where images uploaded show inside here.
        //Important: Gallery for image must have a class of position: relative for dragging image work.
        imageGalleryId: 'please declare it',

        //Route to save images uploaded with the method is 'POST'
        saveImageRoute : 'please declare it',

        //An optional object to send additional data that images belonged to. Like image belongs to 'post_id', 'user_id' or 'thread_id'.
        //Ex: { "post_id": "1562" }
        //You set imageBelongsTo object like this: {'Name' : 'Value'}
        imageBelongsTo : null,

        //The timeout for saving image request can take before automatically being terminated.
        saveImageRouteTimeout: 30000,

        alertServerTimeout: function() {
            _this.addFlashBox('Server time out', 2000, '#f00e0e');
        },

        //Route to save image number with the method is 'POST'
        saveImageNumberRoute : 'please declare it',

        //The timeout for saving image number can take before automatically being terminated.
        saveImageNumberRouteTimeout: 30000,

        //Route to save images order number with the method is 'POST'
        saveImageOrderRoute : 'please declare it',

        //The timeout for saving image order number request can take before automatically being terminated.
        saveImageOrderRouteTimeout: 30000,

        //Route to delete images with the method is 'POST'
        deleteImageRoute : 'please declare it',

        //The timeout for deleting images request can take before automatically being terminated.
        deleteImageRouteTimeout: 30000,

        //The text used for the file upload
        dictuploadImageNote: 'Press or drag images here to upload',

        // The text used when images are uploading,  @imageNumber is a variable for number of images it being uploaded.
        //Ex: you could declare different like:' @imageNumber images uploading'
        //Or 'Uploading @imageNumber images, please wait...'
        //If null then it won't change.
        dictUploadingMessage: null,

        // If 'true' then image will have a select below to change image order for sortable purpose
        selectOrder: true,

        // If true then select order must be also 'true'. This option used for customizing select for style you choose
        //and work accross all browser is the same select style.
        //You must set selectOrder : true to use this customSelect feature.
        customSelect: true,

        //Boolean. When present, it specifies that the user is allowed to upload more
        //than one value in the <input> element.
        multiple: true,

        //Boolean value. True if you want to display image order number over image.
        //False image order number will not be showed.
        addImageOrderNumber: true,

        //Boolean value, specifies where delete buttom should be added.
        deleteImageButtom: true,

        // Limit the maximum number of images could be uploaded.
        maxImages: 10,

        //Add preview image while images are uploading to server.
        //This option if set to 'true' will make image uploader run slower than normal because
        //it need to append original large size image to image tag. So it's inadvisable.
        previewImage: false,

        //Boolean. An option to decide if you want to add progress as percent bar to image tag when uploading.
        progressPercentBar: false,

        //Boolean. An option to decide if you want to add progress as spinner to image tag when uploading.
        progressSpinner: false,

        //Percent. If 'progressSpinner' set to 'true'. Set size of spinners compare with image size in percent.
        progressSpinnerSize: '50%',

        //Boolean. Show number of percent uploaded as text inside progress div.
        showPercentText: true,

        alertMaxImages: function () {
            _this.addFlashBox('Maximum images is: ' + returnOptionValue('maxImages'), 2000, '#f00e0e');
        },

        //Show alert when server error occured when sending XMLHttpRequest (AJAX).
        alertServerError: function() {
            _this.addFlashBox('Server Error', 2000, '#f00e0e');
        },
        //Numer of maximum options in custom select element. If over maximum options then automatically add a scrollbar.
        //Must set selectOrder: true and customSelect: true to use this feature.
        maxCustomSelectOptions: 5,

        //Maximum image columns to show in image gallery div
        maxImageColumn: 4,

        // Minimin image columns to show in image gallery div
        minImageColumn: 2,

        // The minimum width of a images in pixel. Used with 'maxImageColumn' and 'minImageColumn' to decide number image column show.
        minImageWidth: 150,

        //This option to indicate the height of image when showed in gallery compare with showed width.
        //Default is 1 so width equal height.
        //You cannot set width because width is set for resposiveness accoss screen.
        showedHeightWithWidth: 1,

        //The maximum size of a image in MB. If exceeds not get uploaded and the event'maxImageSize' will be called
        maxImageSize: 50,

        //The function to alert customer when they uploaded images with their size over 'maxImageSize'.
        //The default function show a flashBox at the bottom right of screen. And it's look like this with default option: 'Maximum image size is: ' + maxImageSize + 'MB'
        showAlertOnMaxImageSize: function() {
            _this.addFlashBox(returnOptionValue('maxImageSizeText') + returnOptionValue('maxImageSize') + 'MB', returnOptionValue('oversizeTimeout'), '#f00e0e');
        },

        //Text for flash box to appear when image oversize being uploaded
        maxImageSizeText: 'Maximum image size is: ', //The end of string is 'maxImageSize' + 'MB'

        //Timeout for Flash box appear when images oversize get uploaded
        oversizeTimeout: 2000,

        //Background Color for Flash box to appear when image oversize being uploaded
        oversizeBackgroundColor: '#f00e0e',

        //The maximum width of images to resize before uploaded. If only one, maxResizedWidth or maxResizedHeight
        // is provided, the original aspect ratio of the file will be preserved.
        maxResizedWidth : 1000,

        //See maxResizedWidth
        maxResizedHeight : null,

        //The minimim image width in pixel that image can be uploaded to server. If exceed will not upload.
        minImageUploadedWidth: null,

        //The minimim image height in pixel that image can be uploaded to server. If exceed will not upload.
        minImageUploadedHeight: null,

        //timeout to disable gallery from being click in miliseconds.
        //This option is to prevent user from drag and drop image to reset image order too fast.
        //The consequences is increase server usage and make browser running too fast to reset image order.
        lagTimeDisableGalleryAfterElementDragged: 200,

        // The function to alert user that they have uploaded image that too small.
        minSizeImageUploadedAlert: function() {
            _this.addFlashBox('Image too small', 2000, '#e30b0b');
        },

        //If true then allow user to upload same images multiple times.
        allowSameImage: false,

        sameImageUploadedAlert: function() {
            _this.addFlashBox('Image have been uploaded', 2000, '#e30b0b');
        },

        //Ex: 'image/jpeg' or 'image/png' or 'image/png'... The mime type of the resized image. If null the original mime type will be used.
        //If you need to change the file extension ex: '.png' or '.jpg' then see 'renameImage' option below
        resizeMimeType: null,

        //An optional object to send additional headers to the server. Eg: { "X-CSRF-TOKEN": "RSR6tkicph20COW11SOTT5S04j41QXZmfz4bTRwI" }
        //you set header object like this: {'headerName' : 'headerValue'}
        headers: null,

        //Boolean. An options to enable or disable drag and drop feature.
        dragAndDropFeature: true,

        //Specifies a filter for what image types the user can pick from the file input dialog box.
        //Ex: 'image/*' for all type of image or 'image/jpeg, image/png'.
        //The <input type = 'file'> will have accept attribute equal acceptedMimeType.
        acceptedMimeType: 'image/*',

        showAlertMimeType: function() {
            _this.addFlashBox('Wrong image type', 2000, '#e30b0b');
        },

        //An option to add Logo or watermark to image with this syntax to use drawImage function: [imagePath, x, y, width, height]
        //x is the x coordinate where to place the image on the canvas.
        // y is the y coordinate where to place the image on the canvas
        //width:	Optional. The width of the image to use (stretch or reduce the image)
        //height:	Optional. The height of the image to use (stretch or reduce the image)
        // Ex: ["/image/logo.png", 20, 20, 100, 100] or ["/image/logo.png", 20, 20] or ["/image/logo.png", 20, 20, 100] or ["/image/logo.png", 20, 20, ,100]
        //If you want to add logo at the exact center of image then add one more item at the end of array with value 'center'.
        //Syntax: [imagePath, width, height, 'center'].
        // You could provide width and height with empty value to keep original logo size.
        // Syntax: [imagePath, , , 'center']
        addLogo: null,

        //Element inside gallery to insert Before. If you want to you insertBefore instead of appendChild with gallery.
        insertBeforeElmnt: null,

        // Is a function that is called to rename the file before upload to the server.
        // This function have one argument is original image name and must return image name. The name of image is set
        // with current time plus random number from 1000 to 2000 then add file extension
        //
        renameImage: function(originalName) {
            var dt = new Date();
            var time = dt.getTime();
            var x = (Math.floor((Math.random() * 1000) + 1000)).toString();
            var fileExt = originalName.split('.').pop();
            return time + x + '.' + fileExt;
        },

        //Is a function to run to set up more features for image upload like you wish.
        setup: function() {

        },

        //Function to highlight image upload div when files hover over image upload zone. Using drag and drop feature.
        //The default is to change the border to red. See class iu-highlight in css file
        // The target is the div with id="image-upload"
        // Using drag and drop feature.
        hightlight : function(target) {
            target.classList.add('iu-highlight');
        },

        //Function to unhighlight image upload div when files hover outside of image upload zone. Using drag and drop feature.
        //The default is to change the border back the previous color.
        unhightlight: function(target) {
            target.classList.remove('iu-highlight');
        },

        //Call when images are uploading to change the title of image upload.
        //Default is: 'Uploading images, please wait...' with the spinner: 'iu-spinner' below to indicate uploading.
        //Function accept one argument is image upload title with a class 'iu-image-note'.
        //imageUploadZone is a div contains input type='file' that you declare.
        changeInputTitleWhenUploading: function(fileLength) {
            if (fileLength) {
                gallery.style.pointerEvents = 'none';
            }
            var dictUploadingMessage = returnOptionValue('dictUploadingMessage');
            if (dictUploadingMessage) {
                dictUploadingMessage = dictUploadingMessage.replace("@imageNumber", fileLength);
                if (fileLength == 1) {
                    dictUploadingMessage = dictUploadingMessage.replace("images", 'image');
                }
                imageNoteOfImageUpload.innerHTML = dictUploadingMessage + "<div class='iu-spinner'></div>";
                imageUploadZone.style.backgroundColor = '#d5ccc3';
            }
        },

        //Function to change back the input title after all images are uploaded to default value. See 'changeInputTitleWhenUploading' above.
        changeBackInputTitle: function(error = null) {
            if (error !== true) {
                checkMethodExists('changeInputAndInputTitleStyle');
                // changeBack();
            }
            else if (!gallery.getElementsByClassName('iu-image-uploading-placeholder').length) {
                var imageItem = gallery.getElementsByClassName('iu-image-item');
                var imageItemLength = imageItem.length;
                for (var i = 0; i < imageItemLength; i++) {
                    var selectElmnt = imageItem[i].getElementsByClassName('iu-select-number')[0];
                    var selectElmntLength = selectElmnt.length;
                    for (var j = imageItemLength; j < selectElmntLength; j++) {
                        selectElmnt.remove(imageItemLength);
                    }
                }
                var customSelectElmnts = gallery.getElementsByClassName('iu-custom-select');
                _this.customSelect(customSelectElmnts);
                resetImageOrder(null, true, true);
                checkMethodExists('changeInputAndInputTitleStyle');

            }
        },

        //Function to change input upload and input upload note when
        changeInputAndInputTitleStyle: function() {
            imageNoteOfImageUpload.innerHTML = returnOptionValue('dictuploadImageNote');
            imageUploadZone.style.backgroundColor = '#ffffff';
            gallery.style.pointerEvents = 'auto';
        },

        setImagesWidthAndHeight: function(imageElmnt) {
            var galleryWidth = gallery.clientWidth;
            var minImageWidth = returnOptionValue('minImageWidth');
            var maxImageColumn = returnOptionValue('maxImageColumn');
            var minImageColumn = returnOptionValue('minImageColumn');
            var showedHeightWithWidth = returnOptionValue('showedHeightWithWidth');
            //Set the width and height of images based on customer configuration.
            if (galleryWidth/maxImageColumn > minImageWidth) {
                imageElmnt.style.width = galleryWidth/maxImageColumn + 'px';
                imageElmnt.style.height = galleryWidth/maxImageColumn*showedHeightWithWidth + 'px';
            }
            else {
                imageElmnt.style.width = galleryWidth/minImageColumn + 'px';
                imageElmnt.style.height = galleryWidth/minImageColumn*showedHeightWithWidth + 'px';
            }
        },
        //Function to alert user when they change position of image and did not saved to server yet.
        // For the addFlashBox function the first argument is the text to appear on flash box.
        // The second argument is the timeout for XMLHttpRequest. Maximum is 30 seconds
        // The third argument is the background color of flash box.
        savingImageOrderAlert: function() {
            _this.addFlashBox('Saving...', 30000, 'DodgerBlue');
        },

        //Function to alert user after user change the position of image and image order was saved to server.
        //Or alert when user delete image and the server deleted the image.
        // The second argument is the time interval to show flash box; (show for 1 second);
        savedImageOrderAlert: function() {
            _this.addFlashBox('Saved', 1000, 'DodgerBlue');
        },

        //Function to alert users when they press delete buttom over image and is sending request to server but the server not handling yet.
        deletingImageAlert : function() {
            _this.addFlashBox('Deleting...', 30000, 'DodgerBlue');
        },

        //Boolean. This option for me to show demo on website without actually sending image to server.
        //If true then image will not be send. False image will be send.
        sendFormDataWithoutImage: false,

    };
    var camelizeDivId = camelizeWithoutDash(divId);
    //Add camelizeDivId object that customer defined to options
    this.options[camelizeDivId] = options;
    //Attach _this to this object constructor
    var _this = this
    var optionsWithCamelizeDivId = this.options[camelizeDivId];
    var defaultOptions = this.defaultOptions;

    //Add input type = file for imageUpload div and text
    // var imageUploadClass = 'image-upload';
    var imageUploadZone = document.getElementById(divId);
    //Add data-image-upload-id to gallery element to get image-upload-id from gallery element.
    var galleryId = returnOptionValue('imageGalleryId');
    var gallery = document.getElementById(galleryId);
    var progressPercentBar = returnOptionValue('progressPercentBar');
    var progressSpinner = returnOptionValue('progressSpinner');
    var showPercentText = returnOptionValue('showPercentText');
    //Set gallery to style position relative for dragging image to work.
    gallery.style.position = 'relative';
    //resize image when browser resised based on customer configuration

    ['resize', 'load'].forEach(resizeImage);

    function resizeImage(eventName) {
        window.addEventListener(eventName, function() {
            var images = gallery.getElementsByClassName('iu-image-placeholder');
            for (var i = 0; i < images.length; i++) {
                checkMethodExists('setImagesWidthAndHeight', images[i]);
            }
        });
    }

    //When click on image upload zone trigger click for input
    imageUploadZone.addEventListener('click', function() {
        imageUploadZone.getElementsByClassName('iu-button')[0].click();
    });

    var fileInput = document.createElement('input');
    fileInput.className = 'iu-button';
    fileInput.setAttribute('type', 'file');
    //Add accept equal mime type that customer defined
    fileInput.setAttribute('accept', returnOptionValue('acceptedMimeType'));
    fileInput.setAttribute('autocomplete', 'off');
    fileInput.setAttribute('title', '');
    var multiple = returnOptionValue('multiple');
    fileInput.multiple = multiple;
    fileInput.addEventListener('change', function () {
        handleFiles(event, this.files);
    });
    imageUploadZone.appendChild(fileInput);

    //Add a note to input element to show customer how to use them
    var uploadNote = document.createElement('div');
    uploadNote.className = 'iu-image-note';
    uploadNote.innerHTML = returnOptionValue('dictuploadImageNote');
    imageUploadZone.appendChild(uploadNote);
    var fileNames = [];
    var imageNoteOfImageUpload = imageUploadZone.getElementsByClassName('iu-image-note')[0];

    if (returnOptionValue('dragAndDropFeature') === true) {
        //Add drag and drop features for input zone.
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(addPreventDefaults);


        function addPreventDefaults(eventName) {
            imageUploadZone.addEventListener(eventName, preventDefaults, false);
        }

        function preventDefaults (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        //Add highlight feature when user drag files over image upload zone
        ['dragenter', 'dragover'].forEach(addHighlight);

        function addHighlight(eventName) {
            imageUploadZone.addEventListener(eventName, highlight, false);
        }


        ['dragleave', 'drop'].forEach(addUnhighlight);

        function addUnhighlight(eventName) {
            imageUploadZone.addEventListener(eventName, unhighlight, false);
        }

        //Function to highlight image-upload div when files hover over image upload zone.
        function highlight(e) {
            var target = getTargetForHighlight(e);
            checkMethodExists('hightlight', target);
        }

        //Function to unhighlight image-upload div when files hover over image upload zone.
        function unhighlight(e) {
            var target = getTargetForHighlight(e);
            checkMethodExists('unhightlight', target);
        }

        imageUploadZone.addEventListener('drop', handleDrop, false);
        //When user drop files then call handleFiles function to process file.


        function handleDrop(e) {
            var dt = e.dataTransfer;
            var files = dt.files;
            if (files.length) {
                handleFiles(e, files);
            }
        }
    }

    checkMethodExists('setup');

    function handleFiles(e, files) {
        var fileLength = files.length;
        var target = e.target;
        var childNodesOfImageUpload = target.parentNode.childNodes;
        var maxImages = returnOptionValue('maxImages');
        var imageItemLength = gallery.getElementsByClassName('iu-image-item-style').length;
        var maxFileBoolean = false;
        if (maxImages - imageItemLength <= 0) {
            maxFileBoolean = true;
            checkMethodExists('alertMaxImages');
        }

        var satisfiedFileSizeArray = [];
        var currentFileNames = [];
        if (maxImages - (fileLength + imageItemLength) < 0) {
            checkMethodExists('alertMaxImages');
            fileLength = maxImages - imageItemLength;
        }
        //Check the file size then list satisfied image to satisfiedFileSizeArray
        for (var i = 0; i < fileLength; i++) {
            var fileType = files[i].type;
            var acceptedMimeType = returnOptionValue('acceptedMimeType');
            var imageSize = files[i].size/1000000;
            var maxImageSize = returnOptionValue('maxImageSize');
            if (imageSize > maxImageSize) {
                checkMethodExists('showAlertOnMaxImageSize');
            }
            else if (!fileType.includes("image")) {
                checkMethodExists('showAlertMimeType');
            }
            else if (acceptedMimeType !== 'image/*' && !acceptedMimeType.includes(fileType)) {
                checkMethodExists('showAlertMimeType');
            }
            else if (returnOptionValue('allowSameImage') == false && fileNames.includes(files[i].name)) {
                checkMethodExists('sameImageUploadedAlert');
            }
            else {
                satisfiedFileSizeArray.push(i);
                fileNames.push(files[i].name);
                currentFileNames.push(files[i].name);
            }
            if (i == fileLength - 1) {
                var satisfiedFileSizeArrayLength = satisfiedFileSizeArray.length;
                if (satisfiedFileSizeArrayLength > 0) {
                    checkMethodExists('changeInputTitleWhenUploading', satisfiedFileSizeArrayLength);

                    var imageOrderNumberClass = gallery.getElementsByClassName("iu-image-order-number");
                    var imageOrderLength = imageOrderNumberClass.length;
                    var selectElements = gallery.getElementsByClassName('iu-select-number');
                    var selectElementLength = selectElements.length;
                    var selectOrderOption = returnOptionValue('selectOrder');
                    var addImageOrderNumber = returnOptionValue('addImageOrderNumber');
                    var customSelectOption = returnOptionValue('customSelect');

                    //Add option for existed select
                    if (selectOrderOption == true) {
                        var selectElementLength = selectElements.length;
                        for (var i = 0; i < selectElementLength; i++) {
                            var selectI = selectElements[i];
                            for (var j = 0; j < satisfiedFileSizeArrayLength; j++) {
                                var option = document.createElement('option');
                                option.text = selectElementLength + j + 1;
                                selectI.add(option);
                            }
                        }
                        if (customSelectOption == true) {
                            var selectDivCollection = gallery.getElementsByClassName('iu-custom-select');
                            _this.customSelect(selectDivCollection);
                        }
                    }

                    //Create image placehoder
                    for (var i = 0; i < satisfiedFileSizeArrayLength; i++) {
                        var imageUploadingPlaceHolder = document.createElement('div');
                        imageUploadingPlaceHolder.className = "iu-image-uploading-placeholder iu-image-item-style";
                        var fileName = currentFileNames[i].replace(" ", '_');
                        imageUploadingPlaceHolder.classList.add(fileName);
                        // _this.setImagesWidthAndHeight(imageUploadingPlaceHolder);

                        //create proxy image element
                        var imagePlaceholder = document.createElement('img');
                        imagePlaceholder.className = 'iu-image-placeholder';
                        imagePlaceholder.style.animation = 'iu-backgroundColor 2000ms linear infinite';
                        checkMethodExists('setImagesWidthAndHeight', imagePlaceholder);
                        imagePlaceholder.setAttribute('draggable', false);
                        imageUploadingPlaceHolder.appendChild(imagePlaceholder)

                        //Add image order number to image
                        var imageOrderNumber = document.createElement('div');
                        imageOrderNumber.className = 'iu-image-order-number';
                        if (addImageOrderNumber == false) {
                            imageOrderNumber.classList.add('iu-display-none');
                        }
                        imageOrderNumber.innerHTML = i + imageOrderLength + 1;
                        imageUploadingPlaceHolder.appendChild(imageOrderNumber);


                        //Create select for new image
                        if (selectOrderOption == true) {
                            var selectDiv = document.createElement('div');
                            selectDiv.className = "iu-custom-select";
                            var selectNumber = document.createElement('select');
                            if (customSelectOption == true) {
                                selectNumber.classList.add('iu-display-none');
                            }
                            selectNumber.addEventListener('focus', function() {
                                selectNumberChange(event);
                            });
                            selectNumber.classList.add('iu-select-number');
                            selectDiv.appendChild(selectNumber);
                            imageUploadingPlaceHolder.appendChild(selectDiv);
                            selectDiv.addEventListener('mousedown', function() {
                                selectClick(event);
                            });
                            //add option for new image select
                            for (var j = 0; j < selectElementLength + satisfiedFileSizeArrayLength; j++) {
                                var option = document.createElement('option');
                                option.text = j + 1;
                                selectNumber.add(option);
                                if (j == i + selectElementLength) {
                                    option.selected = true;
                                }
                            }
                            var customSelectDiv = selectDiv.parentNode.getElementsByClassName('iu-custom-select');
                            _this.customSelect(customSelectDiv);
                        }

                        if (progressPercentBar === true) {
                            var progressBar = document.createElement('div');
                            progressBar.className = 'iu-progress-bar';
                            var percentBar = document.createElement('div');
                            percentBar.className = 'iu-percent-bar';
                            if (showPercentText === true) {
                                percentBar.innerHTML = '0%';
                            }
                            progressBar.appendChild(percentBar);
                            imageUploadingPlaceHolder.appendChild(progressBar);
                        }
                        else if (progressSpinner === true) {
                            var spinner = document.createElement('div');
                            spinner.className = 'iu-progress-spinner';
                            spinner.style.width = returnOptionValue('progressSpinnerSize');
                            imageUploadingPlaceHolder.appendChild(spinner);
                            if (showPercentText === true) {
                                var percentDiv = document.createElement('div');
                                percentDiv.className = 'iu-percent-div';
                                percentDiv.innerHTML = '0%';
                                imageUploadingPlaceHolder.appendChild(percentDiv);
                            }
                        }


                        galleryAppend(imageUploadingPlaceHolder);

                        if (progressSpinner === true) {
                            function setSpinnerSize() {
                                var spinnerWidth = spinner.offsetWidth;
                                var imageUploadingPlaceHolderWidth = imageUploadingPlaceHolder.offsetWidth;
                                var imageUploadingPlaceHolderHeight = imageUploadingPlaceHolder.offsetHeight - imageUploadingPlaceHolder.getElementsByClassName('iu-custom-select')[0].offsetHeight;
                                spinner.style.height = spinner.offsetWidth + 'px';
                                spinner.style.top = 0.5*imageUploadingPlaceHolderHeight - 0.5*spinnerWidth + 'px';
                                spinner.style.left = 0.5*imageUploadingPlaceHolderWidth - 0.5*spinnerWidth + 'px';
                                if (showPercentText === true) {
                                    percentDiv.style.top = 0.5*imageUploadingPlaceHolderHeight - 0.5*percentDiv.offsetHeight + 'px';
                                    percentDiv.style.left = 0.5*imageUploadingPlaceHolderWidth - 0.5*percentDiv.offsetWidth + 'px';
                                }
                            }
                            setSpinnerSize();
                            window.addEventListener('resize', setSpinnerSize);
                        }

                    }

                }
                for (var j = 0; j < satisfiedFileSizeArrayLength; j++) {
                    processFileReader(files[j], j, satisfiedFileSizeArrayLength, satisfiedFileSizeArray);
                }
            }
        }


    }

    function galleryAppend(imageItem) {
        var insertBeforeElmnt = returnOptionValue('insertBeforeElmnt');
        if (insertBeforeElmnt) {
            gallery.insertBefore(imageItem, insertBeforeElmnt);
        }
        else {
            gallery.appendChild(imageItem);
        }
    }


    //Check if browser support image orientation exif data from imame. If not support then rotate image due to exif
    var supportImageOrientation = CSS.supports('image-orientation', 'from-image');

    function processFileReader(file, fileNumber, fileLength, satisfiedFileSizeArray) {
        //If no satisfied size image uploaded change back the title to original title.
        if (satisfiedFileSizeArray.length == 0) {
            checkMethodExists('changeBackInputTitle');
        }
        if (satisfiedFileSizeArray.includes(fileNumber)) {
            var imageUploaded = file;
            var imageOrientation;
            var imageName = file.name;
            imageName = imageName.replace(" ", "_");
            var resizeMimeType = returnOptionValue('resizeMimeType');
            var imageType;
            if (resizeMimeType) {
                imageType = resizeMimeType;
            }
            else {
                imageType = file.type;
            }
            var reader = new FileReader();
            reader.readAsDataURL(imageUploaded);
            reader.onload = function(e) {
                var image = new Image();
                image.src = e.target.result;
                image.onload = function(e) {

                    if (returnOptionValue('previewImage') === true) {
                        var imageUploadingPlaceHolder = gallery.getElementsByClassName(imageName)[0];
                        var imageTag = imageUploadingPlaceHolder.getElementsByTagName('img')[0];
                        imageTag.style.animation = 'none';
                        imageTag.setAttribute('src', image.src);
                    }

                    var orientation;
                    //Set width and height of the canvas to draw image for resizing
                    var maxWidth = returnOptionValue('maxResizedWidth');
                    var maxHeight = returnOptionValue('maxResizedHeight');
                    var width = image.width; var height = image.height;
                    var minImageUploadedWidth = returnOptionValue('minImageUploadedWidth');
                    var minImageUploadedHeight = returnOptionValue('minImageUploadedHeight');
                    if (minImageUploadedWidth && width < minImageUploadedWidth) {
                        checkMethodExists('minSizeImageUploadedAlert');
                        changeInputTitleBack();
                        return;
                    }
                    else if (minImageUploadedHeight && height < minImageUploadedHeight) {
                        checkMethodExists('minSizeImageUploadedAlert');
                        changeInputTitleBack();
                        return;
                    }
                    var blobImage, savedImage;
                    if (maxWidth && width >= maxWidth && !maxHeight) {
                        height = height * maxWidth / width;
                        width = maxWidth;
                    }
                    else if (maxHeight && height >= maxHeight && !maxWidth) {
                        width = width * maxHeight/height;
                        height = maxHeight;
                    }
                    else if (maxWidth && maxHeight) {
                        if (width >= maxWidth && maxWidth) {
                            width = maxWidth;
                        }
                        if (height >= maxHeight && maxHeight) {
                            height = maxHeight
                        }
                    }
                    getOrientation(image, function(orientation) {
                        var canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;

                        if (supportImageOrientation != true) {
                            if (orientation > 4) {
                                canvas.width = height;
                                canvas.height = width;
                            }
                        }

                        var ctx = canvas.getContext('2d');
                        //If orientation not equal 1 then rotate canvas to draw image to resolve exif problem
                        if (supportImageOrientation != true) {
                            switch (orientation) {
                                case 2:
                                // horizontal flip
                                ctx.translate(canvas.width, 0);
                                ctx.scale(-1, 1);
                                break;
                                case 3:
                                // 180° rotate left
                                ctx.translate(canvas.width, canvas.height);
                                ctx.rotate(Math.PI);
                                break;
                                case 4:
                                // vertical flip
                                ctx.translate(0, canvas.height);
                                ctx.scale(1, -1);
                                break;
                                case 5:
                                // vertical flip + 90 rotate right
                                ctx.rotate(0.5 * Math.PI);
                                ctx.scale(1, -1);
                                break;
                                case 6:
                                // 90° rotate right
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(0, -canvas.width);
                                break;
                                case 7:
                                // horizontal flip + 90 rotate right
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(canvas.height, -canvas.width);
                                ctx.scale(-1, 1);
                                break;
                                case 8:
                                // 90° rotate left
                                ctx.rotate(-0.5 * Math.PI);
                                ctx.translate(-canvas.height, 0);
                                break;
                            }
                        }

                        ctx.drawImage(image, 0, 0, width, height);
                        var addLogoOption = returnOptionValue('addLogo');
                        if (addLogoOption != null && addLogoOption.length) {
                            var logo = new Image();
                            logo.src = addLogoOption[0];
                            logo.onload = function() {
                                if (addLogoOption[3] == 'center') {
                                    if (!addLogoOption[1] && !addLogoOption[2]) {
                                        var xCoor = (width - logo.width)/2;
                                        var yCoor = (height - logo.height)/2;
                                        ctx.drawImage(logo, xCoor, yCoor);
                                    }
                                }
                                else if (!addLogoOption[3] || !addLogoOption[4]) {
                                    ctx.drawImage(logo, addLogoOption[1], addLogoOption[2]);
                                }
                                else {
                                    ctx.drawImage(logo, addLogoOption[1], addLogoOption[2], addLogoOption[3], addLogoOption[4]);
                                }
                                saveImage();
                            }
                        }
                        else {
                            saveImage();
                        }

                    function saveImage() {
                        //Base64 image
                        savedImage = canvas.toDataURL(imageType, 1.0);
                        // Split the base64 string in data and contentType
                        var block = savedImage.split(";");
                        // get the real base64 content of the file
                        var realDecodeImage = block[1].split(",")[1];
                        blobImage = b64toBlob(realDecodeImage, imageType);
                        var formData = new FormData();
                        var newImageName = setFileName(imageName);
                        //Send resized image to server.
                        if (returnOptionValue('sendFormDataWithoutImage') === true) {
                            formData.append('image', newImageName);
                        }
                        else {
                            formData.append('image', blobImage, newImageName);
                        }
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                // Add new image if success
                                appendImage(savedImage, imageName, Number(this.response));
                                changeInputTitleBack();
                            }
                        };
                        //apend to form data imageBelongsTo attribute to save on the server.
                        appendToFormData(returnOptionValue('imageBelongsTo'), formData);

                        xhttp.upload.addEventListener('progress', function(e) {
                            var percentComplete = parseInt((e.loaded / e.total) * 100);
                            if (progressPercentBar === true || progressSpinner === true) {
                                var imageItem = gallery.getElementsByClassName(imageName)[0];
                                var width = 0;
                                var id = setInterval(frame, 1);
                                function frame() {
                                    if (width >= 100) {
                                        clearInterval(id);
                                    } else {
                                        if (width < percentComplete) {
                                            width++;
                                        }
                                        if (progressPercentBar === true) {
                                            var percentBar = imageItem.getElementsByClassName('iu-percent-bar')[0];
                                            percentBar.style.width = width + "%";
                                        }
                                        else if (progressSpinner === true) {
                                            percentBar = imageItem.getElementsByClassName('iu-percent-div')[0];
                                        }
                                        if (showPercentText === true) {
                                            percentBar.innerHTML = width  + "%";
                                        }

                                    }
                                }
                            }

                        });
                        xhttp.addEventListener("error", function() {
                            checkMethodExists('alertServerError');
                            removeImage(imageName);
                        });

                        var saveImageRoute = returnOptionValue('saveImageRoute');
                        xhttp.open("POST", saveImageRoute, true);
                        setHeaders(xhttp);
                        xhttp.timeout = returnOptionValue('saveImageRouteTimeout');
                        xhttp.ontimeout = function (e) {
                            setTimeout(function() {
                                removeImage(imageName);
                            }, 2000)
                            checkMethodExists('alertServerTimeout');
                        }
                        xhttp.send(formData);
                    }
                    });
                    function changeInputTitleBack() {
                        if (fileNumber == satisfiedFileSizeArray[satisfiedFileSizeArray.length - 1]) {
                            checkMethodExists('changeBackInputTitle');
                        }
                    }
                }
            }
        }
    }


    function appendImage(savedImage, imageName, savedImageId) {
        var imageItem = gallery.getElementsByClassName(imageName)[0];
        if (progressPercentBar === true) {
            var progressBar = imageItem.getElementsByClassName('iu-progress-bar')[0];
            _this.fadeOutEffect(progressBar);
        }
        else if (progressSpinner === true) {
            var spinner = imageItem.getElementsByClassName('iu-progress-spinner')[0];
            if (showPercentText === true) {
                var percentDiv = imageItem.getElementsByClassName('iu-percent-div')[0];
            }
            _this.fadeOutEffect(spinner);
            _this.fadeOutEffect(percentDiv);
        }
        imageItem.classList.add("iu-image-item");
        imageItem.setAttribute("data-image-id", savedImageId);
        var imageUploaded = imageItem.getElementsByTagName('img')[0];
        imageUploaded.style.animation = 'none';
        imageUploaded.setAttribute("src", savedImage);

        imageUploaded.setAttribute("alt", imageName);
        imageItem.classList.remove('iu-image-uploading-placeholder');


        var imageNumber = Number(imageItem.getElementsByClassName('iu-image-order-number')[0].innerHTML);

        //Send image number with image id to the server to update image number order
        var xhttp = new XMLHttpRequest();
        var formData = new FormData();
        formData.append('imageNumber', imageNumber);
        formData.append('imageId', savedImageId);
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            }
        };
        xhttp.addEventListener("error", function() {
            checkMethodExists('alertServerError');
        });
        var saveImageNumberRoute = returnOptionValue('saveImageNumberRoute');
        xhttp.open("POST", saveImageNumberRoute, true);
        setHeaders(xhttp);
        xhttp.timeout = returnOptionValue('saveImageNumberRouteTimeout');
        xhttp.ontimeout = function (e) {
            checkMethodExists('alertServerTimeout');
        }
        xhttp.send(formData);


        if (returnOptionValue('deleteImageButtom') == true) {
            //Add close button to image
            var closeButton = document.createElement('div');
            closeButton.className = "iu-close-button";
            closeButton.setAttribute('data-image-name', imageName);
            var closeIcon = document.createElement('div');
            closeIcon.innerHTML = '&times;';
            closeIcon.className = 'iu-close-icon';
            closeButton.appendChild(closeIcon);
            closeButton.addEventListener("mousedown", function() {
                deleteImage(event);
            });
            imageItem.appendChild(closeButton);
        }

        addEventListenerForDragElement(imageItem);
        _this.customSelectScrollBar();
    }

    function removeImage(imageName)
    {
        var imageItem = gallery.getElementsByClassName(imageName)[0];
        imageItem.remove();
        checkMethodExists('changeBackInputTitle', true);
    }

    function selectNumberChange(event) {
        // event.stopPropagation();
        var select = event.target;
        var variables = getVariablesForSelectChange(select);
        var imageItem = variables[0];
        var previousVal = variables[1];
        select.onchange = function () {
            selectChange('none', select, imageItem, previousVal);
        }
    }

    function deleteImage(event) {
        event.stopPropagation();
        var target = event.target;
        if (target.className.includes('iu-close-icon')) {
            target = target.parentNode;
        }
        var elmnt = target;
        var imageItem = elmnt.parentNode;
        var deletedImageId = imageItem.getAttribute('data-image-id');
        var deleteImageRoute = returnOptionValue('deleteImageRoute');
        elmnt.onmouseup = function() {
            checkMethodExists('deletingImageAlert');
            var xhttp = new XMLHttpRequest();
            var formData = new FormData();
            formData.append('imageId', deletedImageId);
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var imageItemLength = gallery.getElementsByClassName('iu-image-item').length;
                    if (imageItemLength == 1) {
                        checkMethodExists('savedImageOrderAlert');
                        //Remove file record in file input to upload old file.
                        imageUploadZone.getElementsByClassName('iu-button')[0].value = '';
                    }
                    var fileName = elmnt.getAttribute('data-image-name');
                    var indexOfFileName = fileNames.indexOf(fileName);

                    //remove file name from fileNames array to allow reupload same image
                    if (indexOfFileName > -1) {
                        fileNames.splice(indexOfFileName, 1);
                    }

                    elmnt.parentNode.remove();
                    var selectOptions = gallery.getElementsByClassName('iu-select-number');
                    if (selectOptions.length) {
                        selectOptionLength = selectOptions[0].options.length;
                        for (var i = 0; i < selectOptions.length; i++) {
                            selectOptions[i].options[selectOptionLength - 1].remove();
                        }
                        resetImageOrder(null, true, true);
                    }
                }
            };
            xhttp.addEventListener("error", function() {
                checkMethodExists('alertServerError');
            });
            xhttp.open("POST", deleteImageRoute, true);
            setHeaders(xhttp);
            xhttp.timeout = returnOptionValue('deleteImageRouteTimeout');
            xhttp.ontimeout = function (e) {
                checkMethodExists('alertServerTimeout');
            }
            xhttp.send(formData);
        }
    }

    function selectClick(event) {
        event.stopPropagation();
    }



    function createOptionList(selElmnt, selElmntOptionLength,divForOptionList) {
        var optionList = divForOptionList.children;
        for (var i = 0; i < optionList.length; i++) {
            optionList[i].remove();
        }
        for (j = 0; j < selElmntOptionLength; j++) {
            var optionItem = document.createElement("div");
            optionItem.innerHTML = selElmnt.options[j].innerHTML;
            optionItem.addEventListener("click", function(e) {
                /*when an item is clicked, update the original select box,
                and the selected item:*/
                var selectingElement = this.parentNode.parentNode.getElementsByTagName("select")[0];
                var selectingElementLength = selectingElement.length;
                var showedValue = this.parentNode.previousSibling;
                var variablesForSelectChange = getVariablesForSelectChange(selectingElement);
                var imageItem = variablesForSelectChange[0];
                var previousVal = variablesForSelectChange[1];
                for (i = 0; i < selectingElementLength; i++) {
                    var selectedValue = this.innerHTML;
                    if (selectingElement.options[i].innerHTML == selectedValue) {
                        selectChange(selectedValue, selectingElement, imageItem, previousVal);
                        selectingElement.selectedIndex = i;
                        showedValue.innerHTML = selectedValue;
                        var sameAsSelectedOption = this.parentNode.getElementsByClassName("iu-same-as-selected");
                        var sameAsSelectedOptionLength = sameAsSelectedOption.length;
                        for (var k = 0; k < sameAsSelectedOptionLength; k++) {
                            sameAsSelectedOption[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "iu-same-as-selected");
                        break;
                    }
                }
                showedValue.click();
            });
            divForOptionList.appendChild(optionItem);
        }
    }
    var selectElemnts = document.getElementsByClassName('iu-custom-select');
    _this.customSelect(selectElemnts);

    function getVariablesForSelectChange(select) {
        var imageItem = select.parentNode.parentNode;
        var previousVal = select.value;
        return [imageItem, previousVal];
    }

    function selectChange(selectedValue, select, imageItem, previousVal) {
        var newSelectVal;
        if (selectedValue == 'none') {
            newSelectVal = select.value;
        }
        else {
            newSelectVal = selectedValue;
        }
        var newImageItem = imageItem.cloneNode(true);
        var imageItemSelected = gallery.getElementsByClassName('iu-image-item')[newSelectVal - 1];
        if (previousVal > newSelectVal) {
            insertBefore(newImageItem, imageItemSelected);
        }
        if (previousVal < newSelectVal) {
            insertAfter(newImageItem, imageItemSelected);
        }
        if (previousVal != newSelectVal) {
            imageItem.remove();
            addFeaturesForPositionChange(newImageItem);
        }
    }

    function addEventListenerForDragElement(elmnt)
    {
        elmnt.addEventListener('mousedown', function(e) {
            dragElement(e.currentTarget);
        });
    }

    function dragElement(elmnt) {
        //Set element get dragged to the origin position due to position relative of placeholder element;
        var originTop = elmnt.offsetTop;
        var originLeft = elmnt.offsetLeft;
        elmnt.style.top = originTop + "px";
        elmnt.style.left = originLeft + "px";
        //Set up placeholder to keep position for dragged element;
        elmnt.style.position = "absolute";
        elmnt.style.zIndex = "1000";
        //Remove iu-image-item class from class List
        elmnt.classList.remove('iu-image-item');

        //Add placeHolder for elmnt.
        var placeHolder = document.createElement('div');
        placeHolder.style.visibility = "hidden";
        //Minus 1 pixel to solve problem when people resize browser and round up imageHolder width bigger than image Item width.
        //Then placeHolder will jump to next position.
        placeHolder.style.width = elmnt.offsetWidth - 1 + "px";
        placeHolder.style.height = elmnt.offsetHeight + "px";
        placeHolder.className = "iu-image-item iu-image-item-style iu-image-placeholder";
        var placeHolderItem = document.createElement('img');
        placeHolderItem.className = 'iu-image-placeholder';
        placeHolderItem.setAttribute('draggable', false);
        placeHolder.appendChild(placeHolderItem);

        //Add select to placeHolder
        if (elmnt.getElementsByClassName('iu-select-number').length == 1) {
            var selectDiv = document.createElement('div');
            var selectNumber = document.createElement('select');
            selectNumber.className = 'iu-select-number';
            selectDiv.appendChild(selectNumber);
            placeHolder.appendChild(selectDiv);
        }

        insertAfter(placeHolder, elmnt);
        var pos1 = 0, pos2 = 0;
        var pos3 = elmnt.clientX;
        var pos4 = elmnt.clientY;
        var clientWidthOfGallery = gallery.clientWidth;
        var clientHeightOfGallery = gallery.clientHeight;
        // console.log(clientWidthOfGallery + ' ' + clientHeightOfGallery);
        var ImageItemHeight = elmnt.offsetHeight;
        var ImageItemWidth = elmnt.offsetWidth;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        var positionChange = false;
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            var elmntTop = elmnt.offsetTop;
            //Get new element top and left of draggable element then compare to border to determine we can move or not
            var newElmntTop = elmntTop - pos2;
            if (newElmntTop >= 0 && newElmntTop < (clientHeightOfGallery - ImageItemHeight)) {
                elmnt.style.top = newElmntTop + "px";
            }
            var elmntLeft = elmnt.offsetLeft;
            var newElmntLeft = elmntLeft - pos1;
            if (newElmntLeft >= 0 && newElmntLeft < (clientWidthOfGallery - ImageItemWidth)) {
                elmnt.style.left = newElmntLeft + "px";
            }
            //Get the center of the draggable object for droppable purpose
            var centerX = elmntLeft + ImageItemWidth/2;
            var centerY = elmntTop + ImageItemHeight/2;
            //Get the coordinate of each image items for determine droppable target.
            var ImageItems = gallery.getElementsByClassName('iu-image-item');
            var ImageCoordinates = {};
            var indexOfDroppableElement;
            var indexOfElmnt;
            var imageItemLength = ImageItems.length;
            for (var i = 0; i < ImageItems.length; i++) {
                if (ImageItems[i] == placeHolder) {
                    indexOfElmnt = i;
                }
                if (ImageItems[i] != placeHolder) {
                    var imageItemLeftI = ImageItems[i].offsetLeft;
                    var imageItemTopI = ImageItems[i].offsetTop;
                    var originTopOfImage;
                    var originLeftOfImage;
                    if (centerX > imageItemLeftI && centerX < (imageItemLeftI + ImageItems[i].offsetWidth) && centerY > imageItemTopI && centerY < (imageItemTopI + ImageItems[i].offsetHeight) ) {
                        indexOfDroppableElement = i;
                    }
                }
                //break the loop early if confirm indexOfElmnt and indexOfDroppableElement
                if (typeof indexOfElmnt !== 'undefined' && typeof indexOfDroppableElement !== 'undefined') {
                    break;
                }
            }
            if (indexOfElmnt > indexOfDroppableElement) {
                placeHolder.remove();
                insertBefore(placeHolder, ImageItems[indexOfDroppableElement]);
                positionChange = true;
            }
            else if (indexOfElmnt < indexOfDroppableElement) {
                placeHolder.remove();
                // If droppable element is the last element then insert after previous element.
                if (indexOfDroppableElement == imageItemLength - 1) {
                    insertAfter(placeHolder, ImageItems[indexOfDroppableElement - 1]);
                }
                else {
                    insertAfter(placeHolder, ImageItems[indexOfDroppableElement]);
                }
                positionChange = true;
            }
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            var newElmnt = elmnt.cloneNode(true);
            insertAfter(newElmnt, placeHolder);
            placeHolder.remove();
            elmnt.remove();
            newElmnt.setAttribute("style", '');
            newElmnt.classList.add("iu-image-item");
            //Add features for new element with event listener if position change
            if (positionChange == false) {
                newElmnt.getElementsByClassName('iu-select-number')[0].selectedIndex = Number(newElmnt.getElementsByClassName('iu-image-order-number')[0].innerHTML) - 1;
            }
            addFeaturesForPositionChange(newElmnt, positionChange);
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    function insertBefore(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }

    function addFeaturesForPositionChange(newElmnt, positionChange = true) {
        if (positionChange == true) {
            checkMethodExists('savingImageOrderAlert');

            var disabledGalleryTime = returnOptionValue('lagTimeDisableGalleryAfterElementDragged');
            if (Number.isInteger(disabledGalleryTime)) {
                gallery.style.pointerEvents = 'none';
                setTimeout(function() {
                    gallery.style.pointerEvents = 'auto';
                }, disabledGalleryTime);
            }
        }
        addEventListenerForDragElement(newElmnt);
        var selectOrder = returnOptionValue('selectOrder');
        var customSelectValue = returnOptionValue('customSelect');
        if (selectOrder == true) {
            var newElmntSelect = newElmnt.getElementsByClassName('iu-select-number')[0];
            newElmntSelect.addEventListener('focus', function() {
                selectNumberChange(event);
            });
        }
        if (selectOrder == true && customSelectValue == true) {
            var newElmntCustomSelect = newElmnt.getElementsByClassName('iu-custom-select')[0];
            newElmntCustomSelect.addEventListener('mousedown', function() {
                selectClick(event);
            });
        }
        if (returnOptionValue('deleteImageButtom') == true) {
            var newcloseButtom = newElmnt.getElementsByClassName('iu-close-button')[0];
            newcloseButtom.addEventListener('mousedown', function(){
                deleteImage(event);
            });
        }
        resetImageOrder(newElmnt, positionChange);
    }


    function resetImageOrder(newElmnt = null, positionChange = true, deleteImage = null) {
        var ImageOrderNumber = gallery.getElementsByClassName('iu-image-order-number');
        var selectOrder = returnOptionValue('selectOrder');
        var customSelectOption = returnOptionValue('customSelect');
        if (selectOrder == true) {
            var selectOrderNumber = gallery.getElementsByClassName('iu-select-number');
        }
        if (customSelectOption == true) {
            var customSelectSelected = gallery.getElementsByClassName('iu-select-selected');
        }
        if (newElmnt) {
            var customSelectElmnt = newElmnt.getElementsByClassName('iu-custom-select');
            _this.customSelect(customSelectElmnt);
        }

        if (newElmnt && positionChange == true) {
            _this.customSelectScrollBar(newElmnt);
        }
        if (positionChange == true) {
            var xhttp = new XMLHttpRequest();
            var formData = new FormData();
            var imageItem;
            var imageIdOrder = [];
            if (ImageOrderNumber.length) {
                for (var i = 0; i < ImageOrderNumber.length; i++) {
                    ImageOrderNumber[i].innerHTML = i + 1;
                    imageItem = ImageOrderNumber[i].parentNode;
                    imageId = imageItem.getAttribute('data-image-id');
                    imageIdOrder.push(Number(imageId));
                }
                formData.append('imageIdOrder', imageIdOrder);
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        checkMethodExists('savedImageOrderAlert');
                    }
                }
                xhttp.addEventListener("error", function() {
                    checkMethodExists('alertServerError');
                });
                var saveImageOrderRoute = returnOptionValue('saveImageOrderRoute');
                xhttp.open("POST", saveImageOrderRoute, true);
                setHeaders(xhttp);
                xhttp.timeout = returnOptionValue('saveImageOrderRouteTimeout');
                xhttp.ontimeout = function (e) {
                    checkMethodExists('alertServerTimeout');
                }
                xhttp.send(formData);

                //Reset select option
                if (selectOrder == true) {
                    selectOrderNumberLength = selectOrderNumber.length;
                    for (var i = 0; i < selectOrderNumberLength; i++) {
                        selectOrderNumber[i].value = i + 1;
                        if (customSelectOption == true && newElmnt) {
                            customSelectSelected[i].innerHTML = i + 1;
                        }
                    }
                    if (deleteImage == true) {
                        var customSelectElmnts = gallery.getElementsByClassName('iu-custom-select');
                        _this.customSelect(customSelectElmnts);
                        _this.customSelectScrollBar();
                    }
                }

            }
        }
        else {
            if (customSelectOption == true && newElmnt && positionChange == false) {
                _this.customSelect(customSelectElmnt);
            }
        }

    }


    //Set the file Name as current date + random number from 10001 -> 20000 + . file extension
    function setFileName(originalName) {
        var renameImage = 'renameImage';
        return checkMethodExists('renameImage', originalName);
    }
    // decode base64 string to image to send to server.
    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    function getOrientation(image, callback) {
        if (!supportImageOrientation) {
            var fileReader = new FileReader();
            objectURLToBlob(image.src, function (blob) {
                fileReader.readAsArrayBuffer(blob);
            });
            fileReader.onload = function(e) {
                var view = new DataView(e.target.result);
                if (view.getUint16(0, false) != 0xFFD8)
                {
                    return callback(-2);
                }
                var length = view.byteLength, offset = 2;
                while (offset < length)
                {
                    if (view.getUint16(offset+2, false) <= 8) return callback(-1);
                    var marker = view.getUint16(offset, false);
                    offset += 2;
                    if (marker == 0xFFE1)
                    {
                        if (view.getUint32(offset += 2, false) != 0x45786966)
                        {
                            return callback(-1);
                        }

                        var little = view.getUint16(offset += 6, false) == 0x4949;
                        offset += view.getUint32(offset + 4, little);
                        var tags = view.getUint16(offset, little);
                        offset += 2;
                        for (var i = 0; i < tags; i++)
                        {
                            if (view.getUint16(offset + (i * 12), little) == 0x0112)
                            {
                                return callback(view.getUint16(offset + (i * 12) + 8, little));
                            }
                        }
                    }
                    else if ((marker & 0xFF00) != 0xFF00)
                    {
                        break;
                    }
                    else
                    {
                        offset += view.getUint16(offset, false);
                    }
                }
                return callback(-1);
            };
        }
        else {
            callback(1);
        }


        //another way to turn object url to blob
        function objectURLToBlob(dataURI, callback) {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            var byteString = atob(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0, end = byteString.length, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
                ia[i] = byteString.charCodeAt(i);
            }
            // write the ArrayBuffer to a blob
            callback(new Blob([ab], { type: mimeString }));
        }
    }

    function getTargetForHighlight(e) {
        var target = e.target;
        var targetClass = target.className;
        if (!targetClass.includes('image-upload')) {
            target = target.parentNode;
            targetClass = target.className;
        }
        return target;
    }

    function camelizeWithoutDash(str) {
        var str = str.replace(/-/g, ' ');
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    //Get options value from dropzone opject when people declare it.
    function returnOptionValue(option) {
        if (typeof optionsWithCamelizeDivId != 'undefined' && option in optionsWithCamelizeDivId) {
            optionValue = optionsWithCamelizeDivId[option];
        }
        else {
            optionValue = defaultOptions[option]
        }
        return optionValue;
    }

    //function to check if method exist when declare object.
    //If object have then process that method. If not then process the default option method.
    //function accept 3 paremeter to pass to method and return value that object method return.
    function checkMethodExists(methodName, argument1 = null, argument2 = null, argument3 = null) {
        if (typeof optionsWithCamelizeDivId != 'undefined' && typeof optionsWithCamelizeDivId[methodName] === "function") {
            return optionsWithCamelizeDivId[methodName](argument1, argument2, argument3);
        }
        else {
            return defaultOptions[methodName](argument1, argument2, argument3);
        }
    }

    //Function to set header of XMLHTTP request.
    function setHeaders(xhttp) {
        var headers = returnOptionValue('headers');
        if (headers) {
            for (const [key, value] of Object.entries(headers)) {
                xhttp.setRequestHeader(key, value);
            }
        }
    }

    //Function to append data to formData object for XMLHTTP
    function appendToFormData(dataObject, formData) {
        if (dataObject) {
            for (const [key, value] of Object.entries(dataObject)) {
                formData.append(key, value);
            }
        }
    }

}
