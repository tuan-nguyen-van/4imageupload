<div class="" id="append-server-image">
    <div class="text-center section-title">
        Append image to gallery from server
    </div>
    <div class="text-guide" data-toggle="collapse" style="cursor: pointer" data-target="#append-server-image-guide">
        <i class="fas fa-caret-down"></i>Append image from server is very easy with appendServerImage() method from ImageUpload constructor.
    </div>
    <div id="append-server-image-guide" class="collapse">
        <div class="text-guide">
            Syntax: <span class="text-danger">ImageUploadObject.appendServerImage(serverImage, imageName, imageId)</span>
            <br>
            <span class="text-danger">ImageUploadObject</span> is the object that you declared with ImageUpload constructor.
            Ex: if you declared : var my4ImageUpload = new ImageUpload({…}).
            Then <span class="text-danger">ImageUploadObject</span> is my4ImageUpload
            <br>
            <span class="text-danger">serverImage</span> is the image source retrieved from server storage.
            <br>
            <span class="text-danger">imageName</span> and <span class="text-danger">imageId</span> is the name and id
            of the image that you get from database table ‘image’ that contains columns 'image_name' and 'id'.
        </div>
        <div class="text-guide">
            Example in Laravel framework
        </div>
        <pre><code class="language-javascript">@php
        writeCode('//$images is a variable retrieved from server contains all images need to append to gallery
@foreach ($images as $image)
    //Get image source from server storage from image_name
    var imageSrc = "/storage/image/{{$image->image_name}}";

    //Get imageName from database image.
    var imageName = \'{{$image->image_name}}\';

    //Get imageId from database image.
    var imageId = \'{{$image->id}}\';

    //Append server image. With my4ImageUpload is the object that
    //you declared with new ImageUpload() object constructor.
    //var my4ImageUpload = new ImageUpload(...)
    my4ImageUpload.appendServerImage(imageSrc, imageName, imageId);
@endforeach');
        @endphp
        </code></pre>
    </div>
</div>
