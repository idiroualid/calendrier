import React from 'react';
import { Calendar, Globe, CheckCircle2, UserCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SuccessViewProps {
  selectedDate: Date;
  selectedTime: string;
  location: string;
}

export const SuccessView = ({ selectedDate, selectedTime, location }: SuccessViewProps) => {
  const getLocationLabel = (loc: string) => {
    if (loc === 'meet') return 'Google Meet';
    if (loc === 'phone') return 'Appel téléphonique';
    return 'WhatsApp';
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-[#1a1a1a] animate-in zoom-in duration-500 text-center">
      <div className="mb-6 text-green-500">
        <CheckCircle2 size={64} strokeWidth={1.5} />
      </div>

      <h2 className="text-white text-2xl font-bold mb-2">Vous avez rendez-vous</h2>
      <p className="text-neutral-400 mb-10 text-sm">
        Un e-mail de confirmation contenant les détails du rendez-vous vous a été envoyé.
      </p>

      <div className="w-full max-w-md border border-neutral-800 rounded-2xl p-6 space-y-5 text-left bg-neutral-900/30">
        <h3 className="text-white font-bold text-lg leading-tight uppercase">
            Appel de Découverte - Pledge&Grow
        </h3>
        
        <div className="space-y-3">
            <div className="flex items-center gap-3 text-neutral-300 font-semibold">
                <UserCircle size={20} className="text-neutral-500" />
                <span>Pledge and Grow</span>
            </div>

            <div className="flex items-start gap-3 text-neutral-300 font-semibold">
                <Calendar size={20} className="text-neutral-500 mt-0.5" />
                <span className="capitalize text-blue-500">
                    {selectedTime}, {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </span>
            </div>

            <div className="flex items-center gap-3 text-neutral-400 text-sm">
                <Globe size={18} className="text-neutral-600" />
                <span>Heure d'Europe centrale</span>
            </div>

            <div className="flex items-center gap-3 text-neutral-300 font-semibold">
                <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                </div>
                <span>Web conférence : {getLocationLabel(location)}</span>
            </div>
        </div>
      </div>

      <button 
        onClick={() => window.location.reload()}
        className="mt-10 px-6 py-2 border border-neutral-700 rounded-full text-sm font-bold text-neutral-400 hover:text-white hover:border-neutral-500 transition-all"
      >
        Planifier un autre événement
      </button>
    </div>
  );
};