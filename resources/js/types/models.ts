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
    price: number;
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
    article_source: 'publisher' | 'advertiser';
    instructions?: string;
    doc_link?: string;
    notes?: string;
    status: 'unpaid' | 'paid' | 'published' | 'completed';
    published_link?: string;
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
