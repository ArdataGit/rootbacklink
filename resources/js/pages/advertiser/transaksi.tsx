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

export default function Transaksi({ orders = [] }: Props) {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
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
            default: return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return <CheckCircle2 className="w-3.5 h-3.5" />;
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
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-14">No</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaksi ID</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Domain</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Pembayaran</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Publisher</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-16 text-center">
                                            <Receipt className="w-10 h-10 mx-auto text-gray-200 mb-3" />
                                            <p className="text-sm text-gray-400 font-medium">Belum ada data transaksi</p>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order, index) => (
                                        <tr key={order.id} className="hover:bg-teal-50/30 transition-colors">
                                            <td className="px-5 py-4 text-sm text-gray-500 font-medium">
                                                {index + 1}
                                            </td>
                                            <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                                                {order.invoice_id}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-600 font-medium">
                                                {order.blog?.domain}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {order.published_link ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Sudah Dipost
                                                        </span>
                                                        <a href={order.published_link} target="_blank" rel="noreferrer" className="text-teal-600 hover:text-teal-700 hover:underline inline-flex items-center gap-1 text-xs font-medium">
                                                            Lihat <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200">
                                                        <Clock className="w-3 h-3" />
                                                        Menunggu Diproses
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Help Banner */}
                <div className="mt-6 p-5 bg-teal-50/50 rounded-xl border border-teal-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-teal-100 shadow-sm">
                            <Receipt className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-800">Butuh bantuan transaksi?</h4>
                            <p className="text-xs text-gray-500">Hubungi Support kami jika ada kendala dengan pembayaran.</p>
                        </div>
                    </div>
                    <button className="px-5 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all">
                        Hubungi Kami
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
