import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Order } from '@/types';
import { Receipt, Clock, CheckCircle2, XCircle, Search, Globe, User, Eye, ChevronDown, ExternalLink, Package } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface AdminOrder extends Order {
    quantity: number;
    admin_fee: number;
    admin_fee_percentage: number;
    publisher_amount: number;
    description?: string;
    published_links?: string[];
}

interface Props {
    orders: AdminOrder[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administrator', href: '#' },
    { title: 'Data Transaksi', href: '/admin/orders' },
];

const statusOptions = [
    { value: 'unpaid', label: 'Belum Bayar', color: 'bg-gray-50 text-gray-700 border-gray-200' },
    { value: 'paid', label: 'Sudah Bayar', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'published', label: 'Sudah Dipost', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    { value: 'completed', label: 'Selesai', color: 'bg-teal-50 text-teal-700 border-teal-200' },
];

export default function AdminOrders({ orders = [] }: Props) {
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = orders.filter(order => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            order.invoice_id?.toLowerCase().includes(q) ||
            order.blog?.domain?.toLowerCase().includes(q) ||
            order.user?.name?.toLowerCase().includes(q)
        );
    });

    const handleStatusChange = (orderId: number, newStatus: string) => {
        router.patch(`/admin/orders/${orderId}/status`, { status: newStatus }, {
            preserveScroll: true,
        });
    };

    const handlePublishedLinkSave = (orderId: number, link: string) => {
        router.patch(`/admin/orders/${orderId}/status`, {
            status: 'published',
            published_link: link,
        }, { preserveScroll: true });
    };

    const getStatusBadge = (status: string) => {
        const opt = statusOptions.find(s => s.value === status);
        return opt || statusOptions[0];
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return <CheckCircle2 className="w-3.5 h-3.5" />;
            case 'published': return <ExternalLink className="w-3.5 h-3.5" />;
            case 'completed': return <Package className="w-3.5 h-3.5" />;
            case 'unpaid': return <Clock className="w-3.5 h-3.5" />;
            default: return <Clock className="w-3.5 h-3.5" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Transaksi - Admin" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Data Transaksi</h1>
                        <p className="mt-1 text-sm text-gray-500">Kelola dan ubah status semua transaksi platform.</p>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Cari invoice, domain, user..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all w-64"
                        />
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Transaksi</p>
                        <p className="text-xl font-bold text-gray-800">{orders.length}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Belum Bayar</p>
                        <p className="text-xl font-bold text-amber-600">{orders.filter(o => o.status === 'unpaid').length}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Sudah Bayar</p>
                        <p className="text-xl font-bold text-emerald-600">{orders.filter(o => o.status === 'paid').length}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Nominal</p>
                        <p className="text-xl font-bold text-gray-800">Rp {new Intl.NumberFormat('id-ID').format(orders.filter(o => o.status !== 'unpaid').reduce((sum, o) => sum + Number(o.total), 0))}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">No</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User/Domain</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty/Nominal</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee Admin</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Publisher</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-16 text-center">
                                            <Receipt className="w-10 h-10 mx-auto text-gray-200 mb-3" />
                                            <p className="text-sm text-gray-400">Tidak ada data transaksi ditemukan</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order, index) => {
                                        const badge = getStatusBadge(order.status);
                                        return (
                                            <tr key={order.id} className="hover:bg-teal-50/30 transition-colors">
                                                <td className="px-5 py-3.5 text-sm text-gray-500">{index + 1}</td>
                                                <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{order.invoice_id}</td>
                                                <td className="px-5 py-3.5 text-sm">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                        <span className="font-medium">{order.user?.name || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                                                        <span className="text-gray-500 text-xs">{order.blog?.domain || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <div className="text-[10px] text-gray-400 font-bold">{order.quantity}x</div>
                                                    <div className="text-sm font-bold text-gray-800">
                                                        Rp {Number(order.total).toLocaleString('id-ID')}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <div className="text-[10px] text-red-400 font-bold">-{order.admin_fee_percentage}%</div>
                                                    <div className="text-xs text-red-500 font-semibold">
                                                        Rp {Number(order.admin_fee || 0).toLocaleString('id-ID')}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <div className="text-sm font-bold text-teal-600">
                                                        Rp {Number(order.publisher_amount || 0).toLocaleString('id-ID')}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <div className="relative inline-block">
                                                        <select
                                                            value={order.status}
                                                            onChange={e => handleStatusChange(order.id, e.target.value)}
                                                            className={`appearance-none pl-3 pr-8 py-1 rounded-full text-xs font-semibold border cursor-pointer ${badge.color} focus:ring-2 focus:ring-teal-500 focus:outline-none`}
                                                        >
                                                            {statusOptions.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-40" />
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-center text-xs text-gray-500">
                                                    {order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <button
                                                        onClick={() => { setSelectedOrder(order); setDetailOpen(true); }}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5 mr-1" /> Detail
                                                    </button>
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
                <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white border-gray-100 rounded-2xl">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-lg font-bold text-gray-800">Detail Transaksi</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="p-6 pt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Invoice</p>
                                    <p className="text-sm font-bold text-gray-800">{selectedOrder.invoice_id}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Domain</p>
                                    <p className="text-sm font-medium text-gray-700">{selectedOrder.blog?.domain}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Advertiser</p>
                                    <p className="text-sm font-medium text-gray-700">{selectedOrder.user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Quantity</p>
                                    <p className="text-sm font-bold text-gray-800">{selectedOrder.quantity}x</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Total Bayar</p>
                                    <p className="text-sm font-bold text-gray-800">Rp {Number(selectedOrder.total).toLocaleString('id-ID')}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Potongan Admin ({selectedOrder.admin_fee_percentage}%)</p>
                                    <p className="text-sm font-bold text-red-500">- Rp {Number(selectedOrder.admin_fee || 0).toLocaleString('id-ID')}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Bersih Publisher</p>
                                    <p className="text-sm font-bold text-teal-600">Rp {Number(selectedOrder.publisher_amount || 0).toLocaleString('id-ID')}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Source Artikel</p>
                                    <p className="text-sm font-medium text-gray-700">{selectedOrder.article_source === 'publisher' ? 'Pemilik Web' : 'Pengiklan'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Status</p>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(selectedOrder.status).color}`}>
                                        {getStatusIcon(selectedOrder.status)}
                                        {getStatusBadge(selectedOrder.status).label}
                                    </span>
                                </div>
                            </div>

                             {selectedOrder.description && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Deskripsi/Detail</p>
                                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">{selectedOrder.description}</p>
                                </div>
                            )}

                            {selectedOrder.instructions && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Instruksi Brief</p>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedOrder.instructions}</p>
                                </div>
                            )}

                            {selectedOrder.doc_link && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Link Dokumen</p>
                                    <a href={selectedOrder.doc_link} target="_blank" rel="noreferrer" className="text-sm text-teal-600 hover:underline break-all">{selectedOrder.doc_link}</a>
                                </div>
                            )}

                            {selectedOrder.notes && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Catatan</p>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                                </div>
                            )}

                            {selectedOrder.links && selectedOrder.links.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Links</p>
                                    <div className="space-y-2">
                                        {selectedOrder.links.map((link: any, idx: number) => (
                                            <div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded-lg text-sm">
                                                <div className="flex-1">
                                                    <span className="text-gray-400 text-xs">Link:</span>
                                                    <p className="text-gray-700 font-medium break-all">{link.link}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <span className="text-gray-400 text-xs">Anchor:</span>
                                                    <p className="text-gray-700 font-medium">{link.anchor}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                             {(selectedOrder.published_link || (selectedOrder.published_links && selectedOrder.published_links.length > 0)) && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Published Links</p>
                                    <div className="space-y-1.5">
                                        {selectedOrder.published_links && selectedOrder.published_links.length > 0 ? (
                                            selectedOrder.published_links.map((link, i) => (
                                                <a key={i} href={link} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 w-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] hover:bg-emerald-100 transition-colors rounded-lg break-all font-medium">
                                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                                    {link}
                                                </a>
                                            ))
                                        ) : (
                                            <a href={selectedOrder.published_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 w-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] hover:bg-emerald-100 transition-colors rounded-lg break-all font-medium">
                                                <ExternalLink className="w-3 h-3 shrink-0" />
                                                {selectedOrder.published_link}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

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
        </AppLayout>
    );
}
