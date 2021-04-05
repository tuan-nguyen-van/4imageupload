<div class="section-title text-center" id="demo+download">
    Demo for default theme
</div>

<div class="text-guide mb-3 text-center">
    Try everything you want in demo! If you want to see more themes then <a href="#theming-section">click here</a>
</div>

<div id="default-demo">
    <div id="iu-gallery-default">
        <div id="iu-image-upload-zone-default"></div>
    </div>
</div>

<div class="text-guide">
    To install default theme in your project is very simple. For more information see <a href="#installation">Installation section</a>
    <br><br>
    1, Click here to download
    <a href="/js/4image-upload.js" download>4image-upload.js</a> and
    <a href="/css/4image-upload-default.css" download>4image-upload-default.css</a> files
    then include them in your project.
    <br><br>
    2, Add Html code to your project position where you want 4image upload to work.
    <pre><code class="language-html">@php
    writeCode('<div id="iu-gallery-default">
    <div id="iu-image-upload-zone-default"></div>
</div>');
@endphp
    </pre></code>
    3, Add this javascript code to your project.
    <pre><code class="language-javascript">@php
    writeCode("//Detect Internet Explorer. Show alert to customer.
if (window.document.documentMode) {
    alert('This website doesn\'t work on Internet Explorer, you should use modern browsers like Chrome or Safari instead');
}
var default4ImageUpload = new ImageUpload({
    imageUploadZoneId : 'iu-image-upload-zone-default',
    imageGalleryId: 'iu-gallery-default',
    sendRequestToServer: false,
    dictUploadImageNote: 'Click or drop photos here to upload',
    customSelect: false,
    showUploadingProgress: true,
    showUploadingLoader: function(imagePlaceholder, showUploadedPercentComplete) {
        var progress = document.createElement('div');
        progress.className = 'iu-progress';
        if (showUploadedPercentComplete === true) {
            progress.innerHTML = '0%';
        }
        imagePlaceholder.appendChild(progress);
    },
    updateUploadingLoader: function(percentComplete, imagePlaceholder, showUploadedPercentComplete) {
        var percentComplete = Math.floor(percentComplete);
        var progress = imagePlaceholder.getElementsByClassName('iu-progress')[0];
        if (progress != null) {
            if (showUploadedPercentComplete === true) {
                progress.innerHTML = percentComplete  + '%';
            }
        }
    },
    removeUploadingLoader: function(imagePlaceholder, showUploadedPercentComplete) {
        var progress = imagePlaceholder.getElementsByClassName('iu-progress')[0];
        setTimeout(function(){
            progress.remove();
        }, 2000)
    },
});");
@endphp
    </pre></code>
</div>
