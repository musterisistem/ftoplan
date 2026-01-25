'use client';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
    phoneNumber: string;
}

export default function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
    if (!phoneNumber) return null;

    // Format number: remove all non-digits
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${formattedNumber}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 right-6 z-30 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group"
            aria-label="WhatsApp ile iletişime geç"
        >
            {/* Pulse animation */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping"></span>

            {/* Icon */}
            <MessageCircle className="relative w-7 h-7 text-white" fill="white" />
        </a>
    );
}
