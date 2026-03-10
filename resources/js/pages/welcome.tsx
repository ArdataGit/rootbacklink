import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppLogoIcon from '@/components/app-logo-icon';
import { ArrowRight, Globe, Shield, TrendingUp, Zap } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="BacklinkPro — SEO Platform">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-teal-50/60 via-white to-emerald-50/40 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950" style={{ fontFamily: 'Inter, sans-serif' }}>
                {/* Nav */}
                <header className="relative z-10 w-full border-b border-gray-100 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 shadow-sm">
                                <AppLogoIcon className="size-4.5 text-white" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-gray-800 dark:text-white">BacklinkPro</span>
                        </Link>
                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link href={dashboard()} className="inline-flex items-center gap-2 rounded-lg bg-teal-500 hover:bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors">
                                    Dashboard <ArrowRight className="w-4 h-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()} className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link href={register()} className="inline-flex items-center gap-2 rounded-lg bg-teal-500 hover:bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors">
                                            Daftar Sekarang
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <main className="relative z-10 flex-1 flex items-center">
                    <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
                        <div className="text-center max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 dark:bg-teal-900/20 px-4 py-1.5 mb-6">
                                <Zap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Platform SEO Terpercaya #1</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-800 dark:text-white leading-[1.1] mb-6">
                                Tingkatkan Peringkat
                                <span className="block text-teal-600 dark:text-teal-400">Website Anda</span>
                            </h1>
                            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                                Platform terlengkap untuk jual beli backlink berkualitas. Kelola web, pantau transaksi, dan tingkatkan otoritas domain Anda dengan mudah.
                            </p>
                            {!auth.user && (
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Link href={register()} className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-600 px-8 py-3.5 text-base font-bold text-white shadow-md hover:shadow-lg transition-all">
                                        Mulai Gratis <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <Link href={login()} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-neutral-700 px-8 py-3.5 text-base font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                                        Sudah Punya Akun
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
                            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-7 border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-shadow">
                                <div className="inline-flex p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 mb-4">
                                    <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Kelola Web</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Daftarkan dan kelola website Anda dengan mudah. Pantau DA, PA, traffic, dan metrik SEO lainnya.</p>
                            </div>
                            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-7 border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-shadow">
                                <div className="inline-flex p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 mb-4">
                                    <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Transaksi Aman</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Sistem transaksi yang transparan dengan status tracking real-time dari pemesanan hingga publikasi.</p>
                            </div>
                            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-7 border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-shadow">
                                <div className="inline-flex p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 mb-4">
                                    <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Pantau Pendapatan</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Dashboard lengkap untuk memantau pemasukkan, saldo, dan riwayat transaksi Anda.</p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 border-t border-gray-100 dark:border-neutral-800">
                    <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between text-sm text-gray-400">
                        <span>© {new Date().getFullYear()} BacklinkPro</span>
                        <span className="font-medium">SEO Platform</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
