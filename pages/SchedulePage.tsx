import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import { getSchedule, getFixedCalendarEvents } from '../services/mockData';
import type { CalendarEvent, CalendarEventType } from '../types';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, XIcon, BookOpenIcon, GraduationCapIcon, TrophyIcon, PartyPopperIcon, PenSquareIcon } from '../components/Icon';
import { useAppContext } from '../hooks/useAppContext';

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const reminderColors = ['#22c55e', '#3b82f6', '#8b5cf6', '#ef4444', '#f97316', '#f59e0b', '#ec4899'];


const SchedulePage: React.FC = () => {
    const { user } = useAppContext();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [userEvents, setUserEvents] = useState<CalendarEvent[]>([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reminderTitle, setReminderTitle] = useState('');
    const [reminderDate, setReminderDate] = useState(new Date());
    const [reminderColor, setReminderColor] = useState(reminderColors[0]);

    const allEvents = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const fixedEvents = getFixedCalendarEvents();

        // Preceptors have a clean schedule, only fixed events and their own reminders.
        if (user?.role === 'preceptor') {
            return [...fixedEvents, ...userEvents];
        }

        // For students and professors, add class schedules
        const weeklySchedule = getSchedule();
        const scheduleEvents: CalendarEvent[] = [];
        const weekDaysMap: Record<string, number> = { 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5 };

        // Generate schedule events for the entire viewed month
        const daysInMonth = getDaysInMonth(year, month);
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            
            weeklySchedule.forEach(item => {
                if (weekDaysMap[item.day] === dayOfWeek) {
                    scheduleEvents.push({
                        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                        title: item.subject,
                        type: 'class',
                        time: item.time
                    });
                }
            });
        }
        
        return [...fixedEvents, ...scheduleEvents, ...userEvents];
    }, [currentDate, userEvents, user]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    let firstDayIndex = getFirstDayOfMonth(year, month);
    firstDayIndex = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;

    const goToPrevMonth = () => {
        const newDate = new Date(year, month - 1, 1);
        setCurrentDate(newDate);
        setSelectedDay(newDate);
    };
    const goToNextMonth = () => {
        const newDate = new Date(year, month + 1, 1);
        setCurrentDate(newDate);
        setSelectedDay(newDate);
    };

    const handleDayClick = (day: number) => {
        setSelectedDay(new Date(year, month, day));
    };
    
    const openAddReminderModal = () => {
        setReminderTitle('');
        setReminderColor(reminderColors[0]);
        setReminderDate(selectedDay);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAddReminder = (e: React.FormEvent) => {
        e.preventDefault();
        if (reminderTitle.trim()) {
            const newEvent: CalendarEvent = {
                date: reminderDate.toISOString().split('T')[0],
                title: reminderTitle,
                type: 'reminder',
                color: reminderColor
            };
            setUserEvents(prev => [...prev, newEvent]);
            closeModal();
        }
    };
    
    const eventVisuals: Record<CalendarEventType, { dotColor: string; icon: React.ReactNode; text: string; bg: string }> = {
        class:    { dotColor: '#0ea5e9',    icon: <BookOpenIcon className="w-5 h-5 text-sky-400"/>,        text: 'text-sky-300',    bg: 'bg-sky-500/10' },
        exam:     { dotColor: '#ef4444',    icon: <GraduationCapIcon className="w-5 h-5 text-red-400"/>,  text: 'text-red-300',    bg: 'bg-red-500/10' },
        final:    { dotColor: '#a855f7', icon: <TrophyIcon className="w-5 h-5 text-purple-400"/>,      text: 'text-purple-300', bg: 'bg-purple-500/10' },
        event:    { dotColor: '#f59e0b',  icon: <PartyPopperIcon className="w-5 h-5 text-amber-400"/>,  text: 'text-amber-300',  bg: 'bg-amber-500/10' },
        reminder: { dotColor: '#22c55e',  icon: <PenSquareIcon className="w-5 h-5 text-green-400"/>,    text: 'text-green-300',  bg: 'bg-green-500/10' },
    };
    
    const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    const eventsForSelectedDay = allEvents.filter(e => {
        const eventDate = new Date(e.date + 'T12:00:00Z'); // Use noon UTC to avoid timezone issues
        return eventDate.toDateString() === selectedDay.toDateString();
    });

    return (
    <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Agenda</h1>
            <button
                onClick={openAddReminderModal}
                className="flex items-center justify-center gap-2 bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
                <PlusIcon className="w-5 h-5" />
                <span>Añadir Recordatorio</span>
            </button>
        </div>

        <Card>
            <div className="flex items-center justify-between mb-4">
                <button onClick={goToPrevMonth} className="p-2 rounded-full hover:bg-white/10"><ChevronLeftIcon /></button>
                <h2 className="text-xl font-bold capitalize">{currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-white/10"><ChevronRightIcon /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[rgb(var(--color-text-secondary))] mb-2">
                {weekDays.map(day => <div key={day} className="text-xs md:text-sm">{day.substring(0,3)}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`empty-${i}`} className="rounded-lg"></div>)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(year, month, day);
                    const today = new Date();
                    const isToday = today.toDateString() === date.toDateString();
                    const isSelected = selectedDay.toDateString() === date.toDateString();
                    
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const eventsForDay = allEvents.filter(e => e.date === dateStr);

                    return (
                        <div key={day} onClick={() => handleDayClick(day)} className={`relative h-16 md:h-24 rounded-lg p-1.5 flex flex-col items-center cursor-pointer transition-all duration-200 ${isSelected ? 'bg-slate-700/80 ring-2 ring-[rgb(var(--color-primary))]' : 'bg-slate-800/50 hover:bg-slate-700/50'}`}>
                            <span className={`text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full transition-colors ${isToday ? 'bg-[rgb(var(--color-primary))] text-black' : ''} ${isSelected ? 'text-white' : ''}`}>{day}</span>
                            <div className="flex-1 flex items-center justify-center gap-1 mt-1">
                                {eventsForDay.slice(0, 4).map((event, idx) => (
                                    <div 
                                        key={idx} 
                                        title={event.title} 
                                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full`}
                                        style={{ 
                                            backgroundColor: (event.type === 'reminder' && event.color) 
                                                ? event.color 
                                                : eventVisuals[event.type].dotColor
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>

        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Eventos del {selectedDay.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</h2>
            {eventsForSelectedDay.length > 0 ? (
                <div className="space-y-3">
                    {eventsForSelectedDay.map((event, idx) => (
                        <div key={idx} className={`flex items-center gap-4 p-4 rounded-lg relative overflow-hidden ${eventVisuals[event.type].bg}`}>
                             {(event.type === 'reminder' && event.color) && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: event.color }}></div>
                            )}
                            <div className="flex-shrink-0" style={{ color: (event.type === 'reminder' && event.color) ? event.color : undefined }}>
                                {eventVisuals[event.type].icon}
                            </div>
                            <div>
                                <p className="font-semibold">{event.title}</p>
                                {event.time && <p className={`text-sm ${eventVisuals[event.type].text}`}>{event.time}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Card>
                    <p className="text-center text-[rgb(var(--color-text-secondary))]">No hay eventos programados para este día.</p>
                </Card>
            )}
        </div>

        {isModalOpen && (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
                <div className="w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                    <Card>
                         <button onClick={closeModal} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10">
                            <XIcon className="w-6 h-6" />
                        </button>
                        <h3 className="text-2xl font-bold mb-6">Añadir Recordatorio</h3>
                        <form onSubmit={handleAddReminder} className="space-y-5">
                            <div>
                                <label htmlFor="reminder-title" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Título</label>
                                <input
                                    id="reminder-title"
                                    type="text"
                                    value={reminderTitle}
                                    onChange={(e) => setReminderTitle(e.target.value)}
                                    placeholder="Ej: Estudiar para Redes"
                                    autoFocus
                                    className="w-full bg-slate-700/50 rounded-lg p-3 border border-slate-600 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition"
                                />
                            </div>

                             <div>
                                <label htmlFor="reminder-date" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Fecha</label>
                                <input
                                    id="reminder-date"
                                    type="date"
                                    value={reminderDate.toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        const dateVal = e.target.value;
                                        if(dateVal) {
                                            setReminderDate(new Date(dateVal + 'T00:00:00'))
                                        }
                                    }}
                                    className="w-full bg-slate-700/50 rounded-lg p-3 border border-slate-600 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition appearance-none"
                                />
                            </div>
                           
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {reminderColors.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setReminderColor(color)}
                                            className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${reminderColor === color ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white' : ''}`}
                                            style={{ backgroundColor: color }}
                                            aria-label={`Select color ${color}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={!reminderTitle.trim()}
                                    className="bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:bg-slate-600 disabled:cursor-not-allowed"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        )}
    </div>
    );
};

export default SchedulePage;