import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Globe, DollarSign, Search, Receipt, Shield, Database, Image as ImageIcon, Sparkles, Settings, Users, Banknote } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Blog Hub',
        href: '/admin/blogs',
        icon: Shield,
    },
    {
        title: 'Data Transaksi',
        href: '/admin/orders',
        icon: Receipt,
    },
    {
        title: 'Permintaan Penarikan',
        href: '/admin/withdrawals',
        icon: DollarSign,
    },
    {
        title: 'Data Users & Saldo',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Kategori Master',
        href: '/admin/categories',
        icon: Database,
    },
    {
        title: 'Master Banner',
        href: '/admin/banners',
        icon: ImageIcon,
    },
    {
        title: 'Pengaturan',
        href: '/admin/settings',
        icon: Settings,
    },
];

const publisherNavItems: NavItem[] = [
    {
        title: 'Web Saya',
        href: '/web-saya',
        icon: Globe,
    },
    {
        title: 'Pemasukkan Saya',
        href: '/pemasukkan',
        icon: DollarSign,
    },
];

const advertiserNavItems: NavItem[] = [
    {
        title: 'Lihat Semua Web',
        href: '/lihat-web',
        icon: Search,
    },
    {
        title: 'Transaksi Saya',
        href: '/transaksi',
        icon: Receipt,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0">
                <NavMain items={mainNavItems} label="Platform" />
                
                <SidebarSeparator className="my-2 opacity-20" />

                {userRole === 'admin' && (
                    <NavMain items={adminNavItems} label="Administrator" />
                )}

                {userRole !== 'admin' && (
                    <>
                        <NavMain items={publisherNavItems} label="Pemilik Web" />
                        <SidebarSeparator className="my-2 opacity-20" />
                        <NavMain items={advertiserNavItems} label="Pengiklan" />
                    </>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/30">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
