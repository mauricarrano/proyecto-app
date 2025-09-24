import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import { getSchedule, getFixedCalendarEvents } from '../services/mockData';
import type { CalendarEvent, CalendarEventType, ScheduleOverride } from '../types';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, XIcon, BookOpenIcon, GraduationCapIcon, TrophyIcon, PartyPopperIcon, PenSquareIcon, ClockIcon, MapPinIcon } from '../components/Icon';
import { useAppContext } from '../hooks/useAppContext';

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const reminderColors = ['#22c55e', '#3b82f6', '#8b5cf6', '#ef4444', '#f97316', '#f59e0b', '#ec4899'];


const SchedulePage: React.FC = () => {
    const { user } = useAppContext();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [userEvents, setUserEvents] = useState<CalendarEvent[]>([]);
    const [scheduleOverrides, setScheduleOverrides] = useState<Record<string, ScheduleOverride>>({});
    
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    const allEvents = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const fixedEvents = getFixedCalendarEvents();
        const weeklySchedule = getSchedule();
        const scheduleEvents: CalendarEvent[] = [];
        const weekDaysMap: Record<string, number> = { 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5 };

        const daysInMonth = getDaysInMonth(year, month);
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            weeklySchedule.forEach(item => {
                if (weekDaysMap[item.day] === dayOfWeek) {
                    const overrideKey = `${dateStr}-${item.subject}`;
                    const override = scheduleOverrides[overrideKey];

                    scheduleEvents.push({
                        date: dateStr,
                        title: item.subject,
                        type: 'class',
                        time: override?.time || item.time,
                        location: override?.location || item.location,
                    });
                }
            });
        }
        
        return [...fixedEvents, ...scheduleEvents, ...userEvents];
    }, [currentDate, userEvents, scheduleOverrides]);

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
    
    const openAddReminderModal = () => setIsReminderModalOpen(true);
    
    const handleAddReminder = (e: React.FormEvent<HTMLFormElement>, title: string, date: Date, color: string) => {
        e.preventDefault();
        if (title.trim()) {
            const newEvent: CalendarEvent = {
                date: date.toISOString().split('T')[0],
                title: title,
                type: 'reminder',
                color: color
            };
            setUserEvents(prev => [...prev, newEvent]);
            setIsReminderModalOpen(false);
        }
    };

    const openEditClassModal = (event: CalendarEvent) => {
        setEditingEvent(event);
        setIsEditModalOpen(true);
    };
    
    const handleEditClass = (e: React.FormEvent<HTMLFormElement>, time: string, location: string) => {
        e.preventDefault();
        if (editingEvent) {
            const overrideKey = `${editingEvent.date}-${editingEvent.title}`;
            setScheduleOverrides(prev => ({
                ...prev,
                [overrideKey]: { time, location }
            }));
            setIsEditModalOpen(false);
            setEditingEvent(null);
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
    
    const canEditSchedule = user?.role === 'professor' || user?.role === 'preceptor';

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
                    {eventsForSelectedDay.map((event, idx) => {
                       const isEditableClass = canEditSchedule && event.type === 'class';
                       const EventWrapper = isEditableClass ? 'button' as const : 'div' as const;
                       
                       return (
                         <EventWrapper 
                            key={idx}
                            onClick={isEditableClass ? () => openEditClassModal(event) : undefined}
                            className={`flex items-start gap-4 p-4 rounded-lg relative overflow-hidden w-full text-left ${eventVisuals[event.type].bg} ${isEditableClass ? 'cursor-pointer hover:ring-2 ring-sky-400' : ''}`}
                         >
                            {(event.type === 'reminder' && event.color) && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: event.color }}></div>
                            )}
                            <div className="flex-shrink-0 pt-1" style={{ color: (event.type === 'reminder' && event.color) ? event.color : undefined }}>
                                {eventVisuals[event.type].icon}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">{event.title}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-1">
                                    {event.time && <p className={`flex items-center gap-1.5 ${eventVisuals[event.type].text}`}><ClockIcon className="w-4 h-4" /> {event.time}</p>}
                                    {event.location && <p className={`flex items-center gap-1.5 ${eventVisuals[event.type].text}`}><MapPinIcon className="w-4 h-4" /> {event.location}</p>}
                                </div>
                            </div>
                            {isEditableClass && <PenSquareIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                        </EventWrapper>
                       )
                    })}
                </div>
            ) : (
                <Card>
                    <p className="text-center text-[rgb(var(--color-text-secondary))]">No hay eventos programados para este día.</p>
                </Card>
            )}
        </div>

        {isReminderModalOpen && <ReminderModal initialDate={selectedDay} onSave={handleAddReminder} onClose={() => setIsReminderModalOpen(false)} />}
        {isEditModalOpen && editingEvent && <EditClassModal event={editingEvent} onSave={handleEditClass} onClose={() => setIsEditModalOpen(false)} />}
    </div>
    );
};

const ReminderModal: React.FC<{ initialDate: Date, onSave: (e: React.FormEvent<HTMLFormElement>, title: string, date: Date, color: string) => void, onClose: () => void }> = ({ initialDate, onSave, onClose }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(initialDate);
    const [color, setColor] = useState(reminderColors[0]);
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                <Card>
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <h3 className="text-2xl font-bold mb-6">Añadir Recordatorio</h3>
                    <form onSubmit={(e) => onSave(e, title, date, color)} className="space-y-5">
                        <div>
                            <label htmlFor="reminder-title" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Título</label>
                            <input
                                id="reminder-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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
                                value={date.toISOString().split('T')[0]}
                                onChange={(e) => {
                                    const dateVal = e.target.value;
                                    if(dateVal) {
                                        setDate(new Date(dateVal + 'T00:00:00'))
                                    }
                                }}
                                className="w-full bg-slate-700/50 rounded-lg p-3 border border-slate-600 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition appearance-none"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Color</label>
                            <div className="flex flex-wrap gap-3">
                                {reminderColors.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white' : ''}`}
                                        style={{ backgroundColor: c }}
                                        aria-label={`Select color ${c}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={!title.trim()}
                                className="bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:bg-slate-600 disabled:cursor-not-allowed"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

const EditClassModal: React.FC<{ event: CalendarEvent, onSave: (e: React.FormEvent<HTMLFormElement>, time: string, location: string) => void, onClose: () => void }> = ({ event, onSave, onClose }) => {
    const [time, setTime] = useState(event.time || '');
    const [location, setLocation] = useState(event.location || '');
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                <Card>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"><XIcon /></button>
                    <h3 className="text-2xl font-bold mb-1">Editar Clase</h3>
                    <p className="text-lg font-semibold text-[rgb(var(--color-primary))] mb-4">{event.title}</p>
                    <form onSubmit={(e) => onSave(e, time, location)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Horario</label>
                            <input type="text" value={time} onChange={e => setTime(e.target.value)} placeholder="ej: 10:00 - 12:00" className="w-full bg-slate-700/50 rounded-lg p-3 border border-slate-600 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Ubicación</label>
                            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="ej: Aula 101" className="w-full bg-slate-700/50 rounded-lg p-3 border border-slate-600 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none"/>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" className="bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity">Guardar Cambios</button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default SchedulePage;