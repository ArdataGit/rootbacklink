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
            'has_backlink_authority' => 'boolean',
            'price_authority_publisher' => 'required_if:has_backlink_authority,true|numeric|nullable|min:0',
            'price_authority_advertiser' => 'required_if:has_backlink_authority,true|numeric|nullable|min:0',
            'has_backlink_sidebar' => 'boolean',
            'price_sidebar' => 'required_if:has_backlink_sidebar,true|numeric|nullable|min:0',
            'sidebar_duration' => 'required_if:has_backlink_sidebar,true|integer|nullable|min:1',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['status'] = 'pending';
        // Admin-managed stats default to 0/'no'
        $validated['da'] = 0;
        $validated['pa'] = 0;
        $validated['ss'] = 0;
        $validated['traffic'] = 0;
        $validated['indexing'] = 'no';

        $validated['has_backlink_authority'] = $request->boolean('has_backlink_authority');
        $validated['has_backlink_sidebar'] = $request->boolean('has_backlink_sidebar');

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
    public function update(Request $request, Blog $blog)
    {
        if ($blog->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'domain' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'has_backlink_authority' => 'boolean',
            'price_authority_publisher' => 'required_if:has_backlink_authority,true|numeric|nullable|min:0',
            'price_authority_advertiser' => 'required_if:has_backlink_authority,true|numeric|nullable|min:0',
            'has_backlink_sidebar' => 'boolean',
            'price_sidebar' => 'required_if:has_backlink_sidebar,true|numeric|nullable|min:0',
            'sidebar_duration' => 'required_if:has_backlink_sidebar,true|integer|nullable|min:1',
        ]);

        $validated['has_backlink_authority'] = $request->boolean('has_backlink_authority');
        $validated['has_backlink_sidebar'] = $request->boolean('has_backlink_sidebar');

        // If updated, set status back to pending for re-review
        $validated['status'] = 'pending';

        $blog->update($validated);

        return redirect()->back()->with('success', 'Perubahan website berhasil disimpan dan akan ditinjau kembali oleh Admin.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
    //
    }
}
