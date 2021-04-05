<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
    <meta name="_token" id="csrf_token" content="{{csrf_token()}}" />
    <link rel="stylesheet" href="/css/sidebar.css?v=1.14">
    <link rel="stylesheet" href="/css/main.css?v=1.35">
    <link rel="stylesheet" href="/css/prism.css">
    <link rel="icon" href="/demo-image/image-uploader-icon.png" alt="4imageupload.com logo">
    <!-- Bootstrap CSS CDN -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">


    <script src="/js/4image-upload.js?v=1.30"></script>
    {{-- Minify 4image-upload.js --}}

    @yield('head')
    <meta name="google-site-verification" content="MS0uAOvYADnW05IVuy59hINSCEDRu73ESQj2dUFHF3Y" />
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-146952827-2"></script>
    <script data-ad-client="ca-pub-9356988426534984" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-146952827-2');
    </script>
</head>
<body>
    <div class="wrapper container">
        @include('layouts.nav')
        <div id="content">
            @include('layouts.toggle-button')
            @yield('content')
        </div>
        {{-- @include('layouts.footer') --}}
    </div>
    @include('layouts.js')
    @yield('js')
</body>
</html>
