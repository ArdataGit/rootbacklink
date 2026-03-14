<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WithdrawalController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/withdrawals/index', [
            'withdrawals' => Withdrawal::with('user')->latest()->get(),
        ]);
    }

    public function update(Request $request, Withdrawal $withdrawal)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,on_progress,completed,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string',
        ]);

        $oldStatus = $withdrawal->status;
        $newStatus = $validated['status'];

        // If status changed to completed, we should have already deducted from "withdrawable_balance" 
        // logic-wise by the user model, but "balance" itself is only deducted on completion.
        if ($newStatus === 'completed' && $oldStatus !== 'completed') {
            $user = $withdrawal->user;
            if ($user->balance < $withdrawal->amount) {
                return redirect()->back()->withErrors(['status' => 'Saldo user tidak cukup untuk pencairan ini.']);
            }
            $user->decrement('balance', $withdrawal->amount);
        }

        // If status was completed and changed back (e.g. error correction), we should increment balance back
        if ($oldStatus === 'completed' && $newStatus !== 'completed') {
            $withdrawal->user->increment('balance', $withdrawal->amount);
        }

        $withdrawal->update([
            'status' => $newStatus,
            'rejection_reason' => $newStatus === 'rejected' ? $validated['rejection_reason'] : null,
        ]);

        return redirect()->back()->with('success', 'Status penarikan berhasil diperbarui.');
    }
}
