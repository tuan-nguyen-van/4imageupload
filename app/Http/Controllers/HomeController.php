<?php

namespace App\Http\Controllers;
use App\Models\Image;
use App\Models\DownloadCount;
use Illuminate\Http\Request;
use ZipArchive;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;

class HomeController extends Controller
{
    public function create() {
        $images = Image::where('token', '7SxuxTYiCd')->orderBy('image_number', 'asc')->get();
        return view('home', [
            'images' => $images
        ]);
    }

    public function installation() {
        return view('installation');
    }

    public function getCountDownload() {
        $downloadCount = DownloadCount::find(1);
        return $downloadCount->count;
    }

    public function testDemo() {
        return view('test-demo');
    }

    public function downloadCode(Request $request) {
        $downloadCount = DownloadCount::find(1);
        $downloadCount->update(['count' => $downloadCount->count + 1]);
        $folderId =  $request->input('folderId');
        mkdir("download/" . $folderId);
        $html = fopen("download/" . $folderId . "/demo.html", "w") or die("Unable to open file!");
        $style = fopen("download/" . $folderId . "/4image-upload.css", "w") or die("Unable to open file!");

        fwrite($style, $request->input('style'));
        fclose($style);

        fwrite($html, '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
<title></title>
<link rel="stylesheet" href="4image-upload.css">
</head>
<body>
<style>
    #image-upload-demo {
        width: 100%;
        margin: auto;
    }
</style>
<h2 style="text-align: center;">Test demo freely all the way you want</h2>

<div id="image-upload-demo">
' . $request->input('html') . '
</div>

<script src="4image-upload.js"></script>

<script id="jsNeedToCopy">
//Detect Internet Explorer. Show alert to customer.
if (window.document.documentMode) {
    alert("This website doesn\'t work on Internet Explorer, you should use modern browsers like Chrome or Safari instead");
}
'. $request->input('script') . '
</script>

</body>
</html>');
        fclose($html);

        copy("js/4image-upload.js", "download/" . $folderId . "/4image-upload.js");


        // Get real path for our folder
        $rootPath = realpath("download/$folderId");

        // Initialize archive object
        $zip = new ZipArchive();
        $zip->open('zip-download/' . $folderId. '.zip', ZipArchive::CREATE | ZipArchive::OVERWRITE);

        $zip->addEmptyDir('4image-upload');

        // Create recursive directory iterator
        /** @var SplFileInfo[] $files */
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($rootPath),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $name => $file)
        {
            //Skip directories (they would be added automatically)
            if (!$file->isDir())
            {
                // Get real and relative path for current file
                $filePath = $file->getRealPath();
                $relativePath = substr($filePath, strlen($rootPath) + 1);

                // Add current file to archive
                $zip->addFile($filePath, "4image-upload/" . basename($file));
            }
        }

        // Zip archive will be created only after closing object
        $zip->close();

        $files = glob('zip-download/*'); // get all file names

        $deleteBeforeTime = 86400;

        foreach($files as $file){ // iterate files
            $lastModifiedTimestamp = filemtime($file);

            if(is_file($file) && time() - $lastModifiedTimestamp > $deleteBeforeTime) {
                unlink($file); // delete file
            }
        }


        function rrmdir($dir) {
            if (is_dir($dir)) {
                $objects = scandir($dir);
                foreach ($objects as $object) {
                    if ($object != "." && $object != "..") {
                        if (filetype($dir."/".$object) == "dir")
                        rrmdir($dir."/".$object);
                        else unlink   ($dir."/".$object);
                    }
                }
                reset($objects);
                rmdir($dir);
            }
        }


        $folders = glob('download/*'); // get all folder names

        foreach($folders as $folder){ // iterate folders
            if (time() - filemtime($folder) > $deleteBeforeTime) {
                rrmdir($folder);
            }
        }

        return $folderId;
    }


}
