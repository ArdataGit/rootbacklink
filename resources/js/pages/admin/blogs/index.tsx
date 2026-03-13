import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Blog, Category } from '@/types';
import type { User } from '@/types';
import { Globe, Tag, CheckCircle, Clock, XCircle, User as UserIcon, Plus, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface Props {
    blogs: Blog[];
    users: Pick<User, 'id' | 'name' | 'email'>[];
    categories: Pick<Category, 'id' | 'name'>[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administrator', href: '#' },
    { title: 'Kelola Website', href: '/admin/blogs' },
];

export default function BlogIndex({ blogs, users, categories }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

    // Create form
    const createForm = useForm({
        user_id: '',
        domain: '',
        category_id: '',
        has_backlink_authority: false,
        price_authority_publisher: '',
        price_authority_advertiser: '',
        has_backlink_sidebar: false,
        price_sidebar: '',
        sidebar_duration: '',
        da: '0',
        pa: '0',
        ss: '0',
        traffic: '0',
        indexing: 'no',
    });

    // Edit form
    const editForm = useForm({
        da: '0',
        pa: '0',
        ss: '0',
        traffic: '0',
        indexing: 'no',
        has_backlink_authority: false,
        price_authority_publisher: '',
        price_authority_advertiser: '',
        has_backlink_sidebar: false,
        price_sidebar: '',
        sidebar_duration: '',
    });

    const openEditModal = (blog: Blog) => {
        setEditingBlog(blog);
        editForm.setData({
            da: String(blog.da),
            pa: String(blog.pa),
            ss: String(blog.ss),
            traffic: String(blog.traffic),
            indexing: blog.indexing,
            has_backlink_authority: blog.has_backlink_authority,
            price_authority_publisher: String(blog.price_authority_publisher || ''),
            price_authority_advertiser: String(blog.price_authority_advertiser || ''),
            has_backlink_sidebar: blog.has_backlink_sidebar,
            price_sidebar: String(blog.price_sidebar || ''),
            sidebar_duration: String(blog.sidebar_duration || ''),
        });
        setIsEditModalOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/blogs', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBlog) return;
        editForm.patch(`/admin/blogs/${editingBlog.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                editForm.reset();
            },
        });
    };

    const handleStatusUpdate = (blogId: number, status: 'approved' | 'rejected') => {
        router.patch(`/admin/blogs/${blogId}/status`, { status });
    };

    const handleDelete = (blogId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus website ini? Semua data terkait akan ikut terhapus.')) {
            router.delete(`/admin/blogs/${blogId}`);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</span>;
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
            case 'rejected':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
            default:
                return null;
        }
    };

    const inputCls = (hasError: boolean) =>
        `w-full px-4 py-2.5 border ${hasError ? 'border-red-400' : 'border-gray-200'} rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Website - Admin" />
            
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Kelola Website</h1>
                        <p className="mt-2 text-sm text-gray-600">Review, kelola statistik, dan tambah website publisher.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Tambah Website
                    </button>
                </div>

                <div className="overflow-hidden bg-white dark:bg-neutral-900 shadow-xl rounded-2xl border border-gray-200 dark:border-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
                            <thead className="bg-gray-50 dark:bg-neutral-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Web & Publisher</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">DA / PA / SS</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Trafik</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Index</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis & Harga</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                                {blogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500 italic">Belum ada data website.</td>
                                    </tr>
                                ) : (
                                    blogs.map((blog) => (
                                        <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center text-sm font-bold text-gray-900 dark:text-white">
                                                        <Globe className="h-4 w-4 mr-2 text-blue-500" />
                                                        {blog.domain}
                                                    </div>
                                                    <div className="flex items-center mt-1 text-xs text-gray-500">
                                                        <UserIcon className="h-3 w-3 mr-1" />
                                                        {blog.user?.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <span className="inline-flex items-center px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider italic">
                                                    <Tag className="w-3 h-3 mr-1" />
                                                    {blog.category?.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                <span className="font-bold text-blue-600">{blog.da}</span>
                                                <span className="mx-1 text-gray-300">/</span>
                                                <span className="font-bold text-cyan-500">{blog.pa}</span>
                                                <span className="mx-1 text-gray-300">/</span>
                                                <span className="font-bold text-red-500">{blog.ss}%</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-700">
                                                {blog.traffic.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {blog.indexing === 'yes' ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">Ya</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-500">Tidak</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    {blog.has_backlink_authority && (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[10px] text-gray-400">Auth:</span>
                                                            <span className="text-xs font-bold text-gray-700">Rp {Number(blog.price_authority_advertiser).toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    {blog.has_backlink_sidebar && (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[10px] text-gray-400">Side:</span>
                                                            <span className="text-xs font-bold text-gray-700">Rp {Number(blog.price_sidebar).toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {getStatusBadge(blog.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    {blog.status === 'pending' && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleStatusUpdate(blog.id, 'approved')}
                                                                className="px-2.5 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-semibold"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button 
                                                                onClick={() => handleStatusUpdate(blog.id, 'rejected')}
                                                                className="px-2.5 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-semibold"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    <button 
                                                        onClick={() => openEditModal(blog)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit Statistik"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(blog.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Website */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-xl bg-white dark:bg-neutral-900 p-0 overflow-hidden rounded-2xl">
                    <form onSubmit={submitCreate}>
                        <div className="px-6 py-6 sm:px-8">
                            <DialogHeader className="mb-5">
                                <DialogTitle className="text-lg font-bold text-gray-800">Tambah Website Baru</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Pemilik Website (User)</label>
                                    <select value={createForm.data.user_id} onChange={e => createForm.setData('user_id', e.target.value)}
                                        className={inputCls(!!createForm.errors.user_id)}>
                                        <option value="">Pilih User...</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                    {createForm.errors.user_id && <p className="mt-1 text-xs text-red-500">{createForm.errors.user_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Domain (Tanpa https://)</label>
                                    <input type="text" value={createForm.data.domain} onChange={e => createForm.setData('domain', e.target.value)}
                                        className={inputCls(!!createForm.errors.domain)} placeholder="example.com" />
                                    {createForm.errors.domain && <p className="mt-1 text-xs text-red-500">{createForm.errors.domain}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Kategori</label>
                                        <select value={createForm.data.category_id} onChange={e => createForm.setData('category_id', e.target.value)}
                                            className={inputCls(!!createForm.errors.category_id)}>
                                            <option value="">Pilih...</option>
                                            {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                        </select>
                                        {createForm.errors.category_id && <p className="mt-1 text-xs text-red-500">{createForm.errors.category_id}</p>}
                                    </div>
                                </div>

                                {/* Backlink Authority */}
                                <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="create_has_authority" checked={createForm.data.has_backlink_authority} onChange={e => createForm.setData('has_backlink_authority', e.target.checked)} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
                                        <label htmlFor="create_has_authority" className="font-bold text-gray-700 text-sm">Backlink Authority (Artikel)</label>
                                    </div>
                                    {createForm.data.has_backlink_authority && (
                                        <div className="grid grid-cols-2 gap-3 pl-8">
                                            <div>
                                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Harga Publisher (Rp)</label>
                                                <input type="number" value={createForm.data.price_authority_publisher} onChange={e => createForm.setData('price_authority_publisher', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="250000" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Harga Advertiser (Rp)</label>
                                                <input type="number" value={createForm.data.price_authority_advertiser} onChange={e => createForm.setData('price_authority_advertiser', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="200000" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Backlink Sidebar */}
                                <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="create_has_sidebar" checked={createForm.data.has_backlink_sidebar} onChange={e => createForm.setData('has_backlink_sidebar', e.target.checked)} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
                                        <label htmlFor="create_has_sidebar" className="font-bold text-gray-700 text-sm">Backlink Sidebar</label>
                                    </div>
                                    {createForm.data.has_backlink_sidebar && (
                                        <div className="grid grid-cols-2 gap-3 pl-8">
                                            <div>
                                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Harga Jual (Rp)</label>
                                                <input type="number" value={createForm.data.price_sidebar} onChange={e => createForm.setData('price_sidebar', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="500000" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Durasi (Hari)</label>
                                                <input type="number" value={createForm.data.sidebar_duration} onChange={e => createForm.setData('sidebar_duration', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="30" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-3 border-y border-gray-100 py-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">DA</label>
                                        <input type="number" value={createForm.data.da} onChange={e => createForm.setData('da', e.target.value)}
                                            className={inputCls(!!createForm.errors.da)} placeholder="0" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">PA</label>
                                        <input type="number" value={createForm.data.pa} onChange={e => createForm.setData('pa', e.target.value)}
                                            className={inputCls(!!createForm.errors.pa)} placeholder="0" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">SS (%)</label>
                                        <input type="number" value={createForm.data.ss} onChange={e => createForm.setData('ss', e.target.value)}
                                            className={inputCls(!!createForm.errors.ss)} placeholder="0" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Est. Trafik /bulan</label>
                                        <input type="number" value={createForm.data.traffic} onChange={e => createForm.setData('traffic', e.target.value)}
                                            className={inputCls(!!createForm.errors.traffic)} placeholder="1000" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Indeks Google</label>
                                        <select value={createForm.data.indexing} onChange={e => createForm.setData('indexing', e.target.value)}
                                            className={inputCls(false)}>
                                            <option value="yes">Ya (Terindeks)</option>
                                            <option value="no">Tidak</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex flex-row-reverse gap-3">
                            <button type="submit" disabled={createForm.processing}
                                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm disabled:opacity-50 transition-colors">
                                {createForm.processing ? 'Menyimpan...' : 'Simpan Website'}
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

            {/* Modal Edit Stats */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-lg bg-white dark:bg-neutral-900 p-0 overflow-hidden rounded-2xl">
                    <form onSubmit={submitEdit}>
                        <div className="px-6 py-6 sm:px-8">
                            <DialogHeader className="mb-5">
                                <DialogTitle className="text-lg font-bold text-gray-800">
                                    Edit Statistik — <span className="text-blue-600">{editingBlog?.domain}</span>
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">DA</label>
                                        <input type="number" value={editForm.data.da} onChange={e => editForm.setData('da', e.target.value)}
                                            className={inputCls(!!editForm.errors.da)} placeholder="0" />
                                        {editForm.errors.da && <p className="mt-1 text-[10px] text-red-500">{editForm.errors.da}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">PA</label>
                                        <input type="number" value={editForm.data.pa} onChange={e => editForm.setData('pa', e.target.value)}
                                            className={inputCls(!!editForm.errors.pa)} placeholder="0" />
                                        {editForm.errors.pa && <p className="mt-1 text-[10px] text-red-500">{editForm.errors.pa}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">SS (%)</label>
                                        <input type="number" value={editForm.data.ss} onChange={e => editForm.setData('ss', e.target.value)}
                                            className={inputCls(!!editForm.errors.ss)} placeholder="0" />
                                        {editForm.errors.ss && <p className="mt-1 text-[10px] text-red-500">{editForm.errors.ss}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Est. Trafik /bulan</label>
                                        <input type="number" value={editForm.data.traffic} onChange={e => editForm.setData('traffic', e.target.value)}
                                            className={inputCls(!!editForm.errors.traffic)} placeholder="1000" />
                                        {editForm.errors.traffic && <p className="mt-1 text-xs text-red-500">{editForm.errors.traffic}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Indeks Google</label>
                                        <select value={editForm.data.indexing} onChange={e => editForm.setData('indexing', e.target.value)}
                                            className={inputCls(false)}>
                                            <option value="yes">Ya (Terindeks)</option>
                                            <option value="no">Tidak</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="border rounded-xl p-4 bg-gray-50 space-y-3 pt-4">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="edit_has_authority" checked={editForm.data.has_backlink_authority} onChange={e => editForm.setData('has_backlink_authority', e.target.checked)} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
                                        <label htmlFor="edit_has_authority" className="font-bold text-gray-700 text-sm">Backlink Authority (Artikel)</label>
                                    </div>
                                    {editForm.data.has_backlink_authority && (
                                        <div className="grid grid-cols-2 gap-3 pl-8">
                                            <div>
                                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Harga Publisher (Rp)</label>
                                                <input type="number" value={editForm.data.price_authority_publisher} onChange={e => editForm.setData('price_authority_publisher', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="250000" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Harga Advertiser (Rp)</label>
                                                <input type="number" value={editForm.data.price_authority_advertiser} onChange={e => editForm.setData('price_authority_advertiser', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="200000" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="edit_has_sidebar" checked={editForm.data.has_backlink_sidebar} onChange={e => editForm.setData('has_backlink_sidebar', e.target.checked)} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
                                        <label htmlFor="edit_has_sidebar" className="font-bold text-gray-700 text-sm">Backlink Sidebar</label>
                                    </div>
                                    {editForm.data.has_backlink_sidebar && (
                                        <div className="grid grid-cols-2 gap-3 pl-8">
                                            <div>
                                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Harga Jual (Rp)</label>
                                                <input type="number" value={editForm.data.price_sidebar} onChange={e => editForm.setData('price_sidebar', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="500000" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Durasi (Hari)</label>
                                                <input type="number" value={editForm.data.sidebar_duration} onChange={e => editForm.setData('sidebar_duration', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="30" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex flex-row-reverse gap-3">
                            <button type="submit" disabled={editForm.processing}
                                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm disabled:opacity-50 transition-colors">
                                {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
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
        </AppLayout>
    );
}
