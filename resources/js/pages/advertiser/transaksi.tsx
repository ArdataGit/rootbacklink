import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Order } from '@/types';
import { Receipt, Clock, CheckCircle2, XCircle, Search, Filter, ExternalLink } from 'lucide-react';

interface Props {
    orders: Order[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengiklan (Advertiser)', href: '#' },
    { title: 'Transaksi Saya', href: '/transaksi' },
];

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Eye, MapPin, Building2, User as UserIcon, Globe, FileText, MessageSquare } from 'lucide-react';

export default function Transaksi({ orders = [] }: Props) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'paid':
            case 'completed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'published':
                return 'bg-sky-50 text-sky-700 border-sky-200';
            case 'pending':
            case 'unpaid':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'failed':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'paid': return 'Sudah Dibayar';
            case 'unpaid': return 'Belum Dibayar';
            case 'pending': return 'Pending';
            case 'failed': return 'Gagal';
            case 'published': return 'Sudah Dipost';
            case 'completed': return 'Selesai';
            default: return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': 
            case 'completed': return <CheckCircle2 className="w-3.5 h-3.5" />;
            case 'published': return <ExternalLink className="w-3.5 h-3.5" />;
            case 'pending':
            case 'unpaid': return <Clock className="w-3.5 h-3.5" />;
            case 'failed': return <XCircle className="w-3.5 h-3.5" />;
            default: return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Transaksi" />
            
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Transaksi Saya</h1>
                        <p className="mt-1 text-sm text-gray-500">Kelola dan pantau status pemesanan backlink Anda.</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500" />
                            <input 
                                type="text" 
                                placeholder="Cari Invoice..." 
                                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all w-48"
                            />
                         </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-widest text-gray-400 w-14">No</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-widest text-gray-400">Transaksi ID</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-widest text-gray-400">Detail Pesanan</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-black uppercase tracking-widest text-gray-400">Link Hasil</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-black uppercase tracking-widest text-gray-400">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <Receipt className="w-12 h-12 text-gray-200 mb-4" />
                                                <p className="text-sm text-gray-400 font-bold italic">Belum ada data transaksi ditemukan</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order, index) => (
                                        <tr key={order.id} className="hover:bg-teal-50/20 transition-colors group">
                                            <td className="px-5 py-5 text-sm text-gray-400 font-bold tracking-tighter">
                                                {(index + 1).toString().padStart(2, '0')}
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="text-sm font-black text-gray-800 tracking-tight">{order.invoice_id}</div>
                                                <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                                                    {order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                </div>
                                            </td>
                                            <td className="px-5 py-5">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="text-sm font-black text-teal-600 hover:text-teal-700 transition-colors cursor-default">{order.blog?.domain}</span>
                                                    <span className="px-1.5 py-0.5 bg-gray-100 text-[9px] rounded font-black text-gray-400 uppercase tracking-tighter">{order.backlink_type}</span>
                                                </div>
                                                <div className="text-[11px] text-gray-400 font-medium italic line-clamp-1 max-w-[200px]">
                                                    {order.description || "Tanpa deskripsi tambahan"}
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-5 text-center">
                                                {order.published_link ? (
                                                    <a href={order.published_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg text-xs font-black hover:bg-emerald-500 hover:text-white transition-all">
                                                        Visit Link <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-[11px] font-bold text-gray-300 italic uppercase">Processing...</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => { setSelectedOrder(order); setDetailOpen(true); }}
                                                        className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                                        title="Detail Pesanan"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {order.status === 'unpaid' && order.tripay_checkout_url && (
                                                        <a 
                                                            href={order.tripay_checkout_url} 
                                                            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/30 transition-all active:scale-95"
                                                        >
                                                            Pay Now
                                                        </a>
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

                {/* Help Banner */}
                <div className="mt-8 p-6 bg-gradient-to-br from-gray-900 to-neutral-800 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-white/5 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/10">
                            <MessageSquare className="w-6 h-6 text-teal-400" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-white tracking-tight">Butuh Bantuan Teknis?</h4>
                            <p className="text-sm text-gray-400 font-medium">Tim Support kami siap membantu kendala transaksi Anda 24/7.</p>
                        </div>
                    </div>
                    <button className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-teal-500/20 relative z-10 hover:-translate-y-1 active:scale-95">
                        Hubungi Admin
                    </button>
                </div>
            </div>

            {/* Detail Modal */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white border-none rounded-3xl shadow-2xl">
                    <DialogHeader className="p-8 pb-4 bg-teal-600 relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <DialogTitle className="text-xl font-black text-white relative z-10">Invoice: {selectedOrder?.invoice_id}</DialogTitle>
                        <p className="text-teal-100 text-xs font-bold uppercase tracking-widest relative z-10">{selectedOrder?.blog?.domain}</p>
                    </DialogHeader>
                    
                    {selectedOrder && (
                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <section>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><FileText className="w-3 h-3" /> Jenis Produk</p>
                                    <p className="text-sm font-black text-gray-800 uppercase tracking-tighter">{selectedOrder.backlink_type === 'authority' ? 'Backlink Authority' : 'Backlink Sidebar'}</p>
                                </section>
                                <section>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Status</p>
                                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(selectedOrder.status)}`}>
                                        {getStatusLabel(selectedOrder.status)}
                                    </span>
                                </section>
                                <section>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Penulis Artikel</p>
                                    <p className="text-sm font-bold text-gray-700">{selectedOrder.article_source === 'publisher' ? 'Layanan Publisher' : 'Disediakan Advertiser'}</p>
                                </section>
                                <section>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Total Pembayaran</p>
                                    <p className="text-sm font-black text-teal-600">Rp {Number(selectedOrder.total).toLocaleString('id-ID')}</p>
                                </section>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Brief Section */}
                            {(selectedOrder.description || selectedOrder.instructions || selectedOrder.doc_link) && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest px-3 py-1 bg-gray-50 border-l-4 border-teal-500 w-fit">Data Brief Anda</h4>
                                    
                                    {selectedOrder.description && (
                                        <div>
                                            <p className="text-[11px] font-bold text-gray-400 mb-1">Detail Brief Pesanan:</p>
                                            <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-600 leading-relaxed font-medium">
                                                {selectedOrder.description}
                                            </div>
                                        </div>
                                    )}

                                    {selectedOrder.instructions && (
                                        <div>
                                            <p className="text-[11px] font-bold text-gray-400 mb-1">Instruksi Khusus:</p>
                                            <div className="p-4 bg-amber-50 rounded-2xl text-xs text-amber-700 leading-relaxed font-bold">
                                                {selectedOrder.instructions}
                                            </div>
                                        </div>
                                    )}

                                    {selectedOrder.doc_link && (
                                        <a href={selectedOrder.doc_link} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-teal-50 rounded-2xl border border-teal-100 group hover:bg-teal-600 transition-all">
                                            <span className="text-xs font-black text-teal-700 group-hover:text-white transition-colors">Lihat Dokumen Artikel</span>
                                            <ExternalLink className="w-4 h-4 text-teal-500 group-hover:text-white transition-colors" />
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Result Section */}
                            {(selectedOrder.status === 'published' || selectedOrder.status === 'completed') && (
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest px-3 py-1 bg-emerald-50 border-l-4 border-emerald-500 w-fit">Hasil Publikasi</h4>
                                    
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-bold text-emerald-600 mb-1 tracking-tight italic">Link yang sudah aktif:</p>
                                        {selectedOrder.published_links && selectedOrder.published_links.length > 0 ? (
                                            selectedOrder.published_links.map((link, i) => (
                                                <a key={i} href={link} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[11px] font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all break-all">
                                                    {link} <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ))
                                        ) : selectedOrder.published_link && (
                                            <a href={selectedOrder.published_link} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[11px] font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all break-all">
                                                {selectedOrder.published_link} <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>

                                    {selectedOrder.published_desc && (
                                        <div>
                                            <p className="text-[11px] font-bold text-gray-400 mb-1">Deskripsi Hasil dari Publisher:</p>
                                            <div className="p-4 bg-sky-50 rounded-2xl text-xs text-sky-700 leading-relaxed font-bold border border-sky-100">
                                                {selectedOrder.published_desc}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-4 flex justify-end">
                                <DialogClose asChild>
                                    <button className="px-6 py-2.5 text-xs font-black uppercase text-gray-400 hover:text-gray-800 transition-colors">Close View</button>
                                </DialogClose>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

