<div class="installation" id="installation">
	<div class="installation-guide text-center section-title">Installation Guide</div>
	<div class="text-guide">
		After downloaded, unzip file you will have a folder '4image-upload'.
		Open it, inside you will have 3 files: 'demo.html', '4image-upload.css', '4image-upload.js'.
		You could open 'demo.html' on browsers to test demo or open with Code Editor to customize features for your need.
	</div>
	<div class="text-guide content-block">
		<div class="trigger-collapse font-weight-bold" data-toggle="collapse" data-target="#step1">
			<i class="fas fa-caret-down"></i> Step 1: Include code and files in your project source code then customize 4image-upload features for your need.
		</div>
		<div id="step1" class="collapse">
			<div class="text-guide">
				To install 4 Image Upload library on client-side besides '4image-upload.css' and '4image-upload.js' then we need 2 more things:
				<br>
				1, html file (to declare 2 html &lt;div&gt;: gallery to show image and image upload zone)
				<br>
				2, a &lt;script&gt; inside html file to declare ImageUpload object and necessary configuration options (optionObject):
				<br>
				<span class="text-danger">var myImageUploader = new ImageUpload({optionObject})</span>
			</div>
			<div class="text-guide">
				Include '4image-upload.css' and '4image-upload.js' files in your project.
			</div>
			<div class="text-guide">
				Open 'demo.html' with code editor then find the &lt;div id="image-upload-demo"&gt; then copy and paste all the
				code inside it to your project code at the position you want to put the 4image-upload features to work.
				<br>
				<pre><code class="language-html">@php
			writeCode('<div id="image-upload-demo">
    HtmlCodeNeedToCopy
</div>');
@endphp
				</code></pre>
			</div>
			<div class="text-guide">
				After that find the “&lt;script id="jsNeedToCopy"&gt; Javascript code &lt;/script&gt;”
				then copy both the &lt;script id="jsNeedToCopy"&gt; tag and all content inside and paste
				it after &lt;script src="/path-to/4image-upload.js"&gt;&lt;/script&gt;
			</div>
			<pre><code class="language-html">@php
			writeCode('<!DOCTYPE html>
<html>
    <head>
        ...
        <link href="/path-to/image-upload.css" rel="stylesheet"/>
    </head>
    <body>
        ...
        HtmlCodeNeedToCopy
        ...
        <script src="/path-to/image-upload.js"></script>
        <script id="jsNeedToCopy"> Javascript code</script>
    </body>
</html>');
@endphp
			</code></pre>
			<div class="text-guide">
				Inside &lt;script id="jsNeedToCopy"&gt; Javascript code &lt;/script&gt; you will see ImageUpload
				object declaration and all the configuration options inside.
			</div>
			<div class="text-guide">
				So customize ImageUpload is very easy, simply declare all options inside <span class="text-danger">optionObject</span>.
				<br>
				<span class="text-danger">Syntax: var myImageUploader = new ImageUpload({optionObject})</span>
			</div>
			<pre><code class="language-javascript">@php
			writeCode('var my4ImageUpload = new ImageUpload({
	imageUploadZoneId: "iu-image-upload-zone",
	imageGalleryId: "iu-gallery",
	sendRequestToServer: false,
	...,
	...,
	...,
});');
@endphp
			</code></pre>
		</div>
	</div>


	<div class="text-guide">
		That's all you need to do to get your '4 Image Upload' running in client-side.
		But's if you want your image upload to work then you need to
		implement code on server to handle request yourself.
		Don't worry it'll be very easy as I will guide you.
	</div>

	<div class="text-guide content-block">
		<div class="trigger-collapse font-weight-bold" data-toggle="collapse" data-target="#step4">
			<i class="fas fa-caret-down"></i> Step 2: Create database to store image information
		</div>
		<div id="step4" class="collapse mb-3">
			<img src="/demo-image/database_table.png" class="mt-3" alt="database table example" style="width: 100%">
			<p>Column 1: ID of each image uploaded. You have to set it with attribute primary, 'integer' type ( int(10) ) and 'AUTO_INCREMENT'</p>
			<p>Column 2: Associate ID, something that uploaded image belongs to. Example: post_id, user_id, thread_id or blog_id...</p>
			<p>Column 3: Uploaded image name.</p>
			<p>Column 4: Uploaded image number.
				Example: if you uploaded 10 images, then each image will have order number from 1 to 10.
				If you don't need image order number for images then you can skip this column.
			</p>
			<p>Column 5: Timestamp when image is created.</p>
			<p>Column 6: Timestamp when image is updated.</p>
		</div>
	</div>

	<div class="text-guide">
		Code on server side. If you use MVC framework like "Laravel" or "CodeIgniter"
		then it'll be very easy on server side. If you don't then the principles behind is the
		same regardless. Here I write example in Laravel framework because Laravel illustrate
		well meaning of code and easy understanding.
	</div>
	<div class="text-guide content-block">
		<div class="trigger-collapse font-weight-bold" data-toggle="collapse" data-target="#step5">
			<i class="fas fa-caret-down"></i> Step 3: Create 3 routes to handle request
		</div>
		<div id="step5" class="collapse">
			<div class="">
				The request method must be "POST" for all 3 routes.
			</div>
			<pre><code class="language-html">@php
			writeCode('<script>
	var myImageUploader = new ImageUpload({
	imageUploadZoneId: \'iu-image-upload-zone\',
	imageGalleryId: "iu-gallery",

	//Change option "sendRequestToServer" to true so the requests will be sent to server.
	sendRequestToServer: true,

	//Set header for request. Some server framework like "Laravel" require header
	//to contains "X-CSRF-TOKEN" to prevent CSRF attack.
	headers: {"X-CSRF-TOKEN": "Your CSRF-TOKEN"},

	//Must declare 3 routes below if you want to work with server.

	//Route to save image uploaded on server.
	saveImageRoute : "(http(s)://yourdomain.com)/.../save-image",

	//This option is object that contain additional information to send to server with
	//"saveImageRoute" like post_id, thread_id... With below imageBelongsTo, on server
	//you will have request input with name is ‘post_id’ and value is 15602.
	imageBelongsTo: {"post_id" : 15602},

	//When you change image position or change image order number then the order of
	//images in gallery will change.
	//This route is to save image order to database.
	//If you don\'t need image order number for each image skip this route and hide
	//select with option selectOrder: false and displayImageOrderNumber: false.
	saveImageOrderRoute : "(http(s)://yourdomain.com)/.../save-image-order",

	//When you hit the delete button, then a request will be sent to server
	//from this "deleteImageRoute" for you to handle.
	deleteImageRoute : "(http(s)://yourdomain.com)/.../delete-image",
	});
</script>');
			@endphp
			</code></pre>
			<p>Example in Laravel framework: </p>
			<pre><code class="language-php">@php
				writeCode('Route::post(\'/save-image\', [ImageController::class, \'save\'])->name(\'save-image\');
Route::post(\'/save-image-order\', [ImageController::class, \'saveImageOrder\'])->name(\'save-image-order\');
Route::post(\'/delete-image\', [ImageController::class, \'deleteImage\'])->name(\'delete-image\');');
			@endphp
			</code></pre>
		</div>
	</div>


	<div class="text-guide content-block">
		<div class="trigger-collapse font-weight-bold" data-toggle="collapse" data-target="#step6">
			<i class="fas fa-caret-down"></i> Step 4: Handle "saveImageRoute" on server
		</div>
		<div id="step6" class="collapse">
			<p>The request from "saveImageRoute" send to server contains three parts</p>
			<p class="ml-4">
				1, Image as a file inside request ‘file’ with a name "image".
			</p>
			<p class="ml-4">
				2, Input "imageNumber"
			</p>
			<p class="ml-4">
				3, Input as "imageBelongsTo" object that you declared.
			</p>
			<p>
				Example: if you declared
				<pre><code class="language-js">@php
				writeCode('imageBelongsTo: {
	"post_id" : 15602,
	"image_note" : "From user 13450"
},')
@endphp
				</pre></code>
				then request will have 2 more inputs: "post_id" equal 15602 and "image_note" equal "From user 13450".
			</p>
			<p>
				On server you write a function to handle "saveImageRoute" request in an order like here:
			</p>
			<p class="ml-4">
				1, Get the image file and image name from file "image" that sent in request.
			</p>
			<p class="ml-4">
				2, Store image file on server disk with image name.
			</p>
			<p class="ml-4">
				3, Save image to database that includes image_name, image_number and "imageBelongsTo" input.
				After saved to database get the automatically database created image ID.
			</p>
			<p class="ml-4">
				4, Return to client-side with a reponse that contains only image ID (integer type).
				The image ID return from server will be stick to image inside "data-image-id" like in the picture.
				<img src="/demo-image/image_id_example.png" class="mt-3" style="width: 100%" alt="image id example">
			</p>
			<p>Example in Laravel framework:</p>
			<pre><code class="language-php">@php
			writeCode('public function save(Request $request) {
	//Get image inside request ‘file’ from request.
	$image = $request->file("image");
	//Get image name from image.
	$imageName = $image->getClientOriginalName();
	//Store image on server disk
	$image->storeAs("image", $imageName, "public");
	//Create new database record of "image" table called $image
	$image = new Image;
	//add post_id to $image
	$image->post_id = $request->input("post_id");
	//add image_number to $image
	$image->image_number = $request->input("imageNumber");
	//add image_name to $image
	$image->image_name = $imageName;
	//Save $image to database
	$image->save();
	//return with a response that includes only image ID
	return response($image->id);
}');
@endphp
			</pre></code>
		</div>
	</div>


	<div class="text-guide content-block">
		<div class="trigger-collapse font-weight-bold" data-toggle="collapse" data-target="#step7">
			<i class="fas fa-caret-down"></i> Step 5: Handle "saveImageOrderRoute" on server
		</div>

		<div id="step7" class="collapse">
			<p>The request from "saveImageOrderRoute" sent to server contains one input "imageIdOrder" as an array
				of image Id [firstImageId, secondImageId, thirdImageId, ...., lastImageId].
			</p>
			<p> Example: With below DOM picture then "imageIdOrder" = [4047, 4050, 4046, 4049, 4048]
				<img src="/demo-image/image_order_ex.png" alt="image order example" style="width: 100%">
			</p>
			<p>
				On server you write a function to handle "saveImageOrderRoute" request like here:
			</p>
			<p class="ml-4">
				1, Because array "imageIdOrder" like [4047, 4050, 4046, 4049, 4048] will turn into string
				 on server like this "4047, 4050, 4046, 4049, 4048". First step is to turn back input
				 "imageIdOrder" as string to array. With php you use "explode" function.
			</p>
			<p class="ml-4">
				2, Run "for loop" for "imageIdOrder" array with i run from 0 to "imageIdOrder" length.
				With each iteration: find in database "image" data record with "id" equal element
				imageIdOrder[i] then update "image_number" equal i + 1.
			</p>
			<p>Example in Laravel framework:</p>
			<pre><code class="language-php">@php
			writeCode('public function saveImageOrder(Request $request) {
	//Turn input "imageIdOrder" from string to array with "explode"
	//function then saved as $imageIdOrder.
	$imageIdOrder = explode(\',\', $request->input(\'imageIdOrder\'));
	//For each $imageIdOrder element find record in "image” table with "id"
	//equal $imageIdOrder[$i] then update "image_number" equal i + 1.
	for ($i=0; $i < count($imageIdOrder) ; $i++) {
		$image = Image::where(\'id\', $imageIdOrder[$i])->update([\'image_number\' => $i + 1]);
	}
}');
@endphp
			</pre></code>
		</div>
	</div>


	<div class="text-guide content-block">
		<div class="trigger-collapse font-weight-bold" data-toggle="collapse" data-target="#step8">
			<i class="fas fa-caret-down"></i> Step 6: Handle "deleteImageRoute" on server
		</div>
		<div id="step8" class="collapse">
			<p>The request from "deleteImageRoute" sent to server
				contains one input "imageId" as the ID of image be getting deleted.
			</p>
			<p>
				On server you write a function to handle "deleteImageRoute" request like here:
			</p>
			<p class="ml-4">
				1, Find in database table "image" the image data with "id" equal
				request input "imageId". Delete this image in database.
			</p>
			<p class="ml-4">
				2, Get the name of the image ("$imageName").
				In server image storage delete the image with a name equal "$imageName".
			</p>
			<p>Example in Laravel framework:</p>
			<pre><code class="language-php">@php
			writeCode('public function deleteImage(Request $request) {
	//Find in database table "image" the image with "id" equal request
	//input "imageId" then delete it.
	$image = Image::where(\'id\', $request->input(\'imageId\'));
	$image->delete();
	//Get the imageName.
	$imageName = $image->image_name;
	//In server storage delete image with name equal $imageName.
	Storage::disk(\'public\')->delete("image/$imageName");
}');
@endphp
			</pre></code>
		</div>
	</div>

	<div class="text-guide content-block">
		<div class="trigger-collapse font-weight-bold" data-toggle="collapse" data-target="#css-note">
			<i class="fas fa-caret-down"></i> Change CSS Style
		</div>
		<div class="collapse" id="css-note">
			<p>
				If you want to change the css style. Then change css style inside 4image-upload.css
				<br>
				Example: If you want to increase distance between showed images to '20px' on gallery then do as follow:
			</p>
			<div class="ml-3">
				1, Change the padding of image item to 10px.
				<br>
				<span class="text-danger"> .iu-image-placeholder { ... padding: 10px; } </span>
				<br>
				2, Change top and left property of image order number to 10px.
				<br>
				<span class="text-danger"> .iu-image-order-number { ... top: 10px; left: 10px;} </span>
				<br>
				3, Change top and right property of close button to 10px;
				<br>
				<span class="text-danger"> .iu-close-button {...top: 10px; right: 10px;} </span>
				<br>
				4, Change css style for custom select, padding to 10px and margin-top to -20px.
				<br>
				<span class="text-danger"> .iu-custom-select {...padding: 10px; margin-top: -20px;} </span>
				<br>
				5, Change padding property for select item of custom select.
				<br>
				<span class="text-danger">.iu-select-items {... padding: 0 10px;}</span>
			</div>
		</div>
	</div>
</div>
