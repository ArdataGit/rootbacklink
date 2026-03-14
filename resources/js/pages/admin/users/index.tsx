import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Users, Search, Wallet, Shield, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    balance: number;
    whatsapp?: string;
}

interface Props {
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administrator', href: '#' },
    { title: 'Data Users & Saldo', href: '/admin/users' },
];

export default function AdminUsers({ users = [] }: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(u => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
        );
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Users & Saldo - Admin" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Data Users & Saldo</h1>
                        <p className="mt-1 text-sm text-gray-500">Pantau semua user dan saldo mereka di platform.</p>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Cari nama atau email..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all w-64"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kontak</th>
                                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Saldo Persistence</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-16 text-center">
                                            <Users className="w-10 h-10 mx-auto text-gray-200 mb-3" />
                                            <p className="text-sm text-gray-400">Tidak ada user ditemukan</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-teal-50/30 transition-colors">
                                            <td className="px-5 py-3.5 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gray-50 rounded-full">
                                                        <UserIcon className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-800">{u.name}</div>
                                                        <div className="text-[10px] text-gray-500">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-center space-x-1">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                                    u.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                    {u.role === 'admin' ? <Shield className="w-2.5 h-2.5 mr-1" /> : null}
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm">
                                                <div className="text-gray-600 whitespace-nowrap">{u.whatsapp || '-'}</div>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Wallet className="w-3.5 h-3.5 text-teal-500" />
                                                    <span className="font-bold text-gray-800">
                                                        Rp {Number(u.balance).toLocaleString('id-ID')}
                                                    </span>
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
        </AppLayout>
    );
}
