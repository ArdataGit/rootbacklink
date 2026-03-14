import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Wallet, Clock, CheckCircle2, XCircle, Search, User, Eye, ChevronDown, Banknote, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface Withdrawal {
    id: number;
    user_id: number;
    amount: number;
    status: string;
    bank_name: string;
    bank_account_number: string;
    bank_account_name: string;
    rejection_reason?: string | null;
    created_at: string;
    user?: {
        name: string;
        email: string;
        balance: number;
        whatsapp?: string;
    };
}

interface Props {
    withdrawals: Withdrawal[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administrator', href: '#' },
    { title: 'Permintaan Penarikan', href: '/admin/withdrawals' },
];

const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'on_progress', label: 'On Progress', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'completed', label: 'Sudah Dicairkan', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'rejected', label: 'Ditolak', color: 'bg-red-50 text-red-700 border-red-200' },
];

export default function AdminWithdrawals({ withdrawals = [] }: Props) {
    const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredWithdrawals = withdrawals.filter(w => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            w.user?.name?.toLowerCase().includes(q) ||
            w.bank_name?.toLowerCase().includes(q) ||
            w.bank_account_number?.toLowerCase().includes(q)
        );
    });

    const handleStatusChange = (id: number, newStatus: string) => {
        if (newStatus === 'rejected') {
            const w = withdrawals.find(x => x.id === id);
            if (w) {
                setSelectedWithdrawal(w);
                setRejectionReason(w.rejection_reason || '');
                setRejectionModalOpen(true);
            }
            return;
        }

        router.patch(`/admin/withdrawals/${id}`, { status: newStatus }, {
            preserveScroll: true,
        });
    };

    const submitRejection = () => {
        if (!selectedWithdrawal) return;
        router.patch(`/admin/withdrawals/${selectedWithdrawal.id}`, { 
            status: 'rejected',
            rejection_reason: rejectionReason 
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setRejectionModalOpen(false);
                setRejectionReason('');
            }
        });
    };

    const getWhatsAppUrl = (w: Withdrawal) => {
        let phone = (w.user?.whatsapp || '').replace(/\D/g, '');
        if (phone.startsWith('0')) {
            phone = '62' + phone.substring(1);
        }
        const statusText = w.status === 'on_progress' ? 'Sedang Diproses' : 'Telah Dicairkan';
        const msg = `Halo ${w.user?.name},\n\nUpdate penarikan saldo Anda sebesar *Rp ${w.amount.toLocaleString('id-ID')}* statusnya sekarang: *${statusText}*.\n\nTerima kasih.`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    };

    const getStatusBadge = (status: string) => {
        const opt = statusOptions.find(s => s.value === status);
        return opt || statusOptions[0];
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permintaan Penarikan - Admin" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Permintaan Penarikan</h1>
                        <p className="mt-1 text-sm text-gray-500">Kelola permintaan pencairan dana dari user.</p>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Cari nama, bank, norek..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all w-64"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bank</th>
                                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Nominal</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredWithdrawals.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-16 text-center">
                                            <Wallet className="w-10 h-10 mx-auto text-gray-200 mb-3" />
                                            <p className="text-sm text-gray-400">Tidak ada permintaan penarikan ditemukan</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredWithdrawals.map((w) => {
                                        const badge = getStatusBadge(w.status);
                                        return (
                                            <tr key={w.id} className="hover:bg-teal-50/30 transition-colors">
                                                <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                                                    {new Date(w.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-5 py-3.5 text-sm">
                                                    <div className="font-semibold text-gray-800">{w.user?.name || '-'}</div>
                                                    <div className="text-[10px] text-gray-400">{w.user?.email || '-'}</div>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm">
                                                    <div className="font-medium text-gray-700">{w.bank_name}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{w.bank_account_number}</div>
                                                </td>
                                                <td className="px-5 py-3.5 text-right font-bold text-gray-800">
                                                    Rp {Number(w.amount).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <div className="relative inline-block">
                                                        <select
                                                            value={w.status}
                                                            onChange={e => handleStatusChange(w.id, e.target.value)}
                                                            className={`appearance-none pl-3 pr-8 py-1 rounded-full text-[10px] font-bold border cursor-pointer ${badge.color} focus:ring-2 focus:ring-teal-500 focus:outline-none uppercase`}
                                                        >
                                                            {statusOptions.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-40" />
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-center space-x-2 whitespace-nowrap">
                                                    <button
                                                        onClick={() => { setSelectedWithdrawal(w); setDetailOpen(true); }}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5 mr-1" /> Rekening
                                                    </button>
                                                    {(w.status === 'on_progress' || w.status === 'completed') && (
                                                        <a
                                                            href={getWhatsAppUrl(w)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-green-500 hover:bg-green-600 transition-colors"
                                                        >
                                                            <MessageCircle className="w-3.5 h-3.5 mr-1" /> WhatsApp
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border-gray-100 rounded-2xl">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-lg font-bold text-gray-800 flex items-center">
                            <Banknote className="w-5 h-5 mr-2 text-teal-600" /> Detail Rekening User
                        </DialogTitle>
                    </DialogHeader>
                    {selectedWithdrawal && (
                        <div className="p-6 pt-4 space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Nama Bank</p>
                                    <p className="text-sm font-bold text-gray-800 uppercase">{selectedWithdrawal.bank_name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Nomor Rekening</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-bold text-teal-700 font-mono tracking-wider">{selectedWithdrawal.bank_account_number}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Atas Nama</p>
                                    <p className="text-sm font-bold text-gray-800">{selectedWithdrawal.bank_account_name}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Saldo User Sekarang (Persistence):</span>
                                    <span className="font-bold text-gray-800">Rp {Number(selectedWithdrawal.user?.balance || 0).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Nominal Penarikan:</span>
                                    <span className="font-bold text-red-600">Rp {Number(selectedWithdrawal.amount).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                            
                            <div className="pt-3 border-t border-gray-100 flex justify-end">
                                <DialogClose asChild>
                                    <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                        Tutup
                                    </button>
                                </DialogClose>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            {/* Rejection Modal */}
            <Dialog open={rejectionModalOpen} onOpenChange={setRejectionModalOpen}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border-gray-100 rounded-2xl">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-lg font-bold text-gray-800">Alasan Penolakan</DialogTitle>
                    </DialogHeader>
                    <div className="p-6 pt-4 space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Berikan alasan penarikan ditolak:</label>
                            <textarea
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                rows={4}
                                placeholder="Contoh: Nomor rekening tidak valid, Nama tidak sesuai, dsb."
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setRejectionModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg">Batal</button>
                            <button onClick={submitRejection} disabled={!rejectionReason.trim()} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50">
                                Simpan Penolakan
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
