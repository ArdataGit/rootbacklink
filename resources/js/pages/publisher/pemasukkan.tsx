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
    rejection_reason?: string | null;
}

interface Stats {
    total_saldo: number;
    withdrawable_balance: number;
    bulan_ini: number;
    total_pesanan: number;
    active_withdrawal?: Withdrawal | null;
    has_bank_info: boolean;
}

interface IncomeRecord {
    id: number;
    invoice_id: string;
    total: number;
    quantity: number;
    admin_fee: number;
    admin_fee_percentage: number;
    publisher_amount: number;
    description?: string;
    created_at: string;
    status: string;
    article_source?: string;
    instructions?: string;
    doc_link?: string;
    notes?: string;
    published_desc?: string;
    published_link?: string;
    published_links?: string[];
    backlink_type?: string;
    blog?: { domain: string };
    user?: { name: string; email: string };
    links?: { link: string; anchor: string }[];
}

interface Props {
    pemasukkan: IncomeRecord[];
    withdrawals: Withdrawal[];
    stats: Stats;
    auth: { user: { name: string; email: string } };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pemilik Web (Publisher)', href: '#' },
    { title: 'Pemasukkan Saya', href: '/pemasukkan' },
];

export default function Pemasukkan({ pemasukkan = [], withdrawals = [], stats = { total_saldo: 0, withdrawable_balance: 0, bulan_ini: 0, total_pesanan: 0, active_withdrawal: null, has_bank_info: false }, auth }: Props) {
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<IncomeRecord | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ amount: '' });
    
    // Form for published link
    const { 
        data: publishData, 
        setData: setPublishData, 
        patch: patchPublish, 
        processing: publishProcessing, 
        errors: publishErrors, 
        reset: publishReset 
    } = useForm({ 
        published_link: '',
        published_links: [] as string[],
        published_desc: ''
    });

    const submitWithdrawal = (e: React.FormEvent) => {
        e.preventDefault();
        post('/withdrawals', {
            preserveScroll: true,
            onSuccess: () => { setIsWithdrawModalOpen(false); reset(); },
        });
    };

    const submitPublishLink = (e: React.FormEvent, orderId: number) => {
        e.preventDefault();
        patchPublish(`/orders/${orderId}/publish`, {
            preserveScroll: true,
            onSuccess: () => { 
                setIsDetailModalOpen(false); 
                publishReset(); 
            },
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

                {!stats.has_bank_info && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg shrink-0">
                            <ArrowRight className="w-5 h-5 text-red-600 rotate-90" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-red-800">Informasi Bank Belum Lengkap</p>
                            <p className="text-xs text-red-600 mt-0.5">
                                Harap lengkapi informasi bank Anda di halaman <Link href="/settings/profile" className="font-bold underline">Pengaturan Profil</Link> untuk dapat melakukan penarikan saldo.
                            </p>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 bg-emerald-50 rounded-lg">
                                <Wallet className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Saldo</p>
                                <h3 className="text-lg font-bold text-gray-800">Rp {new Intl.NumberFormat('id-ID').format(stats.total_saldo)}</h3>
                                <p className="text-[10px] text-gray-400">Dapat ditarik: Rp {new Intl.NumberFormat('id-ID').format(stats.withdrawable_balance)}</p>
                            </div>
                        </div>
                        {stats.active_withdrawal ? (
                            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                <p className="text-xs text-amber-700 font-medium mb-2">
                                    Penarikan Rp {new Intl.NumberFormat('id-ID').format(stats.active_withdrawal.amount)} ({stats.active_withdrawal.status.replace('_', ' ')}) sedang diproses.
                                </p>
                                <a href={getWhatsAppUrl(stats.active_withdrawal.amount)} target="_blank" rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors">
                                    <MessageCircle className="w-4 h-4 mr-1.5" /> Hubungi Admin (WA)
                                </a>
                            </div>
                        ) : (
                            <button onClick={() => setIsWithdrawModalOpen(true)} disabled={stats.withdrawable_balance < 50000 || !stats.has_bank_info}
                                className={`w-full flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold text-white transition-colors ${stats.withdrawable_balance >= 50000 && stats.has_bank_info ? 'bg-teal-500 hover:bg-teal-600' : 'bg-gray-300 cursor-not-allowed'}`}>
                                Tarik Saldo <ArrowRight className="w-4 h-4 ml-1.5" />
                            </button>
                        )}
                        {stats.withdrawable_balance < 50000 && !stats.active_withdrawal && (
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

                {/* Withdrawal History Table */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
                    <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="text-base font-semibold text-gray-800">Riwayat Penarikan Dana</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Nominal</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {withdrawals.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-5 py-10 text-center text-sm text-gray-400">
                                            Belum ada riwayat penarikan.
                                        </td>
                                    </tr>
                                ) : (
                                    withdrawals.map((w) => (
                                        <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3.5 text-sm text-gray-600">
                                                {(w as any).created_at ? new Date((w as any).created_at).toLocaleDateString('id-ID') : '-'}
                                            </td>
                                            <td className="px-5 py-3.5 text-right text-sm font-bold text-gray-800">
                                                Rp {new Intl.NumberFormat('id-ID').format(w.amount)}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                                        w.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        w.status === 'on_progress' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        w.status === 'pending' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        'bg-red-50 text-red-600 border-red-100'
                                                    }`}>
                                                        {w.status === 'completed' ? 'Sudah Dicairkan' : 
                                                         w.status === 'on_progress' ? 'On Progress' : 
                                                         w.status === 'pending' ? 'Pending' : 'Ditolak'}
                                                    </span>
                                                    {w.status === 'rejected' && w.rejection_reason && (
                                                        <p className="text-[10px] text-red-500 mt-1 max-w-[150px] italic">
                                                            Ket: {w.rejection_reason}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
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
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Web & Tgl</th>
                                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty/Nominal</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Potongan Admin</th>
                                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Income</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
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
                                                <div className="font-semibold">{item.blog?.domain || '-'}</div>
                                                <div className="text-[10px] text-gray-400 mt-0.5">{new Date(item.created_at).toLocaleDateString('id-ID')}</div>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="text-xs text-gray-400">{item.quantity}x</div>
                                                <div className="text-sm font-semibold text-gray-500">Rp {new Intl.NumberFormat('id-ID').format(item.total)}</div>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <div className="text-[10px] font-bold text-red-400">-{item.admin_fee_percentage}%</div>
                                                <div className="text-xs text-red-500">Rp {new Intl.NumberFormat('id-ID').format(item.admin_fee)}</div>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="text-sm font-bold text-teal-600">Rp {new Intl.NumberFormat('id-ID').format(item.publisher_amount)}</div>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-50 text-gray-600 border border-gray-200">
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedOrder(item);
                                                        setPublishData({
                                                            published_link: item.published_link || '',
                                                            published_links: item.published_links || Array(item.quantity).fill(''),
                                                            published_desc: item.published_desc || ''
                                                        });
                                                        setIsDetailModalOpen(true);
                                                    }}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-teal-500 hover:bg-teal-600 transition-colors"
                                                >
                                                    <Eye className="w-3.5 h-3.5 mr-1" /> Detail
                                                </button>
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
                                <input 
                                    type="text" 
                                    value={data.amount ? Number(data.amount).toLocaleString('id-ID') : ''} 
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setData('amount', val);
                                    }}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-semibold text-gray-800"
                                    placeholder="50.000" required />
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5">Dapat ditarik: Rp {new Intl.NumberFormat('id-ID').format(stats.withdrawable_balance)}</p>
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

            {/* Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white border-gray-100 rounded-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader className="p-6 pb-4 border-b border-gray-50 shrink-0">
                        <DialogTitle className="text-lg font-bold text-gray-800">Detail Pesanan</DialogTitle>
                    </DialogHeader>
                    
                    <div className="p-6 overflow-y-auto">
                        {selectedOrder && (
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Invoice</p>
                                        <p className="text-sm font-bold text-gray-800">{selectedOrder.invoice_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Domain</p>
                                        <p className="text-sm font-medium text-teal-600">{selectedOrder.blog?.domain}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Advertiser</p>
                                        <p className="text-sm font-medium text-gray-700">{selectedOrder.user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Status</p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Source Artikel</p>
                                        <p className="text-sm font-medium text-gray-700">
                                            {selectedOrder.article_source === 'publisher' ? 'Layanan Anda' : 'Pengiklan'} ({selectedOrder.backlink_type})
                                        </p>
                                    </div>
                                    <div className="col-span-2 pt-2 pb-1 border-y border-gray-50 mt-1">
                                        <div className="flex justify-between items-center text-xs mb-1">
                                            <span className="text-gray-400">Harga Total ({selectedOrder.quantity}x)</span>
                                            <span className="font-semibold text-gray-600">Rp {new Intl.NumberFormat('id-ID').format(selectedOrder.total)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs mb-1">
                                            <span className="text-gray-400">Biaya Admin ({selectedOrder.admin_fee_percentage}%)</span>
                                            <span className="font-semibold text-red-500">- Rp {new Intl.NumberFormat('id-ID').format(selectedOrder.admin_fee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-bold pt-1 border-t border-gray-50 mt-1">
                                            <span className="text-teal-700">Pendapatan Bersih</span>
                                            <span className="text-teal-700">Rp {new Intl.NumberFormat('id-ID').format(selectedOrder.publisher_amount)}</span>
                                        </div>
                                    </div>
                                </div>

                                {selectedOrder.description && (
                                    <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Brief dari Advertiser</p>
                                        <p className="text-xs text-blue-700 leading-relaxed">{selectedOrder.description}</p>
                                    </div>
                                )}

                                {/* Target Links */}
                                {selectedOrder.links && selectedOrder.links.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Links & Anchors</p>
                                        <div className="space-y-2">
                                            {selectedOrder.links.map((link, idx) => (
                                                <div key={idx} className="flex flex-col sm:flex-row gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    <div className="flex-1">
                                                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Link</span>
                                                        <a href={link.link} target="_blank" rel="noreferrer" className="text-sm font-medium text-teal-600 hover:underline break-all block">{link.link}</a>
                                                    </div>
                                                    <div className="sm:w-1/3">
                                                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Anchor Text</span>
                                                        <span className="text-sm font-semibold text-gray-700 block bg-white px-2 py-1 rounded border border-gray-100">{link.anchor}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Instructions */}
                                {selectedOrder.instructions && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Instruksi dari Advertiser</p>
                                        <div className="bg-amber-50 border border-amber-100 text-amber-900 text-sm p-3.5 rounded-lg whitespace-pre-wrap">
                                            {selectedOrder.instructions}
                                        </div>
                                    </div>
                                )}

                                {/* Doc Link */}
                                {selectedOrder.doc_link && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Link Dokumen / Artikel</p>
                                        <a href={selectedOrder.doc_link} target="_blank" rel="noreferrer" className="inline-flex p-3 w-full bg-blue-50 border border-blue-100 text-blue-700 text-sm hover:bg-blue-100 transition-colors rounded-lg break-all">
                                            {selectedOrder.doc_link}
                                        </a>
                                    </div>
                                )}

                                {/* Publisher Action Area */}
                                {selectedOrder.status === 'paid' && (
                                    <div className="mt-6 pt-5 border-t border-gray-100">
                                        <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                                            <h4 className="font-semibold text-teal-900 mb-1 text-sm">Update Status ke Published</h4>
                                            <p className="text-xs text-teal-700 mb-3">
                                                {selectedOrder.quantity > 1 
                                                    ? `Masukkan ${selectedOrder.quantity} link artikel yang sudah tayang di web Anda.`
                                                    : 'Masukkan link artikel yang sudah tayang di web Anda.'}
                                            </p>
                                            
                                            <form onSubmit={(e) => submitPublishLink(e, selectedOrder.id)}>
                                                <div className="space-y-3">
                                                    {selectedOrder.quantity > 1 ? (
                                                        Array(selectedOrder.quantity).fill(0).map((_, i) => (
                                                            <div key={i}>
                                                                <input 
                                                                    type="url" 
                                                                    required
                                                                    placeholder={`Link Artikel ${i + 1}`}
                                                                    value={publishData.published_links[i] || ''}
                                                                    onChange={e => {
                                                                        const newLinks = [...publishData.published_links];
                                                                        newLinks[i] = e.target.value;
                                                                        setPublishData('published_links', newLinks);
                                                                    }}
                                                                    className="w-full px-3 py-2 bg-white border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm mb-1"
                                                                />
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div>
                                                            <input 
                                                                type="url" 
                                                                required
                                                                placeholder="https://domain.com/artikel-baru"
                                                                value={publishData.published_link}
                                                                onChange={e => setPublishData('published_link', e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                                                            />
                                                            {publishErrors.published_link && <p className="text-xs text-red-500 mt-1">{publishErrors.published_link}</p>}
                                                        </div>
                                                    )}
                                                    
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-teal-700 uppercase tracking-wider mb-1">Deskripsi Hasil Publikasi (Optional)</label>
                                                        <textarea 
                                                            placeholder="Berikan info tambahan jika perlu (misal: penempatan link, dll)"
                                                            value={publishData.published_desc}
                                                            onChange={e => setPublishData('published_desc', e.target.value)}
                                                            className="w-full px-3 py-2 bg-white border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm min-h-[80px] resize-none"
                                                        ></textarea>
                                                        {publishErrors.published_desc && <p className="text-xs text-red-500 mt-1">{publishErrors.published_desc}</p>}
                                                    </div>
                                                    <button 
                                                        type="submit" 
                                                        disabled={publishProcessing}
                                                        className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        {publishProcessing ? 'Menyimpan...' : 'Simpan & Publish'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {/* Display published link if already published/completed */}
                                {(selectedOrder.status === 'published' || selectedOrder.status === 'completed') && (selectedOrder.published_link || selectedOrder.published_links) && (
                                    <div className="mt-6 pt-5 border-t border-gray-100">
                                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Link Telah Dipublish</p>
                                        <div className="space-y-2">
                                            {selectedOrder.published_links && selectedOrder.published_links.length > 0 ? (
                                                selectedOrder.published_links.map((link, i) => (
                                                    <a key={i} href={link} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 w-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs hover:bg-emerald-100 transition-colors rounded-lg break-all font-medium">
                                                        <ArrowUpRight className="w-3 h-3 shrink-0" />
                                                        {link}
                                                    </a>
                                                ))
                                            ) : (
                                                <a href={selectedOrder.published_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 w-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs hover:bg-emerald-100 transition-colors rounded-lg break-all font-medium">
                                                    <ArrowUpRight className="w-3 h-3 shrink-0" />
                                                    {selectedOrder.published_link}
                                                </a>
                                            )}
                                        </div>

                                        {selectedOrder.published_desc && (
                                            <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Deskripsi Hasil Anda</p>
                                                <p className="text-xs text-gray-600 italic whitespace-pre-wrap">{selectedOrder.published_desc}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
