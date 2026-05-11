"use client";

import React, { useEffect, useState } from 'react';
import { format, parseISO, addMinutes, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimePickerProps {
  selectedDate: Date;
  onCancel: () => void;
  onConfirmTime: (time: string) => void;
}

export const TimePicker = ({ selectedDate, onCancel, onConfirmTime }: TimePickerProps) => {
  const [pendingTime, setPendingTime] = useState<string | null>(null);
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateTimeSlots = () => {
    const slots = [];
    let hour = 9;
    let minutes = 0;
    while (hour < 18) {
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

  useEffect(() => {
    let mounted = true;
    const fetchBusySlots = async () => {
      setIsLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      try {
        const res = await fetch(`/api/events?date=${dateStr}`);
        if (!res.ok) throw new Error('Erreur réseau');
        const data = await res.json();
        
        if (mounted && Array.isArray(data)) {
          const occupied = new Set<string>();

          data.forEach((event: any) => {
            // SÉCURITÉ : On vérifie que les deux dates existent avant de les parser
            if (event.start_datetime && event.end_datetime) {
              const start = parseISO(event.start_datetime);
              const end = parseISO(event.end_datetime);

              let current = start;
              // On remplit le Set avec tous les créneaux de 15 min compris dans le RDV
              while (isBefore(current, end)) {
                occupied.add(format(current, 'HH:mm'));
                current = addMinutes(current, 15);
              }
            } else if (event.start_datetime) {
              // Si seul le début existe (vieux test), on bloque juste ce créneau de 15 min
              const timePart = event.start_datetime.split('T')[1];
              occupied.add(timePart.substring(0, 5));
            }
          });

          setBusySlots(Array.from(occupied));
        }
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchBusySlots();
    setPendingTime(null);
    return () => { mounted = false; };
  }, [selectedDate]);

  return (
    <div className="flex-1 p-8 flex flex-col bg-[#1a1a1a] animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h3 className="text-white text-lg font-medium capitalize">
          {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
        {isLoading ? (
          <div className="text-neutral-500 text-sm py-4">Chargement...</div>
        ) : (
          timeSlots.map((time) => {
            const isBusy = busySlots.includes(time);
            const isPending = pendingTime === time;

            return (
              <div key={time} className="flex gap-2 w-full">
                <button
                  disabled={isBusy}
                  onClick={() => setPendingTime(time)}
                  className={`
                    py-3 rounded-md font-bold transition-all border text-center
                    ${isBusy 
                      ? 'w-full bg-neutral-900/50 border-neutral-800 text-neutral-600 cursor-not-allowed opacity-50' 
                      : isPending 
                        ? 'w-1/2 bg-neutral-600 border-neutral-600 text-white' 
                        : 'w-full border-blue-500/30 text-blue-500 hover:border-blue-500 hover:bg-blue-500/10'
                    }
                  `}
                >
                  {time} {isBusy && <span className="ml-2 font-normal text-xs">(Complet)</span>}
                </button>

                {isPending && !isBusy && (
                  <button
                    onClick={() => onConfirmTime(time)}
                    className="w-1/2 bg-blue-600 text-white px-4 py-3 rounded-md font-bold animate-in zoom-in duration-200 hover:bg-blue-700"
                  >
                    Confirmer
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      <button onClick={onCancel} className="mt-8 text-sm text-neutral-500 hover:text-white transition-colors self-start">
        Annuler
      </button>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
};