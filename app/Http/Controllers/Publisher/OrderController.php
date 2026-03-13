<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Submit the published link for an order.
     */
    public function publish(Request $request, Order $order)
    {
        // Ensure the order belongs to one of the publisher's blogs
        if ($order->blog->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        // Only allowed if status is paid
        if ($order->status !== 'paid') {
            return back()->with('error', 'Status pesanan tidak valid untuk dipublish.');
        }

        $validated = $request->validate([
            'published_link' => 'required_without:published_links|url|nullable',
            'published_links' => 'required_without:published_link|array|nullable',
            'published_links.*' => 'url',
            'published_desc' => 'nullable|string',
        ]);

        $order->update([
            'status' => 'published',
            'published_link' => $validated['published_link'] ?? null,
            'published_links' => $validated['published_links'] ?? null,
            'published_desc' => $validated['published_desc'] ?? null,
        ]);

        return back()->with('success', 'Link artikel berhasil disubmit dan status pesanan diperbarui.');
    }
}
