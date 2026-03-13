import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { login } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-emerald-500 to-teal-600" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                <Link href={login.url()} className="relative z-20 flex items-center gap-3 text-lg font-bold group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm group-hover:bg-white/25 transition-all">
                        <AppLogoIcon className="size-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">BacklinkPro</span>
                </Link>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg font-medium leading-relaxed text-white/90">
                            &ldquo;Platform terbaik untuk mengelola backlink dan meningkatkan peringkat SEO website Anda.&rdquo;
                        </p>
                        <footer className="text-sm text-white/60 font-medium">— BacklinkPro Team</footer>
                    </blockquote>
                </div>
            </div>
            <div className="w-full lg:p-8 relative bg-white dark:bg-neutral-950">
                <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={login.url()} className="relative z-20 flex items-center justify-center lg:hidden group">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 shadow-md">
                            <AppLogoIcon className="size-6 text-white" />
                        </div>
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h1>
                        <p className="text-sm text-balance text-gray-500 dark:text-gray-400">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
