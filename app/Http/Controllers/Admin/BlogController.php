<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::with(['user', 'category'])->latest()->get();
        $users = User::where('role', '!=', 'admin')->orderBy('name')->get(['id', 'name', 'email']);
        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/blogs/index', [
            'blogs' => $blogs,
            'users' => $users,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'domain' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'has_backlink_authority' => 'required|boolean',
            'price_authority_publisher' => 'required_if:has_backlink_authority,true|nullable|numeric|min:0',
            'price_authority_advertiser' => 'required_if:has_backlink_authority,true|nullable|numeric|min:0',
            'has_backlink_sidebar' => 'required|boolean',
            'price_sidebar' => 'required_if:has_backlink_sidebar,true|nullable|numeric|min:0',
            'sidebar_duration' => 'required_if:has_backlink_sidebar,true|nullable|integer|min:1',
            'da' => 'required|integer|min:0',
            'pa' => 'required|integer|min:0',
            'ss' => 'required|integer|min:0|max:100',
            'traffic' => 'required|integer|min:0',
            'indexing' => 'required|in:yes,no',
        ]);

        $validated['status'] = 'approved';

        Blog::create($validated);

        return redirect()->back()->with('success', 'Website berhasil ditambahkan.');
    }

    public function update(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'da' => 'required|integer|min:0',
            'pa' => 'required|integer|min:0',
            'ss' => 'required|integer|min:0|max:100',
            'traffic' => 'required|integer|min:0',
            'indexing' => 'required|in:yes,no',
            'has_backlink_authority' => 'required|boolean',
            'price_authority_publisher' => 'required_if:has_backlink_authority,true|nullable|numeric|min:0',
            'price_authority_advertiser' => 'required_if:has_backlink_authority,true|nullable|numeric|min:0',
            'has_backlink_sidebar' => 'required|boolean',
            'price_sidebar' => 'required_if:has_backlink_sidebar,true|nullable|numeric|min:0',
            'sidebar_duration' => 'required_if:has_backlink_sidebar,true|nullable|integer|min:1',
            'status' => 'sometimes|in:pending,approved,rejected',
        ]);

        $blog->update($validated);

        return redirect()->back()->with('success', 'Data web berhasil diperbarui.');
    }

    public function updateStatus(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $blog->update($validated);

        return redirect()->back()->with('success', 'Status web berhasil diperbarui.');
    }

    public function destroy(Blog $blog)
    {
        $blog->delete();

        return redirect()->back()->with('success', 'Website berhasil dihapus.');
    }
}
