import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

import { AtSign, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title="Selamat Datang"
            description="Masukkan detail akun Anda untuk mengakses dashboard eksklusif."
        >
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-8"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2 relative group">
                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1 transition-colors group-focus-within:text-teal-500">
                                    Alamat Email
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-500 transition-colors">
                                        <AtSign className="size-4 text-gray-400 group-focus-within:text-teal-500" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="nama@perusahaan.com"
                                        className="h-14 pl-12 bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all duration-300 font-medium placeholder:text-gray-300"
                                    />
                                </div>
                                <InputError message={errors.email} className="ml-1" />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2 relative group">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 transition-colors group-focus-within:text-teal-500">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline underline-offset-4"
                                            tabIndex={5}
                                        >
                                            Lupa Password?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="size-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="h-14 pl-12 bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all duration-300 font-medium placeholder:text-gray-300"
                                    />
                                </div>
                                <InputError message={errors.password} className="ml-1" />
                            </div>

                            {/* Remember Me Toggle or Checkbox - but styled nicer */}
                            <div className="flex items-center space-x-3 ml-1 group cursor-pointer w-fit">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="size-5 rounded-lg border-2 border-gray-200 text-teal-500 focus:ring-teal-500/20 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500 transition-colors"
                                />
                                <Label htmlFor="remember" className="text-sm font-bold text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white transition-colors cursor-pointer select-none">
                                    Ingat saya di perangkat ini
                                </Label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full h-14 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-2xl font-black text-lg tracking-tight transition-all duration-500 shadow-xl shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-1 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3 overflow-hidden relative group"
                                tabIndex={4}
                                disabled={processing}
                            >
                                <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
                                {processing ? (
                                    <Sparkles className="animate-spin text-white size-6" />
                                ) : (
                                    <>
                                        <span>Masuk Sekarang</span>
                                        <ArrowRight className="size-5 group-hover:translate-x-2 transition-transform duration-300" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Footer Link */}
                        {canRegister && (
                            <div className="text-center pt-8 border-t border-gray-50 dark:border-neutral-900 flex flex-col items-center gap-2">
                                <span className="text-sm font-medium text-gray-400 italic">Belum memiliki akun resmi?</span>
                                <Link
                                    href={register()}
                                    className="text-sm font-black text-teal-600 hover:text-teal-700 transition-all border-b-2 border-teal-100 hover:border-teal-600 pb-0.5 tracking-tight group"
                                    tabIndex={5}
                                >
                                    Daftar Sekarang <ArrowRight className="inline size-3 ml-1 group-hover:ml-2 transition-all" />
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl text-center text-sm font-bold text-emerald-700 dark:text-emerald-400 animate-in fade-in slide-in-from-top-4">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
