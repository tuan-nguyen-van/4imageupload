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
