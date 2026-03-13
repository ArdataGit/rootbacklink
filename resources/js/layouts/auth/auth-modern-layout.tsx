import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { login } from '@/routes';
import WaWidget from '@/components/wa-widget';
import type { AuthLayoutProps } from '@/types';

export default function AuthModernLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh overflow-hidden bg-white dark:bg-neutral-950">
            {/* Left side: Visual Content */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neutral-900">
                <img 
                    src="/assets/images/auth-bg.png" 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105 animate-pulse-slow"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/90 via-emerald-900/40 to-transparent" />
                
                <div className="relative z-10 flex flex-col justify-between p-12 w-full text-white">
                    <Link href={login.url()} className="flex items-center gap-3 self-start group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform duration-300">
                            <AppLogoIcon className="size-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">BacklinkPro</span>
                    </Link>

                    <div className="space-y-6 max-w-md">
                        <div className="inline-flex px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest">
                            Official Platform
                        </div>
                        <h2 className="text-5xl font-black leading-tight tracking-tighter">
                            Tingkatkan <span className="text-teal-400">Otoritas</span> Website Anda Sekarang.
                        </h2>
                        <p className="text-gray-300 text-lg font-medium leading-relaxed">
                            Akses ribuan website berkualitas untuk strategi SEO yang lebih agresif dan efektif.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-neutral-900 bg-neutral-700 flex items-center justify-center overflow-hidden">
                                     <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                                </div>
                            ))}
                        </div>
                        <p>Bergabung dengan 1,000+ Pengiklan Lainnya</p>
                    </div>
                </div>
                
                {/* Floating glass elements for creative touch */}
                <div className="absolute top-1/4 right-10 w-32 h-32 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 -rotate-12 animate-float" />
                <div className="absolute bottom-1/4 left-10 w-24 h-24 bg-teal-500/10 backdrop-blur-xl rounded-full border border-teal-500/20 animate-float-delayed" />
            </div>

            {/* Right side: Form Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-white dark:bg-neutral-950 relative">
                {/* Mobile Logo */}
                <div className="lg:hidden absolute top-8 left-8">
                     <Link href={login.url()} className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
                            <AppLogoIcon className="size-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">BacklinkPro</span>
                    </Link>
                </div>

                <div className="w-full max-w-md flex flex-col gap-8 animate-fade-in-up">
                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="relative">
                        {children}
                    </div>
                </div>

                <div className="mt-auto pt-8 text-center text-xs text-gray-400 font-medium uppercase tracking-widest lg:text-left lg:w-full lg:max-w-md">
                    &copy; {new Date().getFullYear()} BacklinkPro. All rights reserved.
                </div>
            </div>
            
            <WaWidget />

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(-12deg); }
                    50% { transform: translateY(-20px) rotate(-8deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1.05); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 0.9; }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite 1s; }
                .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-pulse-slow { animation: pulse-slow 15s ease-in-out infinite; }
            ` }} />
        </div>
    );
}
