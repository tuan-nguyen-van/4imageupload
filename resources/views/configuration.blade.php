<div class="configuration">
    <div class="text-center section-title" id="configuration-option">Configuration Guide</div>
    <div class="text-guide">
        Customize "4 Image Upload" is very easy, simply declare all options inside your new ImageUpload object.
        Remember don't write anything inside 4image-upload.js unless you really know what you are doing or boom!
    </div>
    <pre><code class="language-html">@php
    writeCode('<script src="/path-to/4image-upload.js"></script>
<script>
    var my4ImageUpload = new ImageUpload({
    imageUploadZoneId: "iu-image-upload-zone",
    imageGalleryId: "iu-gallery",
    sendRequestToServer: true,
    headers: {"X-CSRF-TOKEN": "Your CSRF-TOKEN"},
    ...,
    ...,
    });
</script>');
@endphp
    </code></pre>
    <div style="cursor:pointer;" class="text-center font-weight-bold mb-2 text-guide" data-toggle="collapse" data-target="#option-table">
        <i class="fas fa-caret-down"></i> Inside here is the list of all configuration options.
    </div>
    <div class="collapse" id="option-table">
        <div class="mb-3">
            <div style="" class="font-weight-bold text-guide">
                Core function: checkMethodExists()
            </div>
            <div class="text-guide">
                Inside 4image-upload.js. Check if a function is declared or not.
                If you declared function inside: new ImageUpload() then process it.
                If not then process default function inside defaultOptions object inside 4image-upload.js.
                <br>
                Syntax: <span class="text-danger">checkMethodExists(functionName, argument1, argument2, argument3)</span>.
                <br>
                <span class="text-danger">functionName</span> is the name of the function you want to check existence.
                <br>
                <span class="text-danger">argument1, argument2, argument3</span> is argument of functionName function.
            </div>
        </div>
        <div class="table-responsive-sm">
            <table class="table table-dark table-striped table-bordered">
                <thead>
                    <tr>
                        <th style="vertical-align: top;">Option</th>
                        <th style="vertical-align: top;">Type | Default value
                            <br>Description
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>imageUploadZoneId</td>
                        <td>
                            String | null.
                            <br>
                            Must declare. Id of the &lt;div&gt; where to show image upload zone
                            (when users click or drop files inside this zone will trigger uploading process).
                        </td>
                    </tr>
                    <tr>
                        <td>
                            imageGalleryId
                        </td>
                        <td>
                            String | null.
                            <br>
                            Must declare. Id of the &lt;div&gt; where uploaded images be showed inside here.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            sendRequestToServer
                        </td>
                        <td>
                            Boolean | false.
                            <br>
                            If false then you can test without sending request to server to handle.
                            So the javascript code only run in client-side.
                            <br>
                            <span style="color: #e31243">Important:</span> set this to true if you want to send request to server.
                        </td>
                    </tr>
                    <tr>
                        <td id="saveImageRoute">
                            saveImageRoute
                        </td>
                        <td>
                            String | null.
                            Route (link) to send server request to save uploading images with the method 'POST'.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            imageBelongsTo
                        </td>
                        <td>
                            Object | null.
                            <br>
                            Send additional data to <a href="#saveImageRoute">saveImageRoute</a> request. Like 'post_id', 'user_id' or 'thread_id'...
                            <br>
                            Syntax: {'Name0' : 'Value0', 'Name1' : 'Value1', ...}.
                            <br>
                            So the request on server will have additional request inputs: 'Name0' with value 'Value0' and 'Name1' with value 'Value1' ...
                            <br>
                            Ex: { "post_id": "1562" }.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            headers
                        </td>
                        <td>
                            Object | null.
                            <br>
                            Send headers for the request to the server.
                            <br>
                            Ex: { "X-CSRF-TOKEN": "RSR6tkicph20COW11SOTT5S04j41QXZmfz4bTRwI" }.
                            <br>
                            You set headers object like this: {'headerName0' : 'headerValue0', 'headerName1' : 'headerValue1', ...}.
                        </td>
                    </tr>
                    <tr>
                        <td id="saveImageRouteTimeout">
                            saveImageRouteTimeout
                        </td>
                        <td>
                            Integer | 30000.
                            <br>
                            The timeout for <a href="#saveImageRoute">saveImageRoute</a> request can take before automatically being terminated.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            saveImageRouteTimeoutAction
                        </td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function that run when <a href="#saveImageRoute">saveImageRoute</a> reach timeout (<a href="#saveImageRouteTimeout">saveImageRouteTimeout</a>) for XMLHttpRequest().
                        </td>
                    </tr>
                    <tr>
                        <td>
                            abortSaveImageRouteAction
                        </td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            This function is important, sometimes you will see in your database table `image` where
                            you have 2 images with the same image_number order. Ex: 5 images uploaded at the same time with
                            image_number like (6 7 4 5 6). The real reason is: very rare but still happen, when user
                            pressed delete button on uploading image, the server received and saved the image already
                            but did not return any response yet. So because server did not return response when user pressed delete button
                            would triggered abort() the XMLHttpRequest for <a href="#saveImageRoute">saveImageRoute</a> and the image still be deleted on client-side.
                            That's why you see image was deleted but still be saved on server and have 2 images with same image_order.
                            <br><br>
                            This function is to solve the above problem. When abort() <a href="#saveImageRoute">saveImageRoute</a> XMLHttpRequest will run this function.
                            If you care about this problem. You will have to write a function inside here to send another XMLHttpRequest
                            with request input includes imageName of the uploading image. And on server you delete the database record of image with
                            `image_name` equal imageName and also on server image storage delete the image with name equal imageName.
                            <br><br>
                            Function has 1 parameter is imageName of uploading image.
                        </td>
                    </tr>
                    <tr>
                        <td id="saveImageOrderRoute">
                            saveImageOrderRoute
                        </td>
                        <td>
                            String | null.
                            <br>
                            Route (link) to send server request to save all image order numbers with the method 'POST'.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            saveImageOrderRouteTimeout
                        </td>
                        <td>
                            Integer | 30000.
                            <br>
                            The timeout for <a href="#saveImageOrderRoute">saveImageOrderRoute</a> request can take before automatically being terminated.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            saveImageOrderRouteTimeoutAction
                        </td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function that run when <a href="#saveImageOrderRoute">saveImageOrderRoute</a> reach timeout for XMLHttpRequest().
                        </td>
                    </tr>
                    <tr>
                        <td id="deleteImageRoute">
                            deleteImageRoute
                        </td>
                        <td>
                            String | null.
                            <br>
                            Route (link) to send server request to delete saved images with the method 'POST'.
                        </td>
                    </tr>
                    <tr>
                        <td id="deleteImageRouteTimeout">
                            deleteImageRouteTimeout
                        </td>
                        <td>
                            Integer | 30000.
                            <br>
                            The timeout for <a href="#deleteImageRoute">deleteImageRoute</a> can take before automatically being terminated.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            deleteImageRouteTimeoutAction
                        </td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function that run when <a href="#deleteImageRoute">deleteImageRoute</a> reach timeout (<a href="#deleteImageRouteTimeout">deleteImageRouteTimeout</a>) for XMLHttpRequest().
                        </td>
                    </tr>
                    <tr>
                        <td id="addFlashBox">
                            addFlashBox
                        </td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Show flash box to user to alert something when done something from server.
                            The default function has three parameters showedAlertString, showedTime and backgroundColor.
                        </td>
                    </tr>
                    <tr>
                        <td id="alertServerTimeout">
                            alertServerTimeout
                        </td>
                        <td>
                            Array | ['Server time out', 2000, '#f00e0e'].
                            <br>
                            An array contains arguments for <a href="#addFlashBox">addFlashBox</a> function
                            to alert users when request to server reach timeout.
                            <br>
                            Syntax: [showedAlertString, showedTime, backgroundColor].
                        </td>
                    </tr>
                    <tr>
                        <td id="alertServerTimeoutAction">
                            alertServerTimeoutAction
                        </td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to show alert when request to server reach timeout.
                            You could change <a href="#addFlashBox">addFlashBox</a> function to modify this feature.
                            Or you could write another function for <a href="#alertServerTimeoutAction">alertServerTimeoutAction</a>.
                            <br>
                            The default function take 3 array elements from <a href="#alertServerTimeout">alertServerTimeout</a> to pass arguments
                            for <a href="#addFlashBox">addFlashBox</a> function.
                        </td>
                    </tr>
                    <tr>
                        <td id="dictUploadImageNote">
                            dictUploadImageNote
                        </td>
                        <td>
                            String | null.
                            <br>
                            The text note used for the &lt;div&gt; inside Image Upload Zone ('#iu-image-upload-zone')
                            with class ".iu-image-note".
                            <br>
                            Ex: 'Add Photos' or 'Tap here to upload photos'.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            alertUploadingImage
                        </td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Call when images are uploading to alert user.
                            Function has one parameter that is the fileLength
                            of all uploading images (total number of images are uploading).
                        </td>
                    </tr>
                    <tr>
                        <td>showImagePlaceHolder</td>
                        <td>
                            Boolean | true.
                            <br>
                            Option to show image uploading placeholder when images are uploading with class
                            '.iu-image-uploading-placeholder'.
                        </td>
                    </tr>
                    <tr>
                        <td>changeImagePlaceholder</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to change image placeholder css style with class '.iu-image-placeholder'
                            while processing images and send request to server.
                            <br>
                            Function has one paremeter that is DOM element imagePlaceholder itself.
                        </td>
                    </tr>
                    <tr>
                        <td>selectOrder</td>
                        <td>
                            Boolean | true.
                            <br>
                            If true then showed images will have a select dropdowns below them to change image order numbers.
                        </td>
                    </tr>
                    <tr>
                        <td id="customSelect">customSelect</td>
                        <td>
                            Boolean | false.
                            <br>
                            If true then selectOrder must also be true.
                            <br>
                            The free version (default) will not include <a href="#customSelect">customSelect</a> so remember to set it to false.
                            <br>
                            This option used for customizing select dropdown for the style you choose
                            and work accross all browsers with the same select style.
                        </td>
                    </tr>
                    <tr>
                        <td id="maxCustomSelectOptions">maxCustomSelectOptions</td>
                        <td>
                            Integer | 5.
                            <br>
                            Numer of maximum options could be displayed in <a href="#customSelect">customSelect</a> DOM element.
                            If over <a href="#maxCustomSelectOptions">maxCustomSelectOptions</a> then automatically add a scrollbar.
                        </td>
                    </tr>
                    <tr>
                        <td>multiple</td>
                        <td>
                            Boolean | true.
                            <br>
                            If true, it specifies that the user is allowed to upload
                            multiple images one time in the &lt;input type="file"&gt; element.
                            false then only can upload one image a time.
                        </td>
                    </tr>
                    <tr>
                        <td>allowDragImage</td>
                        <td>
                            Boolean | true.
                            <br>
                            Allow users to move images for changing image order numbers by dragging or not.
                        </td>
                    </tr>
                    <tr>
                        <td id="alertUploadingIfChangeOrder">alertUploadingIfChangeOrder</td>
                        <td>
                            Array | ['Please wait after finish uploading', 2000].
                            <br>
                            An array contains arguments for <a href="#addFlashBox">addFlashBox</a> function
                            to alert users cannot change image order while images are uploading.
                            Syntax: [showedAlertString, showedTime, backgroundColor].
                        </td>
                    </tr>
                    <tr>
                        <td>alertUploadingIfChangeOrderAction</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to show alert to user cannot change image order while images are uploading.
                            <br>
                            The default function take 3 array elements from <a href="#alertUploadingIfChangeOrder">alertUploadingIfChangeOrder</a> to pass arguments
                            for <a href="#addFlashBox">addFlashBox</a> function.
                        </td>
                    </tr>
                    <tr>
                        <td id="touchDuration">touchDuration</td>
                        <td>
                            Integer | 500.
                            <br>
                            Number in milisecond, when users use touch devices and they touched image more than <a href="#touchDuration">touchDuration</a> in milisecond
                            then the image will be lifted up and could be dragged around by finger move.
                        </td>
                    </tr>
                    <tr>
                        <td>changeImageStyleWhenTouchImage</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to change image css style after user touched on image longer than <a href="#touchDuration">touchDuration</a>.
                            Purpose is to show image is ready to be dragged around to change order number.
                            Function has one paremeter that is the image item with class '.iu-image-item' that be touched on.
                        </td>
                    </tr>
                    <tr>
                        <td>displayImageOrderNumber</td>
                        <td>
                            Boolean | true.
                            <br>
                            True if you want to display image order number over image.
                            <br>
                            False image order number will not be showed.
                        </td>
                    </tr>
                    <tr>
                        <td>displayDeleteImageButton</td>
                        <td>
                            Boolean | true.
                            <br>
                            Specifies whether delete button should be added.
                        </td>
                    </tr>
                    <tr>
                        <td>deleteImageIcon</td>
                        <td>
                            String | &amp;times; (&times;).
                            <br>
                            The icon to illustrate delete image spot to click with class '.iu-close-icon'.
                        </td>
                    </tr>
                    <tr>
                        <td id="maxImages">maxImages</td>
                        <td>
                            Integer | null.
                            <br>
                            Limit the maximum number of images could be uploaded.
                        </td>
                    </tr>
                    <tr>
                        <td id="alertMaxImages">alertMaxImages</td>
                        <td>
                            Array | ['Maximum images reached', 2000, '#f00e0e'].
                            <br>
                            An array contains arguments for <a href="#addFlashBox">addFlashBox</a> function
                            to alert users that they chose images to upload exceed <a href="#maxImages">maxImages</a>.
                            <br>
                            Syntax: [showedAlertString, showedTime, backgroundColor].
                        </td>
                    </tr>
                    <tr>
                        <td>alertMaxImagesAction</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to show alert to users that they chose images to upload exceed <a href="#maxImages">maxImages</a>.
                            <br>
                            The default function take 3 array elements from <a href="#alertMaxImages">alertMaxImages</a> to pass arguments
                            for <a href="#addFlashBox">addFlashBox</a> function.
                        </td>
                    </tr>
                    <tr>
                        <td>displayPreviewImage</td>
                        <td>
                            Boolean | true
                            <br>
                            Add preview image for &lt;img&gt; with class '.iu-image' with the source 'src' is the
                            original image that user chose while images are uploading to server.
                        </td>
                    </tr>
                    <tr>
                        <td id="showUploadingProgress">showUploadingProgress</td>
                        <td>
                            Boolean | true.
                            <br>
                            An option to show progress when uploading image to server for image placeholder with class '.iu-image-placehoder'.
                        </td>
                    </tr>
                    <tr>
                        <td id="showUploadedPercentComplete">showUploadedPercentComplete</td>
                        <td>
                            Boolean | true.
                            <br>
                            An option to show percent complete when uploading image to server along with <a href="#showUploadingProgress">showUploadingProgress</a>.
                        </td>
                    </tr>
                    <tr>
                        <td>showUploadingLoader</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Here is a function to show uploading progress for image placeholder '.iu-image-placeholder'.
                            <br>
                            Function has two parameters that is image placeholder DOM elemenet
                            with class '.iu-image-placeholder' and <a href="#showUploadedPercentComplete">showUploadedPercentComplete</a> option above
                            for you to add custom progress style to it while image is uploading to server.
                        </td>
                    </tr>
                    <tr>
                        <td>updateUploadingLoader</td>
                        <td>
                            Function | See inside 4image-upload.js
                            <br>
                            Function to update uploading loader while image is being uploaded to server.
                            <br>
                            The default function has three parameters that is percent uploading completion, image placeholder with class
                            '.iu-image-placeholder' and <a href="#showUploadedPercentComplete">showUploadedPercentComplete</a> option above.
                        </td>
                    </tr>
                    <tr>
                        <td>removeUploadingLoader</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to remove uploading loader after image is fully uploaded.
                            <br>
                            The default function has two parameters is the image placeholder '.iu-image-placeholder' and <a href="#showUploadedPercentComplete">showUploadedPercentComplete</a>
                            option above.
                        </td>
                    </tr>
                    <tr>
                        <td id="alertServerError">alertServerError</td>
                        <td>
                            Array | ['Server Error', 2000, '#f00e0e'].
                            <br>
                            An array contains arguments for <a href="#addFlashBox"></a>addFlashBox function
                            to alert users server has error when sending XMLHttpRequest (AJAX).
                            <br>
                            Syntax: [showedAlertString, showedTime, backgroundColor].
                        </td>
                    </tr>
                    <tr>
                        <td>alertServerErrorAction</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to alert users server has error when sending XMLHttpRequest (AJAX).
                            <br>
                            The default function takes 3 array elements from <a href="#alertServerError">alertServerError</a> to pass arguments
                            for <a href="#addFlashBox">addFlashBox</a> function.
                        </td>
                    </tr>
                    <tr>
                        <td id="maxImageColumns">maxImageColumns</td>
                        <td>
                            Integer | 6.
                            <br>
                            Maximum image columns to show in image gallery.
                        </td>
                    </tr>
                    <tr>
                        <td id="minImageColumns">minImageColumns</td>
                        <td>
                            Integer | 3.
                            <br>
                            Minimum image columns to show in image gallery.
                        </td>
                    </tr>
                    <tr>
                        <td>minImageWidth</td>
                        <td>
                            Integer | 150.
                            <br>
                            The minimum width of a images in pixel. Used with <a href="#maxImageColumns">maxImageColumns</a>
                            and <a href="#minImageColumns">minImageColumns</a> to decide number of image columns to show in gallery.
                        </td>
                    </tr>
                    <tr>
                        <td>showedHeightWithWidth</td>
                        <td>
                            Decimal number | 1.
                            <br>
                            This option to decide the ratio height/width of image while showed in gallery.
                            Default is 1 so width equal height.
                            <br>
                            You could consider changing <a href="#setImagesWidthAndHeight">setImagesWidthAndHeight</a> function to set width and height of image all the way you want.
                        </td>
                    </tr>
                    <tr>
                        <td id="maxImageSize">maxImageSize</td>
                        <td>
                            Integer | 50.
                            <br>
                            The maximum size of a image in MB. If exceeds then image will not be uploaded
                            and the function <a href="#showAlertOnMaxImageSizeAction">showAlertOnMaxImageSizeAction</a> will be called.
                        </td>
                    </tr>
                    <tr>
                        <td id="showAlertOnMaxImageSize">showAlertOnMaxImageSize</td>
                        <td>
                            Array | ['Image size too big', 2000, '#f00e0e'].
                            <br>
                            An array contains arguments for <a href="#addFlashBox">addFlashBox</a> function
                            to alert users when they chose to upload images with image size over <a href="#maxImageSize">maxImageSize</a> in MB.
                            <br>
                            Syntax: [showedAlertString, showedTime, backgroundColor].
                        </td>
                    </tr>
                    <tr>
                        <td id="showAlertOnMaxImageSizeAction">showAlertOnMaxImageSizeAction</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to alert users when they chose to upload images with image size over <a href="#maxImageSize">maxImageSize</a> in MB.
                            <br>
                            The default function takes 3 array elements from <a href="#showAlertOnMaxImageSize">showAlertOnMaxImageSize</a> to pass arguments
                            for <a href="#addFlashBox">addFlashBox</a> function.
                        </td>
                    </tr>
                    <tr>
                        <td id="maxResizedWidth">maxResizedWidth</td>
                        <td>
                            Integer | 1250.
                            <br>
                            The maximum width in pixel of images to resize before uploaded.
                            If only one <a href="#maxResizedWidth">maxResizedWidth</a> or <a href="#maxResizedHeight">maxResizedHeight</a>
                            is provided, the original aspect ratio width/height of the image will be preserved.
                            If user uploaded image that is smaller than <a href="#maxResizedWidth">maxResizedWidth</a> then it will not get resized.
                        </td>
                    </tr>
                    <tr>
                        <td id="maxResizedHeight">maxResizedHeight</td>
                        <td>
                            Integer | null,
                            <br>
                            See <a href="#maxResizedWidth">maxResizedWidth</a>.
                        </td>
                    </tr>
                    <tr>
                        <td id="minImageUploadedWidth">minImageUploadedWidth</td>
                        <td>
                            Integer | null.
                            <br>
                            The minimum width in pixel of image can be uploaded to server.
                            If below <a href="#minImageUploadedWidth">minImageUploadedWidth</a> then image will not be uploaded.
                        </td>
                    </tr>
                    <tr>
                        <td id="minImageUploadedHeight">minImageUploadedHeight</td>
                        <td>
                            Integer | null.
                            <br>
                            See <a href="#minImageUploadedWidth">minImageUploadedWidth</a>.
                        </td>
                    </tr>
                    <tr>
                        <td id="minSizeImageUploadedAlert">minSizeImageUploadedAlert</td>
                        <td>
                            Array | ['Image too small', 2000, '#e30b0b'].
                            <br>
                            An array contains arguments for <a href="#addFlashBox">addFlashBox</a> function
                            to alert users that they uploaded image with size smaller
                            than <a href="#minImageUploadedWidth">minImageUploadedWidth</a> or <a href="#minImageUploadedHeight">minImageUploadedHeight</a>.
                            <br>
                            Syntax: [showedAlertString, showedTime, backgroundColor].
                        </td>
                    </tr>
                    <tr>
                        <td>minSizeImageUploadedAlertAction</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to alert user that they uploaded image with size smaller
                            than <a href="#minImageUploadedWidth">minImageUploadedWidth</a> or <a href="#minImageUploadedHeight">minImageUploadedHeight</a>.
                            <br>
                            The default function takes 3 array elements from <a href="#minSizeImageUploadedAlert">minSizeImageUploadedAlert</a> to pass arguments
                            for <a href="#addFlashBox">addFlashBox</a> function.
                        </td>
                    </tr>
                    <tr>
                        <td>delayTimeAfterImageDragged</td>
                        <td>
                            Integer | 200.
                            <br>
                            Time interval in milisecond to disable gallery from being clicked on.
                            This option is to prevent users from drag and drop images around to change image order too fast.
                            The consequences is increase server usage and make browser running too fast.
                        </td>
                    </tr>
                    <tr>
                        <td>allowSameImage</td>
                        <td>
                            Boolean | false.
                            <br>
                            If true then allow user to upload same images multiple times.
                        </td>
                    </tr>
                    <tr>
                        <td>allowSameImageSize</td>
                        <td>
                            Boolean | false.
                            <br>
                            Fix bug on iphones or touch devices. Because names of images change every time get uploaded
                            So this option double check if the same image get reuploaded with same image size.
                        </td>
                    </tr>
                    <tr>
                        <td id="sameImageUploadedAlert">sameImageUploadedAlert</td>
                        <td>
                            Array | ['Image has been uploaded', 2000, '#e30b0b'].
                            <br>
                            An array contains arguments for <a href="#addFlashBox">addFlashBox</a> function
                            to alert users that they chose to upload the same image again.
                            <br>
                            Syntax: [showedAlertString, showedTime, backgroundColor].
                        </td>
                    </tr>
                    <tr>
                        <td>sameImageUploadedAlertAction</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to alert user that they chose to upload the same image again.
                            <br>
                            The default function takes 3 array elements from <a href="#sameImageUploadedAlert">sameImageUploadedAlert</a> to pass arguments
                            for <a href="#addFlashBox">addFlashBox</a> function.
                        </td>
                    </tr>
                    <tr>
                        <td>resizeMimeType</td>
                        <td>
                            String | null.
                            <br>
                            Ex: 'image/jpeg' or 'image/png' or 'image/png'... The mime type of
                            the resized image (not the file extension).
                            <br>
                            If null the original mime type will be used.
                            If you need to change the file extension ex: '.png' or '.jpg' then see <a href="#renameImage">renameImage</a> option below.
                        </td>
                    </tr>
                    <tr>
                        <td id="renameImage">renameImage</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Is a function to rename the image before uploaded to the server.
                            This function has one parameter is original image name and must return image name.
                            <br>
                            With default function then the image name is set
                            with current time (UNIX timestamp) in milisecond plus random number from 1000 to 9999 then add file extension.
                        </td>
                    </tr>
                    <tr>
                        <td>dragAndDropFeature</td>
                        <td>
                            Boolean | true.
                            <br>
                            An options to enable or disable drag and drop file feature on &lt;input type="file"&gt; tag.
                        </td>
                    </tr>
                    <tr>
                        <td id="acceptedMimeType">acceptedMimeType</td>
                        <td>
                            String | 'image/*'.
                            <br>
                            Specifies a filter for what image types the user can pick from the &lt;input type="file"&gt; dialog box.
                            Ex: 'image/*' for all type of images or 'image/jpeg, image/png'.
                            The &lt;input type = 'file'&gt; will have 'accept' attribute equal <a href="#acceptedMimeType">acceptedMimeType</a>.
                        </td>
                    </tr>
                    <tr>
                        <td id="showAlertMimeType">showAlertMimeType</td>
                        <td>
                            Array | ['Wrong image mime type', 2000, '#e30b0b'].
                            <br>
                            An array contains arguments for <a href="#addFlashBox">addFlashBox</a> function
                            to alert users that they chose to upload the image with wrong Mime Type.
                            <br>
                            Syntax: [showedAlertString, showedTime, backgroundColor].
                        </td>
                    </tr>
                    <tr>
                        <td>showAlertMimeTypeAction</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to alert user that they chose to upload the image with wrong Mime Type.
                            <br>
                            The default function takes 3 array elements from <a href="#showAlertMimeType">showAlertMimeType</a> to pass arguments
                            for <a href="#addFlashBox">addFlashBox</a> function.
                        </td>
                    </tr>
                    <tr>
                        <td>addLogo</td>
                        <td>
                            Array | null.
                            <br>
                            An option to add Logo to uploading image with this syntax to use drawImage feature.
                            <br>
                            Syntax: [imagePath, x, y, width, height]
                            <br>
                            imagePath is the path to image source.
                            <br>
                            x, y is the X, Y coordinate where to place the logo on the image canvas.
                            <br>
                            width:	Optional. The width of the logo to use (stretch or reduce the logo)
                            <br>
                            height:	Optional. The height of the logo to use (stretch or reduce the logo)
                            <br>
                            Ex: ["/image/logo.png", 20, 20, 100, 100] or ["/image/logo.png", 20, 20]
                            or ["/image/logo.png", 20, 20, 100] or ["/image/logo.png", 20, 20, ,100]
                            <br><br>
                            If you want to add logo at the "potision":
                            "center", "top-left", "top-right", "bottom-right", "bottom-left"
                            of image canvas then follow this syntax
                            <br>
                            Syntax: [imagePath, width, height, potision, DeltaX, DeltaY].
                            <br>
                            Optional. "width" and "height" is the width and height of the logo (stretch or reduce the logo),
                            <br>
                            Optional. "DeltaX" and "DeltaY" is the x and y coordinate (in pixel) to move logo away from "position" you declared
                            as origin coordinate 0(0, 0).
                            <br><br>
                            Ex: ["/image/logo.png", 200, 120, 'bottom-right', 50, 50] is meant
                            that add logo.png with logo width equal 200px and logo height equal 120px,
                            at the bottom right of the uploading image and the
                            distance from the bottom border is 50px and the distance from right border is 50px.
                            <br><br>
                            You could provide width and height with empty value to keep original logo size.
                            <br>
                            Syntax: [imagePath, , , 'center'].
                        </td>
                    </tr>
                    <tr>
                        <td id="insertImageItemBeforeElmnt">insertImageItemBeforeElmnt</td>
                        <td>
                            DOM element | null.
                            <br>
                            By default, uploaded image item '.iu-image-item' be appended to gallery as the last child.
                            But if you want uploaded image item to insert before other element inside gallery
                            then use this option.
                            <br>
                            The declare <a href="#insertImageItemBeforeElmnt">insertImageItemBeforeElmnt</a> DOM Element must exist inside gallery for this option to work.
                        </td>
                    </tr>
                    <tr>
                        <td>setup</td>
                        <td>
                            Function | Empty function.
                            <br>
                            Is a function to set up more features for 4 image upload library like you wish when create ImageUpload object.
                        </td>
                    </tr>
                    <tr>
                        <td id="hightlightUploadZone">hightlightUploadZone</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function run when using drag and drop feature for &lt;input type="file"&gt;.
                            Function to highlight target when files hover over image upload zone.
                            <br>
                            The default is to change the border to red. See class '.iu-highlight' in css file.
                        </td>
                    </tr>
                    <tr>
                        <td id="unhightlightUploadZone">unhightlightUploadZone</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            See <a href="#hightlightUploadZone">hightlightUploadZone</a>.
                            <br>
                            The default is to change the border back to the previous color.
                        </td>
                    </tr>
                    <tr>
                        <td>getTargetForHighlight</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Return target (DOM Element) for <a href="#hightlightUploadZone">hightlightUploadZone</a>, <a href="#unhightlightUploadZone">unhightlightUploadZone</a>
                            <br>
                            The default function returns target is image upload zone itself.
                        </td>
                    </tr>
                    <tr>
                        <td>changeUploadZoneAndInputNoteStyle</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to change image upload zone ('#iu-image-upload-zone') and image note imageNoteOfImageUpload '.iu-image-note' inside
                            after all images are uploaded successfully to server.
                            <br>
                            Function has three paremeters that is imageUploadZone, imageNoteOfImageUpload and <a href="#dictUploadImageNote">dictUploadImageNote</a> option that you declare.
                        </td>
                    </tr>
                    <tr>
                        <td id="setImagesWidthAndHeight">setImagesWidthAndHeight</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to set width and height of image inside gallery with class '.iu-image-placeholder'.
                            <br>
                            Function has one parameter that is the div contains &lt;img&gt; with class '.iu-image-placeholder'.
                        </td>
                    </tr>
                    <tr>
                        <td id="savingImageOrderAlert">savingImageOrderAlert</td>
                        <td>
                            Array | ['Saving...', 30000].
                            <br>
                            An array contains arguments for <a href="#addFlashBox">addFlashBox</a> function
                            to alert users that they changed position of image and did not yet be saved to server.
                            <br>
                            Syntax: [showedAlertString, showedTime, backgroundColor].
                        </td>
                    </tr>
                    <tr>
                        <td>savingImageOrderAlertAction</td>
                        <td>
                            Function | See inside 4image-upload.js
                            <br>
                            Function to alert user that they change position of image and did not yet be saved to server.
                            <br>
                            The default function takes 3 array elements from <a href="#savingImageOrderAlert">savingImageOrderAlert</a> to pass arguments
                            for <a href="#addFlashBox">addFlashBox</a> function.
                        </td>
                    </tr>
                    <tr>
                        <td id="savedImageOrderAlert">savedImageOrderAlert</td>
                        <td>
                            Array | ['Saved', 2000].
                            <br>
                            An array contains arguments for <a href="#addFlashBox">addFlashBox</a> function
                            to alert users after user changed the position of image and image order was saved on server.
                            <br>
                            Syntax: [showedAlertString, showedTime, backgroundColor].
                        </td>
                    </tr>
                    <tr>
                        <td>savedImageOrderAlertAction</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to alert users after user changed the position of image and image order was saved on server.
                            <br>
                            The default function takes 3 array elements from <a href="#savedImageOrderAlert">savedImageOrderAlert</a> to pass arguments
                            for <a href="#addFlashBox">addFlashBox</a> function.
                        </td>
                    </tr>
                    <tr>
                        <td id="deletingImageAlert">deletingImageAlert</td>
                        <td>
                            Array | ['Deleting...', 30000].
                            <br>
                            An array contains arguments for <a href="#addFlashBox">addFlashBox</a> function
                            to alert users when they pressed delete button on image and is
                            sending request to server but the server is not handle request yet.
                            <br>
                            Syntax: [showedAlertString, showedTime, backgroundColor].
                        </td>
                    </tr>
                    <tr>
                        <td>deletingImageAlertAction</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to alert users when they press delete button on image and is
                            sending request to server but the server is not handle request yet.
                            <br>
                            The default function takes 3 array elements from <a href="#deletingImageAlert">deletingImageAlert</a> to pass arguments
                            for <a href="#addFlashBox">addFlashBox</a> function.
                        </td>
                    </tr>
                    <tr>
                        <td id="deletedImageAlert">deletedImageAlert</td>
                        <td>
                            Array | ['Deleted', 2000].
                            <br>
                            An array contains arguments for <a href="#addFlashBox">addFlashBox</a> function
                            to alert users after they pressed delete button on image
                            and the server deleted image for the request.
                            <br>
                            Syntax: [showedAlertString, showedTime, backgroundColor].
                        </td>
                    </tr>
                    <tr>
                        <td>deletedImageAlertAction</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function to alert users after they pressed delete button on image
                            and the server deleted image for the request.
                            <br>
                            The default function takes 3 array elements from <a href="#deletedImageAlert">deletedImageAlert</a> to pass arguments
                            for <a href="#addFlashBox">addFlashBox</a> function.
                        </td>
                    </tr>
                    <tr>
                        <td>sendFormDataWithoutImage</td>
                        <td>
                            Boolean | false.
                            <br>
                            This option is allow send <a href="#saveImageRoute">saveImageRoute</a> request without actually sending image to server.
                            If true then request file 'image' will not be sent.
                            Instead request will send input with the name "image" and value is imageName.
                            If you want to use this option then on server change Controller for <a href="#saveImageRoute">saveImageRoute</a>
                            because request will not contain request file 'image' anymore.
                            This option is used mainly to test.
                        </td>
                    </tr>
                    <tr>
                        <td>afterAppendImageAction</td>
                        <td>
                            Function | See inside 4image-upload.js.
                            <br>
                            Function that run after append image from server to gallery done for each image.
                            This function has one parameter that is imageItem with class '.iu-image-item'.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
