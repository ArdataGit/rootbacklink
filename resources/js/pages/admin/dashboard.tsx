import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Database, Shield, Image as ImageIcon, LayoutGrid, Clock } from 'lucide-react';

interface Stats {
    total_categories: number;
    total_banners: number;
    total_blogs: number;
    pending_blogs: number;
}

interface Props {
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administrator', href: '#' },
    { title: 'Dashboard', href: '/dashboard' },
];

export default function AdminDashboard({ stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                            Selamat Datang, Administrator!
                        </h1>
                        <p className="text-teal-50 text-base max-w-2xl">
                            Ringkasan aktivitas dan performa platform backlink order hari ini.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 -translate-y-8 translate-x-1/4 opacity-10 pointer-events-none">
                        <Shield className="w-48 h-48" />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Blog</h3>
                            <div className="bg-teal-50 p-2 rounded-lg">
                                <LayoutGrid className="w-5 h-5 text-teal-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stats.total_blogs}</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-amber-100 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menunggu Persetujuan</h3>
                            <div className="bg-amber-50 p-2 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stats.pending_blogs}</p>
                        {stats.pending_blogs > 0 && (
                            <p className="text-xs text-amber-600 mt-1 font-medium">Butuh tindakan segera</p>
                        )}
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Master Kategori</h3>
                            <div className="bg-emerald-50 p-2 rounded-lg">
                                <Database className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stats.total_categories}</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Banner</h3>
                            <div className="bg-violet-50 p-2 rounded-lg">
                                <ImageIcon className="w-5 h-5 text-violet-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stats.total_banners}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Aksi Cepat</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link href="/admin/blogs" className="group flex flex-col items-center justify-center bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all">
                            <div className="bg-gray-50 p-4 rounded-xl group-hover:bg-teal-50 transition-colors mb-3">
                                <Shield className="w-8 h-8 text-gray-500 group-hover:text-teal-600" />
                            </div>
                            <span className="font-semibold text-gray-800 group-hover:text-teal-600">Review Blog</span>
                            <p className="text-xs text-center text-gray-400 mt-1.5">Setujui atau tolak pengajuan web baru</p>
                        </Link>

                        <Link href="/admin/categories" className="group flex flex-col items-center justify-center bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all">
                            <div className="bg-gray-50 p-4 rounded-xl group-hover:bg-emerald-50 transition-colors mb-3">
                                <Database className="w-8 h-8 text-gray-500 group-hover:text-emerald-600" />
                            </div>
                            <span className="font-semibold text-gray-800 group-hover:text-emerald-600">Kelola Kategori</span>
                            <p className="text-xs text-center text-gray-400 mt-1.5">Tambah, ubah, dan hapus kategori</p>
                        </Link>

                        <Link href="/admin/banners" className="group flex flex-col items-center justify-center bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md hover:border-violet-200 transition-all">
                            <div className="bg-gray-50 p-4 rounded-xl group-hover:bg-violet-50 transition-colors mb-3">
                                <ImageIcon className="w-8 h-8 text-gray-500 group-hover:text-violet-600" />
                            </div>
                            <span className="font-semibold text-gray-800 group-hover:text-violet-600">Pengaturan Banner</span>
                            <p className="text-xs text-center text-gray-400 mt-1.5">Upload dan atur banner promosi</p>
                        </Link>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
