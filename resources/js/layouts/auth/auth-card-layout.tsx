import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative overflow-hidden bg-gradient-to-br from-teal-50/80 via-emerald-50/40 to-white dark:from-neutral-950 dark:via-teal-950/10 dark:to-neutral-900">
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] bg-emerald-200/20 rounded-full blur-3xl" />

            <div className="flex w-full max-w-md flex-col gap-6 relative z-10">
                <Link href={home()} className="flex items-center gap-3 self-center font-medium group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 shadow-md shadow-teal-400/20 group-hover:shadow-teal-400/40 transition-all duration-300 group-hover:scale-105">
                        <AppLogoIcon className="size-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-gray-800 dark:text-white">BacklinkPro</span>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-2xl shadow-lg border-gray-100 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm">
                        <CardHeader className="px-8 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl font-bold">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 py-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
