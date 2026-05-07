import React from 'react';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
  isToday, isBefore, startOfDay, isSameDay 
} from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarGridProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export const CalendarGrid = ({ currentMonth, setCurrentMonth, selectedDate, onSelectDate }: CalendarGridProps) => {
  const today = startOfDay(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const isFirstMonth = isSameMonth(currentMonth, today);

  return (
    <div className="flex-1 p-8 flex flex-col bg-[#1a1a1a]">
      <h2 className="text-white text-[19px] font-bold mb-10 text-center">Sélectionnez la date et l'heure</h2>
      
      {/* Header Navigation */}
      <div className="flex items-center justify-center gap-8 mb-8">
        <button 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
          disabled={isFirstMonth}
          className={`p-2 rounded-full transition-all ${isFirstMonth ? 'text-neutral-800 cursor-not-allowed' : 'text-blue-500 hover:bg-neutral-800'}`}
        >
          <ChevronLeft size={24}/>
        </button>

        <div className="min-w-[150px] text-center">
          <span className="text-white font-semibold text-lg capitalize tracking-wide">
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </span>
        </div>

        <button 
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
          className="p-2 rounded-full text-blue-500 hover:bg-neutral-800 transition-all"
        >
          <ChevronRight size={24}/>
        </button>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 mb-4 text-center">
        {['LUN.', 'MAR.', 'MER.', 'JEU.', 'VEN.', 'SAM.', 'DIM.'].map(day => (
          <div key={day} className="text-[10px] font-extrabold text-neutral-500 tracking-tighter">{day}</div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-y-2 gap-x-2">
        {calendarDays.map((day, idx) => {
          const isCurrentMonthDay = isSameMonth(day, monthStart);
          const isDayPast = isBefore(day, today);
          const isDisabled = !isCurrentMonthDay || isDayPast;
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <div key={idx} className="flex items-center justify-center">
              <button
                disabled={isDisabled}
                onClick={() => onSelectDate(day)}
                className={`
                  h-12 w-12 flex flex-col items-center justify-center rounded-full text-[15px] font-bold transition-all relative
                  ${isDisabled 
                    ? 'text-neutral-800 cursor-default' 
                    : isSelected
                      ? 'bg-blue-600 text-white' 
                      : 'text-blue-500 bg-blue-500/5 hover:bg-blue-600 hover:text-white'
                  }
                `}
              >
                {format(day, 'd')}
                {isToday(day) && !isDisabled && !isSelected && (
                  <span className="absolute bottom-1.5 w-1 h-1 bg-white rounded-full"></span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Fuseau */}
      <div className="mt-auto pt-6 flex flex-col gap-2 border-t border-neutral-800">
        <div className="flex items-center gap-2 text-white text-[13px] font-bold cursor-pointer hover:bg-neutral-800 w-fit p-1 px-2 rounded transition-colors">
          <Globe size={14} />
          <span>Heure d'Europe centrale ({format(new Date(), 'HH:mm')})</span>
          <span className="text-[10px] ml-1 opacity-60">▼</span>
        </div>
      </div>
    </div>
  );
};