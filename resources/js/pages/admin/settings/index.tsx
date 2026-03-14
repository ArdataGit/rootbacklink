import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Settings as SettingsIcon, Save, MessageSquare, Percent, CheckCircle2, AlertCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
    settings: {
        wa_number?: string;
        wa_message?: string;
        admin_fee_percentage?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administrator', href: '/admin/dashboard' },
    { title: 'Pengaturan Sistem', href: '/admin/settings' },
];

export default function AdminSettings({ settings }: Props) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        wa_number: settings.wa_number || '',
        wa_message: settings.wa_message || '',
        admin_fee_percentage: settings.admin_fee_percentage || '0',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/settings');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Sistem" />

            <div className="flex h-full flex-1 flex-col gap-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-3 rounded-2xl shadow-lg shadow-teal-100">
                            <SettingsIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pengaturan Sistem</h1>
                            <p className="text-gray-500 font-medium">Konfigurasi operasional dan finansial platform.</p>
                        </div>
                    </div>
                </div>

                {recentlySuccessful && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span className="font-semibold text-sm">Semua perubahan telah berhasil disimpan ke sistem!</span>
                    </div>
                )}

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Pusat Kontrol</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Halaman ini memungkinkan Anda untuk mengelola parameter krusial platform seperti biaya administrasi dan integrasi bantuan pelanggan.
                            </p>
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center gap-3 text-xs font-medium text-teal-600 bg-teal-50 px-3 py-2 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    Perubahan akan langsung berdampak pada seluruh sistem.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* WhatsApp Configuration Group */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                            <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-teal-600" />
                                <h2 className="font-bold text-gray-800">Konfigurasi WhatsApp Widget</h2>
                            </div>
                            <div className="p-8 space-y-6">
                                <div>
                                    <label htmlFor="wa_number" className="block text-sm font-bold text-gray-700 mb-2">
                                        Nomor WhatsApp Admin
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors">
                                            <span className="text-sm font-bold">+</span>
                                        </div>
                                        <input
                                            id="wa_number"
                                            type="text"
                                            className="block w-full pl-8 pr-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all sm:text-sm font-semibold text-gray-800"
                                            value={data.wa_number}
                                            onChange={(e) => setData('wa_number', e.target.value.replace(/\D/g, ''))}
                                            placeholder="6281234567890"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">Gunakan kode negara (e.g., 62 untu Indonesia) tanpa tanda kurung atau spasi.</p>
                                    {errors.wa_number && (
                                        <p className="mt-1 text-sm text-red-600 font-medium">{errors.wa_number}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="wa_message" className="block text-sm font-bold text-gray-700 mb-2">
                                        Pesan Sapaan Default
                                    </label>
                                    <textarea
                                        id="wa_message"
                                        rows={4}
                                        className="block w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all sm:text-sm font-medium text-gray-800"
                                        value={data.wa_message}
                                        onChange={(e) => setData('wa_message', e.target.value)}
                                        placeholder="Halo Admin, saya butuh bantuan terkait..."
                                    />
                                    <p className="mt-2 text-xs text-gray-500">Pesan ini akan muncul secara otomatis di kolom chat WhatsApp user.</p>
                                    {errors.wa_message && (
                                        <p className="mt-1 text-sm text-red-600 font-medium">{errors.wa_message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Financial Settings Group */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                            <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 flex items-center gap-3">
                                <Percent className="w-5 h-5 text-indigo-600" />
                                <h2 className="font-bold text-gray-800">Pengaturan Keuangan</h2>
                            </div>
                            <div className="p-8">
                                <div className="max-w-xs">
                                    <label htmlFor="admin_fee_percentage" className="block text-sm font-bold text-gray-700 mb-2">
                                        Biaya Administrasi Platform
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="admin_fee_percentage"
                                            type="number"
                                            step="0.01"
                                            className="block w-full pl-4 pr-12 py-3 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm font-bold text-gray-800"
                                            value={data.admin_fee_percentage}
                                            onChange={(e) => setData('admin_fee_percentage', e.target.value)}
                                            placeholder="10.00"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <span className="text-gray-400 font-bold group-focus-within:text-indigo-500 transition-colors">%</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500 italic">Dipotong dari setiap transaksi backlink yang sukses.</p>
                                    {errors.admin_fee_percentage && (
                                        <p className="mt-1 text-sm text-red-600 font-medium">{errors.admin_fee_percentage}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="sticky bottom-4 z-10 flex justify-end gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-lg lg:static lg:bg-transparent lg:shadow-none lg:p-0 lg:border-0 lg:pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 rounded-xl shadow-lg shadow-teal-100 transition-all transform hover:scale-105 active:scale-95 font-bold flex items-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                {processing ? 'Menyimpan Data...' : 'Simpan Semua Pengaturan'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
