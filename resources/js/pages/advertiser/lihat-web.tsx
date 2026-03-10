import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Blog, Category } from '@/types';
import { Search, Filter, Globe, BarChart, Tag, ShoppingCart, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
    blogs: Blog[];
    categories: Category[];
    filters: {
        search?: string;
        category_id?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengiklan (Advertiser)', href: '#' },
    { title: 'Lihat Semua Web', href: '/lihat-web' },
];

export default function LihatWeb({ blogs, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');

    const handleSearch = () => {
        router.get('/lihat-web', { search, category_id: categoryId }, { preserveState: true });
    };

    useEffect(() => {
        if (categoryId !== (filters.category_id || '')) {
            handleSearch();
        }
    }, [categoryId]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Katalog Web Backlink" />
            
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Katalog Website Backlink</h1>
                    <p className="mt-1.5 text-gray-500 text-sm">Temukan website berkualitas tinggi untuk meningkatkan otoritas dan peringkat SEO Anda.</p>
                </div>

                {/* Filter */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-6 relative">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Cari Domain</label>
                            <div className="relative group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleSearch()}
                                    placeholder="Ketik nama domain..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Kategori</label>
                            <select
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm appearance-none"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <button
                                onClick={handleSearch}
                                className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Catalog Grid */}
                {blogs.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                        <Globe className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                        <h3 className="text-base font-semibold text-gray-600 mb-1">Tidak ditemukan website</h3>
                        <p className="text-sm text-gray-400">Coba cari dengan kata kunci lain atau pilih kategori yang berbeda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {blogs.map(blog => (
                            <div key={blog.id} className="group bg-white rounded-2xl border border-gray-100 p-5 transition-all hover:shadow-md hover:border-teal-200">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
                                        <Tag className="w-3 h-3 mr-1" />
                                        {blog.category?.name}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors break-all">
                                    {blog.domain}
                                </h3>

                                <div className="space-y-2.5 mb-5">
                                    <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl">
                                        <div className="text-center">
                                            <div className="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">DA</div>
                                            <div className="text-base font-bold text-teal-600">{blog.da}</div>
                                        </div>
                                        <div className="text-center border-x border-gray-200">
                                            <div className="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">PA</div>
                                            <div className="text-base font-bold text-sky-600">{blog.pa}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">SS</div>
                                            <div className="text-base font-bold text-rose-500">{blog.ss}%</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl">
                                        <div className="text-center border-r border-gray-200">
                                            <div className="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Traffic / Bln</div>
                                            <div className="text-sm font-bold text-amber-600">{blog.traffic >= 1000 ? `${(blog.traffic/1000).toFixed(1)}k` : blog.traffic}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Google Index</div>
                                            <div className="text-sm font-bold text-emerald-600">{blog.indexing === 'yes' ? 'Ya' : 'Tidak'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div>
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Harga Jual</span>
                                        <div className="text-lg font-bold text-gray-800">Rp {blog.price.toLocaleString()}</div>
                                    </div>
                                    <button 
                                        onClick={() => router.get(`/checkout/${blog.id}`)}
                                        className="h-11 w-11 rounded-xl bg-teal-500 text-white flex items-center justify-center hover:bg-teal-600 transition-colors shadow-sm"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
