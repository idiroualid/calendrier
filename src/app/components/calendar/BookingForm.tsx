"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Video, Phone, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

interface BookingFormProps {
  selectedDate: Date;
  selectedTime: string;
  onBack: () => void;
  onLocationChange: (location: string) => void;
  onComplete: () => void;
}

export const BookingForm = ({ selectedDate, selectedTime, onBack, onLocationChange, onComplete }: BookingFormProps) => {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLocationSelect = (loc: string) => {
    let label = "";
    if (loc === 'meet') label = "Google Meet";
    if (loc === 'phone') label = "Appel téléphonique";
    if (loc === 'whatsapp') label = "WhatsApp";
    
    setLocation(loc);
    onLocationChange(label);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location) {
      alert("Veuillez sélectionner un lieu pour le rendez-vous.");
      return;
    }

    setLoading(true);

    // Récupère les valeurs du formulaire de façon sûre (string)
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const name = fd.get('fullName')?.toString().trim() || '';
    const email = fd.get('email')?.toString().trim() || '';
    const notes = fd.get('notes')?.toString().trim() || '';

    const payload: any = {
      name,
      email,
      notes,
      location,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
    };

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = data?.error || 'Erreur serveur lors de la réservation.';
        // If the slot is already taken, show a simple alert and redirect to booking page
        if (res.status === 409 || (typeof message === 'string' && message.includes('Le créneau'))) {
          alert('Ce créneau est déjà réservé. Veuillez choisir un autre créneau.');
          router.push('/');
          return;
        }

        console.error('API error:', message, data);
        alert('Erreur: ' + message);
        return;
      }

      // Supabase peut renvoyer dbError pour détails
      if (data?.dbError) {
        console.error('DB error:', data.dbError);
        alert('Erreur en base de données: ' + (data.dbError.message || JSON.stringify(data.dbError)));
        return;
      }

      // Tout s'est bien passé
      onComplete();
    } catch (err) {
      console.error('Erreur API:', err);
      alert('Erreur réseau lors de la soumission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 bg-[#1a1a1a] animate-in fade-in duration-500 overflow-y-auto max-h-[640px] custom-scrollbar">
      {/* Bouton Retour */}
      <button 
        onClick={onBack}
        className="mb-6 p-2 rounded-full border border-neutral-800 text-blue-500 hover:bg-neutral-800 transition-all"
      >
        <ArrowLeft size={20} />
      </button>

      <h2 className="text-white text-xl font-bold mb-8">Saisissez vos informations</h2>

      <form className="space-y-6 max-w-md" onSubmit={handleSubmit}>
        {/* NOM */}
        <div>
          <label className="block text-white text-sm font-bold mb-2">Nom complet *</label>
          <input 
            name="fullName"
            type="text" 
            className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-md p-3 text-white focus:border-blue-500 outline-none transition-all placeholder:text-neutral-700"
            placeholder="Votre nom"
            required
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-white text-sm font-bold mb-2">Adresse e-mail *</label>
          <input 
            name="email"
            type="email" 
            className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-md p-3 text-white focus:border-blue-500 outline-none transition-all placeholder:text-neutral-700"
            placeholder="votre@email.com"
            required
          />
        </div>

        {/* LIEU */}
        <div>
          <label className="block text-white text-sm font-bold mb-3">Lieu *</label>
          <div className="grid grid-cols-1 gap-2">
            <label className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-all ${location === 'meet' ? 'border-blue-500 bg-blue-500/10' : 'border-neutral-800 hover:border-neutral-700'}`}>
              <input type="radio" name="location" className="hidden" onChange={() => handleLocationSelect('meet')} required />
              <Video size={18} className="text-blue-500" />
              <span className="text-white text-sm font-medium">Google Meet</span>
            </label>

            <label className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-all ${location === 'phone' ? 'border-blue-500 bg-blue-500/10' : 'border-neutral-800 hover:border-neutral-700'}`}>
              <input type="radio" name="location" className="hidden" onChange={() => handleLocationSelect('phone')} />
              <Phone size={18} className="text-green-500" />
              <span className="text-white text-sm font-medium">Appel téléphonique</span>
            </label>

            <label className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-all ${location === 'whatsapp' ? 'border-blue-500 bg-blue-500/10' : 'border-neutral-800 hover:border-neutral-700'}`}>
              <input type="radio" name="location" className="hidden" onChange={() => handleLocationSelect('whatsapp')} />
              <MessageCircle size={18} className="text-green-400" />
              <span className="text-white text-sm font-medium">WhatsApp</span>
            </label>
          </div>
        </div>

        {/* TEXTAREA */}
        <div>
          <label className="block text-white text-sm font-bold mb-2">
            Notes supplémentaires
          </label>
          <textarea 
            name="notes"
            rows={4}
            className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-md p-3 text-white focus:border-blue-500 outline-none transition-all resize-none placeholder:text-neutral-700"
            placeholder="Détails, questions, objectifs..."
          ></textarea>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin text-center"></div>
          ) : (
            "Confirmer l'événement"
          )}
        </button>
      </form>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};