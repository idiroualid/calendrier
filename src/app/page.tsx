"use client";

import { useState } from 'react';
import { InfoSidebar } from './components/calendar/InfoSidebar';
import { CalendarGrid } from './components/calendar/CalendarGrid';
import { TimePicker } from './components/calendar/TimePicker';
import { BookingForm } from './components/calendar/BookingForm';
import { SuccessView } from './components/calendar/SuccessView';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [isConfirmed, setIsConfirmed] = useState(false); // Étape Formulaire
  const [isFinished, setIsFinished] = useState(false);   // Étape Succès

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white">
      <div className={`
        bg-[#1a1a1a] border border-neutral-800 rounded-xl shadow-2xl 
        flex overflow-hidden transition-all duration-500
        ${isFinished ? 'max-w-3xl' : isConfirmed ? 'max-w-5xl' : selectedDate ? 'max-w-6xl' : 'max-w-4xl'} 
        w-full min-h-[640px]
      `}>
        
        {/* Sidebar : On la cache uniquement sur l'écran de succès final */}
        {!isFinished && (
          <InfoSidebar 
            selectedDate={selectedDate} 
            selectedTime={selectedTime} 
            location={selectedLocation} 
          />
        )}

        {isFinished ? (
          <SuccessView 
            selectedDate={selectedDate!} 
            selectedTime={selectedTime!} 
            location={selectedLocation!} 
          />
        ) : isConfirmed ? (
          <BookingForm 
            selectedDate={selectedDate!} 
            selectedTime={selectedTime!} 
            onLocationChange={setSelectedLocation}
            onBack={() => setIsConfirmed(false)}
            onComplete={() => setIsFinished(true)}
          />
        ) : (
          <>
            <div className={`flex-1 transition-all ${selectedDate ? 'border-r border-neutral-800' : ''}`}>
              <CalendarGrid 
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
              />
            </div>

            {selectedDate && (
              <div className="w-[320px] animate-in fade-in slide-in-from-right-4">
                <TimePicker 
                  selectedDate={selectedDate} 
                  onCancel={() => setSelectedDate(null)}
                  onConfirmTime={(time) => {
                    setSelectedTime(time);
                    setIsConfirmed(true);
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}