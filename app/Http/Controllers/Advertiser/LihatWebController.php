<?php

namespace App\Http\Controllers\Advertiser;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LihatWebController extends Controller
{
    public function index(Request $request)
    {
        $query = Blog::with('category')->where('status', 'approved');

        if ($request->has('search')) {
            $query->where('domain', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return Inertia::render('advertiser/lihat-web', [
            'blogs' => $query->latest()->get(),
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category_id']),
        ]);
    }
}
