import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Blog } from '@/types';
import { ShoppingCart, Globe, Tag, Info, AlertCircle, FileText, Link as LinkIcon, Edit3, ChevronRight, Star, XCircle } from 'lucide-react';

interface PaymentChannel {
    group: string;
    code: string;
    name: string;
    type: string;
    fee_merchant: { flat: number, percent: string };
    fee_customer: { flat: number, percent: string };
    total_fee: { flat: number, percent: string };
    minimum_fee: number;
    maximum_fee: number;
    icon_url: string;
    active: boolean;
}

interface Props {
    blog: Blog;
    paymentChannels: PaymentChannel[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengiklan (Advertiser)', href: '#' },
    { title: 'Lihat Semua Web', href: '/lihat-web' },
    { title: 'Checkout', href: '#' },
];

export default function Checkout({ blog, paymentChannels = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        blog_id: blog.id,
        backlink_type: blog.has_backlink_authority ? 'authority' : (blog.has_backlink_sidebar ? 'sidebar' : ''),
        links: [{ link: '', anchor: '' }],
        article_source: 'publisher',
        instructions: '',
        doc_link: '',
        notes: '',
        description: '',
        quantity: 1,
        payment_method: '', // New field for Tripay channel code
    });

    const unitPrice = data.backlink_type === 'authority' 
        ? (data.article_source === 'publisher' ? (blog.price_authority_publisher || 0) : (blog.price_authority_advertiser || 0))
        : (blog.price_sidebar || 0);

    const totalPrice = unitPrice * data.quantity;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout');
    };

    const addLink = () => {
        if (data.links.length < 4) {
            setData('links', [...data.links, { link: '', anchor: '' }]);
        }
    };

    const removeLink = (index: number) => {
        const newLinks = [...data.links];
        newLinks.splice(index, 1);
        setData('links', newLinks);
    };

    const updateLink = (index: number, field: 'link' | 'anchor', value: string) => {
        const newLinks = [...data.links];
        newLinks[index][field] = value;
        setData('links', newLinks);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Checkout - ${blog.domain}`} />
            
            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <ShoppingCart className="w-7 h-7 text-teal-600" />
                        Konfirmasi Pesanan
                    </h1>
                    <p className="mt-1.5 text-sm text-gray-500">Silakan lengkapi detail order di bawah ini.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-6">
                            
                            {/* Dynamic Links */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Target Link & Anchor</label>
                                    <div className="flex items-center gap-3">
                                        <label htmlFor="quantity" className="text-xs font-semibold text-gray-400 uppercase">Jumlah:</label>
                                        <input 
                                            id="quantity"
                                            type="number" 
                                            min="1" 
                                            max="10"
                                            value={data.quantity}
                                            onChange={e => setData('quantity', parseInt(e.target.value) || 1)}
                                            className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm font-bold text-teal-600 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                {data.links.map((linkData, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="url"
                                                value={linkData.link}
                                                onChange={e => updateLink(index, 'link', e.target.value)}
                                                placeholder={`Link ${index + 1} (https://domain.com/page)`}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                                                required
                                            />
                                            {/* @ts-ignore */}
                                            {errors[`links.${index}.link`] && <p className="text-xs text-red-500">{errors[`links.${index}.link`]}</p>}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                value={linkData.anchor}
                                                onChange={e => updateLink(index, 'anchor', e.target.value)}
                                                placeholder={`Anchor ${index + 1} (Jasa SEO)`}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                                                required
                                            />
                                            {/* @ts-ignore */}
                                            {errors[`links.${index}.anchor`] && <p className="text-xs text-red-500">{errors[`links.${index}.anchor`]}</p>}
                                        </div>
                                        {data.links.length > 1 && (
                                            <button type="button" onClick={() => removeLink(index)} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {data.links.length < 4 && (
                                    <button type="button" onClick={addLink} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors">
                                        + Tambah Link (Maks 4)
                                    </button>
                                )}
                            </div>

                            {/* Backlink Type Selection */}
                            <div className="space-y-4">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis Backlink</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {blog.has_backlink_authority && (
                                        <button type="button" onClick={() => setData('backlink_type', 'authority')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${data.backlink_type === 'authority' ? 'border-teal-500 bg-teal-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <div className="flex flex-col">
                                                <span className={`font-semibold text-sm ${data.backlink_type === 'authority' ? 'text-teal-700' : 'text-gray-800'}`}>Backlink Authority</span>
                                                <span className="text-xs text-gray-400 mt-1">Artikel permanen</span>
                                            </div>
                                        </button>
                                    )}
                                    {blog.has_backlink_sidebar && (
                                        <button type="button" onClick={() => setData('backlink_type', 'sidebar')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${data.backlink_type === 'sidebar' ? 'border-teal-500 bg-teal-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <div className="flex flex-col">
                                                <span className={`font-semibold text-sm ${data.backlink_type === 'sidebar' ? 'text-teal-700' : 'text-gray-800'}`}>Backlink Sidebar</span>
                                                <span className="text-xs text-gray-400 mt-1">Tayang {blog.sidebar_duration} hari</span>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Source Selection (Only for Authority) */}
                            {data.backlink_type === 'authority' && (
                                <div className="pt-5 border-t border-gray-100">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Artikel dari mana?</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button type="button" onClick={() => setData('article_source', 'publisher')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col items-start gap-1 justify-center ${data.article_source === 'publisher' ? 'border-teal-500 bg-teal-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <div className="flex items-center gap-2.5">
                                                <Edit3 className={`w-4 h-4 ${data.article_source === 'publisher' ? 'text-teal-600' : 'text-gray-400'}`} />
                                                <span className={`font-semibold text-sm ${data.article_source === 'publisher' ? 'text-teal-700' : 'text-gray-600'}`}>Pemilik Web</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-teal-600 ml-[26px]">Rp {Number(blog.price_authority_publisher).toLocaleString()}</span>
                                        </button>
                                        <button type="button" onClick={() => setData('article_source', 'advertiser')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col items-start gap-1 justify-center ${data.article_source === 'advertiser' ? 'border-teal-500 bg-teal-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <div className="flex items-center gap-2.5">
                                                <FileText className={`w-4 h-4 ${data.article_source === 'advertiser' ? 'text-teal-600' : 'text-gray-400'}`} />
                                                <span className={`font-semibold text-sm ${data.article_source === 'advertiser' ? 'text-teal-700' : 'text-gray-600'}`}>Saya (Pengiklan)</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-teal-600 ml-[26px]">Rp {Number(blog.price_authority_advertiser).toLocaleString()}</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Conditional Inputs */}
                            {data.backlink_type === 'authority' && (
                                <div className="space-y-4">
                                    {data.article_source === 'publisher' ? (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="block text-sm font-semibold text-gray-600">Instruksi untuk Pemilik Web</label>
                                                <span className="text-[10px] text-gray-400 font-medium">Brief artikel</span>
                                            </div>
                                            <textarea
                                                value={data.instructions}
                                                onChange={e => setData('instructions', e.target.value)}
                                                rows={3}
                                                placeholder="Contoh: Tolong buatkan artikel informatif..."
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                                            />
                                            {errors.instructions && <p className="text-xs text-red-500">{errors.instructions}</p>}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-600">Link Dokumen Artikel</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="url"
                                                    value={data.doc_link}
                                                    onChange={e => setData('doc_link', e.target.value)}
                                                    placeholder="https://docs.google.com/document/..."
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                                                />
                                            </div>
                                            {errors.doc_link && <p className="text-xs text-red-500">{errors.doc_link}</p>}
                                            <p className="text-[11px] text-gray-400 flex items-center gap-1"><Info className="w-3 h-3" /> Pastikan akses link 'Anyone with the link' sebagai Viewer.</p>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-600">Deskripsi/Detail Artikel (Opsional)</label>
                                        <textarea
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            rows={2}
                                            placeholder="Gambarkan topik atau isi artikel yang diinginkan..."
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                                        />
                                        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 pt-4 border-t border-gray-100">
                                <label className="block text-sm font-semibold text-gray-600">Catatan Tambahan (Opsional)</label>
                                <input
                                    type="text"
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Ada permintaan tambahan?"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                                />
                            </div>

                            <div className="pt-5 border-t border-gray-100">
                                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    Metode Pembayaran
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {paymentChannels.length > 0 ? (
                                        paymentChannels.map((channel) => (
                                            <button
                                                key={channel.code}
                                                type="button"
                                                onClick={() => setData('payment_method', channel.code)}
                                                className={`p-3 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 ${
                                                    data.payment_method === channel.code 
                                                        ? 'border-teal-500 bg-teal-50 shadow-sm' 
                                                        : 'border-gray-100 hover:border-teal-200 bg-white'
                                                }`}
                                            >
                                                <img 
                                                    src={channel.icon_url} 
                                                    alt={channel.name} 
                                                    className="h-6 object-contain"
                                                />
                                                <span className={`text-[11px] font-semibold ${data.payment_method === channel.code ? 'text-teal-700' : 'text-gray-600'}`}>
                                                    {channel.name}
                                                </span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-4 text-center text-sm text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                                            Tidak ada metode pembayaran tersedia saat ini.
                                        </div>
                                    )}
                                </div>
                                {/* @ts-ignore */}
                                {errors.payment_method && <p className="text-xs text-red-500 mt-2">{errors.payment_method}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !data.payment_method}
                                className="w-full py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                            >
                                {processing ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Star className="w-24 h-24 fill-white" />
                            </div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-5">Ringkasan Web</h3>
                            
                            <div className="space-y-3 relative z-10">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-white/15 rounded-md">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-base truncate">{blog.domain}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-white/15 rounded-md">
                                        <Tag className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm opacity-90">{blog.category?.name}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/15 mt-4">
                                    <div className="text-center">
                                        <div className="text-[10px] font-semibold opacity-50 uppercase mb-0.5">DA</div>
                                        <div className="text-lg font-bold">{blog.da}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[10px] font-semibold opacity-50 uppercase mb-0.5">PA</div>
                                        <div className="text-lg font-bold">{blog.pa}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[10px] font-semibold opacity-50 uppercase mb-0.5">SS</div>
                                        <div className="text-lg font-bold">{blog.ss}%</div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-white/15 mt-3">
                                    <div className="flex justify-between items-center text-xs opacity-70 mb-1">
                                        <span>Harga Satuan x {data.quantity}</span>
                                        <span>Rp {unitPrice.toLocaleString()}</span>
                                    </div>
                                    <span className="text-xs font-semibold opacity-50 uppercase tracking-wider">Total Bayar</span>
                                    <div className="text-2xl font-bold mt-0.5">Rp {totalPrice.toLocaleString()}</div>
                                </div>
                                <p className="text-xs opacity-80 mt-1">{data.backlink_type === 'sidebar' ? `Berlaku untuk ${blog.sidebar_duration} hari` : 'Artikel permanen'}</p>
                            </div>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <h4 className="font-semibold text-amber-800 mb-0.5">Penting</h4>
                                    <p className="text-amber-700/80 text-xs leading-relaxed">Link artikel akan divalidasi. Pastikan brief jelas agar tidak ditolak oleh Publisher.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
