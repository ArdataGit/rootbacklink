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
        $tripay = app(TripayService::class);
        $paymentChannels = $tripay->getPaymentChannels();

        return Inertia::render('advertiser/checkout', [
            'blog' => $blog->load('category'),
            'paymentChannels' => $paymentChannels,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'blog_id' => 'required|exists:blogs,id',
            'backlink_type' => 'required|in:authority,sidebar',
            'article_source' => 'required_if:backlink_type,authority|in:publisher,advertiser|nullable',
            'instructions' => 'required_if:article_source,publisher',
            'doc_link' => 'required_if:article_source,advertiser',
            'notes' => 'nullable|string',
            'links' => 'required|array|min:1|max:4',
            'links.*.link' => 'required|url',
            'links.*.anchor' => 'required|string',
            'payment_method' => 'required|string',
        ]);

        $blog = Blog::findOrFail($validated['blog_id']);
        $user = auth()->user();

        // Calculate Price
        $totalPrice = 0;
        if ($validated['backlink_type'] === 'authority') {
            $totalPrice = $validated['article_source'] === 'publisher' 
                          ? $blog->price_authority_publisher 
                          : $blog->price_authority_advertiser;
        } else {
            $totalPrice = $blog->price_sidebar;
        }

        if (!$totalPrice || $totalPrice <= 0) {
            return redirect()->back()->withErrors(['backlink_type' => 'Harga backlink tidak valid atau belum diatur oleh publisher.']);
        }

        $invoiceId = 'INV-' . strtoupper(uniqid());

        $order = Order::create([
            'user_id' => $user->id,
            'blog_id' => $blog->id,
            'invoice_id' => $invoiceId,
            'total' => $totalPrice,
            'backlink_type' => $validated['backlink_type'],
            'article_source' => $validated['article_source'] ?? null,
            'instructions' => $validated['instructions'] ?? null,
            'doc_link' => $validated['doc_link'] ?? null,
            'notes' => $validated['notes'] ?? null,
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
            'method' => $validated['payment_method'],
            'merchant_ref' => $invoiceId,
            'amount' => (int)$totalPrice,
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => $user->whatsapp ?? '',
            'return_url' => route('advertiser.transaksi'),
            'order_items' => [
                [
                    'name' => 'Backlink ' . ucfirst($validated['backlink_type']) . ' - ' . $blog->domain,
                    'price' => (int)$totalPrice,
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
