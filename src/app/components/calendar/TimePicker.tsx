import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimePickerProps {
  selectedDate: Date;
  onCancel: () => void;
  onConfirmTime: (time: string) => void; // Ajout de la prop de confirmation
}

export const TimePicker = ({ selectedDate, onCancel, onConfirmTime }: TimePickerProps) => {
  const [pendingTime, setPendingTime] = useState<string | null>(null);

  // Génération dynamique des créneaux toutes les 15 minutes
  const generateTimeSlots = () => {
    const slots = [];
    let hour = 9;
    let minutes = 0;

    while (hour < 18) { // De 09:00 à 18:00
      const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      slots.push(timeString);
      
      minutes += 15;
      if (minutes === 60) {
        minutes = 0;
        hour += 1;
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="p-8 h-full flex flex-col bg-[#1a1a1a] min-w-[320px] animate-in slide-in-from-right duration-300 border-l border-neutral-800">
      <h3 className="text-white text-lg font-medium mb-8 capitalize">
        {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
      </h3>
      
      {/* Liste des créneaux avec scrollbar personnalisée */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
        {timeSlots.map((time) => {
          const isPending = pendingTime === time;

          return (
            <div key={time} className="flex gap-2">
              <button
                onClick={() => setPendingTime(time)}
                className={`
                  py-3 px-4 border font-bold rounded-md transition-all duration-300 
                  ${isPending 
                    ? 'w-1/2 bg-neutral-600 border-neutral-600 text-white' 
                    : 'w-full border-blue-500/30 text-blue-500 hover:border-blue-500 hover:bg-blue-500/10'
                  }
                `}
              >
                {time}
              </button>

              {isPending && (
                <button
                  onClick={() => onConfirmTime(time)} // Appelle la fonction passée en prop
                  className="w-1/2 bg-blue-600 text-white px-4 py-3 rounded-md font-bold animate-in zoom-in duration-200 hover:bg-blue-700 shadow-lg shadow-blue-900/20"
                >
                  Confirmer
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => {
            setPendingTime(null);
            onCancel();
        }}
        className="mt-8 text-sm text-neutral-500 hover:text-white transition-colors self-start font-medium"
      >
        Annuler
      </button>

      {/* Style CSS pour la scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>
    </div>
  );
};