<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\Category;
use Inertia\Inertia;

class WebSayaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Blog::with('category')->where('user_id', auth()->id());

        if ($request->filled('search')) {
            $query->where('domain', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $blogs = $query->latest()->get();
        $categories = Category::all();

        return Inertia::render('publisher/web-saya', [
            'blogs' => $blogs,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'domain' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'da' => 'required|integer|min:0',
            'pa' => 'required|integer|min:0',
            'ss' => 'required|integer|min:0|max:100',
            'traffic' => 'required|integer|min:0',
            'indexing' => 'required|in:yes,no',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['status'] = 'pending';

        Blog::create($validated);

        return redirect()->back()->with('success', 'Website berhasil didaftarkan dan sedang menunggu review Admin.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
    //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
    //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
    //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
    //
    }
}
