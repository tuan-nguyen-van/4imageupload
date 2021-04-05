addFlashBox: function(showedAlertString, showedTime, backgroundColor) {
    var oldFlashBox = document.getElementsByClassName('iu-flash-box')[0];
    if (oldFlashBox) {
        oldFlashBox.remove();
    }
    var flashBox = document.createElement('div');
    flashBox.className = 'iu-flash-box';
    if (backgroundColor) {
        flashBox.style.backgroundColor = backgroundColor;
    }
    flashBox.innerHTML = showedAlertString;
    document.body.appendChild(flashBox);
    setTimeout(function(){
        fadeEffect(flashBox);
    }, showedTime);

    function fadeEffect(elmnt) {
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
        }, 50);
    }
},
