@extends ('layouts.master')
@section('head')
	<title>Multiple image pload javascript library with reorder, sortable.</title>
	<meta name="description" value="4 Image Upload is a pure javascript framework
	 that handle almost everything about image upload on client-side and really
	 simple to use and install with many unique features and customize easily.">
	 <meta name="keywords" value="javascript framwork, javascript library, javascript, upload image, image upload, photo upload,
	 picture upload, dragndrop, drag and drop, drag'n'drop, free, sortable, image order, reorder image,
	 change image order, finger move, touch device, resize image, resize photos, add logo, responsive,
	 customizable, customize, lightweight, work across browsers">
@endsection
@section ('content')
	@php
		function writeCode($code) {
			$code = htmlspecialchars($code);
			$code = str_replace("&amp;hellip;", "&hellip;", $code);
			echo($code);
		}
	@endphp

	<div class="content-padding" id="main-content">
		<div id="menu-btn">
			<button type="button" id="sidebarCollapse" class="btn btn-info">
				<i class="fas fa-align-left"></i>
				<span>MENU</span>
			</button>
		</div>
		@include('introduction')

		{{-- @include('demo+download') --}}

		@include('theme')

		@include("installation")

		@include("configuration")

		@include('append-server-image')

		@include('version')

		@include('donate')

		<div class="modal fade" id="modalPayPal">
			<div class="modal-dialog modal-dialog-scrollable">
				<div class="modal-content">
					<!-- Modal Header -->
					<div class="modal-header">
						<h5 class="modal-title text-center" id="modal-title-paypal" style="color: #17a2b8;"></h5>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>
					<!-- Modal body -->
					<div class="modal-body" id="modal-paypal-body">
						<div id="paypal-button-container"></div>
						@include('image-upload-script')
					</div>
				</div>
			</div>
		</div>

	</div>
@endsection
@section ('js')
	<script src="https://kit.fontawesome.com/4c44b4da47.js" crossorigin="anonymous"></script>
    <script src="https://www.paypal.com/sdk/js?client-id=AYDy7BLKe7v96jt3Al1i-7HMQMDHXf9dgkLV_dBtHDYIMHU-KQBuqjJnqwfqP9HyklxlNSBoAJc_dr89&components=buttons"></script>
	<!-- Add the checkout buttons, set up the order and approve the order -->
	@include('/js/paypal')
@endsection
