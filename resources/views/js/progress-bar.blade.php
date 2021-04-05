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
    var percentComplete = Math.floor(percentComplete);
    var percentBar = imagePlaceholder.getElementsByClassName('iu-percent-bar')[0];

    if (percentBar != null) {
        percentBar.style.width = percentComplete + "%";
        if (showUploadedPercentComplete === true) {
            percentBar.innerHTML = percentComplete  + "%";
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
