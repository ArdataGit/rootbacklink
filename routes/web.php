<?php

use App\Http\Controllers\Publisher\WebSayaController;
use App\Http\Controllers\Advertiser\LihatWebController;
use App\Http\Controllers\Advertiser\OrderController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Tripay Callback (no auth, no CSRF)
Route::post('tripay/callback', [\App\Http\Controllers\TripayCallbackController::class , 'handle'])
    ->name('tripay.callback');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
            if (auth()->user()->role === 'admin') {
                $stats = [
                    'total_categories' => \App\Models\Category::count(),
                    'total_banners' => \App\Models\Banner::count(),
                    'total_blogs' => \App\Models\Blog::count(),
                    'pending_blogs' => \App\Models\Blog::where('status', 'pending')->count(),
                ];
                return Inertia::render('admin/dashboard', [
                'stats' => $stats
                ]);
            }

            $user = auth()->user();

            // Stats for standard user
            $totalSalesAmount = \App\Models\Order::whereHas('blog', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                }
                )->sum('total');

                $totalPurchasesAmount = \App\Models\Order::where('user_id', $user->id)->sum('total');

                $userStats = [
                    'total_blogs' => \App\Models\Blog::where('user_id', $user->id)->count(),
                    'pembelian' => \App\Models\Order::where('user_id', $user->id)->count(),
                    'penjualan' => \App\Models\Order::whereHas('blog', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }
            )->count(),
                'saldo' => $totalSalesAmount - $totalPurchasesAmount,
            ];

            // Recent Transactions (Purchases and Sales combined, max 5)
            $recentPurchases = \App\Models\Order::with('blog')
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($order) {
                $order->jenis_transaksi = 'Pembelian';
                return $order;
            }
            );

            $recentSales = \App\Models\Order::with('blog', 'user')
                ->whereHas('blog', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }
            )
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($order) {
                $order->jenis_transaksi = 'Penjualan';
                return $order;
            }
            );

            $recentTransactions = $recentPurchases->concat($recentSales)
                ->sortByDesc('created_at')
                ->take(5)
                ->values();


            $banners = \App\Models\Banner::where('is_active', true)->latest()->get();
            return Inertia::render('dashboard', [
            'banners' => $banners,
            'stats' => $userStats,
            'recent_transactions' => $recentTransactions
            ]);
        }
        )->name('dashboard');

        // Publisher Routes
        Route::get('web-saya', [WebSayaController::class , 'index'])->name('publisher.web-saya.index');
        Route::post('web-saya', [WebSayaController::class , 'store'])->name('publisher.web-saya.store');
        Route::post('withdrawals', [\App\Http\Controllers\Publisher\WithdrawalController::class , 'store'])->name('publisher.withdrawals.store');
        Route::patch('orders/{order}/publish', [\App\Http\Controllers\Publisher\OrderController::class , 'publish'])->name('publisher.orders.publish');
        Route::get('pemasukkan', function () {
            $user = auth()->user();

            // Fetch all orders where the associated blog belongs to the current user
            $pemasukkan = \App\Models\Order::with(['blog', 'user', 'links'])
                ->whereHas('blog', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }
            )
                ->latest()
                ->get();

            // Calculate total gross income
            $totalGross = $pemasukkan->where('status', 'paid')->sum('total');

            // Deduct requested/approved withdrawals to find available balance
            $totalWithdrawn = \App\Models\Withdrawal::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'approved'])
                ->sum('amount');

            $totalSaldo = $totalGross - $totalWithdrawn;

            // Check for existing pending request to disable button
            $pendingWithdrawal = \App\Models\Withdrawal::where('user_id', $user->id)
                ->where('status', 'pending')
                ->latest()
                ->first();

            // Metrics for current month
            $currentMonth = now()->month;
            $currentYear = now()->year;

            $bulanIni = $pemasukkan->where('status', 'paid')
                ->filter(function ($order) use ($currentMonth, $currentYear) {
                return $order->created_at->month == $currentMonth && $order->created_at->year == $currentYear;
            }
            )->sum('total');

            return Inertia::render('publisher/pemasukkan', [
            'pemasukkan' => $pemasukkan,
            'stats' => [
            'total_saldo' => $totalSaldo,
            'bulan_ini' => $bulanIni,
            'total_pesanan' => $pemasukkan->count(),
            'pending_withdrawal' => $pendingWithdrawal
            ]
            ]);
        }
        )->name('publisher.pemasukkan');

        // Advertiser Routes
        Route::get('lihat-web', [LihatWebController::class , 'index'])->name('advertiser.lihat-web');
        Route::get('checkout/{blog}', [OrderController::class , 'checkout'])->name('advertiser.checkout');
        Route::post('checkout', [OrderController::class , 'store'])->name('advertiser.order.store');
        Route::get('transaksi', [OrderController::class , 'index'])->name('advertiser.transaksi');

        // Admin Routes
        Route::middleware(['admin'])->prefix('admin')->group(function () {
            Route::get('blogs', [\App\Http\Controllers\Admin\BlogController::class , 'index'])->name('admin.blogs.index');
            Route::patch('blogs/{blog}/status', [\App\Http\Controllers\Admin\BlogController::class , 'updateStatus'])->name('admin.blogs.update-status');

            Route::get('categories', [\App\Http\Controllers\Admin\CategoryController::class , 'index'])->name('admin.categories.index');
            Route::post('categories', [\App\Http\Controllers\Admin\CategoryController::class , 'store'])->name('admin.categories.store');
            Route::patch('categories/{category}', [\App\Http\Controllers\Admin\CategoryController::class , 'update'])->name('admin.categories.update');
            Route::delete('categories/{category}', [\App\Http\Controllers\Admin\CategoryController::class , 'destroy'])->name('admin.categories.destroy');

            Route::get('banners', [\App\Http\Controllers\Admin\BannerController::class , 'index'])->name('admin.banners.index');
            Route::post('banners', [\App\Http\Controllers\Admin\BannerController::class , 'store'])->name('admin.banners.store');
            Route::post('banners/{banner}', [\App\Http\Controllers\Admin\BannerController::class , 'update'])->name('admin.banners.update');
            Route::delete('banners/{banner}', [\App\Http\Controllers\Admin\BannerController::class , 'destroy'])->name('admin.banners.destroy');

            // Admin Order Management
            Route::get('orders', [\App\Http\Controllers\Admin\OrderController::class , 'index'])->name('admin.orders.index');
            Route::patch('orders/{order}/status', [\App\Http\Controllers\Admin\OrderController::class , 'updateStatus'])->name('admin.orders.update-status');
        }
        );
    });

require __DIR__ . '/settings.php';
