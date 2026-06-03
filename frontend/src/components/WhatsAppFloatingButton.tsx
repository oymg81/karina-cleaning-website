import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_URL = 'https://wa.me/message/NZGNL4QE5S6OD1';

const WhatsAppFloatingButton: React.FC = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Clean & Care PRO on WhatsApp"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-200 hover:scale-110 hover:bg-[#20ba5a] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
    >
      <FaWhatsapp className="h-8 w-8" aria-hidden="true" />
    </a>
  );
};

export default WhatsAppFloatingButton;
