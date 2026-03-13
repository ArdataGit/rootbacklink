import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
    settings: {
        wa_number?: string;
        wa_message?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administrator', href: '/admin/dashboard' },
    { title: 'Pengaturan WhatsApp', href: '/admin/settings' },
];

export default function AdminSettings({ settings }: Props) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        wa_number: settings.wa_number || '',
        wa_message: settings.wa_message || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/settings');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Sistem" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-teal-50 p-2 rounded-lg">
                        <SettingsIcon className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Pengaturan WhatsApp</h1>
                        <p className="text-sm text-gray-500">Konfigurasi tombol penghubung WhatsApp Admin</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    {recentlySuccessful && (
                        <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-center justify-between border border-emerald-100">
                            <span className="font-medium">Pengaturan berhasil disimpan.</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="wa_number" className="block text-sm font-medium text-gray-700 mb-1">
                                Nomor WhatsApp
                            </label>
                            <input
                                id="wa_number"
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                                value={data.wa_number}
                                onChange={(e) => setData('wa_number', e.target.value)}
                                placeholder="Contoh: 6281234567890 (Gunakan kode negara)"
                            />
                            {errors.wa_number && (
                                <p className="mt-1 text-sm text-red-600">{errors.wa_number}</p>
                            )}
                            <p className="mt-2 text-xs text-gray-500">Pastikan nomor aktif dan menggunakan kode negara, contoh: 62 untuk Indonesia.</p>
                        </div>

                        <div>
                            <label htmlFor="wa_message" className="block text-sm font-medium text-gray-700 mb-1">
                                Pesan Awalan (Opsional)
                            </label>
                            <textarea
                                id="wa_message"
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                                value={data.wa_message}
                                onChange={(e) => setData('wa_message', e.target.value)}
                                placeholder="Halo, saya ingin bertanya tentang backlink..."
                            />
                            {errors.wa_message && (
                                <p className="mt-1 text-sm text-red-600">{errors.wa_message}</p>
                            )}
                            <p className="mt-2 text-xs text-gray-500">Pesan bawaan yang akan terbuka saat tombol WhatsApp diklik.</p>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-teal-600 hover:bg-teal-700 text-white font-medium flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
