import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

import { User, AtSign, Phone, MapPin, Building2, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function Register() {
    return (
        <AuthLayout
            title="Ayo Bergabung!"
            description="Lengkapi data di bawah ini untuk menjadi bagian dari platform backlink nomor satu."
        >
            <Head title="Register" />
            
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="space-y-8"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Name */}
                            <div className="space-y-2 relative group md:col-span-2">
                                <Label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1 group-focus-within:text-teal-500 transition-colors">Nama Lengkap</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-500 transition-colors">
                                        <User className="size-4 text-gray-400 group-focus-within:text-teal-500" />
                                    </div>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Nama Lengkap Anda"
                                        className="h-14 pl-12 bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all duration-300 font-medium"
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            {/* Email */}
                            <div className="space-y-2 relative group">
                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1 group-focus-within:text-teal-500 transition-colors">Email Bisnis</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-500 transition-colors">
                                        <AtSign className="size-4 text-gray-400 group-focus-within:text-teal-500" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="nama@email.com"
                                        className="h-14 pl-12 bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all duration-300 font-medium"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* WhatsApp */}
                            <div className="space-y-2 relative group">
                                <Label htmlFor="whatsapp" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1 group-focus-within:text-teal-500 transition-colors">Nomor WhatsApp</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-500 transition-colors">
                                        <Phone className="size-4 text-gray-400 group-focus-within:text-teal-500" />
                                    </div>
                                    <Input
                                        id="whatsapp"
                                        type="text"
                                        required
                                        tabIndex={3}
                                        name="whatsapp"
                                        placeholder="Contoh: 081234..."
                                        className="h-14 pl-12 bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all duration-300 font-medium"
                                    />
                                </div>
                                <InputError message={errors.whatsapp} />
                            </div>

                            {/* Province */}
                            <div className="space-y-2 relative group">
                                <Label htmlFor="province" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1 group-focus-within:text-teal-500 transition-colors">Provinsi</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-500 transition-colors">
                                        <MapPin className="size-4 text-gray-400 group-focus-within:text-teal-500" />
                                    </div>
                                    <Input
                                        id="province"
                                        type="text"
                                        required
                                        tabIndex={4}
                                        name="province"
                                        placeholder="Provinsi Anda"
                                        className="h-14 pl-12 bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all duration-300 font-medium"
                                    />
                                </div>
                                <InputError message={errors.province} />
                            </div>

                            {/* City */}
                            <div className="space-y-2 relative group">
                                <Label htmlFor="city" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1 group-focus-within:text-teal-500 transition-colors">Kota</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-500 transition-colors">
                                        <Building2 className="size-4 text-gray-400 group-focus-within:text-teal-500" />
                                    </div>
                                    <Input
                                        id="city"
                                        type="text"
                                        required
                                        tabIndex={5}
                                        name="city"
                                        placeholder="Kota Anda"
                                        className="h-14 pl-12 bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all duration-300 font-medium"
                                    />
                                </div>
                                <InputError message={errors.city} />
                            </div>

                            {/* Password */}
                            <div className="space-y-2 relative group">
                                <Label htmlFor="password" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1 group-focus-within:text-teal-500 transition-colors">Buat Password</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-500 transition-colors">
                                        <Lock className="size-4 text-gray-400 group-focus-within:text-teal-500" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={6}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Min. 8 Karakter"
                                        className="h-14 pl-12 bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all duration-300 font-medium"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2 relative group">
                                <Label htmlFor="password_confirmation" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1 group-focus-within:text-teal-500 transition-colors">Ulangi Password</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-500 transition-colors">
                                        <Lock className="size-4 text-gray-400 group-focus-within:text-teal-500" />
                                    </div>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={7}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Konfirmasi Password"
                                        className="h-14 pl-12 bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all duration-300 font-medium"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full h-14 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-2xl font-black text-lg tracking-tight transition-all duration-500 shadow-xl shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-1 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3 overflow-hidden relative group"
                                tabIndex={8}
                            >
                                <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
                                {processing ? (
                                    <Sparkles className="animate-spin text-white size-6" />
                                ) : (
                                    <>
                                        <span>Daftar Sekarang</span>
                                        <ArrowRight className="size-5 group-hover:translate-x-2 transition-transform duration-300" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Footer Link */}
                        <div className="text-center pt-8 border-t border-gray-50 dark:border-neutral-900 flex flex-col items-center gap-2 font-medium">
                            <span className="text-gray-400 italic text-sm">Sudah menjadi perwira?</span>
                            <Link
                                href={login()}
                                tabIndex={9}
                                className="text-teal-600 hover:text-teal-700 font-black tracking-tight border-b-2 border-teal-100 hover:border-teal-600 transition-all group"
                            >
                                Masuk ke Markas <ArrowRight className="inline size-3 ml-1 group-hover:ml-2 transition-all" />
                            </Link>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
