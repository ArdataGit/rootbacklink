import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Blog, Category } from '@/types';
import { Search, Filter, Globe, BarChart, Tag, ShoppingCart, ArrowUpDown, ArrowUp, ArrowDown, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface Props {
    blogs: Blog[];
    categories: Category[];
    filters: {
        search?: string;
        category_id?: string;
        da_min?: string;
        da_max?: string;
        pa_min?: string;
        pa_max?: string;
        ss_min?: string;
        ss_max?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengiklan (Advertiser)', href: '#' },
    { title: 'Lihat Semua Web', href: '/lihat-web' },
];

export default function LihatWeb({ blogs = [], categories = [], filters = {} }: Props) {
    if (!filters) filters = {};
    
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [daMin, setDaMin] = useState(filters.da_min || '');
    const [daMax, setDaMax] = useState(filters.da_max || '');
    const [paMin, setPaMin] = useState(filters.pa_min || '');
    const [paMax, setPaMax] = useState(filters.pa_max || '');
    const [ssMin, setSsMin] = useState(filters.ss_min || '');
    const [ssMax, setSsMax] = useState(filters.ss_max || '');
    const [sort, setSort] = useState(filters.sort || 'created_at');
    const [direction, setDirection] = useState<'asc'|'desc'>(filters.direction || 'desc');

    // UI States
    const [selectedBlogForPrice, setSelectedBlogForPrice] = useState<Blog | null>(null);
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

    const handleSearch = () => {
        router.get('/lihat-web', { 
            search, category_id: categoryId,
            da_min: daMin, da_max: daMax,
            pa_min: paMin, pa_max: paMax,
            ss_min: ssMin, ss_max: ssMax,
            sort, direction
        }, { preserveState: true });
    };

    const handleSort = (field: string) => {
        const newDirection = sort === field && direction === 'asc' ? 'desc' : 'asc';
        setSort(field);
        setDirection(newDirection);
        router.get('/lihat-web', { 
            search, category_id: categoryId,
            da_min: daMin, da_max: daMax,
            pa_min: paMin, pa_max: paMax,
            ss_min: ssMin, ss_max: ssMax,
            sort: field, direction: newDirection
        }, { preserveState: true });
    };

    const resetFilters = () => {
        setSearch(''); setCategoryId('');
        setDaMin(''); setDaMax('');
        setPaMin(''); setPaMax('');
        setSsMin(''); setSsMax('');
        router.get('/lihat-web', { sort: 'created_at', direction: 'desc' }, { preserveState: true });
    };

    const getMinPrice = (blog: Blog) => {
        const prices = [];
        if (blog.has_backlink_authority) {
            if (blog.price_authority_advertiser) prices.push(Number(blog.price_authority_advertiser));
            if (blog.price_authority_publisher) prices.push(Number(blog.price_authority_publisher));
        }
        if (blog.has_backlink_sidebar && blog.price_sidebar) prices.push(Number(blog.price_sidebar));
        return prices.length > 0 ? Math.min(...prices) : 0;
    };

    const SortIcon = ({ field }: { field: string }) => {
        if (sort !== field) return <ArrowUpDown className="w-3 h-3 ml-1 inline text-gray-400" />;
        return direction === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 inline text-teal-600" /> : <ArrowDown className="w-3 h-3 ml-1 inline text-teal-600" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Katalog Web Backlink" />
            
            <div className="p-4 sm:p-6 lg:p-8 w-full max-w-[1400px] mx-auto">
                <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Katalog Website Backlink</h1>
                        <p className="mt-1.5 text-gray-500 text-sm">Temukan website berkualitas tinggi untuk meningkatkan otoritas dan peringkat SEO Anda.</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5 relative">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Cari Domain</label>
                            <div className="relative group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleSearch()}
                                    placeholder="Ketik nama domain..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Kategori</label>
                            <select
                                value={categoryId}
                                onChange={e => { setCategoryId(e.target.value); }}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm appearance-none"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-4 flex items-end gap-2">
                            <button onClick={handleSearch} className="flex-1 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                                <Filter className="w-4 h-4" /> Terapkan Filter
                            </button>
                            <button onClick={resetFilters} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-lg transition-colors flex items-center justify-center text-sm">
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                            <span className="text-xs font-semibold text-gray-500 w-8 text-center shrink-0">DA</span>
                            <input type="number" placeholder="Min" value={daMin} onChange={e => setDaMin(e.target.value)} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-xs focus:ring-1 focus:ring-teal-500" />
                            <span className="text-gray-400">-</span>
                            <input type="number" placeholder="Max" value={daMax} onChange={e => setDaMax(e.target.value)} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-xs focus:ring-1 focus:ring-teal-500" />
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                            <span className="text-xs font-semibold text-gray-500 w-8 text-center shrink-0">PA</span>
                            <input type="number" placeholder="Min" value={paMin} onChange={e => setPaMin(e.target.value)} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-xs focus:ring-1 focus:ring-teal-500" />
                            <span className="text-gray-400">-</span>
                            <input type="number" placeholder="Max" value={paMax} onChange={e => setPaMax(e.target.value)} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-xs focus:ring-1 focus:ring-teal-500" />
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                            <span className="text-xs font-semibold text-gray-500 w-8 text-center shrink-0">SS %</span>
                            <input type="number" placeholder="Min" value={ssMin} onChange={e => setSsMin(e.target.value)} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-xs focus:ring-1 focus:ring-teal-500" />
                            <span className="text-gray-400">-</span>
                            <input type="number" placeholder="Max" value={ssMax} onChange={e => setSsMax(e.target.value)} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-xs focus:ring-1 focus:ring-teal-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-5 py-3 text-left">
                                        <button className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider group hover:text-teal-600" onClick={() => handleSort('domain')}>
                                            Domain <SortIcon field="domain" />
                                        </button>
                                    </th>
                                    <th scope="col" className="px-5 py-3 text-center">
                                        <button className="flex items-center justify-center mx-auto text-xs font-semibold text-gray-500 uppercase tracking-wider group hover:text-teal-600" onClick={() => handleSort('da')}>
                                            DA <SortIcon field="da" />
                                        </button>
                                    </th>
                                    <th scope="col" className="px-5 py-3 text-center">
                                        <button className="flex items-center justify-center mx-auto text-xs font-semibold text-gray-500 uppercase tracking-wider group hover:text-teal-600" onClick={() => handleSort('pa')}>
                                            PA <SortIcon field="pa" />
                                        </button>
                                    </th>
                                    <th scope="col" className="px-5 py-3 text-center">
                                        <button className="flex items-center justify-center mx-auto text-xs font-semibold text-gray-500 uppercase tracking-wider group hover:text-teal-600" onClick={() => handleSort('ss')}>
                                            SS <SortIcon field="ss" />
                                        </button>
                                    </th>
                                    <th scope="col" className="px-5 py-3 text-center">
                                        <button className="flex items-center justify-center mx-auto text-xs font-semibold text-gray-500 uppercase tracking-wider group hover:text-teal-600" onClick={() => handleSort('traffic')}>
                                            Est. Trafik <SortIcon field="traffic" />
                                        </button>
                                    </th>
                                    <th scope="col" className="px-5 py-3 text-right">
                                        <button className="flex items-center justify-end ml-auto text-xs font-semibold text-gray-500 uppercase tracking-wider group hover:text-teal-600" onClick={() => handleSort('price')}>
                                            Jenis & Harga  <SortIcon field="price" />
                                        </button>
                                    </th>
                                    <th scope="col" className="px-5 py-3 text-center">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {blogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-16 text-center">
                                            <Globe className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                                            <h3 className="text-base font-semibold text-gray-600 mb-1">Tidak ditemukan website</h3>
                                            <p className="text-sm text-gray-400">Coba atur ulang filter pencarian Anda.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    blogs.map(blog => {
                                        const minPrice = getMinPrice(blog);
                                        return (
                                            <tr key={blog.id} className="hover:bg-teal-50/40 transition-colors">
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-teal-50 rounded-lg flex items-center justify-center border border-teal-100">
                                                            <Globe className="h-5 w-5 text-teal-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-800">{blog.domain}</div>
                                                            <div className="flex items-center mt-1 text-xs text-gray-500">
                                                                <Tag className="h-3 w-3 mr-1" />
                                                                {blog.category?.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-center whitespace-nowrap">
                                                    <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-teal-50 text-teal-700 font-bold text-sm border border-teal-100 min-w-[40px]">
                                                        {blog.da}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-center whitespace-nowrap">
                                                    <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-sky-50 text-sky-700 font-bold text-sm border border-sky-100 min-w-[40px]">
                                                        {blog.pa}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-center whitespace-nowrap">
                                                    <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-rose-50 text-rose-700 font-bold text-sm border border-rose-100 min-w-[40px]">
                                                        {blog.ss}%
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-center whitespace-nowrap">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-sm font-bold text-gray-700">
                                                            {blog.traffic >= 1000 ? `${(blog.traffic/1000).toFixed(1)}k` : blog.traffic}
                                                        </span>
                                                        {blog.indexing === 'yes' && (
                                                            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 rounded mt-1">Terindeks</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-right whitespace-nowrap">
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedBlogForPrice(blog);
                                                            setIsPriceModalOpen(true);
                                                        }}
                                                        className="group flex flex-col items-end gap-0.5 hover:opacity-80 transition-opacity"
                                                    >
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Start from:</span>
                                                        <div className="flex items-center gap-1.5 p-1 px-2.5 bg-emerald-50 border border-emerald-100 rounded-lg group-hover:border-emerald-300 transition-colors shadow-sm">
                                                            <span className="text-sm font-extrabold text-emerald-600">
                                                                Rp {minPrice.toLocaleString('id-ID')}
                                                            </span>
                                                            <Info className="w-3 h-3 text-emerald-400" />
                                                        </div>
                                                    </button>
                                                </td>
                                                <td className="px-5 py-4 text-center whitespace-nowrap">
                                                    <button 
                                                        onClick={() => router.get(`/checkout/${blog.id}`)}
                                                        className="inline-flex items-center px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                                        title="Pesan Backlink"
                                                    >
                                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                                        Pesan
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

            {/* Price Detail Modal */}
            <Dialog open={isPriceModalOpen} onOpenChange={setIsPriceModalOpen}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border-gray-100 rounded-2xl shadow-2xl">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-xl font-extrabold text-gray-800 flex items-center justify-between">
                            <span>Detail Harga Backlink</span>
                        </DialogTitle>
                        <p className="text-xs text-gray-400 font-medium">{selectedBlogForPrice?.domain}</p>
                    </DialogHeader>
                    
                    <div className="p-6 space-y-4">
                        {selectedBlogForPrice && (
                            <div className="grid gap-3">
                                {selectedBlogForPrice.has_backlink_authority && (
                                    <>
                                        {selectedBlogForPrice.price_authority_advertiser && (
                                            <div className="flex items-center justify-between p-4 bg-teal-50/50 rounded-xl border border-teal-100 shadow-sm transition-all hover:bg-teal-50">
                                                <div>
                                                    <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1">Authority (Artikel dari Anda)</p>
                                                    <p className="text-xs text-teal-800/70 font-medium whitespace-pre-wrap">Anda mengirimkan artikel siap publis</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-teal-700 leading-none">Rp {Number(selectedBlogForPrice.price_authority_advertiser).toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {selectedBlogForPrice.price_authority_publisher && (
                                            <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 shadow-sm transition-all hover:bg-emerald-50">
                                                <div>
                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Authority (Artikel dari Pemilik Web)</p>
                                                    <p className="text-xs text-emerald-800/70 font-medium whitespace-pre-wrap">Publisher yang akan menuliskan artikelnya</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-emerald-700 leading-none">Rp {Number(selectedBlogForPrice.price_authority_publisher).toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                {selectedBlogForPrice.has_backlink_sidebar && (
                                    <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 shadow-sm">
                                        <div>
                                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Backlink Sidebar</p>
                                            <p className="text-xs text-indigo-800/70 font-medium">Link di menu sidebar ({selectedBlogForPrice.sidebar_duration} hari)</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-indigo-700">Rp {Number(selectedBlogForPrice.price_sidebar).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <div className="pt-4 mt-2">
                            <button 
                                onClick={() => {
                                    if (selectedBlogForPrice) {
                                        router.get(`/checkout/${selectedBlogForPrice.id}`);
                                    }
                                }}
                                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-2 group"
                            >
                                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Pesan Sekarang
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}


