<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['blog', 'user', 'links'])
            ->latest()
            ->get();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:unpaid,paid,published,completed',
            'published_link' => 'nullable|url',
        ]);

        $order->update([
            'status' => $validated['status'],
            'published_link' => $validated['published_link'] ?? $order->published_link,
        ]);

        return back()->with('success', 'Status transaksi berhasil diperbarui.');
    }
}
