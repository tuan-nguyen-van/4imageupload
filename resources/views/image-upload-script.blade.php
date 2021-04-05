<script>
    //Detect Internet Explorer. Show alert to customer.
    if (window.document.documentMode) {
        alert("This website doesn\'t work on Internet Explorer, you should use modern browsers like Chrome or Safari instead");
    }
</script>
<script>
    window.mobileAndTabletCheck = function() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
            check = true;
        })(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };
    var imageNoteText = window.mobileAndTabletCheck() ? 'Tap here to add photos' : 'Click or drop photos here to upload';

    var radioAndCheckboxInputs = document.getElementsByClassName('custom-control-input');
    for (var i = 0; i < radioAndCheckboxInputs.length; i++) {
        radioAndCheckboxInputs[i].addEventListener('change', demoInputChange);
    }

    var selectInputs = document.getElementById('component-configuration').getElementsByTagName('select');
    for (var i = 0; i < selectInputs.length; i++) {
        selectInputs[i].addEventListener('change', demoInputChange);
    }

    demoInputChange();

    var styles, script, demoHtml;

    function demoInputChange() {

        var booleanScript = '';
        ['selectOrder', 'customSelect', 'displayImageOrderNumber', 'displayDeleteImageButton', 'allowDragImage', 'displayPreviewImage', 'allowSameImage', 'addLogo'].forEach(getChecked);

        function getChecked(item) {
            var checked = document.getElementsByName(item)[0].checked;
            if (item == 'addLogo' && checked == true) {
                booleanScript += `addLogo: ["/demo-image/logo.png", , , "center"],
`;
            }
            else if (item == 'allowSameImage' && checked == true) {
                booleanScript += `allowSameImage: true,
allowSameImageSize: true,
`;
            }
            else if(item != 'allowSameImage' && item != 'addLogo' && checked == false) {
                booleanScript += item + `: false,
`;
            }
        }


        var selectScript = '';
        ['maxCustomSelectOptions', 'maxImageColumns', 'minImageColumns', 'minImageWidth'].forEach(getSelectValue);
        function getSelectValue(item) {
            var selectValue = document.getElementsByName(item)[0].value;
            if (selectValue) {
                selectScript += item + ' :' + selectValue + `,
`;
            }
        }

        var booleanScriptPlusSelectScript = booleanScript + selectScript;

        var inputObject = {hidePercentText: "false"};
        ['imageUploadZone', 'progressBar', 'hidePercentText', 'flashBox', 'customSelectColor', 'padding', 'imageStyle'].forEach(getInputValue);

        function getInputValue(item) {
            var inputElements = document.getElementsByName(item);
            for (var i = 0; i < inputElements.length; i++) {
                if (inputElements[i].checked) {
                    inputObject[item] = inputElements[i].value;
                }
            }
        }

        //Remove demo-section content
        var demoSection = document.getElementById('demo-section');

        demoSection.innerHTML = '';

        demoSection.style.backgroundColor = '#ffffff';

        caretDownColor = '#fff';

        var customSelectBackGroundColor;

        if (inputObject.customSelectColor === 'blue') {
            customSelectBackGroundColor = 'DodgerBlue';
            sameAsSelectedBackGroundColor = 'rgba(0, 0, 0, 0.1)';
            customSelectTextColor = '#ffffff';
        }
        else if (inputObject.customSelectColor === 'dark') {
            customSelectBackGroundColor = '#1f1c1c';
            sameAsSelectedBackGroundColor = 'rgba(0, 0, 0, 0.5)';
            customSelectTextColor = '#ffffff';
        }
        else if (inputObject.customSelectColor === 'white') {
            demoSection.style.backgroundColor = '#e8e0c8';
            customSelectBackGroundColor = '#ffffff';
            sameAsSelectedBackGroundColor = 'rgba(0, 0, 0, 0.3)';
            customSelectTextColor = '#000000';
            caretDownColor = '#000000';
        }


        var padding, customSelectMarginTop;
        if (inputObject.padding == '0') {
            padding = '0px';
            customSelectMarginTop: '0px';
        }
        else if (inputObject.padding == '2px') {
            padding = '2px';
            customSelectMarginTop = '-4px';
        }
        else if (inputObject.padding == '5px') {
            padding = '5px';
            customSelectMarginTop = '-10px';
        }
        else if (inputObject.padding == '10px') {
            padding = '10px';
            customSelectMarginTop = '-20px';
        }

        styles = `.iu-image-item-style {
    position: relative;
    display:inline-block;
    vertical-align: top;
}

*, ::after, ::before {
    box-sizing: border-box;
}

.iu-highlight {
    border: 2px dashed #ff1a1a !important;
}

.iu-image-note {
    font-size: 1rem;
    color: black;
    z-index: 9;
    cursor: pointer;
}

.iu-image-placeholder {
    margin-bottom: 0px;
    display: block;
    padding: ` + padding + `;
    background-clip: content-box;
    position: relative;
}

.iu-image {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.iu-image-order-number {
    position:absolute;
    top: ` + padding + `;
    left: ` + padding + `;
    color: white;
    font-size: 1rem;
    background: rgba(0,0,0,.3);
    padding:2px 8px;
}

.iu-close-button {
    position:absolute;
    top: ` + padding + `;
    right: ` + padding + `;
    color: white;
    background: rgba(0,0,0,.3);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-weight: bold;
    font-size: 1.4rem;
    cursor:pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.iu-close-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: "Times New Roman", Times, serif;
}

.iu-close-button:hover {
    background: rgba(0,0,0,.5);
}

.iu-button {
    display: none;
}

@keyframes iu-backgroundColor {
    0% {background-color: #c0b3a5;}
    50% {background-color: #a18d78;}
    100% {background-color: #c0b3a5;}
}

.iu-select-number {
    width: 100%;
}

.iu-custom-select {
    position: relative;
    padding: ` + padding + `;
    margin-top: ` + customSelectMarginTop +  `;
    font-size: 1rem;
}

.iu-display-none {
    display: none;
}

.iu-select-selected {
    background-color: ` + customSelectBackGroundColor + `;
}

.iu-select-selected:after {
    position: absolute;
    content: "";
    top: 50%;
    transform: translate(0, calc(-50% + 3px));
    right: calc(10px + ` + padding + `);
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-color: `+ caretDownColor + ` transparent transparent transparent;
}

.iu-select-hide {
    display: none;
}

.iu-select-selected.iu-select-arrow-active:after {
    border-color: transparent transparent ` + caretDownColor + ` transparent;
    transform: translate(0, calc(-50% - 3px));
}

/* style the items (options), including the selected item: */
.iu-select-items div,.iu-select-selected {
    color: ` + customSelectTextColor + `;
    padding: 5px 10px;
    border: 1px solid transparent;
    border-color: transparent transparent rgba(0, 0, 0, 0.1) transparent;
    cursor: pointer;
}

/* Style items (options): */
.iu-select-items {
    position: absolute;
    background-color: ` + customSelectBackGroundColor + `;
    left: 0;
    right: 0;
    z-index: 99;
    background-clip: content-box;
    padding: 0 ` + padding + `;
}

.iu-select-items div:hover, .iu-same-as-selected {
    background-color: ` + sameAsSelectedBackGroundColor + `;
}
`;

        var oldScript = document.getElementById('new-script');
        var oldStyle = document.getElementById('new-style');
        if (oldScript) {
            oldScript.remove();
        }
        if (oldStyle) {
            oldStyle.remove();
        }

        var newScript = document.createElement('script');
        newScript.id = 'new-script';

        var divTag = document.getElementsByTagName('div');
        var divTagLength = divTag.length;

        var randomNumberScript = Math.floor(Math.random() * divTagLength);
        divTag[randomNumberScript].appendChild(newScript);

        var newStyle = document.createElement('style');
        newStyle.id = 'new-style';
        var randomNumberStyle = Math.floor(Math.random() * divTagLength);
        divTag[randomNumberStyle].appendChild(newStyle);

        if (inputObject.imageUploadZone == 'small button') {
            demoHtml = `<div id="iu-gallery"></div>
<div class="" style="display: inline-block; margin-right: 10px;">
    Other stuff
</div>
<div id="iu-image-upload-zone"></div>
<div class="" style="display: inline-block">
    Other stuff
</div>`;

            demoSection.innerHTML = demoHtml;

            styles += `@include('css.small-button')
`;

            script = `var myImageUpload = new ImageUpload({
@include('js.image-upload-declare')` + `
` + booleanScriptPlusSelectScript + `
dragAndDropFeature: false,
dictUploadImageNote: '<img src="/demo-image/image-icon.png" class="iu-image-icon">Add photos',
`;
        }
        else if (inputObject.imageUploadZone == 'large zone') {
            demoHtml = `<div id="iu-gallery"></div>
<div id="iu-image-upload-zone"></div>`;

            demoSection.innerHTML = demoHtml;

            styles += `@include('css.large-zone')
`;

            script = `var myImageUpload = new ImageUpload({
@include('js.image-upload-declare')` + `
` + booleanScriptPlusSelectScript + `
dictUploadImageNote: '` + imageNoteText + `',
alertUploadingImage: function(fileLength) {
    var dictUploadingMessage;
    if (fileLength == 1) {
        dictUploadingMessage = 'Uploading 1 images, please wait...';
    }
    else {
        dictUploadingMessage = 'Uploading ' +  fileLength + ' images, please wait...';
    }
    var imageUploadZone = document.getElementById("iu-image-upload-zone");
    var imageNoteOfImageUpload = imageUploadZone.getElementsByClassName('iu-image-note')[0];
    imageNoteOfImageUpload.innerHTML = dictUploadingMessage + "<div class='iu-spinner'></div>";
    imageUploadZone.style.backgroundColor = '#d5ccc3';
},
changeUploadZoneAndInputNoteStyle: function(imageUploadZone, imageNoteOfImageUpload, dictUploadImageNote) {
    imageNoteOfImageUpload.innerHTML = dictUploadImageNote;
    imageUploadZone.style.backgroundColor = 'transparent';
},
`;
        }
        else if (inputObject.imageUploadZone == 'image like') {
            demoHtml = `<div id="iu-gallery">
    <div id="iu-image-like-div">
        <div class="iu-image-placeholder" id="iu-image-upload-zone">
        </div>
    </div>
</div>`;

            demoSection.innerHTML = demoHtml;

            styles += `@include('css.image-like')
`;

            script = `var myImageUpload = new ImageUpload({
@include('js.image-upload-declare')` + `
` + booleanScriptPlusSelectScript + `
dictUploadImageNote: '<img src="/demo-image/image-uploader-icon.png" class="iu-image-icon"><p class="iu-note-text">` + imageNoteText + `</p>',
insertImageItemBeforeElmnt: document.getElementById('iu-image-upload-zone').parentNode,
getTargetForHighlight: function() {
    return document.getElementById('iu-image-upload-zone').getElementsByClassName('iu-image-note')[0];
},
`;
        }
        else if (inputObject.imageUploadZone == 'single line') {
            demoHtml = `<div id="iu-gallery">
    <div id="iu-image-upload-zone"></div>
</div>`;

            demoSection.innerHTML = demoHtml;

            styles += `@include('css.single-line')
`;

            script = `var myImageUpload = new ImageUpload({
@include('js.image-upload-declare')` + `
` + booleanScriptPlusSelectScript + `
dictUploadImageNote: '` + imageNoteText + `',
`;
        }


        var progressScript;

        if (inputObject.progressBar === 'bar center') {
            styles += `@include('css.progress-bar-center')
`;
            progressScript = `@include('js.progress-bar')`;
        }
        else if (inputObject.progressBar === 'bar bottom') {
            styles += `@include('css.progress-bar-bottom')
`;
            progressScript = `@include('js.progress-bar')`;
        }
        else if (inputObject.progressBar === 'spinner') {
            styles += `@include('css.progress-spinner')
`;
            progressScript = `@include('js.progress-spinner')`;
        }


        if (inputObject.hidePercentText === 'true') {
            var percentScript = `showUploadedPercentComplete: false,
`;
            script += percentScript;
        }

        var imageBorderStyleScript;

        var flashScript;
        flashScript = `
@include('js.flash-box')`;

        if (inputObject.flashBox == 'border side') {
            styles += `@include('css.flash-border-side')
`;
        }
        else if (inputObject.flashBox == 'like alert') {
            styles += `@include('css.flash-like-alert')
`;
            flashScript += `
deletingImageAlert: ['Deleting Image...', 30000],
deletedImageAlert: ['Image was deleted', 2000],
savingImageOrderAlert: ['Saving Image Order...', 30000],
savedImageOrderAlert: ['Saved Image Order', 2000],`;
        }

        script += progressScript + flashScript + `
});`;

        setTimeout(function() {
            newScript.appendChild(document.createTextNode(script));
            newStyle.appendChild(document.createTextNode(styles));
            @foreach ($images as $image)
                var imageSrc = "/storage/image/{{$image->image_name}}";
                var imageName = '{{$image->image_name}}';
                var imageId = '{{$image->id}}';
                myImageUpload.appendServerImage(imageSrc, imageName, imageId);
            @endforeach
        }, 500);
    }

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    var downloadButton = document.getElementsByClassName('download-button')[0];
    downloadButton.addEventListener('click', function() {
        var xhttp = new XMLHttpRequest();
        var formData = new FormData();
        script = script.replace('addLogo: ["/demo-image/logo.png", , , "center"],', '');
        formData.append('style', styles);
        formData.append('script', script);
        formData.append('html', demoHtml);
        var folderId = '4imageupload_' + makeid(15);
        formData.append('folderId', folderId);

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var hiddenElement = document.createElement('a');
                hiddenElement.href = 'zip-download/' + this.responseText + '.zip';
                hiddenElement.target = '_blank';
                hiddenElement.download = this.responseText + '.zip';
                hiddenElement.click();
            }
        };

        xhttp.open("POST", '{{ route('download-code') }}', true);
        xhttp.setRequestHeader('X-CSRF-TOKEN', document.getElementById('csrf_token').getAttribute('content'));
        xhttp.send(formData);
    })
</script>
