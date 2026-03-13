import { MessageCircle } from 'lucide-react';
import { usePage } from '@inertiajs/react';

export default function WaWidget() {
    const { waSettings } = usePage<{ waSettings?: { number: string; message: string } }>().props;

    if (!waSettings?.number) return null;

    // Ensure number starts with 62 or code
    let phoneNumber = waSettings.number.replace(/\D/g, '');
    if (phoneNumber.startsWith('0')) {
        phoneNumber = '62' + phoneNumber.substring(1);
    }
    
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waSettings.message || 'Halo Admin')}`;

    return (
        <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
            aria-label="Chat WhatsApp"
        >
            <MessageCircle className="w-8 h-8" />
            
            {/* Tooltip */}
            <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:-right-2 before:border-8 before:border-transparent before:border-l-gray-900 drop-shadow-md">
                Hubungi Admin
            </span>
        </a>
    );
}
