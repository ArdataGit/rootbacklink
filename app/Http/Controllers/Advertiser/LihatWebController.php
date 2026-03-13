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

        if ($request->filled('search')) {
            $query->where('domain', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Range Filters
        foreach (['da', 'pa', 'ss'] as $metric) {
            if ($request->filled("{$metric}_min")) {
                $query->where($metric, '>=', $request->{"{$metric}_min"});
            }
            if ($request->filled("{$metric}_max")) {
                $query->where($metric, '<=', $request->{"{$metric}_max"});
            }
        }

        // Sorting
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');

        $allowedSorts = ['da', 'pa', 'ss', 'traffic', 'domain', 'price'];
        if (in_array($sort, $allowedSorts)) {
            if ($sort === 'price') {
                $query->orderBy('price_authority_advertiser', $direction);
            } else {
                $query->orderBy($sort, $direction);
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return Inertia::render('advertiser/lihat-web', [
            'blogs' => $query->get(),
            'categories' => Category::all(),
            'filters' => [
                'search' => $request->search ?? '',
                'category_id' => $request->category_id ?? '',
                'da_min' => $request->da_min ?? '',
                'da_max' => $request->da_max ?? '',
                'pa_min' => $request->pa_min ?? '',
                'pa_max' => $request->pa_max ?? '',
                'ss_min' => $request->ss_min ?? '',
                'ss_max' => $request->ss_max ?? '',
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }
}
