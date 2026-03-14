<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\TripayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TripayCallbackController extends Controller
{
    public function handle(Request $request)
    {
        $tripay = new TripayService();

        $json = $request->getContent();

        // Verify signature
        if (!$tripay->verifyCallbackSignature($json)) {
            Log::warning('Tripay callback: invalid signature');
            return response()->json(['success' => false, 'message' => 'Invalid signature'], 403);
        }

        $data = json_decode($json, true);

        if (!$data || !isset($data['merchant_ref'])) {
            return response()->json(['success' => false, 'message' => 'Invalid payload'], 400);
        }

        $order = Order::where('invoice_id', $data['merchant_ref'])->first();

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        $tripayStatus = strtoupper($data['status'] ?? '');

        switch ($tripayStatus) {
            case 'PAID':
                $order->update(['status' => 'paid']);
                
                // Increment publisher balance
                if ($order->blog && $order->blog->user) {
                    $order->blog->user->increment('balance', $order->publisher_amount);
                }
                
                Log::info('Tripay callback: order paid and balance incremented', [
                    'invoice' => $order->invoice_id,
                    'publisher_id' => $order->blog->user_id ?? 'unknown'
                ]);
                break;
            case 'EXPIRED':
            case 'FAILED':
                $order->update(['status' => 'unpaid']);
                Log::info('Tripay callback: order expired/failed', ['invoice' => $order->invoice_id, 'status' => $tripayStatus]);
                break;
            default:
                Log::info('Tripay callback: unhandled status', ['status' => $tripayStatus]);
                break;
        }

        return response()->json(['success' => true]);
    }
}
