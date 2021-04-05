function changeInputDiv(galleryElmnt, imageUploadZoneId) {
    var inputElmnt = document.getElementById(imageUploadZoneId);
    var imageNote = galleryElmnt.getElementsByClassName('iu-image-note')[0];
    inputElmnt.style.position = 'absolute';
    inputElmnt.style.width = '100%';
    inputElmnt.style.bottom = '-8px';
    inputElmnt.style.display = 'block';
    inputElmnt.style.height = 'auto';
    inputElmnt.style.transform = 'translateY(100%)';
    imageNote.style.position = 'relative';
    imageNote.style.top = 'auto';
    imageNote.style.left = 'auto';
    imageNote.style.transform = 'none';
}
