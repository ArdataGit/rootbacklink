import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Banner } from '@/types';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Globe, ShoppingCart, TrendingUp, Wallet } from 'lucide-react';

interface Stats {
    total_blogs: number;
    pembelian: number;
    penjualan: number;
    saldo: number;
}

interface Transaction {
    id: number;
    created_at: string;
    jenis_transaksi: 'Pembelian' | 'Penjualan';
    invoice_id: string;
    total: number;
    blog?: {
        domain: string;
    };
}

interface Props {
    banners?: Banner[];
    stats?: Stats;
    recent_transactions?: Transaction[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
];

export default function Dashboard({ banners = [], stats, recent_transactions }: Props) {
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const nextBanner = () => setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    const prevBanner = () => setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

    const statCards = [
        { label: 'Total Blog', value: stats?.total_blogs || 0, icon: Globe, color: 'text-teal-600', bg: 'bg-teal-50' },
        { label: 'Pembelian', value: stats?.pembelian || 0, icon: ShoppingCart, color: 'text-sky-600', bg: 'bg-sky-50' },
        { label: 'Penjualan', value: stats?.penjualan || 0, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Saldo', value: `Rp ${stats?.saldo ? new Intl.NumberFormat('id-ID').format(stats.saldo) : 0}`, icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50', isCurrency: true },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                
                {/* Banner Slider */}
                {banners.length > 0 && (
                    <div className="relative w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden group">
                        {banners.map((banner, index) => (
                            <div 
                                key={banner.id}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                {banner.url ? (
                                    <a href={banner.url} target="_blank" rel="noreferrer" className="block w-full h-full">
                                        <img src={`/storage/${banner.image_path}`} alt={banner.title} className="w-full h-full object-cover" />
                                    </a>
                                ) : (
                                    <img src={`/storage/${banner.image_path}`} alt={banner.title} className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                                <div className="absolute bottom-5 left-6 right-6 z-20 pointer-events-none">
                                    <h2 className="text-2xl font-bold text-white drop-shadow-sm">{banner.title}</h2>
                                </div>
                            </div>
                        ))}
                        {banners.length > 1 && (
                            <>
                                <button onClick={prevBanner} className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button onClick={nextBanner} className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
                                    {banners.map((_, idx) => (
                                        <button key={idx} onClick={() => setCurrentBanner(idx)} className={`h-1.5 rounded-full transition-all ${idx === currentBanner ? 'bg-white w-6' : 'bg-white/50 w-1.5'}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card) => (
                        <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                            <div className={`${card.bg} p-2.5 rounded-lg w-fit mb-3`}>
                                <card.icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{card.label}</p>
                            <p className="text-xl font-bold text-gray-800">{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50">
                        <h3 className="text-base font-semibold text-gray-800">Transaksi Terakhir</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Jenis</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Keterangan</th>
                                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Nominal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_transactions && recent_transactions.length > 0 ? (
                                    recent_transactions.map((trx) => (
                                        <tr key={trx.id} className="border-b border-gray-50 last:border-0 hover:bg-teal-50/30 transition-colors">
                                            <td className="px-5 py-3.5 text-sm text-gray-500">
                                                {new Date(trx.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                                    trx.jenis_transaksi === 'Pembelian' 
                                                    ? 'bg-sky-50 text-sky-700 border-sky-200' 
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                }`}>
                                                    {trx.jenis_transaksi}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-gray-700 font-medium">
                                                {trx.blog?.domain || `Order #${trx.invoice_id}`}
                                            </td>
                                            <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 text-right">
                                                Rp {new Intl.NumberFormat('id-ID').format(trx.total)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                                            Data masih kosong...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
