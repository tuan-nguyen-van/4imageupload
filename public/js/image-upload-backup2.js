iuUploadImageOptions = {
    imageGalleryId: 'please declare it',
    saveImageRoute : 'please declare it',
    saveImageNumberRoute : 'please declare it',
    saveImageOrderRoute : 'please declare it',
    deleteImageRoute : 'please declare it',
    maxResizedWidth : 1250,
    dictuploadImageNote: 'Press or drag images here to upload',
    dictUploadingMessage: 'Uploading images, please wait',
    moveUpOrDown: false,
    selectOrder: true,
};

function ImageUpload(divId, options) {
    this.divId = divId;
    this.options = options;
    this.defaultOptions = {
        imageGalleryId: 'please declare it',
        saveImageRoute : 'please declare it',
        saveImageNumberRoute : 'please declare it',
        saveImageOrderRoute : 'please declare it',
        deleteImageRoute : 'please declare it',
        maxResizedWidth : 1250,
        dictuploadImageNote: 'Press or drag images here to upload',
        dictUploadingMessage: 'Uploading images, please wait',
        moveUpOrDown: false,
        selectOrder: true,
    };
    console.log('running');
}
var ImageUpload1 = new ImageUpload('image-upload-1', {
                        deleteImageRoute : 'please declare it',
                        maxResizedWidth : 1250,
                        dictuploadImageNote: 'Press or drag images here to upload',
                        dictUploadingMessage: 'Uploading images, please wait',
                        moveUpOrDown: false,
                    });
console.log(ImageUpload1);




function imageUpload(divId, optionObject)
{
    var divIdWithoutDash = divId.replace(/-/g, ' ');
    var camelizeDivId = iuCamelize(divIdWithoutDash);

    iuUploadImageOptions[camelizeDivId] = optionObject;

    //Add input type = file for imageUpload div and text
    // var imageUploadClass = 'image-upload';
    var imageUploadZone = document.getElementById(divId);
    //Add data-image-upload-id to gallery element to get image-upload-id from gallery element.
    var imageGalleryId = iuReturnOptionValue(divId, 'imageGalleryId');

    var gallery = document.getElementById(imageGalleryId);
    gallery.setAttribute('data-image-upload-id', divId);

    var fileInput = document.createElement('input');
    fileInput.className = 'iu-button';
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('autocomplete', 'off');
    fileInput.setAttribute('title', '');
    fileInput.setAttribute('onchange', 'iuHandleFiles(event, this.files)');
    fileInput.multiple = true;
    imageUploadZone.appendChild(fileInput);
    var uploadNote = document.createElement('div');
    uploadNote.className = 'iu-image-note';
    uploadNote.innerHTML = iuReturnOptionValue(imageUploadZone.id, 'dictuploadImageNote');
    imageUploadZone.appendChild(uploadNote);

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(iuAddPreventDefaults);

    function iuAddPreventDefaults(eventName) {
        imageUploadZone.addEventListener(eventName, iuPreventDefaults, false);
    }

    function iuPreventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    };

    ['dragenter', 'dragover'].forEach(addIuHighlight);

    function addIuHighlight(eventName) {
        imageUploadZone.addEventListener(eventName, iuHighlight, false);
    }


    ['dragleave', 'drop'].forEach(addIuUnhighlight);

    function addIuUnhighlight(eventName) {
        imageUploadZone.addEventListener(eventName, iuUnhighlight, false);
    }

    function iuHighlight(e) {
        var target = iuGetTargetForHighlight(e);
        target.classList.add('iu-highlight');
    }

    function iuUnhighlight(e) {
        var target = iuGetTargetForHighlight(e);
        target.classList.remove('iu-highlight');
        console.log(target.classList);
    }

    imageUploadZone.addEventListener('drop', iuHandleDrop, false);

    function iuHandleDrop(e) {
        var dt = e.dataTransfer;
        var files = dt.files;
        if (files.length) {
            iuHandleFiles(e, files);
        }
    }
}

        function iuCamelize(str) {
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            }).replace(/\s+/g, '');
        }

        function iuReturnOptionValue(imageUploadZoneId, option) {
            imageUploadIdWithoutDash = imageUploadZoneId.replace(/-/g, ' ');
            camelizeImageId = iuCamelize(imageUploadIdWithoutDash);
            var dictuploadImageNote;
            if (typeof iuUploadImageOptions[camelizeImageId] != 'undefined' && option in iuUploadImageOptions[camelizeImageId]) {
                optionValue = iuUploadImageOptions[camelizeImageId][option];
            }
            else {
                optionValue = iuUploadImageOptions[option]
            }
            return optionValue;
        }


        function iuHandleFiles(e, files) {
            var target = e.target;
            var childNodesOfImageUpload = target.parentNode.childNodes;
            var imageNoteOfImageUpload;
            for (var i = 0; i < childNodesOfImageUpload.length; i++) {
                if (childNodesOfImageUpload[i].classList.contains("iu-image-note")) {
                    childNodesOfImageUpload[i].innerHTML =  iuReturnOptionValue(target.parentNode.id, 'dictUploadingMessage') + "<div class='loader'></div>";
                    imageNoteOfImageUpload = childNodesOfImageUpload[i];
                    break;
                }
            }
            for (var i = 0; i < files.length; i++) {
                iuProcessFileReader(files[i], i, files.length, imageNoteOfImageUpload, target.parentNode.id);
            }
        }

        function iuProcessFileReader(file, fileNumber, fileLength, imageNoteOfImageUpload, imageUploadId) {
            var imageUploaded = file;
            var imageOrientation;
            var imageName = file.name;
            var imageType = file.type;
            var reader = new FileReader();
            // console.log(imageUploaded.size);
            reader.readAsDataURL(imageUploaded);
            reader.onload = function(e) {
                var image = new Image();
                image.src = e.target.result;
                image.onload = function(e) {
                    var orientation;
                    var maxWidth = iuReturnOptionValue(imageUploadId, 'maxResizedWidth');
                    var width = image.width; var height = image.height;
                    var blobImage, savedImage;
                    if (width >= maxWidth) {
                        height = height * maxWidth / width;
                        width = maxWidth;
                    }
                    iuGetOrientation(image, function(orientation) {
                        var canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        //Check if browser support image orientation exif data from imame. If not support then rotate image due to exif
                        var supportImageOrientation = CSS.supports('image-orientation', 'from-image');
                        console.log(supportImageOrientation);
                        if (supportImageOrientation != 'true') {
                            if (orientation > 4) {
                                canvas.width = height;
                                canvas.height = width;
                            }
                        }

                        var ctx = canvas.getContext('2d');
                        if (supportImageOrientation != 'true') {
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
                        //Base64 image
                        savedImage = canvas.toDataURL(imageType, 1.0);

                        if (fileNumber == (fileLength - 1)) {
                            imageNoteOfImageUpload.innerHTML = iuReturnOptionValue(imageUploadId, 'dictuploadImageNote');
                        }
                        // Split the base64 string in data and contentType
                        var block = savedImage.split(";");
                        // get the real base64 content of the file
                        var realDecodeImage = block[1].split(",")[1];
                        blobImage = iuB64toBlob(realDecodeImage, imageType);
                        var formData = new FormData();
                        var newImageName = iuSetFileName(imageName);
                        formData.append('image', blobImage, newImageName);
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                iuAppendImage(savedImage, imageName, imageUploadId, Number(this.response));
                            }
                        };
                        var csrfToken = document.getElementById('csrf_token').getAttribute('content');
                        formData.append('token', csrfToken);
                        var saveImageRoute = iuReturnOptionValue(imageUploadId, 'saveImageRoute');
                        xhttp.open("POST", saveImageRoute, true);
                        xhttp.setRequestHeader('X-CSRF-TOKEN', csrfToken);
                        xhttp.send(formData);
                    });
                }
            }
        }

        //Set the file Name as current date + random number from 10001 -> 20000 + . file extension
        function iuSetFileName(originalName) {
            var dt = new Date();
            var time = dt.getTime();
            var x = (Math.floor((Math.random() * 1000) + 1000)).toString();
            var fileExt = originalName.split('.').pop();
            return time + x + '.' + fileExt;
        }


        function iuGetTargetForHighlight(e) {
            var target = e.target;
            var targetClass = target.className;
            if (!targetClass.includes('image-upload')) {
                target = target.parentNode;
                targetClass = target.className;
            }
            return target;
        }

        // decode base64 string to image to send to server.
        function iuB64toBlob(b64Data, contentType, sliceSize) {
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


        function iuGetOrientation(image, callback) {
            var fileReader = new FileReader();
            iuObjectURLToBlob(image.src, function (blob) {
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
            //another way to turn object url to blob
            function iuObjectURLToBlob(dataURI, callback) {
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
            // function iuObjectURLToBlob(url, callback) {
            //     var http = new XMLHttpRequest();
            //     http.open("GET", url, true);
            //     http.responseType = "blob";
            //     http.onload = function(e) {
            //         if (this.status == 200 || this.status === 0) {
            //             callback(this.response);
            //         }
            //     };
            //     http.send();
            // }
        }

        function iuAppendImage(savedImage, imageName, imageUploadId, savedImageId) {
            var galleryId = iuReturnOptionValue(imageUploadId, 'imageGalleryId');
            var gallery = document.getElementById(galleryId)
            var imageItem = document.createElement('div');
            imageItem.className = "iu-image-item iu-image-item-style";
            imageItem.setAttribute("data-image-id", savedImageId);
            var imageUploaded = document.createElement('img');
            imageUploaded.setAttribute("src", savedImage);
            imageUploaded.className = 'iu-image-placeholder';
            //Prevent image from being dragged and dropped for Firefox. Because on FireFox it set draggable = "true"
            imageUploaded.setAttribute('draggable', false);
            imageUploaded.setAttribute("alt", imageName);
            imageItem.appendChild(imageUploaded);
            var moveUpOrDown = iuReturnOptionValue(imageUploadId, 'moveUpOrDown');
            if (moveUpOrDown == true) {
                var leftArrow = document.createElement('div');
                leftArrow.className = "iu-arrow-div iu-left-arrow-div";
                leftArrow.innerHTML = "&#129128;";
                var rightArrow = document.createElement('div');
                rightArrow.className = "iu-arrow-div iu-right-arrow-div";
                rightArrow.innerHTML = "&#129130;";
                imageItem.appendChild(leftArrow);
                imageItem.appendChild(rightArrow);
                leftArrow.setAttribute("onmousedown", "iuMoveImageUpOrDown(event, 'up')");
                rightArrow.setAttribute("onmousedown", "iuMoveImageUpOrDown(event, 'down')");
            }

            var selectOrderOption = iuReturnOptionValue(imageUploadId, 'selectOrder');

            if (selectOrderOption == true) {
                var selectElements = gallery.getElementsByClassName('iu-select-number');
                var selectElementLength = selectElements.length;

                var selectDiv = document.createElement('div');
                selectDiv.className = "iu-custom-select";
                var selectNumber = document.createElement('select');
                selectNumber.setAttribute("onfocus", "iuSelectNumberChange(event)")
                selectNumber.className = 'iu-select-number';
                selectDiv.appendChild(selectNumber);
                imageItem.appendChild(selectDiv);
                selectDiv.setAttribute("onmousedown", "iuSelectClick(event)");
                //add option for new image select
                for (var i = 0; i < selectElementLength + 1; i++) {
                    var option = document.createElement('option');
                    option.text = i + 1;
                    selectNumber.add(option);
                    if (i == selectElementLength) {
                        option.selected = true;
                        // var selectDivCollection = selectDiv.parentNode.getElementsByClassName('iu-custom-select');
                        // iuCustomSelect(selectDivCollection);
                    }
                }
                //Add 1 more option for existed select
                for (var j = 0; j < selectElementLength; j++) {
                    var option = document.createElement('option');
                    option.text = selectElementLength + 1;
                    selectElements[j].add(option);
                    // var selectItemOption = selectElements[j].nextSibling.nextSibling;
                    // var optionItem = document.createElement("div");
                    // optionItem.innerHTML = selectElementLength + 1;
                    // selectItemOption.appendChild(optionItem);
                }
                var customSelectDiv = selectDiv.parentNode.getElementsByClassName('iu-custom-select');
                iuCustomSelect(customSelectDiv);
                var selectDivCollection = gallery.getElementsByClassName('iu-custom-select');
                iuCustomSelect(selectDivCollection);

                // var customSelectDiv = gallery.getElementsByClassName('iu-custom-select');
                // var customSelectDivLength = customSelectDiv.length;
                // for (var k = 0; k < customSelectDivLength; k++) {
                //     var selElmnt = customSelectDiv[k].getElementsByTagName("select")[0];
                //     var selElmntOptionLength = selElmnt.length;
                //     var divForOptionList = customSelectDiv[k].getElementsByClassName('iu-select-items')[0];
                //     iuCreateOptionList(selElmnt, selElmntOptionLength, divForOptionList);
                // }
            }


            imageOrderNumberClass = gallery.getElementsByClassName("iu-image-order-number");
            imageOrderLength = imageOrderNumberClass.length;

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
            var xhttp = new XMLHttpRequest();
            var formData = new FormData();
            formData.append('imageNumber', imageNumber);
            formData.append('imageId', savedImageId);
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log('save-image-number');
                }
            };
            var saveImageNumberRoute = iuReturnOptionValue(imageUploadId, 'saveImageNumberRoute');
            xhttp.open("POST", saveImageNumberRoute, true);
            var csrfToken = document.getElementById('csrf_token').getAttribute('content');
            xhttp.setRequestHeader('X-CSRF-TOKEN', csrfToken);
            xhttp.send(formData);

            imageItem.appendChild(imageOrderNumber);

            var closeButton = document.createElement('div');
            closeButton.className = "iu-close-icon";
            closeButton.innerHTML = '&times;';
            closeButton.setAttribute("onmousedown", "iuDeleteImage(event)");
            imageItem.appendChild(closeButton);
            document.getElementById(galleryId).appendChild(imageItem);
            iuAddEventListenerForDragElement(imageItem, galleryId);
            // imageItem.setAttribute("onmousedown", "iuDragElement(this)");
        }

        function iuInsertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
        function iuInsertBefore(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode);
        }

        function iuDragElement(elmnt, galleryId) {
            //Set element get dragged to the origin position due to position relative of placeholder element;
            var originTop = elmnt.offsetTop;
            var originLeft = elmnt.offsetLeft;
            elmnt.style.top = originTop + "px";
            elmnt.style.left = originLeft + "px";
            //Set up placeholder to keep position for dragged element;
            elmnt.style.position = "absolute";
            elmnt.style.zIndex = "1000";
            //classList doesn't work on IE 9
            //Remove iu-image-item class from class List
            elmnt.classList.remove('iu-image-item');
            var placeHolder = document.createElement('div');
            placeHolder.style.visibility = "hidden";
            placeHolder.className = "iu-image-item iu-image-item-style image-placeholder";
            var placeHolderItem = document.createElement('img');
            placeHolderItem.className = 'iu-image-placeholder';
            placeHolderItem.setAttribute('draggable', false);
            placeHolder.appendChild(placeHolderItem);

            if (elmnt.getElementsByClassName('iu-select-number').length == 1) {
                var selectDiv = document.createElement('div');
                var selectNumber = document.createElement('select');
                selectNumber.className = 'iu-select-number';
                selectDiv.appendChild(selectNumber);
                placeHolder.appendChild(selectDiv);
            }

            iuInsertAfter(placeHolder, elmnt);
            var gallery = document.getElementById(galleryId);
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
                    iuInsertBefore(placeHolder, ImageItems[indexOfDroppableElement]);
                    // console.log('droppable element change');
                    // console.log('down drag to top');
                }
                else if (indexOfElmnt < indexOfDroppableElement) {
                    placeHolder.remove();
                    // console.log(indexOfDroppableElement);
                    // If droppable element is the last element then insert after previous element.
                    if (indexOfDroppableElement == imageItemLength - 1) {
                        iuInsertAfter(placeHolder, ImageItems[indexOfDroppableElement - 1]);
                    }
                    else {
                        iuInsertAfter(placeHolder, ImageItems[indexOfDroppableElement]);
                    }
                }
                console.log('element: ' + indexOfElmnt + ' droppable element: ' + indexOfDroppableElement);
            }

            function closeDragElement() {
                // stop moving when mouse button is released:
                var newElmnt = elmnt.cloneNode(true);
                iuInsertAfter(newElmnt, placeHolder);
                elmnt.remove();
                newElmnt.setAttribute("style", '');
                newElmnt.classList.add("iu-image-item");
                //Add event listener to new element
                iuAddEventListenerForDragElement(newElmnt, galleryId);
                placeHolder.remove();
                document.onmousemove = null;
                document.onmouseup = null;
                iuResetImageOrder(gallery);
                var selectDivCollection = gallery.getElementsByClassName('iu-custom-select');
                iuCustomSelect(selectDivCollection);
            }
        }


        function iuAddEventListenerForDragElement(elmnt, galleryId)
        {
            elmnt.addEventListener('mousedown', function(e) {
                iuDragElement(e.currentTarget, galleryId);
            });
        }
        function iuResetImageOrder(gallery) {
            var ImageOrderNumber = gallery.getElementsByClassName('iu-image-order-number');
            var SelectOrderNumber = gallery.getElementsByClassName('iu-select-number');
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
                console.log(imageIdOrder);
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log('save-image-order');
                    }
                };
                var imageUploadId = gallery.getAttribute('data-image-upload-id');
                var saveImageOrderRoute = iuReturnOptionValue(imageUploadId, 'saveImageOrderRoute');
                xhttp.open("POST", saveImageOrderRoute, true);
                var csrfToken = document.getElementById('csrf_token').getAttribute('content');
                xhttp.setRequestHeader('X-CSRF-TOKEN', csrfToken);
                xhttp.send(formData);
            }
            for (var i = 0; i < SelectOrderNumber.length; i++) {
                SelectOrderNumber[i].value = i + 1;
            }
        }

        function iuDeleteImage(event) {
            event.stopPropagation();
            var elmnt = event.target;
            var imageItem = elmnt.parentNode;
            var deletedImageId = imageItem.getAttribute('data-image-id');
            var gallery = elmnt.parentNode.parentNode;
            var galleryId = gallery.id;
            var imageUploadId = gallery.getAttribute('data-image-upload-id');
            var deleteImageRoute = iuReturnOptionValue(imageUploadId, 'deleteImageRoute');
            elmnt.onmouseup = function() {
                var xhttp = new XMLHttpRequest();
                var formData = new FormData();
                formData.append('imageId', deletedImageId);
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        elmnt.parentNode.remove();
                        iuResetImageOrder(gallery);
                    }
                };
                xhttp.open("POST", deleteImageRoute, true);
                var csrfToken = document.getElementById('csrf_token').getAttribute('content');
                xhttp.setRequestHeader('X-CSRF-TOKEN', csrfToken);
                xhttp.send(formData);
            }
        }

        function iuMoveImageUpOrDown(event, upOrDown) {
            event.stopPropagation();
            var elmnt = event.target;
            var gallery = elmnt.parentNode.parentNode;
            var galleryId = gallery.id;
            var firstImageItem = gallery.getElementsByClassName('iu-image-item')[0];
            var imageItemLength = gallery.getElementsByClassName('iu-image-item').length;
            var lastImageItem = gallery.getElementsByClassName('iu-image-item')[imageItemLength - 1];
            var imageItemClickOn = elmnt.parentNode;
            var newElmnt = imageItemClickOn.cloneNode(true);
            if (upOrDown == 'up' && imageItemClickOn != firstImageItem) {
                iuInsertBefore(newElmnt, imageItemClickOn.previousSibling);
                handleUpOrDown();
            }
            if (upOrDown == 'down' && imageItemClickOn != lastImageItem) {
                iuInsertAfter(newElmnt, imageItemClickOn.nextSibling);
                handleUpOrDown();
            }
            function handleUpOrDown() {
                imageItemClickOn.remove();
                iuAddEventListenerForDragElement(newElmnt, galleryId);
                iuResetImageOrder(gallery);
                var selectDivCollection = gallery.getElementsByClassName('iu-custom-select');
                iuCustomSelect(selectDivCollection);
            }
        }

        function iuSelectClick(event) {
            event.stopPropagation();
        }

        function iuSelectNumberChange(event) {
            // event.stopPropagation();
            var select = event.target;
            var variables = iuGetVariablesForSelectChange(select);
            var imageItem = variables[0];
            var gallery = variables[1];
            var galleryId = variables[2];
            var previousVal = variables[3];
            select.onchange = function () {
                iuSelectChange('none', select, imageItem, gallery, galleryId, previousVal);
            }
        }

        function iuGetVariablesForSelectChange(select) {
            var imageItem = select.parentNode.parentNode;
            var gallery = select.parentNode.parentNode.parentNode;
            var galleryId = gallery.id;
            var previousVal = select.value;
            return [imageItem, gallery, galleryId, previousVal];
        }

        function iuSelectChange(selectedValue, select, imageItem, gallery, galleryId, previousVal) {
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
                iuInsertBefore(newImageItem, imageItemSelected);
            }
            if (previousVal < newSelectVal) {
                iuInsertAfter(newImageItem, imageItemSelected);
            }
            if (previousVal != newSelectVal) {
                imageItem.remove();
                iuAddEventListenerForDragElement(newImageItem, galleryId);
                iuResetImageOrder(gallery);
                var selectDivCollection = gallery.getElementsByClassName('iu-custom-select');
                iuCustomSelect(selectDivCollection);
            }
        }

        function iuCustomSelect(customSelectDiv) {
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

                iuCreateOptionList(selElmnt, selElmntOptionLength, divForOptionList);
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
        function iuCreateOptionList(selElmnt, selElmntOptionLength,divForOptionList) {
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
                    var variablesForSelectChange = iuGetVariablesForSelectChange(selectingElement);
                    var imageItem = variablesForSelectChange[0];
                    var gallery = variablesForSelectChange[1];
                    var galleryId = variablesForSelectChange[2];
                    var previousVal = variablesForSelectChange[3];
                    for (i = 0; i < selectingElementLength; i++) {
                        var selectedValue = this.innerHTML;
                        if (selectingElement.options[i].innerHTML == selectedValue) {
                            iuSelectChange(selectedValue, selectingElement, imageItem, gallery, galleryId, previousVal);
                            selectingElement.selectedIndex = i;
                            showedValue.innerHTML = selectedValue;
                            var SameAsSelectedOption = this.parentNode.getElementsByClassName("iu-same-as-selected");
                            var SameAsSelectedOptionLength = SameAsSelectedOption.length;
                            for (var k = 0; k < SameAsSelectedOptionLength; k++) {
                                SameAsSelectedOption[k].removeAttribute("class");
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
        iuCustomSelect(selectElemnts);
