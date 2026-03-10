<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::with(['user', 'category'])->latest()->get();

        return Inertia::render('admin/blogs/index', [
            'blogs' => $blogs
        ]);
    }

    public function updateStatus(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $blog->update($validated);

        return redirect()->back()->with('success', 'Status web berhasil diperbarui.');
    }
}
