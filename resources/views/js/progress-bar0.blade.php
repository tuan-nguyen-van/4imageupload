showUploadingLoader: function(imagePlaceholder, showUploadedPercentComplete) {
    var progressBar = document.createElement('div');
    progressBar.className = 'iu-progress-bar';
    var percentBar = document.createElement('div');
    percentBar.className = 'iu-percent-bar';
    if (showUploadedPercentComplete === true) {
        percentBar.innerHTML = '0%';
    }
    progressBar.appendChild(percentBar);
    imagePlaceholder.appendChild(progressBar);
},
updateUploadingLoader: function(percentComplete, imagePlaceholder, showUploadedPercentComplete) {
    var width;
    var percentComplete = Math.floor(percentComplete);
    var percentBar = imagePlaceholder.getElementsByClassName('iu-percent-bar')[0];
    var dataWidth;
    var styleWidth;
    if (percentBar) {
        dataWidth = Number(percentBar.getAttribute('data-width'));
    }

    if (dataWidth || dataWidth === 0) {
        styleWidth = percentBar.style.width;
        styleWidth = Number(styleWidth.replace("%", ''));
        width = styleWidth;
        percentBar.setAttribute('data-width', String(percentComplete));
    }
    else {
        percentBar.setAttribute('data-width', '0');
        width = 0;
    }

    var id = setInterval(frame, 5);
    function frame() {
        if (width >= 100 || width >= percentComplete) {
            clearInterval(id);
        }
        else {
            if (width < percentComplete) {
                width += 1;
            }
            else {
                clearInterval(id);
            }
            if (percentBar != null) {
                percentBar.style.width = width + "%";
                if (showUploadedPercentComplete === true) {
                    percentBar.innerHTML = width  + "%";
                }
            }
        }
    }
},
removeUploadingLoader: function(imagePlaceholder, showUploadedPercentComplete) {
    var progressBar = imagePlaceholder.getElementsByClassName('iu-progress-bar')[0];
    var fadeEffect = setInterval(function() {
        if (!progressBar.style.opacity) {
            progressBar.style.opacity = 1;
        }
        if (progressBar.style.opacity > 0) {
            progressBar.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
            progressBar.remove();
        }
    }, 300);
},
