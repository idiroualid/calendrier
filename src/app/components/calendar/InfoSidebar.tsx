// src/components/calendar/InfoSidebar.tsx
import React from 'react';
import Image from 'next/image';
import { Clock, Calendar, Globe, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InfoSidebarProps {
  selectedDate?: Date | null;
  selectedTime?: string | null; // C'est cette variable qui contient "09:15" par exemple
  location?: string | null;
  isConfirmed?: boolean;
}

export const InfoSidebar = ({ selectedDate, selectedTime, location }: InfoSidebarProps) => {
  
  const getLocationText = (loc: string) => {
    switch (loc) {
      case 'meet': return 'Google Meet';
      case 'phone': return 'Appel téléphonique';
      case 'whatsapp': return 'WhatsApp';
      default: return loc;
    }
  };

  return (
    <div className="w-[35%] border-r border-neutral-800 p-8 flex flex-col gap-6 bg-[#1a1a1a]">
      {/* Logo */}
      <div className="flex items-center justify-start">
        <div className="relative w-24 h-24 -ml-2">
          <Image src="/images/logo.png" alt="Logo" fill className="object-contain" priority />
        </div>
      </div>
      
      {/* Titres */}
      <div className="space-y-1">
        <p className="text-neutral-500 text-[11px] font-bold uppercase tracking-[0.2em]">Pledge and Grow</p>
        <h1 className="text-white text-2xl font-bold leading-tight uppercase">Appel de Découverte - Pledge&Grow</h1>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {/* Durée */}
        <div className="flex items-center gap-3 text-neutral-400 font-semibold">
          <Clock size={20} className="text-neutral-500" />
          <span>15 min</span>
        </div>

        {/* DATE ET HEURE CORRIGÉES */}
        {selectedDate && (
          <div className="flex items-start gap-3 text-blue-500 font-bold animate-in fade-in slide-in-from-left-2">
            <Calendar size={20} className="mt-1 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="capitalize text-lg">
                {/* On utilise selectedTime s'il existe, sinon on n'affiche rien ou 00:00 */}
                {selectedTime ? selectedTime : ""} {selectedTime ? '-' : ''} {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </span>
            </div>
          </div>
        )}

        {/* Lieu */}
        {location && (
          <div className="flex items-center gap-3 text-neutral-400 font-semibold animate-in fade-in">
            <MapPin size={20} className="text-neutral-500" />
            <span>{getLocationText(location)}</span>
          </div>
        )}

        <div className="flex items-center gap-3 text-neutral-500 font-semibold">
          <Globe size={20} />
          <span className="text-sm">Heure d'Europe centrale</span>
        </div>
      </div>
      
      <div className="mt-auto">
        <button className="text-[13px] text-neutral-500 font-medium hover:text-white transition-colors">
          Paramètres des cookies
        </button>
      </div>
    </div>
  );
};