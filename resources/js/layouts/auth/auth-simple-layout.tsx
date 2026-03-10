import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative overflow-hidden bg-gradient-to-br from-teal-50/80 via-emerald-50/40 to-white dark:from-neutral-950 dark:via-teal-950/10 dark:to-neutral-900">
            {/* Decorative shapes */}
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] bg-emerald-200/20 rounded-full blur-3xl" />
            
            <div className="w-full max-w-sm relative z-10">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-3 font-medium group"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 shadow-md shadow-teal-400/20 group-hover:shadow-teal-400/40 transition-all duration-300 group-hover:scale-105">
                                <AppLogoIcon className="size-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">
                                BacklinkPro
                            </span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h1>
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
