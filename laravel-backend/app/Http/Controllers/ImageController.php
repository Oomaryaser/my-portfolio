<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ImageController extends Controller
{
    // GET /api/images
    public function index()
    {
        // TODO: fetch images from database
        return response()->json([]);
    }

    // POST /api/upload
    public function store(Request $request)
    {
        // TODO: handle file upload
        return response()->json(['id' => 1], Response::HTTP_CREATED);
    }

    // DELETE /api/images/{id}
    public function destroy($id)
    {
        // TODO: delete image by id
        return response()->json(['ok' => true]);
    }
}
