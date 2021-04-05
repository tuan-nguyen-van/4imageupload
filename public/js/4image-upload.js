/* Image Uploader version 3.0

Website: https://4imageupload.com

MIT License
4imageupload is licensed under MIT.

Copyright (c) 2019, William Tuan Nguyen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/


function ImageUpload(options = {}) {

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

    //Get exif as callback argument.
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


    function camelizeWithoutDash(str) {
        var str = str.replace(/-/g, ' ');
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    //function to check if method exist when declare object.
    //If object have then process that method. If not then process the default option method.
    //function accept 3 paremeter to pass to method and return value that object method return.
    function checkMethodExists(methodName, argument1 = null, argument2 = null, argument3 = null) {
        if (typeof optionsWithCamelizeUploadZoneId != 'undefined' && typeof optionsWithCamelizeUploadZoneId[methodName] === "function") {
            return optionsWithCamelizeUploadZoneId[methodName](argument1, argument2, argument3);
        }
        else {
            return defaultOptions[methodName](argument1, argument2, argument3);
        }
    }

    //function to check mobile and tablet device (touch device)
    function mobileAndTabletCheck() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
            check = true;
        })(navigator.userAgent||navigator.vendor||window.opera);
        return check;
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

    //Get options value from dropzone opject when people declare it.
    function returnOptionValue(option) {
        if (typeof optionsWithCamelizeUploadZoneId != 'undefined' && option in optionsWithCamelizeUploadZoneId) {
            optionValue = optionsWithCamelizeUploadZoneId[option];
        }
        else {
            optionValue = defaultOptions[option]
        }
        return optionValue;
    }


    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }


    function insertBefore(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }


    function addFeaturesForPositionChange(positionChange = true, imageElmnt) {

        if (positionChange == true) {
            checkMethodExists('savingImageOrderAlertAction');
            var disabledGalleryTime = returnOptionValue('delayTimeAfterImageDragged');

            if (Number.isInteger(disabledGalleryTime)) {
                gallery.style.pointerEvents = 'none';
                setTimeout(function() {
                    gallery.style.pointerEvents = 'auto';
                }, disabledGalleryTime);
            }


            //Remove style attribute to change back backgroundColor for option list.
            var selectItems = gallery.getElementsByClassName('iu-select-items');
            for (var i = 0; i < selectItems.length; i++) {
                var customSelectOptions = selectItems[i].getElementsByTagName('DIV');
                for (var j = 0; j < customSelectOptions.length; j++) {
                    customSelectOptions[j].removeAttribute('style');
                }
            }

        }

        resetImageOrder(positionChange, null, 'change-order');
    }


    function resetImageOrder(positionChange = true, deleteImage = null, action = null) {

        var imageOrderNumber = gallery.getElementsByClassName('iu-image-order-number');

        if (selectOrder == true) {
            var selectOrderNumber = gallery.getElementsByClassName('iu-select-number');
        }
        if (selectOrder == true && customSelectOption == true) {
            var customSelectSelected = gallery.getElementsByClassName('iu-select-selected');
        }


        if (positionChange == true) {
            var xhttp = new XMLHttpRequest();
            var formData = new FormData();
            var imageItem;
            var imageIdOrder = [];
            if (imageOrderNumber.length) {
                for (var i = 0; i < imageOrderNumber.length; i++) {
                    imageOrderNumber[i].innerHTML = i + 1;
                    imageItem = imageOrderNumber[i].parentNode.parentNode;

                    imageId = imageItem.getAttribute('data-image-id');

                    imageIdOrder.push(Number(imageId));
                }
                formData.append('imageIdOrder', imageIdOrder);
                xhttp.addEventListener("error", function() {
                    checkMethodExists('alertServerErrorAction');
                });

                if (sendRequestToServer === true) {
                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            savedImageOrderAlertWithActionVar();
                        }
                    }
                    var saveImageOrderRoute = returnOptionValue('saveImageOrderRoute');
                    xhttp.open("POST", saveImageOrderRoute, true);
                    setHeaders(xhttp);

                    var saveImageOrderRouteTimeout = returnOptionValue('saveImageOrderRouteTimeout');
                    if (Number.isInteger(saveImageOrderRouteTimeout)) {
                        xhttp.timeout = saveImageOrderRouteTimeout;
                    }

                    xhttp.ontimeout = function (e) {
                        checkMethodExists('saveImageOrderRouteTimeoutAction');
                    }
                    xhttp.send(formData);
                }
                else if (sendRequestToServer === false) {
                    setTimeout(function(){
                        console.log('testing');
                        savedImageOrderAlertWithActionVar();
                    }, delayTimeToRunWithoutServer);
                }


                function savedImageOrderAlertWithActionVar() {
                    if (action !== 'change-back-upload-zone' && action !== 'delete-1-image') {
                        checkMethodExists('savedImageOrderAlertAction');
                    }
                }

                //Reset select option
                if (selectOrder == true) {
                    selectOrderNumberLength = selectOrderNumber.length;
                    for (var i = 0; i < selectOrderNumberLength; i++) {
                        selectOrderNumber[i].value = i + 1;
                        if (customSelectOption == true) {
                            customSelectSelected[i].innerHTML = i + 1;
                        }
                    }
                    if (customSelectOption == true) {
                        var customSelectElmnts = gallery.getElementsByClassName('iu-custom-select');
                        _this.customSelect(customSelectElmnts, action);
                        _this.customSelectScrollBar();
                    }
                }

            }
        }
    }


    //Set the file Name as current date + random number from 10001 -> 20000 + . file extension
    function setFileName(originalName) {
        var renameImage = 'renameImage';
        return checkMethodExists('renameImage', originalName);
    }


    function appendCloseButton(imagePlaceholder, fileName, xhttp, newImageName) {
        if (displayDeleteImageButton == true) {
            //Add close button to image
            var closeButton = document.createElement('div');
            closeButton.className = "iu-close-button";
            if (fileName) {
                closeButton.setAttribute('data-image-name', fileName);
            }
            var closeIcon = document.createElement('div');
            closeIcon.innerHTML = returnOptionValue('deleteImageIcon');
            closeIcon.className = 'iu-close-icon';
            closeButton.appendChild(closeIcon);

            //Add xhttp request in case customer press close button while image
            //is uploading, so we able to abort xhttp request.
            closeButton.addEventListener("mousedown", function() {
                deleteImage(event, xhttp, newImageName);
            });
            imagePlaceholder.appendChild(closeButton);
        }
    }


    function createImagePlaceholder() {
        var imagePlaceholder = document.createElement('div');
        imagePlaceholder.className = 'iu-image-placeholder';

        var img = document.createElement('img');
        img.className = 'iu-image';
        //Prevent browser like firefox allow image to be dragged by default.
        img.setAttribute('draggable', false);

        imagePlaceholder.appendChild(img);
        return [imagePlaceholder, img];
    }


    this.options = options;
    this.appendServerImage = function(serverImage, imageName, imageId) {

        //Create image item then add to gallery
        var imageItem = document.createElement('div');
        imageItem.className = "iu-image-item iu-image-item-style " + imageName;
        imageItem.setAttribute('data-image-id', imageId);

        var returnImage = createImagePlaceholder();
        var imagePlaceholder = returnImage[0];
        var img = returnImage[1];

        img.setAttribute("src", serverImage);

        checkMethodExists('setImagesWidthAndHeight', imagePlaceholder);

        img.setAttribute("alt", imageName);
        imageItem.appendChild(imagePlaceholder);

        //Create select Element
        if (selectOrder == true) {
            var selectElements = gallery.getElementsByClassName('iu-select-number');
            var selectElementLength = selectElements.length;

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


            //If customSelectOption equal true then call customSelect for select element
            //Custom select will add style for select when add option for select element.
            if (customSelectOption == true) {

                //Add custom select for current just created select
                var customSelectDiv = selectDiv.parentNode.getElementsByClassName('iu-custom-select');
                _this.customSelect(customSelectDiv);

                //Add custom select for every select element exist in gallery
                var selectDivCollection = gallery.getElementsByClassName('iu-custom-select');
                _this.customSelect(selectDivCollection, 'add-1-image');
            }

        }

        //Add image order number to image
        var imageOrderNumberClass = gallery.getElementsByClassName("iu-image-order-number");
        var imageOrderLength = imageOrderNumberClass.length;

        var imageOrderNumber = document.createElement('div');
        imageOrderNumber.className = 'iu-image-order-number';

        //hide image order if declare option is false
        if (displayImageOrderNumber == false) {
            imageOrderNumber.style.display = 'none';
        }

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
        imagePlaceholder.appendChild(imageOrderNumber);


        //Add close button to image
        appendCloseButton(imagePlaceholder);

        galleryAppend(imageItem);
        addEventListenerForDragElement(imageItem);
        if (customSelectOption == true) {
            _this.customSelectScrollBar();
        }
        checkMethodExists('afterAppendImageAction', imageItem);
    };


    this.customSelect = function(customSelectDivs, action) {
        if (customSelectOption == true) {

            var customSelectDivLength = customSelectDivs.length;

            //Call custom select when user change image order by select or by dragging.
            //Just change iu-select-selected innerHTML equal selected index.
            if (action) {

                //Update custom select value for element '.iu-select-selected'
                function updateCustomSelectShowedValue(customSelectDiv) {
                    var selElmnt = customSelectDiv.getElementsByTagName("select")[0];
                    var selectedReplacement = customSelectDiv.getElementsByClassName('iu-select-selected')[0];
                    selectedReplacement.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;

                    if (action != 'add-1-image') {
                        var optionList = customSelectDiv.getElementsByClassName('iu-select-items')[0];
                        var sameAsSelectedOption = optionList.getElementsByClassName('iu-same-as-selected')[0];

                        //Remove all class to update 'iu-same-as-selected' class for option item
                        if (sameAsSelectedOption) {
                            sameAsSelectedOption.removeAttribute("class");
                        }

                        //Add 'iu-same-as-selected' class to select option
                        newCustomSelectedOption = optionList.children.item(Number(selElmnt.options[selElmnt.selectedIndex].innerHTML) - 1);
                        if (newCustomSelectedOption) {
                            newCustomSelectedOption.setAttribute("class", "iu-same-as-selected");
                        }
                    }
                }


                if (action == 'change-order') {
                    for (var i = 0; i < customSelectDivLength; i++) {
                        updateCustomSelectShowedValue(customSelectDivs[i]);
                    }
                }
                else if (action == 'add-1-image') {
                    for (var i = 0; i < customSelectDivLength; i++) {
                        updateCustomSelectShowedValue(customSelectDivs[i]);

                        //Add 1 option to custom select option item
                        var customSelectItem = customSelectDivs[i].getElementsByClassName("iu-select-items")[0];
                        var lastOptionNumber = Number(customSelectItem.lastChild.textContent);

                        var optionItem = document.createElement("div");
                        optionItem.innerHTML = lastOptionNumber + 1;
                        customSelectOptionClick(optionItem);
                        customSelectItem.appendChild(optionItem);

                        //Call timeout so that the loop will run to the end to have item call 'iu-same-as-selected'.
                        setTimeout(changeBackGroundColorForSelectedOption, 200, optionItem);
                    }
                }
                else if (action == 'delete-1-image') {
                    for (var i = 0; i < customSelectDivLength; i++) {
                        updateCustomSelectShowedValue(customSelectDivs[i]);

                        //Remove last custom option of select items
                        var customSelectItem = customSelectDivs[i].getElementsByClassName("iu-select-items")[0].lastChild.remove();
                    }
                }
                return;
            }


            for (var i = 0; i < customSelectDivLength; i++) {
                if (customSelectDivs[i].getElementsByClassName('iu-select-selected').length) {
                    customSelectDivs[i].getElementsByClassName('iu-select-selected')[0].remove();
                    customSelectDivs[i].getElementsByClassName('iu-select-items')[0].remove();
                }
                var selElmnt = customSelectDivs[i].getElementsByTagName("select")[0];
                var selElmntOptionLength = selElmnt.length;

                /* For each element, create a new DIV that will act as the selected item: */
                var selectedReplacement = document.createElement('div');
                selectedReplacement.setAttribute('class', 'iu-select-selected');
                selectedReplacement.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
                customSelectDivs[i].appendChild(selectedReplacement);

                /* For each element, create a new DIV that will contain the option list: */
                var divForOptionList = document.createElement("DIV");
                divForOptionList.setAttribute('class', 'iu-select-items iu-select-hide');

                createOptionList(selElmnt, selElmntOptionLength, divForOptionList);
                customSelectDivs[i].appendChild(divForOptionList);

                /*when the select box is clicked, close any other select boxes,
                and open/close the current select box:*/
                selectedReplacement.addEventListener("click", function(e) {

                    //Alert user when they change image order while image still uploading
                    var returnValue = alertUploadingIfChangeImageOrder();
                    if (returnValue) {
                        return;
                    }

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

            //If the user press mouse down then close all selects also
            //to prevent so select dropdown when dragging images
            gallery.addEventListener("mousedown", closeAllSelect);
        }
    }


    //Create option for custom select element
    function createOptionList(selElmnt, selElmntOptionLength, divForOptionList) {

        var optionList = divForOptionList.children;

        for (var i = 0; i < optionList.length; i++) {
            optionList[i].remove();
        }

        for (j = 0; j < selElmntOptionLength; j++) {
            var optionItem = document.createElement("div");
            optionItem.innerHTML = selElmnt.options[j].innerHTML;

            //Add class iu-same-as-selected for option item.
            if (j + 1 == Number(selElmnt.options[selElmnt.selectedIndex].innerHTML)) {
                optionItem.setAttribute("class", "iu-same-as-selected");
            }


            /*when an item is clicked, update the original select box,
            and the selected item:*/
            customSelectOptionClick(optionItem);
            divForOptionList.appendChild(optionItem);


            //Call timeout so that the loop will run to the end to have item call 'iu-same-as-selected'.
            setTimeout(changeBackGroundColorForSelectedOption, 200, optionItem);

        }
    }


    function getSameAsSelectedOption(option) {
        return option.parentNode.getElementsByClassName('iu-same-as-selected')[0];
    }


    //This function use to change back ground color of option on hover.
    function changeBackGroundColorForSelectedOption(optionItem) {
        //Get the css backgroundColor from selected option.
        var backgroundColor;
        var sameAsSelectedOption = getSameAsSelectedOption(optionItem);
        var backgroundColor = window.getComputedStyle(sameAsSelectedOption, null).getPropertyValue("background-color");

        //Remove backgroundColor on hover for custom select option that haveclass 'iu-same-as-selected'
        optionItem.addEventListener('mouseover', function(e) {
            var target = e.target;
            var sameAsSelectedOption = getSameAsSelectedOption(optionItem);

            if (!target.className.includes('iu-same-as-selected')) {
                sameAsSelectedOption.style.backgroundColor = 'initial';
            }
            else {
                sameAsSelectedOption.style.backgroundColor = backgroundColor;
            }
        });

        //Readd backgroundColor for 'iu-same-as-selected' on mouseout
        optionItem.addEventListener('mouseout', function(e) {
            var sameAsSelectedOption = getSameAsSelectedOption(optionItem);
            sameAsSelectedOption.style.backgroundColor = backgroundColor;
        });
    }


    /*when an item is clicked, update the original select box,
    and the selected item:*/
    function customSelectOptionClick(optionItem) {
        optionItem.addEventListener("click", function(e) {

            var selectingElement = optionItem.parentNode.parentNode.getElementsByTagName("select")[0];
            var selectingElementLength = selectingElement.length;
            var showedValue = optionItem.parentNode.previousSibling;
            var variablesForSelectChange = getVariablesForSelectChange(selectingElement);
            var imageItem = variablesForSelectChange[0];
            var previousVal = variablesForSelectChange[1];

            for (i = 0; i < selectingElementLength; i++) {
                var selectedValue = Number(optionItem.innerHTML);

                if (selectingElement.options[i].innerHTML == selectedValue) {
                    selectChange(selectedValue, selectingElement, imageItem, previousVal);

                    //Update select element to value i
                    selectingElement.selectedIndex = i;

                    //update Showed Value of custom select to selected Value
                    showedValue.innerHTML = selectedValue;

                    var sameAsSelectedOption = optionItem.parentNode.getElementsByClassName("iu-same-as-selected")[0];

                    if (sameAsSelectedOption) {
                        sameAsSelectedOption.removeAttribute("class");
                    }

                    optionItem.setAttribute("class", "iu-same-as-selected");

                    break;
                }
            }
            showedValue.click();
        });
    }

    //Function to add scroll bar to custom select when number of options over maxCustomSelectOptions
    this.customSelectScrollBar = function(newElmnt = null) {
        if (selectOrder == true && customSelectOption == true) {

            var maxCustomSelectOptions = returnOptionValue('maxCustomSelectOptions');

            //Check if maxCustomSelectOptions < 1 then no need to add scroll bar to them.
            if (maxCustomSelectOptions < 1) {
                return;
            }

            var imageItemLength = gallery.getElementsByClassName('iu-image-item').length;
            var customSelectItems = gallery.getElementsByClassName('iu-select-items');
            var customSelectItemLength = customSelectItems.length;

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
            //If smaller then set height equal their original height
            else {
                for (var i = 0; i < customSelectItemLength; i++) {
                    customSelectItems[i].style.overflowY = 'auto';
                    customSelectItems[i].style.height = customSelectItemLength * selectSelectedElmnt[0].offsetHeight + 'px';
                }
            }
        }
    }


    this.defaultOptions = {
        //String. Must declare. Id of the <div> where to show image upload zone
        //(when users click or drop files inside this zone will trigger uploading process).
        imageUploadZoneId : null,


        //String. Must declare. Id of the <div> where uploaded images be showed inside here.
        imageGalleryId: null,


        //Boolean. If false then you can test without sending request to server to handle.
        //So the javascript code only run in client side.
        //Important: set this to true if you want to send request to server.
        sendRequestToServer: false,


        //String. Route (link) to send server request to save uploading images with the method 'POST'.
        saveImageRoute : null,


        //Object. Send additional data to saveImageRoute request. Like 'post_id', 'user_id' or 'thread_id'...
        //Syntax: {'Name0' : 'Value0', 'Name1' : 'Value1', ...}.
        //So the request on server will have additional request inputs: 'Name0' with value 'Value0' and 'Name1' with value 'Value1' ...
        //Ex: { "post_id": "1562" }
        imageBelongsTo : null,


        //Object. Send headers for the request to the server. Ex: { "X-CSRF-TOKEN": "RSR6tkicph20COW11SOTT5S04j41QXZmfz4bTRwI" }.
        //You set headers object like this: {'headerName0' : 'headerValue0', 'headerName1' : 'headerValue1', ...}.
        headers: null,


        //Integer. The timeout for saveImageRoute request can take before automatically being terminated.
        saveImageRouteTimeout: 30000,


        //Function. Function that run when saveImageRoute reach timeout (saveImageRouteTimeout) for XMLHttpRequest().
        saveImageRouteTimeoutAction: function() {
            checkMethodExists('alertServerTimeoutAction');
        },

        // Function. This function is important, sometimes you will see in your database table `image` where
        // you have 2 images with the same image_number order. Ex: 5 images uploaded at the same time with
        // image_number like (6 7 4 5 6). The real reason is: very rare but still happen, when user
        // pressed delete button on uploading image, the server received and saved the image already
        // but did not return any response yet. So because server did not return response when user pressed delete button
        // would triggered abort() the XMLHttpRequest for saveImageRoute and the image still be deleted on client-side.
        // That's why you see image was deleted but still be saved on server and have 2 images with same image_order.
        //
        // This function is to solve the above problem. When abort() saveImageRoute XMLHttpRequest will run this function.
        // If you care about this problem. You will have to write a function inside here to send another XMLHttpRequest
        // with request input includes imageName of the uploading image. And on server you delete the database record of image with
        // `image_name` equal imageName and also on server image storage delete the image with name equal imageName.
        // Function has 1 parameter is imageName of uploading image.
        abortSaveImageRouteAction: function(imageName) {

        },

        //String. Route (link) to send server request to save all image order numbers with the method 'POST'.
        saveImageOrderRoute : null,


        //Integer. The timeout for saveImageOrderRoute request can take before automatically being terminated.
        saveImageOrderRouteTimeout: 30000,


        //Function. Function that run when saveImageOrderRoute reach timeout for XMLHttpRequest().
        saveImageOrderRouteTimeoutAction: function() {
            checkMethodExists('alertServerTimeoutAction');
        },


        //String. Route (link) to send server request to delete saved images with the method 'POST'.
        deleteImageRoute : null,


        //Integer. The timeout for deleteImageRoute can take before automatically being terminated.
        deleteImageRouteTimeout: 30000,


        //Function. Function that run when deleteImageRoute reach timeout (deleteImageRouteTimeout) for XMLHttpRequest().
        deleteImageRouteTimeoutAction: function() {
            checkMethodExists('alertServerTimeoutAction');
        },


        //Function. Show flash box to user to alert something when done something from server.
        //The default function has three parameters showedAlertString, showedTime and backgroundColor.
        addFlashBox: function(showedAlertString, showedTime, backgroundColor) {

        },


        //Array. An array contains arguments for addFlashBox function
        //to alert users when request to server reach timeout.
        //Syntax: [showedAlertString, showedTime, backgroundColor].
        alertServerTimeout: ['Server time out', 2000, '#f00e0e'],


        //Function. Function to show alert when request to server reach timeout.
        //You could change addFlashBox function inside image-upload.js to modify this feature.
        //Or you could write another function for alertServerTimeoutAction.
        //The default function takes 3 array elements from alertServerTimeout to pass arguments
        //for addFlashBox function.
        alertServerTimeoutAction: function() {
            checkMethodExists('addFlashBox', returnOptionValue('alertServerTimeout')[0], returnOptionValue('alertServerTimeout')[1], returnOptionValue('alertServerTimeout')[2]);
        },


        //String. The text note used for the <div> inside Image Upload Zone ('#iu-image-upload-zone')
        //with class ".iu-image-note".
        //Ex: 'Add Photos' or 'Tap here to upload photos'.
        dictUploadImageNote: null,


        //Function. Call when images are uploading to alert user.
        //Function has one parameter that is the fileLength
        //of all uploading images (total number of images are uploading).
        alertUploadingImage: function(fileLength) {

        },


        //Boolean. Option to show image uploading placeholder when images are uploading with class
        //'.iu-image-uploading-placeholder'.
        showImagePlaceHolder : true,


        //Function. Function to change image placeholder css style with class '.iu-image-placeholder'
        //while processing images and send request to server.
        //Function has one paremeter that is DOM element imagePlaceholder itself.
        changeImagePlaceholder: function(imagePlaceholder) {
            imagePlaceholder.style.animation = 'iu-backgroundColor 2000ms linear infinite';
        },


        //Boolean. If true then showed images will have a select dropdowns below them to change image order numbers.
        selectOrder: true,


        //Boolean. If true then selectOrder must also be true.
        //The free version (default) will not include customSelect so remember to set it to false.
        //This option used for customizing select dropdown for the style you choose
        //and work accross all browsers with the same select style.
        customSelect: true,


        //Integer. Numer of maximum options could be displayed in customSelect DOM element.
        //If over maxCustomSelectOptions then automatically add a scrollbar.
        maxCustomSelectOptions: 5,


        //Boolean. If true, it specifies that the user is allowed to upload
        //multiple images one time in the <input type="file"> element.
        //false then only can upload one image a time.
        multiple: true,


        //Boolean. Allow users to move images for changing image order numbers by dragging or not.
        allowDragImage: true,


        //Array. An array contains arguments for addFlashBox function
        //to alert users cannot change image order while images are uploading.
        //Syntax: [showedAlertString, showedTime, backgroundColor].
        alertUploadingIfChangeOrder: ['Please wait after finish uploading', 2000],


        //Function. Function to show alert to user cannot change image order while images are uploading.
        //The default function takes 3 array elements from alertUploadingIfChangeOrder to pass arguments
        //for addFlashBox function.
        alertUploadingIfChangeOrderAction: function() {
            checkMethodExists('addFlashBox', returnOptionValue('alertUploadingIfChangeOrder')[0], returnOptionValue('alertUploadingIfChangeOrder')[1], returnOptionValue('alertUploadingIfChangeOrder')[2]);
        },


        //Integer. Number in milisecond, when users use touch devices and they touched image more than "touchDuration" in milisecond
        //then the image will be lifted up and could be dragged around by finger move.
        touchDuration: 500,


        //Function. Function to change image css style after user touched on image longer than "touchDuration".
        //Purpose is to show image is ready to be dragged around to change order number.
        //Function has one paremeter that is the image item with class '.iu-image-item' that be touched on.
        changeImageStyleWhenTouchImage: function(image) {
            image.style.opacity = '0.8';
        },


        //Boolean. True if you want to display image order number over image.
        //False image order number will not be showed.
        displayImageOrderNumber: true,


        //Boolean. Specifies whether delete button should be added.
        displayDeleteImageButton: true,


        //String. The icon to illustrate delete image spot to click with class '.iu-close-icon'.
        deleteImageIcon: '&times;',


        //Integer. Limit the maximum number of images could be uploaded.
        maxImages: null,


        //Array. An array contains arguments for addFlashBox function
        //to alert users that they chose images to upload exceed maxImages.
        //Syntax: [showedAlertString, showedTime, backgroundColor].
        alertMaxImages: ['Maximum images reached', 2000, '#f00e0e'],


        //Function. Function to show alert to users that they chose images to upload exceed maxImages.
        //The default function takes 3 array elements from alertMaxImages to pass arguments
        //for addFlashBox function.
        alertMaxImagesAction: function () {
            checkMethodExists('addFlashBox', returnOptionValue('alertMaxImages')[0], returnOptionValue('alertMaxImages')[1], returnOptionValue('alertMaxImages')[2]);
        },


        //Boolean. Add preview image for <img> with class '.iu-image' with the source 'src' is the
        //original image that user chose while images are uploading to server.
        displayPreviewImage: true,


        //Boolean. An option to show progress when uploading image to server for image placeholder with class '.iu-image-placehoder'.
        showUploadingProgress: true,


        //Boolean. An option to show percent complete when uploading image to server along with showUploadingProgress.
        showUploadedPercentComplete: true,


        //Function. Here is a function to show uploading progress for image placeholder '.iu-image-placeholder'.
        //Function has two parameters that is image placeholder DOM elemenet
        //with class '.iu-image-placeholder' and showUploadedPercentComplete option above
        //for you to add custom progress style to it while image is uploading to server.
        showUploadingLoader: function(imagePlaceholder, showUploadedPercentComplete) {

        },


        //Function. Function to update uploading loader while image is being uploaded to server.
        //The default function has three parameters that is percent uploading completion, image placeholder with class
        //'.iu-image-placeholder' and showUploadedPercentComplete option above.
        updateUploadingLoader: function(percentComplete, imagePlaceholder, showUploadedPercentComplete) {

        },


        //Function. Function to remove uploading loader after image is fully uploaded.
        //The default function has two parameters is the image placeholder '.iu-image-placeholder' and showUploadedPercentComplete
        //option above.
        removeUploadingLoader: function(imagePlaceholder, showUploadedPercentComplete) {

        },


        //Array. An array contains arguments for addFlashBox function
        //to alert users server has error when sending XMLHttpRequest (AJAX).
        //Syntax: [showedAlertString, showedTime, backgroundColor].
        alertServerError: ['Server Error', 2000, '#f00e0e'],


        //Function. Function to alert users server has error when sending XMLHttpRequest (AJAX).
        //The default function takes 3 array elements from alertServerError to pass arguments
        //for addFlashBox function.
        alertServerErrorAction: function() {
            checkMethodExists('addFlashBox', returnOptionValue('alertServerError')[0], returnOptionValue('alertServerError')[1], returnOptionValue('alertServerError')[2]);
        },


        //Integer. Maximum image columns to show in image gallery.
        maxImageColumns: 6,


        //Integer. Minimum image columns to show in image gallery.
        minImageColumns: 3,


        //Integer. The minimum width of a images in pixel. Used with 'maxImageColumns'
        //and 'minImageColumns' to decide number of image columns to show in gallery.
        minImageWidth: 150,


        //Decimal number. This option to decide the ratio height/width of image while showed in gallery.
        //Default is 1 so width equal height.
        //You could consider changing setImagesWidthAndHeight function to set width and height of image all the way you want.
        showedHeightWithWidth: 1,


        //Integer. The maximum size of a image in MB. If exceeds then image will not be uploaded
        //and the function showAlertOnMaxImageSizeAction will be called.
        maxImageSize: 50,


        //Array. An array contains arguments for addFlashBox function
        //to alert users when they chose to upload images with image size over 'maxImageSize' in MB.
        //Syntax: [showedAlertString, showedTime, backgroundColor].
        showAlertOnMaxImageSize: ['Image size too big', 2000, '#f00e0e'],


        //Function. Function to alert users when they chose to upload images with image size over 'maxImageSize' in MB.
        //The default function takes 3 array elements from showAlertOnMaxImageSize to pass arguments
        //for addFlashBox function.
        showAlertOnMaxImageSizeAction: function(maxImageSize) {
            checkMethodExists('addFlashBox', returnOptionValue('showAlertOnMaxImageSize')[0], returnOptionValue('showAlertOnMaxImageSize')[1], returnOptionValue('showAlertOnMaxImageSize')[2]);
        },


        //Integer. The maximum width in pixel of images to resize before uploaded.
        //If only one maxResizedWidth or maxResizedHeight
        //is provided, the original aspect ratio width/height of the image will be preserved.
        //If user uploaded image that is smaller than maxResizedWidth then it will not get resized.
        maxResizedWidth : 1250,


        //Integer. See maxResizedWidth.
        maxResizedHeight : null,


        //Integer. The minimum width in pixel of image can be uploaded to server.
        //If below minImageUploadedWidth then image will not be uploaded.
        minImageUploadedWidth: null,


        //Integer. See minImageUploadedWidth.
        minImageUploadedHeight: null,


        //Array. An array contains arguments for addFlashBox function
        //to alert users that they uploaded image with size smaller
        //than minImageUploadedWidth or minImageUploadedHeight.
        //Syntax: [showedAlertString, showedTime, backgroundColor].
        minSizeImageUploadedAlert: ['Image too small', 2000, '#e30b0b'],


        //Function. Function to alert user that they uploaded image with size smaller
        //than minImageUploadedWidth or minImageUploadedHeight.
        //The default function takes 3 array elements from minSizeImageUploadedAlert to pass arguments
        //for addFlashBox function.
        minSizeImageUploadedAlertAction: function() {
            checkMethodExists('addFlashBox', returnOptionValue('minSizeImageUploadedAlert')[0], returnOptionValue('minSizeImageUploadedAlert')[1], returnOptionValue('minSizeImageUploadedAlert')[2]);
        },


        //Integer. Time interval in milisecond to disable gallery from being clicked on.
        //This option is to prevent users from drag and drop images around to change image order too fast.
        //The consequences is increase server usage and make browser running too fast.
        delayTimeAfterImageDragged: 200,


        //Boolean. If true then allow user to upload same images multiple times.
        allowSameImage: false,


        //Boolean. Fix bugs on iphones or touch devices. Because names of images change every time get uploaded
        //So this option double check if the same image with same image size get reuploaded.
        allowSameImageSize: false,


        //Array. An array contains arguments for addFlashBox function
        //to alert users that they chose to upload the same image again.
        //Syntax: [showedAlertString, showedTime, backgroundColor].
        sameImageUploadedAlert: ['Image has been uploaded', 2000, '#e30b0b'],


        //Function. Function to alert user that they chose to upload the same image again.
        //The default function takes 3 array elements from sameImageUploadedAlert to pass arguments
        //for addFlashBox function.
        sameImageUploadedAlertAction: function() {
            checkMethodExists('addFlashBox', returnOptionValue('sameImageUploadedAlert')[0], returnOptionValue('sameImageUploadedAlert')[1], returnOptionValue('sameImageUploadedAlert')[2]);
        },


        //String. Ex: 'image/jpeg' or 'image/png' or 'image/png'... The mime type of
        //the resized image (not the file extension)
        //If null the original mime type will be used.
        //If you need to change the file extension ex: '.png' or '.jpg' then see 'renameImage' option below.
        resizeMimeType: null,


        //Function. Is a function to rename the image before uploaded to the server.
        //This function has one parameter is original image name and must return image name.
        //With default function then the image name is set
        //with current time (UNIX timestamp) in milisecond plus random number from 1000 to 9999 then add file extension.
        renameImage: function(originalName) {
            var dt = new Date();
            var time = dt.getTime();
            var randomNumber = (Math.floor((Math.random() * 1000) + 9000)).toString();
            var fileExt = originalName.split('.').pop();
            return time + randomNumber + '.' + fileExt;
        },


        //Boolean. An options to enable or disable drag and drop file feature on <input type="file"> tag.
        dragAndDropFeature: true,


        //String. Specifies a filter for what image types the user can pick from the <input type="file"> dialog box.
        //Ex: 'image/*' for all type of images or 'image/jpeg, image/png'.
        //The <input type = 'file'> will have 'accept' attribute equal acceptedMimeType.
        acceptedMimeType: 'image/*',


        //Array. An array contains arguments for addFlashBox function
        //to alert users that they chose to upload the image with wrong Mime Type.
        //Syntax: [showedAlertString, showedTime, backgroundColor].
        showAlertMimeType: ['Wrong image mime type', 2000, '#e30b0b'],


        //Function. Function to alert user that they chose to upload the image with wrong Mime Type.
        //The default function takes 3 array elements from showAlertMimeType to pass arguments
        //for addFlashBox function.
        showAlertMimeTypeAction: function() {
            checkMethodExists('addFlashBox', returnOptionValue('showAlertMimeType')[0], returnOptionValue('showAlertMimeType')[1], returnOptionValue('showAlertMimeType')[2]);
        },


        //Array. An option to add Logo to uploading image with this syntax to use drawImage feature.
        //Syntax: [imagePath, x, y, width, height]
        //imagePath is the path to image source.
        //x, y is the X, Y coordinate where to place the logo on the image canvas.
        //width:	Optional. The width of the logo to use (stretch or reduce the logo)
        //height:	Optional. The height of the logo to use (stretch or reduce the logo)
        // Ex: ["/image/logo.png", 20, 20, 100, 100] or ["/image/logo.png", 20, 20]
        //or ["/image/logo.png", 20, 20, 100] or ["/image/logo.png", 20, 20, ,100]

        //If you want to add logo at the "potision":
        //"center", "top-left", "top-right", "bottom-right", "bottom-left"
        //of image canvas then follow this syntax
        //Syntax: [imagePath, width, height, potision, DeltaX, DeltaY].
        //Optional. "width" and "height" is the width and height of the logo (stretch or reduce the logo),
        //Optional. "DeltaX" and "DeltaY" is the x and y coordinate (in pixel) to move logo away from "position" you declared
        //as origin coordinate 0(0, 0).

        //Ex: ["/image/logo.png", 200, 120, 'bottom-right', 50, 50] is meant
        //that add logo.png with logo width equal 200px and logo height equal 120px,
        //at the bottom right of the uploading image and the
        //distance from the bottom border is 50px and the distance from right border is 50px.

        // You could provide width and height with empty value to keep original logo size.
        // Syntax: [imagePath, , , 'center'].
        addLogo: null,


        //DOM element. By default, uploaded image item '.iu-image-item' be appended to gallery as the last child.
        //But if you want uploaded image item to insert before other element inside gallery
        //then use this option.
        //The declare insertImageItemBeforeElmnt DOM Element must exist inside gallery for this option to work.
        insertImageItemBeforeElmnt: null,


        //Function. Is a function to set up more features for image upload library like you wish when create ImageUpload object.
        setup: function() {

        },


        //Function. Function run when using drag and drop feature for <input type="file">.
        //Function to highlight target when files hover over image upload zone.
        //The default is to change the border to red. See class '.iu-highlight' in css file.
        hightlightUploadZone : function(target) {
            target.classList.add('iu-highlight');
        },


        //Function. See hightlightUploadZone.
        //The default is to change the border back to the previous color.
        unhightlightUploadZone: function(target) {
            target.classList.remove('iu-highlight');
        },


        //Function. Return target (DOM Element) for hightlightUploadZone, unhightlightUploadZone
        //The default function returns target is image upload zone itself.
        getTargetForHighlight : function() {
            var target = document.getElementById(imageUploadZoneId);
            return target;
        },


        //Function. Function to change image upload zone ('#iu-image-upload-zone') and image note imageNoteOfImageUpload '.iu-image-note' inside
        //after all images are uploaded successfully to server.
        //Function has three paremeters that is imageUploadZone, imageNoteOfImageUpload and dictUploadImageNote option that you declare.
        changeUploadZoneAndInputNoteStyle: function(imageUploadZone, imageNoteOfImageUpload, dictUploadImageNote) {

        },


        //Function. Function to set width and height of image inside gallery with class '.iu-image-placeholder'.
        //Function has one parameter that is the div contains <img> with class '.iu-image-placeholder'.
        setImagesWidthAndHeight: function(imagePlaceholder) {
            var galleryWidth = gallery.clientWidth;
            var minImageWidth = returnOptionValue('minImageWidth');
            var maxImageColumns = returnOptionValue('maxImageColumns');
            var minImageColumns = returnOptionValue('minImageColumns');
            var showedHeightWithWidth = returnOptionValue('showedHeightWithWidth');
            var width;
            //Set the width and height of images based on customer configuration.
            if (galleryWidth/maxImageColumns > minImageWidth) {
                width = galleryWidth/maxImageColumns;
            }
            else {
                width = galleryWidth/minImageColumns;
            }
            imagePlaceholder.style.width = width - 0.1 + 'px';
            imagePlaceholder.style.height = width*showedHeightWithWidth + 'px';
        },


        //Array. An array contains arguments for addFlashBox function
        //to alert users that they changed position of image and did not yet be saved to server.
        //Syntax: [showedAlertString, showedTime, backgroundColor].
        savingImageOrderAlert: ['Saving...', 30000],


        //Function. Function to alert user that they change position of image and did not yet be saved to server.
        //The default function takes 3 array elements from savingImageOrderAlert to pass arguments
        //for addFlashBox function.
        savingImageOrderAlertAction: function() {
            checkMethodExists('addFlashBox', returnOptionValue('savingImageOrderAlert')[0], returnOptionValue('savingImageOrderAlert')[1], returnOptionValue('savingImageOrderAlert')[2]);
        },


        //Array. An array contains arguments for addFlashBox function
        //to alert users after user changed the position of image and image order was saved on server.
        //Syntax: [showedAlertString, showedTime, backgroundColor].
        savedImageOrderAlert: ['Saved', 2000],


        //Function. Function to alert users after user changed the position of image and image order was saved on server.
        //The default function takes 3 array elements from savedImageOrderAlert to pass arguments
        //for addFlashBox function.
        savedImageOrderAlertAction: function() {
            checkMethodExists('addFlashBox', returnOptionValue('savedImageOrderAlert')[0], returnOptionValue('savedImageOrderAlert')[1], returnOptionValue('savedImageOrderAlert')[2]);
        },


        //Array. An array contains arguments for addFlashBox function
        //to alert users when they pressed delete button on image and is
        //sending request to server but the server is not handle request yet.
        //Syntax: [showedAlertString, showedTime, backgroundColor].
        deletingImageAlert: ['Deleting...', 30000],


        //Function. Function to alert users when they press delete button on image and is
        //sending request to server but the server is not handle request yet.
        //The default function takes 3 array elements from deletingImageAlert to pass arguments
        //for addFlashBox function.
        deletingImageAlertAction : function() {
            checkMethodExists('addFlashBox', returnOptionValue('deletingImageAlert')[0], returnOptionValue('deletingImageAlert')[1], returnOptionValue('deletingImageAlert')[2]);
        },


        //Array. An array contains arguments for addFlashBox function
        //to alert users after they pressed delete button on image
        //and the server deleted image for the request.
        //Syntax: [showedAlertString, showedTime, backgroundColor].
        deletedImageAlert: ['Deleted', 2000],


        //Function. Function to alert users after they pressed delete button on image
        //and the server deleted image for the request.
        //The default function takes 3 array elements from deletedImageAlert to pass arguments
        //for addFlashBox function.
        deletedImageAlertAction : function() {
            checkMethodExists('addFlashBox', returnOptionValue('deletedImageAlert')[0], returnOptionValue('deletedImageAlert')[1], returnOptionValue('deletedImageAlert')[2]);
        },


        //Boolean. This option is allow send saveImageRoute request without actually sending image to server.
        //If true then request file 'image' will not be sent.
        //Instead request will send input with the name "image" and value is imageName.
        //If you want to use this option then on server change Controller for "saveImageRoute"
        //because request will not contain request file 'image' anymore.
        //This option is used mainly to test.
        sendFormDataWithoutImage: false,


        //Function. Function that run after append image from server to gallery done for each image.
        //This function has one parameter that is imageItem with class '.iu-image-item'.
        afterAppendImageAction: function(imageItem) {

        },

    };
    var imageUploadZoneId = options.imageUploadZoneId;

    if (!imageUploadZoneId) {
        alert('You must declare option imageUploadZoneId');
        return;
    }

    var camelizeUploadZoneId = camelizeWithoutDash(imageUploadZoneId);

    //Add camelizeUploadZoneId object that customer defined to options
    this.options[camelizeUploadZoneId] = options;

    //Attach _this to this object constructor
    var _this = this;
    var optionsWithCamelizeUploadZoneId = this.options[camelizeUploadZoneId];
    var defaultOptions = this.defaultOptions;

    //Add <input type="file"> for image upload zone.
    var imageUploadZone = document.getElementById(imageUploadZoneId);

    //Add position "relative" so 'display' css property can work
    imageUploadZone.style.position = 'relative';

    var galleryId = returnOptionValue('imageGalleryId');

    if (!galleryId) {
        alert('You must declare option imageGalleryId');
        return;
    }

    var gallery = document.getElementById(galleryId);

    var showUploadingProgress = returnOptionValue('showUploadingProgress');

    var allowDragImage = returnOptionValue('allowDragImage');

    var sendRequestToServer = returnOptionValue('sendRequestToServer');

    var selectOrder = returnOptionValue('selectOrder');

    var customSelectOption = returnOptionValue('customSelect');

    var displayImageOrderNumber = returnOptionValue('displayImageOrderNumber');

    var displayDeleteImageButton = returnOptionValue('displayDeleteImageButton');

    var maxImages = returnOptionValue('maxImages');

    var maxImageSize = returnOptionValue('maxImageSize');

    var allowSameImage = returnOptionValue('allowSameImage');

    var dictUploadImageNote = returnOptionValue('dictUploadImageNote');

    var showImagePlaceHolder = returnOptionValue('showImagePlaceHolder');

    var acceptedMimeType = returnOptionValue('acceptedMimeType');

    var delayTimeToRunWithoutServer = 500;

    var showUploadedPercentComplete = returnOptionValue('showUploadedPercentComplete');

    var isMobileAndTablet = mobileAndTabletCheck();

    //Set gallery to style position relative for dragging image to work.
    gallery.style.position = 'relative';

    //Change image width and height if gallery change size with ResizeObserver
    try {
        //If browser support ResizeObserver
        var resizeObserver = new ResizeObserver(function(entries) {
            setWidthHeightForEachImage()
        });
        resizeObserver.observe(gallery);
    } catch (err) {
        console.log(err);
        //If browser not support ResizeObserver then do this manually

        //resize image when browser resised based on customer configuration
        ['resize', 'load'].forEach(resizeImage);
        function resizeImage(eventName) {
            window.addEventListener(eventName, function() {
                setWidthHeightForEachImage();
            });
        }


        var galleryWidth, newGalleryWidth;
        //Detect if gallery change width every 500 milisecond.
        // If true then resize image width and height
        setInterval(function() {
            galleryWidth = gallery.offsetWidth;

            setTimeout(function() {
                newGalleryWidth = gallery.offsetWidth;
                if (galleryWidth != newGalleryWidth && newGalleryWidth) {
                    setWidthHeightForEachImage();
                    galleryWidth = gallery.offsetWidth;
                }
            }, 50);

            if (galleryWidth != newGalleryWidth && newGalleryWidth) {
                setWidthHeightForEachImage();
                newGalleryWidth = gallery.offsetWidth;
            }

        }, 500);
    }


    //Function to set width and height for each images
    function setWidthHeightForEachImage() {
        var images = gallery.getElementsByClassName('iu-image-placeholder');
        for (var i = 0; i < images.length; i++) {
            checkMethodExists('setImagesWidthAndHeight', images[i]);
        }
    }

    //When click on image upload zone trigger click for <input type="file">
    //and reset input value to '' to reupload if select same image.
    imageUploadZone.addEventListener('click', function() {
        var inputButton = imageUploadZone.getElementsByClassName('iu-button')[0];
        inputButton.click();
        inputButton.value = '';
    });

    //Create input element
    var fileInput = document.createElement('input');
    fileInput.className = 'iu-button';
    fileInput.setAttribute('type', 'file');

    //Add accept equal mime type that customer defined
    fileInput.setAttribute('accept', acceptedMimeType);
    fileInput.setAttribute('autocomplete', 'off');
    fileInput.setAttribute('title', '');

    var multiple = returnOptionValue('multiple');
    fileInput.multiple = multiple;

    fileInput.addEventListener('change', function () {
        handleFiles(event, this.files);
    });

    imageUploadZone.appendChild(fileInput);

    //Add a note to image upload zone to show customer how to use them
    var uploadNote = document.createElement('div');
    uploadNote.className = 'iu-image-note';
    uploadNote.innerHTML = dictUploadImageNote;
    imageUploadZone.appendChild(uploadNote);

    //fileNames to record every image name have been uploaded for allowSameImage option.
    var fileNames = [];
    var fileSizes = [];

    var imageNoteOfImageUpload = imageUploadZone.getElementsByClassName('iu-image-note')[0];

    //Add drag and drop features for input zone.
    if (returnOptionValue('dragAndDropFeature') === true) {
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

        //Function to highlight image upload zone when files hover over it.
        function highlight() {
            var target = checkMethodExists('getTargetForHighlight');
            checkMethodExists('hightlightUploadZone', target);
        }

        //Function to unhighlight image upload zone when files not hover over it
        //Or hover outside it.
        function unhighlight() {
            var target = checkMethodExists('getTargetForHighlight');
            checkMethodExists('unhightlightUploadZone', target);
        }

        imageUploadZone.addEventListener('drop', handleDrop, false);

        //When user drop files then call handleFiles function to process file.
        function handleDrop(e) {
            var data = e.dataTransfer;
            var files = data.files;
            if (files.length) {
                handleFiles(e, files);
            }
        }
    }

    //Call setup method in case you want additional feature for image-upload.
    checkMethodExists('setup');


    function handleFiles(e, files) {
        var fileLength = files.length;
        var target = e.target;

        var imageItemLength = gallery.getElementsByClassName('iu-image-item-style').length;
        var maxFileBoolean = false;

        //Check if file I satisfy requirement if pass then log to passThroughRequirementArray
        var passThroughRequirementArray = [];
        for (var i = 0; i < fileLength; i++) {
            //Replace all images with name contains space " " to "_".
            //If contain space will have error.
            var fileIName = files[i].name.replace(" ", '_');

            var fileType = files[i].type;

            //size in bytes
            var originalImageSize = files[i].size;

            //Get file size and convert to MB
            var imageSize = originalImageSize/1000000;

            if (imageSize > maxImageSize) {
                checkMethodExists('showAlertOnMaxImageSizeAction');
            }
            else if (!fileType.includes("image")) {
                checkMethodExists('showAlertMimeTypeAction');
            }
            else if (acceptedMimeType !== 'image/*' && !acceptedMimeType.includes(fileType)) {
                checkMethodExists('showAlertMimeTypeAction');
            }
            else if (returnOptionValue('allowSameImage') == false && fileNames.includes(fileIName)) {
                checkMethodExists('sameImageUploadedAlertAction');
            }
            else if (returnOptionValue('allowSameImageSize') == false && fileSizes.includes(originalImageSize)) {
                checkMethodExists('sameImageUploadedAlertAction');
            }
            else {
                passThroughRequirementArray.push(i);
            }
        }

        //Update new fileLength
        fileLength = passThroughRequirementArray.length;

        //If number of image over maxImages then alert max images.
        if (maxImages && maxImages - imageItemLength <= 0) {
            maxFileBoolean = true;
            checkMethodExists('alertMaxImagesAction');
        }

        //This variable to log image number (i) that pass through requirement
        var satisfiedFileArray = [];

        //To log file name to check if same image get reupload.
        var currentFileNames = [];

        //If number of image uploaded plus number of image preparing to upload over max images
        if (maxImages && maxImages - (fileLength + imageItemLength) < 0) {
            checkMethodExists('alertMaxImagesAction');
            fileLength = maxImages - imageItemLength;
        }

        //Check the file size then list satisfied image to satisfiedFileArray
        for (var i = 0; i < fileLength; i++) {

            //Replace all images with name contains space " " to "_".
            //If contain space will have error.
            var fileIName = files[passThroughRequirementArray[i]].name.replace(" ", '_');

            var fileType = files[passThroughRequirementArray[i]].type;

            //Get file size and convert to MB
            var imageSize = files[passThroughRequirementArray[i]].size;
            fileSizes.push(imageSize);

            satisfiedFileArray.push(passThroughRequirementArray[i]);
            fileNames.push(fileIName);

            currentFileNames.push(fileIName);

            //When process loop for to the last file
            if (i == fileLength - 1) {
                var satisfiedFileArrayLength = satisfiedFileArray.length;

                //If have image that satisfy all requirement.
                if (satisfiedFileArrayLength > 0) {

                    //Alert image uploading
                    checkMethodExists('alertUploadingImage', satisfiedFileArrayLength);

                    var changeBackUploadZone = setInterval(function() {
                        if (!gallery.getElementsByClassName('iu-image-uploading-placeholder').length) {

                            //reset select option if user delete image while uploading
                            if (selectOrder == true) {
                                var imageItem = gallery.getElementsByClassName('iu-image-item');
                                var imageItemLength = imageItem.length;
                                for (var k = 0; k < imageItemLength; k++) {
                                    var selectElmnt = imageItem[k].getElementsByClassName('iu-select-number')[0];
                                    var selectElmntLength = selectElmnt.length;

                                    //Remove any option with value over imageItemLength.
                                    for (var j = imageItemLength; j < selectElmntLength; j++) {
                                        selectElmnt.remove(imageItemLength);
                                    }
                                }
                            }

                            //if customer delete image when uploading then we need to add customSelect back to select
                            if (customSelectOption == true) {
                                var customSelectElmnts = gallery.getElementsByClassName('iu-custom-select');
                                _this.customSelect(customSelectElmnts);
                            }

                            resetImageOrder(true, true, 'change-back-upload-zone');
                            checkMethodExists('changeUploadZoneAndInputNoteStyle', imageUploadZone, imageNoteOfImageUpload, dictUploadImageNote);
                            clearInterval(changeBackUploadZone);

                            //Reset input file so same image could get uploaded and able to alert image have been uploaded.
                            fileInput.value = "";
                        }
                    }, 1000);

                    var imageOrderNumberClass = gallery.getElementsByClassName("iu-image-order-number");
                    var imageOrderLength = imageOrderNumberClass.length;

                    //Add option for existed select, the number of option equal satisfiedFileArrayLength
                    if (selectOrder == true) {
                        var selectElements = gallery.getElementsByClassName('iu-select-number');
                        var selectElementLength = selectElements.length;

                        for (var k = 0; k < selectElementLength; k++) {
                            var selectK = selectElements[k];
                            for (var j = 0; j < satisfiedFileArrayLength; j++) {
                                var option = document.createElement('option');
                                option.text = selectElementLength + j + 1;
                                selectK.add(option);
                            }
                        }
                        if (customSelectOption == true) {
                            var selectDivCollection = gallery.getElementsByClassName('iu-custom-select');
                            _this.customSelect(selectDivCollection);
                        }
                    }


                    //Create image uploading placehoder for uploading images.
                    for (var k = 0; k < satisfiedFileArrayLength; k++) {
                        var imageUploadingPlaceHolder = document.createElement('div');
                        imageUploadingPlaceHolder.className = "iu-image-uploading-placeholder iu-image-item-style";

                        //Not display image place holder if customer declare option showImagePlaceHolder equal false.
                        if (!showImagePlaceHolder) {
                            imageUploadingPlaceHolder.classList.add('iu-display-none');
                        }

                        //Add file Name to class of image place holder to track where image is.
                        var fileName = currentFileNames[k];
                        imageUploadingPlaceHolder.classList.add(fileName);

                        var returnImage = createImagePlaceholder();

                        var imagePlaceholder = returnImage[0];
                        var img = returnImage[1];

                        //Change style for image place holder.
                        checkMethodExists('changeImagePlaceholder', imagePlaceholder);

                        checkMethodExists('setImagesWidthAndHeight', imagePlaceholder);

                        imageUploadingPlaceHolder.appendChild(imagePlaceholder);

                        //Add image order number to image
                        var imageOrderNumber = document.createElement('div');
                        imageOrderNumber.className = 'iu-image-order-number';

                        //Hide image order number if customer set false to option displayImageOrderNumber
                        if (displayImageOrderNumber == false) {
                            imageOrderNumber.classList.add('iu-display-none');
                        }

                        imageOrderNumber.innerHTML = k + imageOrderLength + 1;
                        imagePlaceholder.appendChild(imageOrderNumber);


                        //Create select for new image
                        if (selectOrder == true) {
                            var selectDiv = document.createElement('div');
                            selectDiv.className = "iu-custom-select";
                            var selectNumber = document.createElement('select');

                            //hide select dropdown if customer set customSelectOption equal true
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
                            for (var j = 0; j < selectElementLength + satisfiedFileArrayLength; j++) {
                                var option = document.createElement('option');
                                option.text = j + 1;
                                selectNumber.add(option);
                                if (j == k + selectElementLength) {
                                    option.selected = true;
                                }
                            }
                            if (customSelectOption == true) {
                                var customSelectDiv = selectDiv.parentNode.getElementsByClassName('iu-custom-select');
                                _this.customSelect(customSelectDiv);
                            }
                        }
                        galleryAppend(imageUploadingPlaceHolder);

                        //Show upload progress if customer set showUploadingProgress to true
                        if (showUploadingProgress === true) {
                            checkMethodExists('showUploadingLoader', imagePlaceholder, showUploadedPercentComplete);
                        }

                        //When run to the last satisfied File then read each file with processFileReader.
                        if (k == satisfiedFileArrayLength - 1) {
                            for (var m = 0; m < satisfiedFileArrayLength; m++) {
                                processFileReader(files[satisfiedFileArray[m]], satisfiedFileArray[m], satisfiedFileArrayLength, satisfiedFileArray);
                            }
                        }
                    }

                }

            }
        }


    }



    function galleryAppend(imageItem) {
        var insertImageItemBeforeElmnt = returnOptionValue('insertImageItemBeforeElmnt');
        if (insertImageItemBeforeElmnt) {
            gallery.insertBefore(imageItem, insertImageItemBeforeElmnt);
        }
        else {
            gallery.appendChild(imageItem);
        }
    }


    function getLastElementInside(parentElement, className) {
        var classNameElements = parentElement.getElementsByClassName(className);
        var classNameElementLength = classNameElements.length;
        return classNameElements[classNameElementLength - 1];
    }


    //Check if browser support image orientation exif data from imame. If not support then rotate image due to exif problem.
    var supportImageOrientation = CSS.supports('image-orientation', 'from-image');

    function processFileReader(file, fileNumber, fileLength, satisfiedFileArray) {
        if (satisfiedFileArray.includes(fileNumber)) {
            var imageOrientation;

            var imageName = file.name;
            imageName = imageName.replace(" ", "_");

            //Get last element inside gallery with class name imageName.
            var imageUploadingPlaceHolder = getLastElementInside(gallery, imageName);

            var imageNumber = imageUploadingPlaceHolder.getElementsByClassName('iu-image-order-number')[0].textContent;
            imageNumber = Number(imageNumber);

            var resizeMimeType = returnOptionValue('resizeMimeType');
            var imageType;
            if (resizeMimeType) {
                imageType = resizeMimeType;
            }
            else {
                imageType = file.type;
            }

            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                var image = new Image();
                image.src = e.target.result;
                image.onload = function(e) {

                    //Add "src" to image placehoder
                    if (returnOptionValue('displayPreviewImage') === true) {
                        var imageTag = imageUploadingPlaceHolder.getElementsByTagName('img')[0];
                        var imagePlaceholder = imageUploadingPlaceHolder.getElementsByClassName('iu-image-placeholder')[0];
                        imagePlaceholder.style.animation = 'none';
                        imageTag.setAttribute('src', image.src);
                    }

                    var orientation;

                    //Set width and height of the canvas to draw image for resizing
                    var maxWidth = returnOptionValue('maxResizedWidth');
                    var maxHeight = returnOptionValue('maxResizedHeight');

                    var width = image.width;
                    var height = image.height;

                    var minImageUploadedWidth = returnOptionValue('minImageUploadedWidth');
                    var minImageUploadedHeight = returnOptionValue('minImageUploadedHeight');

                    //Check if image width satisfied with minImageUploadedWidth and minImageUploadedHeight
                    if (minImageUploadedWidth && width < minImageUploadedWidth || minImageUploadedHeight && height < minImageUploadedHeight) {
                        checkMethodExists('minSizeImageUploadedAlertAction');
                        imageUploadingPlaceHolder.remove();
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
                                var option3 = addLogoOption[3];

                                //If customer declare option 3 equal string for position like "center"
                                if (typeof option3 === 'string') {
                                    var option1 = Number.isInteger(addLogoOption[1]) ? addLogoOption[1] : logo.width;
                                    var option2 = Number.isInteger(addLogoOption[2]) ? addLogoOption[2] : logo.height;
                                    var option4 = Number.isInteger(addLogoOption[4]) ? addLogoOption[4] : 0;
                                    var option5 = Number.isInteger(addLogoOption[5]) ? addLogoOption[5] : 0;

                                    if (option3 == 'center') {
                                        var xCoor = (width - option1)/2 + option4;
                                        var yCoor = (height - option2)/2 + option5;
                                    }
                                    else if (option3 == 'top-left') {
                                        var xCoor = option4;
                                        var yCoor = option5;
                                    }
                                    else if (option3 == 'top-right') {
                                        var xCoor = width - option1 - option4;
                                        var yCoor = option5;
                                    }
                                    else if (option3 == 'bottom-right') {
                                        var xCoor = width - option1 - option4;
                                        var yCoor = height - option2 - option5;
                                    }
                                    else if (option3 == 'bottom-left') {
                                        var xCoor = option4;
                                        var yCoor = height - option2 - option5;
                                    }

                                    ctx.drawImage(logo, xCoor, yCoor, option1, option2);
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
                                formData.append('imageNumber', imageNumber);
                            }

                            var xhttp = new XMLHttpRequest();

                            //apend to form data imageBelongsTo attribute to save on the server.
                            appendToFormData(returnOptionValue('imageBelongsTo'), formData);

                            xhttp.addEventListener("error", function() {
                                checkMethodExists('alertServerErrorAction');
                                removeImage(imageName);
                            });

                            var saveImageRoute = returnOptionValue('saveImageRoute');
                            var imageItem = getLastElementInside(gallery, imageName);
                            var imagePlaceholder = imageItem.getElementsByClassName('iu-image-placeholder')[0]

                            if (sendRequestToServer === true) {
                                xhttp.onreadystatechange = function() {
                                    if (this.readyState == 4 && this.status == 200) {
                                        // Add new image if success
                                        appendImage(savedImage, imageName, Number(this.response));
                                    }
                                };


                                xhttp.upload.addEventListener('progress', function(e) {
                                    var percentComplete = parseInt((e.loaded / e.total) * 100);

                                    if (showUploadingProgress === true) {
                                        checkMethodExists('updateUploadingLoader', percentComplete, imagePlaceholder, showUploadedPercentComplete);
                                    }

                                });

                                //Create delete button for image item.
                                appendCloseButton(imagePlaceholder, imageName, xhttp, newImageName);


                                xhttp.open("POST", saveImageRoute, true);
                                setHeaders(xhttp);

                                var saveImageRouteTimeout = returnOptionValue('saveImageRouteTimeout');

                                if (Number.isInteger(saveImageRouteTimeout)) {
                                    xhttp.timeout = saveImageRouteTimeout;
                                }

                                xhttp.ontimeout = function (e) {
                                    setTimeout(function() {
                                        removeImage(imageName);
                                    }, 2000)
                                    checkMethodExists('saveImageRouteTimeoutAction');
                                }
                                xhttp.send(formData);

                            }
                            else if (sendRequestToServer === false) {

                                function saveImageRouteSuccessAction(imagePlaceholder) {
                                    console.log('testing');
                                    //Create delete button for image item.
                                    appendCloseButton(imagePlaceholder, imageName);

                                    //This function try to update percentComplete like real uploading to server.
                                    var interval = setInterval(updatePercent, 100);
                                    var proxyPercentComplete = 0;
                                    function updatePercent() {
                                        if (proxyPercentComplete >= 100) {
                                            clearInterval(interval);
                                        }
                                        checkMethodExists('updateUploadingLoader', proxyPercentComplete, imagePlaceholder, showUploadedPercentComplete);
                                        proxyPercentComplete += 10;
                                    }

                                    //append image with id from 1 to 999999999999
                                    appendImage(savedImage, imageName, Math.floor(Math.random() * (1000000000000 - 1)) + 1 );
                                }
                                setTimeout(saveImageRouteSuccessAction, delayTimeToRunWithoutServer, imagePlaceholder);

                            }

                        }

                    });
                }
            }
        }
    }



    function appendImage(savedImage, imageName, savedImageId) {
        var imageItem = getLastElementInside(gallery, imageName);
        var imagePlaceholder = imageItem.getElementsByClassName('iu-image-placeholder')[0];

        if (showUploadingProgress === true) {
            checkMethodExists('removeUploadingLoader', imagePlaceholder, showUploadedPercentComplete);
        }

        imageItem.classList.add("iu-image-item");
        imageItem.setAttribute("data-image-id", savedImageId);

        var image = imageItem.getElementsByTagName('img')[0];

        imagePlaceholder.style.animation = 'none';

        image.setAttribute("src", savedImage);
        image.setAttribute("alt", imageName);

        imageItem.classList.remove('iu-image-uploading-placeholder');

        //Show image element if customer choose showImagePlaceHolder to false
        if (!showImagePlaceHolder) {
            imageItem.classList.remove('iu-display-none');
        }

        addEventListenerForDragElement(imageItem);

        if (customSelectOption == true) {
            _this.customSelectScrollBar();
        }
    }


    function removeImage(imageName)
    {
        var imageItem = getLastElementInside(gallery, imageName);
        imageItem.remove();

        //Remove fileName from fileNames Array
        //So it'll allow customer to reupload same image with same name again.
        //If not then will have alert sameUploadImage.
        var index = fileNames.indexOf(imageName);
        if (index > -1) {
            fileNames.splice(index, 1)
        }
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



    function deleteImage(event, xhttp, newImageName) {
        event.stopPropagation();

        var target = event.target;

        if (target.className.includes('iu-close-icon')) {
            target = target.parentNode;
        }

        var elmnt = target;
        var imageItem = elmnt.parentNode.parentNode;

        var deletedImageId = imageItem.getAttribute('data-image-id');


        if (!deletedImageId) {
            xhttpSuccessAction();
            if (xhttp) {
                xhttp.abort();
                checkMethodExists('abortSaveImageRouteAction', newImageName);
            }
        }
        else {
            var deleteImageRoute = returnOptionValue('deleteImageRoute');
            elmnt.onmouseup = function() {
                checkMethodExists('deletingImageAlertAction');
                var xhttp = new XMLHttpRequest();
                var formData = new FormData();
                formData.append('imageId', deletedImageId);
                xhttp.addEventListener("error", function() {
                    checkMethodExists('alertServerErrorAction');
                });

                if (sendRequestToServer === true) {
                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            xhttpSuccessAction();
                        }
                    };

                    xhttp.open("POST", deleteImageRoute, true);
                    setHeaders(xhttp);

                    var deleteImageRouteTimeout = returnOptionValue('deleteImageRouteTimeout');
                    if (Number.isInteger(deleteImageRouteTimeout)) {
                        xhttp.timeout = deleteImageRouteTimeout;
                    }

                    xhttp.ontimeout = function () {
                        checkMethodExists('deleteImageRouteTimeoutAction');
                    }
                    xhttp.send(formData);
                }
                else if (sendRequestToServer === false) {

                    setTimeout(function() {
                        console.log('testing');
                        xhttpSuccessAction();
                    }, delayTimeToRunWithoutServer);

                }
            }
        }

        function xhttpSuccessAction() {
            var imageItemLength = gallery.getElementsByClassName('iu-image-item').length;

            checkMethodExists('deletedImageAlertAction');

            if (imageItemLength == 1) {
                //Remove file record in file input to upload old file.
                imageUploadZone.getElementsByClassName('iu-button')[0].value = '';
            }
            var fileName = elmnt.getAttribute('data-image-name');
            var indexOfFileName = fileNames.indexOf(fileName);

            //remove file name from fileNames array to allow reupload same image
            if (indexOfFileName > -1) {
                fileNames.splice(indexOfFileName, 1);
            }

            imageItem.remove();
            var selectOptions = gallery.getElementsByClassName('iu-select-number');
            if (selectOptions.length) {
                //Change select option dropdown after remove image item.
                selectOptionLength = selectOptions[0].options.length;
                for (var i = 0; i < selectOptions.length; i++) {
                    selectOptions[i].options[selectOptionLength - 1].remove();
                }
                resetImageOrder(true, true, 'delete-1-image');
            }
        }

    }



    function selectClick(event) {
        //alert user when they change image order while image still uploading
        var returnValue = alertUploadingIfChangeImageOrder();

        //If return value equal true then prevent user from click on select.
        if (returnValue) {
            event.preventDefault();
            return;
        }

        //Else stop propagation because image item have event listener for mousedown and mousemove event
        //if not stop then the image item will lift up and move.
        event.stopPropagation();
    }


    function getVariablesForSelectChange(select) {
        var imageItem = select.parentNode.parentNode;
        var previousVal = Number(select.value);
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

        var imageItemSelected = gallery.getElementsByClassName('iu-image-item')[newSelectVal - 1];

        if (previousVal > newSelectVal) {
            insertBefore(imageItem, imageItemSelected);
        }

        if (previousVal < newSelectVal) {
            insertAfter(imageItem, imageItemSelected);
        }

        if (previousVal != newSelectVal) {
            addFeaturesForPositionChange(true, imageItem);
        }
    }


    function addEventListenerForDragElement(imageItem) {
        if (allowDragImage === true) {
            if (isMobileAndTablet == true) {
                var timer;
                var touchDuration = returnOptionValue('touchDuration');
                var body = document.getElementsByTagName('body')[0];
                var lastClientY;
                var startClientY;

                //Set timer for touch event and change image style if touch more than touchDuration
                function touchstart(target, clientY) {

                    document.ontouchmove = getLastClientY;
                    function getLastClientY(e) {
                        lastClientY = e.touches[0].clientY;
                    }

                    if (!timer) {
                        timer = setTimeout(function() {
                            //Set overflow to hidden show when user move image by finger move
                            //then the body will not get scroll along
                            body.style.overflow = 'hidden';

                            timer = null;
                            checkMethodExists('changeImageStyleWhenTouchImage', target);
                            dragElement(target, true);
                        }, touchDuration);
                    }
                }


                function touchend(e) {
                    //Reset scrollbar for body
                    body.style.overflow = 'auto';

                    //stops short touches from firing the event
                    if (timer) {

                        //Move window with scrollBy Method because we preventDefault behavior of scroll when touchstart
                        //so if timer have value (not reach touchDuration yet) then we still allow user to sroll.
                        if (startClientY != lastClientY) {

                            //If move down
                            if (startClientY > lastClientY) {
                                y = 10;
                            }
                            else {
                                y = -10;
                            }
                            var delay = 5;
                            var total =  Math.abs(y);

                            var scrollByInterval = setInterval(function() {
                                window.scrollBy(0, y);
                                total += Math.abs(y);
                                if (total >= 3 * Math.abs(startClientY - lastClientY)) {
                                    clearInterval(scrollByInterval);
                                }
                            }, delay);
                        }

                        clearTimeout(timer);
                        timer = null;
                    }
                }
                var imageSource = imageItem.getElementsByTagName('img')[0];

                imageSource.addEventListener("touchstart", function(e) {

                    if (e.touches.length > 1) {
                        return;
                    }

                    e.preventDefault();

                    startClientY = e.touches[0].clientY;

                    //alert user when they change image order while image still uploading
                    var returnValue = alertUploadingIfChangeImageOrder();
                    //If uploading image then return
                    if (returnValue) {
                        return;
                    }

                    touchstart(e.currentTarget.parentNode.parentNode);
                }, { passive:false, capture: false });

                imageSource.addEventListener("touchend", touchend);
            }
            else {
                imageItem.addEventListener('mousedown', function(e) {

                    //alert user when they change image order while image still uploading
                    var returnValue = alertUploadingIfChangeImageOrder();
                    //If uploading image then return
                    if (returnValue) {
                        return;
                    }

                    dragElement(e.currentTarget, false);
                });
            }
        }
    }


    //Function to alert user when they change image order while image still uploading
    function alertUploadingIfChangeImageOrder() {
        var firstImageUploading = gallery.getElementsByClassName('iu-image-uploading-placeholder')[0];
        if (firstImageUploading) {
            checkMethodExists('alertUploadingIfChangeOrderAction');
            return true;
        }
        else {
            return false;
        }
    }


    function dragElement(elmnt, touchDevice) {

        //Set element get dragged to the origin position due to position relative of placeholder element;
        var originTop = elmnt.offsetTop;
        var originLeft = elmnt.offsetLeft;
        elmnt.style.top = originTop + "px";
        elmnt.style.left = originLeft + "px";

        //Change position to absolute so image is ready to be move around.
        elmnt.style.position = "absolute";
        elmnt.style.zIndex = "1000";

        //Remove iu-image-item class from class List
        elmnt.classList.remove('iu-image-item');

        //Add placeHolder for elmnt.
        var placeHolder = document.createElement('div');
        placeHolder.style.visibility = "hidden";

        //Minus 1 pixel to solve problem when people resize browser and math round up imagePlaceholder width bigger than image Item width.
        //Then placeHolder will jump to next row.
        placeHolder.style.width = elmnt.offsetWidth - 0.5 + "px";
        placeHolder.style.height = elmnt.offsetHeight + "px";
        placeHolder.className = "iu-image-item iu-image-item-style iu-temporary-placeholder";

        var returnImage = createImagePlaceholder();
        var imagePlaceholder = returnImage[0];
        var img = returnImage[1];

        placeHolder.appendChild(imagePlaceholder);

        //Add select to placeHolder
        if (elmnt.getElementsByClassName('iu-select-number').length == 1) {
            var selectDiv = document.createElement('div');
            var selectNumber = document.createElement('select');
            selectNumber.className = 'iu-select-number';
            selectDiv.appendChild(selectNumber);
            placeHolder.appendChild(selectDiv);
        }

        //Add placeHolder to position that moved image located.
        insertAfter(placeHolder, elmnt);

        var pos1 = 0, pos2 = 0;

        var pos3 = elmnt.clientX;
        var pos4 = elmnt.clientY;

        var clientWidthOfGallery = gallery.clientWidth;
        var clientHeightOfGallery = gallery.clientHeight;

        var imageItemHeight = elmnt.offsetHeight;
        var imageItemWidth = elmnt.offsetWidth;

        if (touchDevice == false) {
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        else if (touchDevice == true) {
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementDrag;
        }

        var positionChange = false;
        function elementDrag(e) {
            e = e || window.event;
            if (!touchDevice) {
                e.preventDefault();
            }

            // calculate the new cursor position:
            var clientX, clientY;
            if (touchDevice == false) {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            else if (touchDevice == true) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
                var viewportOffset = elmnt.getBoundingClientRect();
                var insideOrOutsideElmnt;

                //If touch position inside element
                if (clientX >= viewportOffset.left && clientX <= viewportOffset.right && clientY >= viewportOffset.top && clientY <= viewportOffset.bottom) {
                    //touch inside
                }
                else {
                    document.ontouchmove = null;
                    elmnt.style = '';
                    //Remove temporary placeholder
                    var placeholderNeedDelete = gallery.getElementsByClassName('iu-temporary-placeholder')[0];
                    if (placeholderNeedDelete) {
                        placeholderNeedDelete.remove();
                    }
                }

            }

            //Get distance different between cursor after move image
            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;

            var elmntTop = elmnt.offsetTop;

            //Get new element top and left of draggable element then compare to
            // border to determine we can move or not
            var newElmntTop = elmntTop - pos2;
            if (newElmntTop >= 0 && newElmntTop < (clientHeightOfGallery - imageItemHeight)) {
                elmnt.style.top = newElmntTop + "px";
            }
            var elmntLeft = elmnt.offsetLeft;
            var newElmntLeft = elmntLeft - pos1;
            if (newElmntLeft >= 0 && newElmntLeft < (clientWidthOfGallery - imageItemWidth)) {
                elmnt.style.left = newElmntLeft + "px";
            }

            //Get the center of the draggable object for droppable purpose
            var centerX = elmntLeft + imageItemWidth/2;
            var centerY = elmntTop + imageItemHeight/2;

            //Get the coordinate of each image items to determine droppable target.
            var imageItems = gallery.getElementsByClassName('iu-image-item');
            var indexOfDroppableElement;
            var indexOfElmnt;
            var imageItemLength = imageItems.length;

            for (var i = 0; i < imageItemLength; i++) {
                if (imageItems[i] == placeHolder) {
                    indexOfElmnt = i;
                }
                if (imageItems[i] != placeHolder) {
                    var imageItemLeftI = imageItems[i].offsetLeft;
                    var imageItemTopI = imageItems[i].offsetTop;
                    var originTopOfImage;
                    var originLeftOfImage;

                    //Check if the center of dragging image inside another image element. if have then get the index i
                    if (centerX > imageItemLeftI && centerX < (imageItemLeftI + imageItems[i].offsetWidth) && centerY > imageItemTopI && centerY < (imageItemTopI + imageItems[i].offsetHeight) ) {
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
                insertBefore(placeHolder, imageItems[indexOfDroppableElement]);
                positionChange = true;
            }
            else if (indexOfElmnt < indexOfDroppableElement) {
                placeHolder.remove();

                // If droppable element is the last element then insert after previous element.
                if (indexOfDroppableElement == imageItemLength - 1) {
                    insertAfter(placeHolder, imageItems[indexOfDroppableElement - 1]);
                }
                else {
                    insertAfter(placeHolder, imageItems[indexOfDroppableElement]);
                }
                positionChange = true;
            }

        }


        function closeDragElement() {

            if (gallery.getElementsByClassName('iu-temporary-placeholder')[0]) {
                // stop moving when mouse button is released:
                insertAfter(elmnt, placeHolder);
                placeHolder.remove();
            }


            // elmnt.remove();
            elmnt.setAttribute("style", '');
            elmnt.classList.add("iu-image-item");

            //Add features for new element with event listener if position change
            if (positionChange == false && selectOrder == true) {
                elmnt.getElementsByClassName('iu-select-number')[0].selectedIndex = Number(elmnt.getElementsByClassName('iu-image-order-number')[0].innerHTML) - 1;
            }

            addFeaturesForPositionChange(positionChange, elmnt);

            //Remove event listeners.
            document.onmousemove = null;
            document.onmouseup = null;

            if (touchDevice == true) {
                document.ontouchmove = null;
                document.ontouchend = null;
            }
        }
    }


}
