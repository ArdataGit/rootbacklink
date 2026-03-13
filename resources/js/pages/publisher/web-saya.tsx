import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Category, Blog } from '@/types';
import { useState, useEffect } from 'react';
import { Plus, Globe, Tag, BarChart, CheckCircle, Clock, XCircle, Search, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface Props {
    blogs: Blog[];
    categories: Category[];
    filters?: {
        search?: string;
        category_id?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pemilik Web (Publisher)', href: '#' },
    { title: 'Web Saya', href: '/web-saya' },
];

export default function WebSaya({ blogs, categories, filters = {} }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [filterCategory, setFilterCategory] = useState(filters.category_id || '');

    const handleSearch = () => {
        router.get('/web-saya', { search: searchQuery, category_id: filterCategory }, { preserveState: true });
    };

    useEffect(() => {
        if (filterCategory !== (filters.category_id || '')) {
            handleSearch();
        }
    }, [filterCategory]);

    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        domain: '',
        category_id: '',
        has_backlink_authority: false,
        price_authority_publisher: '',
        price_authority_advertiser: '',
        has_backlink_sidebar: false,
        price_sidebar: '',
        sidebar_duration: '',
    });

    const openModal = (blog: Blog | null = null) => {
        clearErrors();
        if (blog) {
            setEditingBlog(blog);
            setData({
                domain: blog.domain,
                category_id: blog.category_id.toString(),
                has_backlink_authority: !!blog.has_backlink_authority,
                price_authority_publisher: blog.price_authority_publisher?.toString() || '',
                price_authority_advertiser: blog.price_authority_advertiser?.toString() || '',
                has_backlink_sidebar: !!blog.has_backlink_sidebar,
                price_sidebar: blog.price_sidebar?.toString() || '',
                sidebar_duration: blog.sidebar_duration?.toString() || '',
            });
        } else {
            setEditingBlog(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBlog) {
            patch(`/web-saya/${editingBlog.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/web-saya', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" /> Approved</span>;
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
            case 'rejected':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Web Saya" />
            
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Daftar Web Saya</h1>
                        <p className="mt-1.5 text-sm text-gray-500">Kelola daftar website Anda untuk menerima pesanan backlink.</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-1.5" />
                        Tambah Web Baru
                    </button>
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
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleSearch()}
                                    placeholder="example.com..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Kategori</label>
                            <select
                                value={filterCategory}
                                onChange={e => setFilterCategory(e.target.value)}
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
                                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-200"
                            >
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Domain</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">DA</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">PA</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">SS</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Indexing</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Est. Trafik</th>
                                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis & Harga</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {blogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-16 text-center">
                                            <Globe className="w-10 h-10 mx-auto text-gray-200 mb-3" />
                                            <p className="text-sm text-gray-400">Belum ada data web yang Anda daftarkan.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    blogs.map((blog) => (
                                        <tr key={blog.id} className="hover:bg-teal-50/30 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4 text-teal-500 shrink-0" />
                                                    <span className="text-sm font-medium text-gray-800">{blog.domain}</span>
                                                </div>
                                                <div className="flex items-center mt-0.5 ml-6 text-xs text-gray-400">
                                                    <Tag className="h-3 w-3 mr-1" />
                                                    {blog.category?.name}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-center text-sm font-semibold text-teal-600">{blog.da}</td>
                                            <td className="px-5 py-3.5 text-center text-sm font-semibold text-sky-600">{blog.pa}</td>
                                            <td className="px-5 py-3.5 text-center text-sm font-semibold text-rose-500">{blog.ss}%</td>
                                            <td className="px-5 py-3.5 text-center">
                                                {blog.indexing === 'yes' ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">Ya</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-50 text-gray-500">Tidak</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 text-center text-sm text-gray-600">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50">
                                                    <BarChart className="w-3 h-3 mr-1 text-amber-500" />
                                                    {blog.traffic.toLocaleString()} / bln
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right text-sm">
                                                <div className="flex flex-col items-end gap-1.5">
                                                    {blog.has_backlink_authority && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded bg-teal-50 text-teal-700 text-[11px] font-bold border border-teal-100">
                                                            Auth: Rp {Number(blog.price_authority_advertiser).toLocaleString()}
                                                        </span>
                                                    )}
                                                    {blog.has_backlink_sidebar && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-100">
                                                            Side: Rp {Number(blog.price_sidebar).toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                {getStatusBadge(blog.status)}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <button 
                                                    onClick={() => openModal(blog)}
                                                    className="text-teal-600 hover:text-teal-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors border border-teal-100"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-xl bg-white border-gray-100 p-0 overflow-hidden rounded-2xl">
                        <form onSubmit={submit}>
                            <div className="px-6 py-6 sm:px-8">
                                <DialogHeader className="mb-5">
                                    <DialogTitle className="text-lg font-bold text-gray-800">
                                        {editingBlog ? 'Update Data Website' : 'Pendaftaran Web Baru'}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Domain (Tanpa https://)</label>
                                        <input type="text" value={data.domain} onChange={e => setData('domain', e.target.value)}
                                            className={`w-full px-4 py-2.5 border ${errors.domain ? 'border-red-400' : 'border-gray-200'} rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                                            placeholder="example.com" />
                                        {errors.domain && <p className="mt-1 text-xs text-red-500">{errors.domain}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Kategori Utama</label>
                                            <select value={data.category_id} onChange={e => setData('category_id', e.target.value)}
                                                className={`w-full px-4 py-2.5 border ${errors.category_id ? 'border-red-400' : 'border-gray-200'} rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent`}>
                                                <option value="">Pilih...</option>
                                                {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                            </select>
                                            {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>}
                                        </div>
                                    </div>

                                    {/* Backlink Authority */}
                                    <div className="border rounded-xl p-4 bg-gray-50">
                                        <div className="flex items-center gap-3 mb-4">
                                            <input type="checkbox" id="has_authority" checked={data.has_backlink_authority} onChange={e => setData('has_backlink_authority', e.target.checked)} className="w-5 h-5 rounded text-teal-600 focus:ring-teal-500" />
                                            <label htmlFor="has_authority" className="font-bold text-gray-800">Backlink Authority (Artikel)</label>
                                        </div>
                                        {data.has_backlink_authority && (
                                            <div className="grid grid-cols-2 gap-4 pl-8">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Artikel dr Pemilik Web (Rp)</label>
                                                    <input type="number" value={data.price_authority_publisher} onChange={e => setData('price_authority_publisher', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="250000" />
                                                    {/* @ts-ignore */}
                                                    {errors.price_authority_publisher && <p className="text-xs text-red-500 mt-1">{errors.price_authority_publisher}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Artikel dr Pengiklan (Rp)</label>
                                                    <input type="number" value={data.price_authority_advertiser} onChange={e => setData('price_authority_advertiser', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="200000" />
                                                    {/* @ts-ignore */}
                                                    {errors.price_authority_advertiser && <p className="text-xs text-red-500 mt-1">{errors.price_authority_advertiser}</p>}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Backlink Sidebar */}
                                    <div className="border rounded-xl p-4 bg-gray-50">
                                        <div className="flex items-center gap-3 mb-4">
                                            <input type="checkbox" id="has_sidebar" checked={data.has_backlink_sidebar} onChange={e => setData('has_backlink_sidebar', e.target.checked)} className="w-5 h-5 rounded text-teal-600 focus:ring-teal-500" />
                                            <label htmlFor="has_sidebar" className="font-bold text-gray-800">Backlink Sidebar</label>
                                        </div>
                                        {data.has_backlink_sidebar && (
                                            <div className="grid grid-cols-2 gap-4 pl-8">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Harga per Durasi (Rp)</label>
                                                    <input type="number" value={data.price_sidebar} onChange={e => setData('price_sidebar', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="500000" />
                                                    {/* @ts-ignore */}
                                                    {errors.price_sidebar && <p className="text-xs text-red-500 mt-1">{errors.price_sidebar}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Durasi Tayang (Hari)</label>
                                                    <input type="number" value={data.sidebar_duration} onChange={e => setData('sidebar_duration', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="30" />
                                                    {/* @ts-ignore */}
                                                    {errors.sidebar_duration && <p className="text-xs text-red-500 mt-1">{errors.sidebar_duration}</p>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {(!data.has_backlink_authority && !data.has_backlink_sidebar) && (
                                        <p className="text-sm text-red-500 font-medium">Pilih setidaknya satu jenis backlink untuk website ini.</p>
                                    )}

                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 flex flex-row-reverse gap-3">
                                <button type="submit" disabled={processing}
                                    className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-lg shadow-sm disabled:opacity-50 transition-colors">
                                    {processing ? 'Menyimpan...' : (editingBlog ? 'Simpan Perubahan' : 'Simpan Web')}
                                </button>
                                <DialogClose asChild>
                                    <button type="button" className="px-5 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                                        Batal
                                    </button>
                                </DialogClose>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
