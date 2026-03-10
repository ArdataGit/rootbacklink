import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Banner } from '@/types';
import { Plus, Image as ImageIcon, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface Props {
    banners: Banner[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administrator', href: '#' },
    { title: 'Master Banner', href: '/admin/banners' },
];

export default function BannerIndex({ banners }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        image: null as File | null,
        url: '',
        is_active: true,
        _method: 'POST' // using spoofing for update to handle file uploads
    });

    const openCreateModal = () => {
        setEditingBanner(null);
        setData({ title: '', image: null, url: '', is_active: true, _method: 'POST' });
        setIsModalOpen(true);
    };

    const openEditModal = (banner: Banner) => {
        setEditingBanner(banner);
        setData({ 
            title: banner.title, 
            image: null, 
            url: banner.url || '', 
            is_active: banner.is_active,
            _method: 'POST' // We use POST for inertia file uploads and spoof the PATCH/PUT method in the controller if needed. Actually we'll route to POST /admin/banners/{banner} for update based on web.php routes we set to POST.
        });
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBanner) {
            post(`/admin/banners/${editingBanner.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                forceFormData: true,
            });
        } else {
            post('/admin/banners', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                forceFormData: true,
            });
        }
    };

    const deleteBanner = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus banner ini?')) {
            router.delete(`/admin/banners/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Banner - Admin" />
            
            <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Master Banner</h1>
                        <p className="mt-2 text-sm text-gray-600">Kelola banner promosi untuk dashboard pengguna.</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Tambah Banner
                    </button>
                </div>

                <div className="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
                            <thead className="bg-gray-50 dark:bg-neutral-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul & Link</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                                {banners.map((banner) => (
                                    <tr key={banner.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-16 w-32 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                                                <img src={`/storage/${banner.image_path}`} alt={banner.title} className="object-cover w-full h-full" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{banner.title}</div>
                                            {banner.url && (
                                                <a href={banner.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">
                                                    {banner.url}
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${banner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {banner.is_active ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                            <button 
                                                onClick={() => openEditModal(banner)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => deleteBanner(banner.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {banners.length === 0 && (
                        <div className="p-8 text-center text-gray-500">Belum ada banner yang ditambahkan.</div>
                    )}
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-md bg-white dark:bg-neutral-900">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">
                                {editingBanner ? 'Edit Banner' : 'Tambah Banner Baru'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={submit} className="space-y-4 pt-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Judul Banner</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className={`block w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    placeholder="Contoh: Promo Ramadhan"
                                    required
                                />
                                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Upload Gambar</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                    className={`block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100
                                    `}
                                    required={!editingBanner} // Image is required for new banners, optional on edit
                                />
                                {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Link URL (Opsional)</label>
                                <input
                                    type="url"
                                    value={data.url}
                                    onChange={e => setData('url', e.target.value)}
                                    className={`block w-full px-4 py-2 border ${errors.url ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    placeholder="https://example.com"
                                />
                                {errors.url && <p className="mt-1 text-xs text-red-500">{errors.url}</p>}
                            </div>

                            <div className="flex items-center mt-4">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                    Banner Aktif
                                </label>
                            </div>

                            <div className="flex flex-row-reverse gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                                <DialogClose asChild>
                                    <button type="button" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
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
