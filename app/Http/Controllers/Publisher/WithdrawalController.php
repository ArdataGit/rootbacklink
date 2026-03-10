<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Withdrawal;

class WithdrawalController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:50000', // Assuming a minimum withdrawal of 50k for example
        ]);

        $user = auth()->user();

        // Calculate available balance
        $totalGross = Order::whereHas('blog', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->where('status', 'paid')->sum('total');

        $totalWithdrawn = Withdrawal::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'approved'])
            ->sum('amount');

        $availableBalance = $totalGross - $totalWithdrawn;

        if ($request->amount > $availableBalance) {
            return redirect()->back()->withErrors(['amount' => 'Nominal penarikan melebihi saldo tersedia.']);
        }

        // Check if there's already a pending withdrawal
        $pendingExists = Withdrawal::where('user_id', $user->id)
            ->where('status', 'pending')
            ->exists();

        if ($pendingExists) {
            return redirect()->back()->withErrors(['amount' => 'Anda masih memiliki permintaan penarikan yang sedang diproses.']);
        }

        Withdrawal::create([
            'user_id' => $user->id,
            'amount' => $request->amount,
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Permintaan penarikan saldo berhasil dikirim.');
    }
}
