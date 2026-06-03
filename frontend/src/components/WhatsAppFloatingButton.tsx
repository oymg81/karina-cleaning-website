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
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition-transform duration-200 hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
    >
      <FaWhatsapp className="h-7 w-7" aria-hidden="true" />
    </a>
  );
};

export default WhatsAppFloatingButton;
