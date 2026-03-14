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
        $user = auth()->user();

        // Check if bank info is filled
        if (!$user->bank_name || !$user->bank_account_number || !$user->bank_account_name) {
            return redirect()->route('profile.edit')->with('warning', 'Silakan lengkapi data rekening bank Anda terlebih dahulu sebelum melakukan penarikan dana.');
        }

        $request->validate([
            'amount' => 'required|numeric|min:50000',
        ]);

        $availableBalance = $user->withdrawable_balance;

        if ($request->amount > $availableBalance) {
            return redirect()->back()->withErrors(['amount' => 'Nominal penarikan melebihi saldo tersedia.']);
        }

        // Check if there's already a pending withdrawal
        $pendingExists = Withdrawal::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'on_progress'])
            ->exists();

        if ($pendingExists) {
            return redirect()->back()->withErrors(['amount' => 'Anda masih memiliki permintaan penarikan yang sedang diproses.']);
        }

        Withdrawal::create([
            'user_id' => $user->id,
            'amount' => $request->amount,
            'status' => 'pending',
            'bank_name' => $user->bank_name,
            'bank_account_number' => $user->bank_account_number,
            'bank_account_name' => $user->bank_account_name,
        ]);

        return redirect()->back()->with('success', 'Permintaan penarikan saldo berhasil dikirim.');
    }
}
