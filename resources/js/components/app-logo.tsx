import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 shadow-sm">
                <AppLogoIcon className="size-5 text-white" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-bold tracking-tight text-gray-800 dark:text-white">
                    BacklinkPro
                </span>
                <span className="truncate text-[10px] leading-tight text-gray-400 font-medium">
                    SEO Platform
                </span>
            </div>
        </>
    );
}
