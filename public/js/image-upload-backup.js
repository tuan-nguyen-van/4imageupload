var uploadImageOptions = {
            maxResizedWidth : 1250,
            dictuploadImageNote: 'Press or drag images here to upload',
            dictUploadingMessage: 'Uploading images, please wait',
            moveUpOrDown: false,
            selectOrder: true,
        };
        uploadImageOptions.uploadImage1 = {
            dictuploadImageNote: 'Nhấn vào đây để tải lên',
            imageGalleryId: 'gallery1',
            moveUpOrDown: true,
            selectOrder: false,
        };
        uploadImageOptions.uploadImage2 = {
            dictuploadImageNote: 'Nhấn vào đây để tải lên',
            imageGalleryId: 'gallery2',
            moveUpOrDown: true,
            selectOrder: false,
        };
        function camelize(str) {
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            }).replace(/\s+/g, '');
        }

        function returnOptionValue(imageUploadZoneId, option) {
            imageUploadIdWithoutDash = imageUploadZoneId.replace(/-/g, ' ');
            camelizeImageId = camelize(imageUploadIdWithoutDash);
            var dictuploadImageNote;
            if (typeof uploadImageOptions[camelizeImageId] != 'undefined' && option in uploadImageOptions[camelizeImageId]) {
                optionValue = uploadImageOptions[camelizeImageId][option];
            }
            else {
                optionValue = uploadImageOptions[option]
            }
            return optionValue;
        }
        var imageUploadClass = 'image-upload';
        var imageUploadZone = document.getElementsByClassName(imageUploadClass);
        var uploadZoneLength = imageUploadZone.length;
        for (var i = 0; i < uploadZoneLength; i++) {
            var fileInput = document.createElement('input');
            fileInput.className = 'pu-button';
            fileInput.setAttribute('type', 'file');
            fileInput.setAttribute('autocomplete', 'off');
            fileInput.setAttribute('title', '');
            fileInput.setAttribute('onchange', 'handleFiles(event, this.files)');
            fileInput.multiple = true;
            imageUploadZone[i].appendChild(fileInput);
            var uploadNote = document.createElement('div');
            uploadNote.className = 'image-note';
            uploadNote.innerHTML = returnOptionValue(imageUploadZone[i].id, 'dictuploadImageNote');
            imageUploadZone[i].appendChild(uploadNote);
        }

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            for (var i = 0; i < uploadZoneLength; i++) {
                imageUploadZone[i].addEventListener(eventName, preventDefaults, false);
            }
        });

        function preventDefaults (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        ['dragenter', 'dragover'].forEach(eventName => {
            for (var i = 0; i < uploadZoneLength; i++) {
                imageUploadZone[i].addEventListener(eventName, highlight, false);
            }
        });
        ['dragleave', 'drop'].forEach(eventName => {
            for (var i = 0; i < uploadZoneLength; i++) {
                imageUploadZone[i].addEventListener(eventName, unhighlight, false);
            }
        });

        function highlight(e) {
            var target = getTargetForHighlight(e);
            target.classList.add('pu-highlight');
        }

        function unhighlight(e) {
            var target = getTargetForHighlight(e);
            target.classList.remove('pu-highlight');
        }

        for (var i = 0; i < uploadZoneLength; i++) {
            imageUploadZone[i].addEventListener('drop', handleDrop, false);
        }

        function handleDrop(e) {
            var dt = e.dataTransfer;
            var files = dt.files;
            if (files.length) {
                handleFiles(e, files);
            }
        }

        function handleFiles(e, files) {
            var target = e.target;
            var childNodesOfImageUpload = target.parentNode.childNodes;
            var imageNoteOfImageUpload;
            for (var i = 0; i < childNodesOfImageUpload.length; i++) {
                if (childNodesOfImageUpload[i].classList.contains("image-note")) {
                    childNodesOfImageUpload[i].innerHTML =  returnOptionValue(target.parentNode.id, 'dictUploadingMessage') + "<div class='loader'></div>";
                    imageNoteOfImageUpload = childNodesOfImageUpload[i];
                    break;
                }
            }
            for (var i = 0; i < files.length; i++) {
                processFileReader(files[i], i, files.length, imageNoteOfImageUpload, target.parentNode.id);
            }
        }

        function processFileReader(file, fileNumber, fileLength, imageNoteOfImageUpload, imageUploadId) {
            // console.log(i);
            var imageUploaded = file;
            var imageOrientation;
            var imageName = file.name;
            var imageType = file.type;
            var reader = new FileReader();
            // console.log(imageUploaded.size);
            console.log(imageName);
            reader.readAsDataURL(imageUploaded);
            reader.onload = function(e) {
                var image = new Image();
                image.src = e.target.result;
                image.onload = function(e) {
                    var orientation;
                    var maxWidth = returnOptionValue(imageUploadId, 'maxResizedWidth');
                    var width = image.width; var height = image.height;
                    var blobImage, savedImage;
                    if (width >= maxWidth) {
                        height = height * maxWidth / width;
                        width = maxWidth;
                    }
                    getOrientation(image, function(orientation) {
                        var canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        // if (orientation > 4) {
                        //     canvas.width = height;
                        //     canvas.height = width;
                        // }
                        var ctx = canvas.getContext('2d');
                        // switch (orientation) {
                        //     case 2:
                        //     // horizontal flip
                        //     ctx.translate(canvas.width, 0);
                        //     ctx.scale(-1, 1);
                        //     break;
                        //     case 3:
                        //     // 180° rotate left
                        //     ctx.translate(canvas.width, canvas.height);
                        //     ctx.rotate(Math.PI);
                        //     break;
                        //     case 4:
                        //     // vertical flip
                        //     ctx.translate(0, canvas.height);
                        //     ctx.scale(1, -1);
                        //     break;
                        //     case 5:
                        //     // vertical flip + 90 rotate right
                        //     ctx.rotate(0.5 * Math.PI);
                        //     ctx.scale(1, -1);
                        //     break;
                        //     case 6:
                        //     // 90° rotate right
                        //     ctx.rotate(0.5 * Math.PI);
                        //     ctx.translate(0, -canvas.width);
                        //     break;
                        //     case 7:
                        //     // horizontal flip + 90 rotate right
                        //     ctx.rotate(0.5 * Math.PI);
                        //     ctx.translate(canvas.height, -canvas.width);
                        //     ctx.scale(-1, 1);
                        //     break;
                        //     case 8:
                        //     // 90° rotate left
                        //     ctx.rotate(-0.5 * Math.PI);
                        //     ctx.translate(-canvas.height, 0);
                        //     break;
                        // }
                        ctx.drawImage(image, 0, 0, width, height);
                        //Base64 image
                        savedImage = canvas.toDataURL(imageType, 1.0);
                        // var img = document.createElement('img');
                        // img.src = "image/20170101_143331.jpg";
                        // img.setAttribute('alt', imageName);
                        // document.getElementById('gallery').appendChild(img);
                        appendImage(savedImage, imageName, imageUploadId);
                        if (fileNumber == (fileLength - 1)) {
                            imageNoteOfImageUpload.innerHTML = returnOptionValue(imageUploadId, 'dictuploadImageNote');
                        }
                        // Split the base64 string in data and contentType
                        var block = savedImage.split(";");
                        // get the real base64 content of the file
                        var realDecodeImage = block[1].split(",")[1];
                        blobImage = b64toBlob(realDecodeImage, imageType);
                    });
                }
            }
        }

        function getTargetForHighlight(e) {
            var target = e.target;
            var targetClass = target.className;
            if (!targetClass.includes(imageUploadClass)) {
                target = target.parentNode;
                targetClass = target.className;
            }
            return target;
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

            function objectURLToBlob(url, callback) {
                var http = new XMLHttpRequest();
                http.open("GET", url, true);
                http.responseType = "blob";
                http.onload = function(e) {
                    if (this.status == 200 || this.status === 0) {
                        callback(this.response);
                    }
                };
                http.send();
            }
        }

        function appendImage(savedImage, imageName, imageUploadId) {
            var galleryId = returnOptionValue(imageUploadId, 'imageGalleryId');
            var gallery = document.getElementById(galleryId)
            var imageItem = document.createElement('div');
            imageItem.className = "image-item image-item-style";
            var imageUploaded = document.createElement('img');
            imageUploaded.setAttribute("src", savedImage);
            imageUploaded.className = 'image-showed';
            imageUploaded.setAttribute("alt", imageName);
            imageItem.appendChild(imageUploaded);
            var moveUpOrDown = returnOptionValue(imageUploadId, 'moveUpOrDown');
            if (moveUpOrDown == true) {
                var leftArrow = document.createElement('div');
                leftArrow.className = "arrow-div left-arrow-div";
                leftArrow.innerHTML = "&#129128;";
                var rightArrow = document.createElement('div');
                rightArrow.className = "arrow-div right-arrow-div";
                rightArrow.innerHTML = "&#129130;";
                imageItem.appendChild(leftArrow);
                imageItem.appendChild(rightArrow);
                leftArrow.setAttribute("onmousedown", "moveImageUpOrDown(event, 'up')");
                rightArrow.setAttribute("onmousedown", "moveImageUpOrDown(event, 'down')");
            }

            var selectOrderOption = returnOptionValue(imageUploadId, 'selectOrder');

            if (selectOrderOption == true) {
                var selectElements = gallery.getElementsByClassName('select-number');
                var selectElementLength = selectElements.length;

                var selectDiv = document.createElement('div');
                selectDiv.className = "custom-select";
                var selectNumber = document.createElement('select');
                selectNumber.setAttribute("onfocus", "selectNumberChange(event)")
                selectNumber.className = 'select-number';
                selectDiv.appendChild(selectNumber);
                imageItem.appendChild(selectDiv);
                selectDiv.setAttribute("onmousedown", "selectClick(event)");
                //add option for new image select
                for (var i = 0; i < selectElementLength + 1; i++) {
                    var option = document.createElement('option');
                    option.text = i + 1;
                    selectNumber.add(option);
                    if (i == selectElementLength) {
                        option.selected = true;
                        // var selectDivCollection = selectDiv.parentNode.getElementsByClassName('custom-select');
                        // customSelect(selectDivCollection);
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
                var customSelectDiv = selectDiv.parentNode.getElementsByClassName('custom-select');
                customSelect(customSelectDiv);
                var selectDivCollection = gallery.getElementsByClassName('custom-select');
                customSelect(selectDivCollection);

                // var customSelectDiv = gallery.getElementsByClassName('custom-select');
                // var customSelectDivLength = customSelectDiv.length;
                // for (var k = 0; k < customSelectDivLength; k++) {
                //     var selElmnt = customSelectDiv[k].getElementsByTagName("select")[0];
                //     var selElmntOptionLength = selElmnt.length;
                //     var divForOptionList = customSelectDiv[k].getElementsByClassName('select-items')[0];
                //     createOptionList(selElmnt, selElmntOptionLength, divForOptionList);
                // }
            }


            imageOrderNumberClass = gallery.getElementsByClassName("image-order-number");
            imageOrderLength = imageOrderNumberClass.length;

            var imageOrderNumber = document.createElement('div');
            imageOrderNumber.className = 'image-order-number';
            if (imageOrderLength == 0) {
                imageOrderNumber.innerHTML = 1;
            }
            else {
                var lastImageNumber = imageOrderNumberClass[imageOrderLength-1].innerHTML;
                imageOrderNumber.innerHTML = Number(lastImageNumber) + 1;
            }

            imageItem.appendChild(imageOrderNumber);

            var closeButton = document.createElement('div');
            closeButton.className = "close-icon";
            closeButton.innerHTML = '&times;';
            closeButton.setAttribute("onmousedown", "deleteImage(event)");
            imageItem.appendChild(closeButton);
            document.getElementById(galleryId).appendChild(imageItem);
            addEventListenerForDragElement(imageItem, galleryId);
            // imageItem.setAttribute("onmousedown", "dragElement(this)");
        }

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
        function insertBefore(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode);
        }

        function dragElement(elmnt, galleryId) {
            //Set element get dragged to the origin position due to position relative of placeholder element;
            var originTop = elmnt.offsetTop;
            var originLeft = elmnt.offsetLeft;
            elmnt.style.top = originTop + "px";
            elmnt.style.left = originLeft + "px";
            //Set up placeholder to keep position for dragged element;
            elmnt.style.position = "absolute";
            elmnt.style.zIndex = "1000";
            //classList doesn't work on IE 9
            //Remove image-item class from class List
            elmnt.classList.remove('image-item');
            var placeHolder = document.createElement('div');
            placeHolder.style.visibility = "hidden";
            placeHolder.className = "image-item image-item-style image-placeholder";
            var placeHolderItem = document.createElement('img');
            placeHolderItem.className = 'image-showed';
            placeHolder.appendChild(placeHolderItem);

            if (elmnt.getElementsByClassName('select-number').length == 1) {
                var selectDiv = document.createElement('div');
                var selectNumber = document.createElement('select');
                selectNumber.className = 'select-number';
                selectDiv.appendChild(selectNumber);
                placeHolder.appendChild(selectDiv);
            }

            insertAfter(placeHolder, elmnt);
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
                var ImageItems = gallery.getElementsByClassName('image-item');
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
                    // console.log('droppable element change');
                    // console.log('down drag to top');
                }
                else if (indexOfElmnt < indexOfDroppableElement) {
                    placeHolder.remove();
                    // console.log(indexOfDroppableElement);
                    // If droppable element is the last element then insert after previous element.
                    if (indexOfDroppableElement == imageItemLength - 1) {
                        insertAfter(placeHolder, ImageItems[indexOfDroppableElement - 1]);
                    }
                    else {
                        insertAfter(placeHolder, ImageItems[indexOfDroppableElement]);
                    }
                }
                console.log('element: ' + indexOfElmnt + ' droppable element: ' + indexOfDroppableElement);
            }

            function closeDragElement() {
                // stop moving when mouse button is released:
                var newElmnt = elmnt.cloneNode(true);
                insertAfter(newElmnt, placeHolder);
                elmnt.remove();
                newElmnt.setAttribute("style", '');
                newElmnt.classList.add("image-item");
                //Add event listener to new element
                addEventListenerForDragElement(newElmnt, galleryId);
                placeHolder.remove();
                document.onmousemove = null;
                document.onmouseup = null;
                resetImageOrder(gallery);
                var selectDivCollection = gallery.getElementsByClassName('custom-select');
                customSelect(selectDivCollection);
            }
        }
        function addEventListenerForDragElement(elmnt, galleryId)
        {
            elmnt.addEventListener('mousedown', function(e) {
                dragElement(e.currentTarget, galleryId);
            });
        }
        function resetImageOrder(gallery) {
            var ImageOrderNumber = gallery.getElementsByClassName('image-order-number');
            var SelectOrderNumber = gallery.getElementsByClassName('select-number');
            for (var i = 0; i < ImageOrderNumber.length; i++) {
                ImageOrderNumber[i].innerHTML = i + 1;
            }
            for (var i = 0; i < SelectOrderNumber.length; i++) {
                SelectOrderNumber[i].value = i + 1;
            }
        }

        function deleteImage(event) {
            event.stopPropagation();
            var elmnt = event.target;
            var gallery = elmnt.parentNode.parentNode;
            var galleryId = gallery.id;
            elmnt.onmouseup = function() {
                elmnt.parentNode.remove();
                resetImageOrder(gallery);
            }
        }

        function moveImageUpOrDown(event, upOrDown) {
            event.stopPropagation();
            var elmnt = event.target;
            var gallery = elmnt.parentNode.parentNode;
            var galleryId = gallery.id;
            var firstImageItem = gallery.getElementsByClassName('image-item')[0];
            var imageItemLength = gallery.getElementsByClassName('image-item').length;
            var lastImageItem = gallery.getElementsByClassName('image-item')[imageItemLength - 1];
            var imageItemClickOn = elmnt.parentNode;
            var newElmnt = imageItemClickOn.cloneNode(true);
            if (upOrDown == 'up' && imageItemClickOn != firstImageItem) {
                insertBefore(newElmnt, imageItemClickOn.previousSibling);
                handleUpOrDown();
            }
            if (upOrDown == 'down' && imageItemClickOn != lastImageItem) {
                insertAfter(newElmnt, imageItemClickOn.nextSibling);
                handleUpOrDown();
            }
            function handleUpOrDown() {
                imageItemClickOn.remove();
                addEventListenerForDragElement(newElmnt, galleryId);
                resetImageOrder(gallery);
                var selectDivCollection = gallery.getElementsByClassName('custom-select');
                customSelect(selectDivCollection);
            }
        }

        function selectClick(event) {
            event.stopPropagation();
        }

        function selectNumberChange(event) {
            // event.stopPropagation();
            var select = event.target;
            var variables = getVariablesForSelectChange(select);
            var imageItem = variables[0];
            var gallery = variables[1];
            var galleryId = variables[2];
            var previousVal = variables[3];
            select.onchange = function () {
                selectChange('none', select, imageItem, gallery, galleryId, previousVal);
            }
        }

        function getVariablesForSelectChange(select) {
            var imageItem = select.parentNode.parentNode;
            var gallery = select.parentNode.parentNode.parentNode;
            var galleryId = gallery.id;
            var previousVal = select.value;
            return [imageItem, gallery, galleryId, previousVal];
        }

        function selectChange(selectedValue, select, imageItem, gallery, galleryId, previousVal) {
            var newSelectVal;
            if (selectedValue == 'none') {
                newSelectVal = select.value;
            }
            else {
                newSelectVal = selectedValue;
            }
            var newImageItem = imageItem.cloneNode(true);
            var imageItemSelected = gallery.getElementsByClassName('image-item')[newSelectVal - 1];
            if (previousVal > newSelectVal) {
                insertBefore(newImageItem, imageItemSelected);
            }
            if (previousVal < newSelectVal) {
                insertAfter(newImageItem, imageItemSelected);
            }
            if (previousVal != newSelectVal) {
                imageItem.remove();
                addEventListenerForDragElement(newImageItem, galleryId);
                resetImageOrder(gallery);
                var selectDivCollection = gallery.getElementsByClassName('custom-select');
                customSelect(selectDivCollection);
            }
        }

        function customSelect(customSelectDiv) {
            /* Look for any elements with the class "custom-select": */
            // var customSelectDiv = document.getElementsByClassName('custom-select');
            var customSelectDivLength = customSelectDiv.length;
            for (var i = 0; i < customSelectDivLength; i++) {
                if (customSelectDiv[i].getElementsByClassName('select-selected').length) {
                    customSelectDiv[i].getElementsByClassName('select-selected')[0].remove();
                    customSelectDiv[i].getElementsByClassName('select-items')[0].remove();
                }

                var selElmnt = customSelectDiv[i].getElementsByTagName("select")[0];
                var selElmntOptionLength = selElmnt.length;
                /* For each element, create a new DIV that will act as the selected item: */
                var selectedReplacement = document.createElement('div');
                selectedReplacement.setAttribute('class', 'select-selected');
                selectedReplacement.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
                customSelectDiv[i].appendChild(selectedReplacement);
                /* For each element, create a new DIV that will contain the option list: */
                var divForOptionList = document.createElement("DIV");
                divForOptionList.setAttribute('class', 'select-items select-hide');

                createOptionList(selElmnt, selElmntOptionLength, divForOptionList);
                customSelectDiv[i].appendChild(divForOptionList);
                /*when the select box is clicked, close any other select boxes,
                and open/close the current select box:*/
                selectedReplacement.addEventListener("click", function(e) {
                    e.stopPropagation();
                    closeAllSelect(this);
                    this.nextSibling.classList.toggle("select-hide");
                    this.classList.toggle("select-arrow-active");
                });
            }
            /*a function that will close all select boxes in the document,
              except the current select box:*/
              function closeAllSelect(elmnt) {
                 var x, y, i, xl, yl, arrNo = [];
                 x = document.getElementsByClassName("select-items");
                 y = document.getElementsByClassName("select-selected");
                 xl = x.length;
                 yl = y.length;
                 for (i = 0; i < yl; i++) {
                   if (elmnt == y[i]) {
                     arrNo.push(i)
                   } else {
                     y[i].classList.remove("select-arrow-active");
                   }
                 }
                 for (i = 0; i < xl; i++) {
                   if (arrNo.indexOf(i)) {
                     x[i].classList.add("select-hide");
                   }
                 }
              }
              /*if the user clicks anywhere outside the select box,
                then close all select boxes:*/
            document.addEventListener("click", closeAllSelect);
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
                    var gallery = variablesForSelectChange[1];
                    var galleryId = variablesForSelectChange[2];
                    var previousVal = variablesForSelectChange[3];
                    for (i = 0; i < selectingElementLength; i++) {
                        var selectedValue = this.innerHTML;
                        if (selectingElement.options[i].innerHTML == selectedValue) {
                            selectChange(selectedValue, selectingElement, imageItem, gallery, galleryId, previousVal);
                            selectingElement.selectedIndex = i;
                            showedValue.innerHTML = selectedValue;
                            var SameAsSelectedOption = this.parentNode.getElementsByClassName("same-as-selected");
                            var SameAsSelectedOptionLength = SameAsSelectedOption.length;
                            for (var k = 0; k < SameAsSelectedOptionLength; k++) {
                                SameAsSelectedOption[k].removeAttribute("class");
                            }
                            this.setAttribute("class", "same-as-selected");
                            break;
                        }
                    }
                    showedValue.click();
                });
                divForOptionList.appendChild(optionItem);
            }
        }
        var selectElemnts = document.getElementsByClassName('custom-select');
        customSelect(selectElemnts);
