import type { User } from './auth';

export interface Category {
    id: number;
    name: string;
    slug: string;
    created_at?: string;
    updated_at?: string;
}

export interface Blog {
    id: number;
    user_id: number;
    category_id: number;
    domain: string;
    da: number;
    pa: number;
    ss: number;
    indexing: 'yes' | 'no';
    traffic: number;
    has_backlink_authority: boolean;
    price_authority_publisher?: number;
    price_authority_advertiser?: number;
    has_backlink_sidebar: boolean;
    price_sidebar?: number;
    sidebar_duration?: number;
    status: 'pending' | 'approved' | 'rejected';
    user?: User;
    category?: Category;
    created_at?: string;
    updated_at?: string;
}

export interface OrderLink {
    id: number;
    order_id: number;
    link: string;
    anchor: string;
}

export interface Order {
    id: number;
    user_id: number;
    blog_id: number;
    invoice_id: string;
    total: number;
    quantity: number;
    admin_fee: number;
    admin_fee_percentage: number;
    publisher_amount: number;
    backlink_type: 'authority' | 'sidebar';
    article_source?: 'publisher' | 'advertiser';
    description?: string;
    instructions?: string;
    doc_link?: string;
    notes?: string;
    published_desc?: string;
    status: 'unpaid' | 'paid' | 'published' | 'completed';
    published_link?: string;
    published_links?: string[];
    tripay_reference?: string;
    tripay_checkout_url?: string;
    user?: User;
    blog?: Blog;
    links?: OrderLink[];
    created_at?: string;
    updated_at?: string;
}

export interface Banner {
    id: number;
    title: string;
    image_path: string;
    is_active: boolean;
    url?: string;
    created_at?: string;
    updated_at?: string;
}
