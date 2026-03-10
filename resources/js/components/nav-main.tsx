import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [], label = 'Platform' }: { items: NavItem[], label?: string }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-1">
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500 mb-1">{label}</SidebarGroupLabel>
            <SidebarMenu className="space-y-0.5">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                            className="h-9 rounded-lg font-medium transition-all duration-150 data-[active=true]:bg-teal-50 data-[active=true]:text-teal-700 data-[active=true]:font-semibold dark:data-[active=true]:bg-teal-900/20 dark:data-[active=true]:text-teal-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon className="!size-[18px] shrink-0" />}
                                <span className="truncate">{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
