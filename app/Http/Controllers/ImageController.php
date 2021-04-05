<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Image;

class ImageController extends Controller
{
    public function save(Request $request) {
        if ($request->file('image') !== null) {
            $image = $request->file('image');
            $imageName = $image->getClientOriginalName();
            $path = $image->storeAs(
                'image',
                $imageName,
                'public'
            );
        }
        else {
            $imageName = $request->input('image');
        }
        $image = new Image;
        $image->token = $request->input('token');
        $image->image_number = $request->input('imageNumber');
        $image->image_name = $imageName;
        $image->save();
        return response($image->id);
    }


    public function deleteImage(Request $request) {
        // $image = Image::find($request->input('imageId'));
        // $image->delete();
        // Storage::disk('public')->delete("image/$image->image_name");
    }

    public function saveImageOrder(Request $request) {
        $imageIdOrder = explode(',', $request->input('imageIdOrder'));
        for ($i=0; $i < count($imageIdOrder) ; $i++) {
            $image = Image::where('id', $imageIdOrder[$i])->update(['image_number' => $i + 1]);
        }
    }

    public function deleteImageWhereImageNumberNull() {
        $image = Image::where('image_number', null)->delete();
    }
}
