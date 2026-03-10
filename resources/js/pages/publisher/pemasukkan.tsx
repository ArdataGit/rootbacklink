import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Wallet, ArrowUpRight, Receipt, ArrowRight, MessageCircle, Calendar, Eye } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface Withdrawal {
    id: number;
    amount: number;
    status: string;
}

interface Stats {
    total_saldo: number;
    bulan_ini: number;
    total_pesanan: number;
    pending_withdrawal?: Withdrawal | null;
}

interface IncomeRecord {
    id: number;
    invoice_id: string;
    total: number;
    created_at: string;
    status: string;
    blog?: { domain: string };
    user?: { name: string; email: string };
}

interface Props {
    pemasukkan: IncomeRecord[];
    stats: Stats;
    auth: { user: { name: string; email: string } };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pemilik Web (Publisher)', href: '#' },
    { title: 'Pemasukkan Saya', href: '/pemasukkan' },
];

export default function Pemasukkan({ pemasukkan = [], stats = { total_saldo: 0, bulan_ini: 0, total_pesanan: 0, pending_withdrawal: null }, auth }: Props) {
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ amount: '' });

    const submitWithdrawal = (e: React.FormEvent) => {
        e.preventDefault();
        post('/withdrawals', {
            preserveScroll: true,
            onSuccess: () => { setIsWithdrawModalOpen(false); reset(); },
        });
    };

    const adminWhatsAppNumber = '6281234567890';
    const getWhatsAppUrl = (amount: number) => {
        const text = `Halo Admin, saya *${auth.user.name}* (${auth.user.email}) ingin konfirmasi penarikan saldo sebesar *Rp ${new Intl.NumberFormat('id-ID').format(amount)}*. Mohon diproses, terima kasih.`;
        return `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(text)}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pemasukkan Saya" />
            
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Riwayat Pemasukkan</h1>
                    <p className="mt-1.5 text-sm text-gray-500">Pantau penghasilan Anda dari pesanan backlink yang telah selesai.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 bg-emerald-50 rounded-lg">
                                <Wallet className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Saldo Aktif</p>
                                <h3 className="text-lg font-bold text-gray-800">Rp {new Intl.NumberFormat('id-ID').format(stats.total_saldo)}</h3>
                            </div>
                        </div>
                        {stats.pending_withdrawal ? (
                            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                <p className="text-xs text-amber-700 font-medium mb-2">
                                    Penarikan Rp {new Intl.NumberFormat('id-ID').format(stats.pending_withdrawal.amount)} sedang diproses.
                                </p>
                                <a href={getWhatsAppUrl(stats.pending_withdrawal.amount)} target="_blank" rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors">
                                    <MessageCircle className="w-4 h-4 mr-1.5" /> Hubungi Admin (WA)
                                </a>
                            </div>
                        ) : (
                            <button onClick={() => setIsWithdrawModalOpen(true)} disabled={stats.total_saldo < 50000}
                                className={`w-full flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold text-white transition-colors ${stats.total_saldo >= 50000 ? 'bg-teal-500 hover:bg-teal-600' : 'bg-gray-300 cursor-not-allowed'}`}>
                                Tarik Saldo <ArrowRight className="w-4 h-4 ml-1.5" />
                            </button>
                        )}
                        {stats.total_saldo < 50000 && !stats.pending_withdrawal && (
                            <p className="text-[10px] text-gray-400 mt-1.5 text-center">Minimal penarikan Rp 50.000</p>
                        )}
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 flex items-center gap-3">
                        <div className="p-2.5 bg-sky-50 rounded-lg">
                            <ArrowUpRight className="w-5 h-5 text-sky-600" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bulan Ini</p>
                            <h3 className="text-lg font-bold text-gray-800">Rp {new Intl.NumberFormat('id-ID').format(stats.bulan_ini)}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 rounded-lg">
                            <Receipt className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Pesanan</p>
                            <h3 className="text-lg font-bold text-gray-800">{stats.total_pesanan}</h3>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50">
                        <h2 className="text-base font-semibold text-gray-800">Daftar Transaksi</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No Transaksi</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Domain</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nominal</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Keterangan</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {pemasukkan.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-16 text-center">
                                            <Calendar className="w-10 h-10 mx-auto text-gray-200 mb-3" />
                                            <p className="text-sm text-gray-400">Belum ada riwayat pemasukkan.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    pemasukkan.map((item) => (
                                        <tr key={item.id} className="hover:bg-teal-50/30 transition-colors">
                                            <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{item.invoice_id}</td>
                                            <td className="px-5 py-3.5 text-sm text-gray-600">
                                                {item.blog?.domain || '-'}
                                                <div className="text-xs text-gray-400 mt-0.5">{new Date(item.created_at).toLocaleDateString('id-ID')}</div>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm font-bold text-gray-800">
                                                Rp {new Intl.NumberFormat('id-ID').format(item.total)}
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-gray-600">
                                                Order dari: <span className="font-medium text-gray-800">{item.user?.name || '-'}</span>
                                                <div className="mt-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <Link href={`#`} className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-teal-500 hover:bg-teal-600 transition-colors">
                                                    <Eye className="w-3.5 h-3.5 mr-1" /> Lihat Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Withdraw Modal */}
            <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border-gray-100 rounded-2xl">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-lg font-bold text-gray-800 flex items-center">
                            <Wallet className="w-5 h-5 mr-2 text-teal-600" /> Tarik Saldo
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitWithdrawal} className="p-6 pt-4">
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Nominal Penarikan</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">Rp</span>
                                <input type="number" value={data.amount} onChange={e => setData('amount', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-semibold text-gray-800"
                                    placeholder="50000" min="50000" max={stats.total_saldo} required />
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5">Maksimal: Rp {new Intl.NumberFormat('id-ID').format(stats.total_saldo)}</p>
                            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                            <DialogClose asChild>
                                <button type="button" onClick={() => { reset(); setIsWithdrawModalOpen(false); }}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                    Batal
                                </button>
                            </DialogClose>
                            <button type="submit" disabled={processing}
                                className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50">
                                {processing ? 'Memproses...' : 'Kirim Permintaan'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
