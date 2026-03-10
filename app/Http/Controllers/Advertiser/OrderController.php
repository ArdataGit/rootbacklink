<?php

namespace App\Http\Controllers\Advertiser;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Order;
use App\Services\TripayService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('advertiser/transaksi', [
            'orders' => Order::with('blog')
            ->where('user_id', auth()->id())
            ->latest()
            ->get(),
        ]);
    }

    public function checkout(Blog $blog)
    {
        return Inertia::render('advertiser/checkout', [
            'blog' => $blog->load('category'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'blog_id' => 'required|exists:blogs,id',
            'article_source' => 'required|in:publisher,advertiser',
            'instructions' => 'required_if:article_source,publisher',
            'doc_link' => 'required_if:article_source,advertiser',
            'notes' => 'nullable|string',
            'links' => 'required|array|min:1|max:4',
            'links.*.link' => 'required|url',
            'links.*.anchor' => 'required|string',
        ]);

        $blog = Blog::findOrFail($validated['blog_id']);
        $user = auth()->user();

        $invoiceId = 'INV-' . strtoupper(uniqid());

        $order = Order::create([
            'user_id' => $user->id,
            'blog_id' => $blog->id,
            'invoice_id' => $invoiceId,
            'total' => $blog->price,
            'article_source' => $validated['article_source'],
            'instructions' => $validated['instructions'] ?? null,
            'doc_link' => $validated['doc_link'] ?? null,
            'notes' => $validated['notes'],
            'status' => 'unpaid',
        ]);

        // Save dynamic links
        foreach ($validated['links'] as $linkData) {
            \App\Models\OrderLink::create([
                'order_id' => $order->id,
                'link' => $linkData['link'],
                'anchor' => $linkData['anchor']
            ]);
        }

        // Create Tripay transaction
        $tripay = app(TripayService::class);
        $result = $tripay->createTransaction([
            'merchant_ref' => $invoiceId,
            'amount' => (int)$blog->price,
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => $user->whatsapp ?? '',
            'return_url' => route('advertiser.transaksi'),
            'order_items' => [
                [
                    'name' => 'Backlink - ' . $blog->domain,
                    'price' => (int)$blog->price,
                    'quantity' => 1,
                ],
            ],
        ]);

        if ($result['success']) {
            $order->update([
                'tripay_reference' => $result['data']['reference'],
                'tripay_checkout_url' => $result['data']['checkout_url'],
            ]);

            return Inertia::location($result['data']['checkout_url']);
        }

        // If Tripay fails, still redirect to transaksi page with warning
        return redirect()->route('advertiser.transaksi')
            ->with('warning', 'Pesanan dibuat tapi gateway pembayaran gagal: ' . ($result['message'] ?? 'Unknown error'));
    }
}
