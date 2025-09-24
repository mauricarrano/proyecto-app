import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Card from '../components/ui/Card';
import { AttendanceIcon, GraduationCapIcon, CalendarIcon, BookOpenIcon, BellIcon, CheckCircleIcon, XIcon, ClockIcon } from '../components/Icon';
import AcademicStats from '../components/AcademicStats';
import { getSchedule, getUpcomingDeadlines } from '../services/mockData';
import ForumWidget from '../components/ForumWidget';
import UpcomingDeadlines from '../components/UpcomingDeadlines';

interface StudentDashboardProps {
  setPage: (page: string) => void;
  initialModal?: string | null;
  clearInitialModal?: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ setPage, initialModal, clearInitialModal }) => {
    const { user } = useAppContext();
    const [modalContent, setModalContent] = useState<null | 'finals' | 'event'>(null);
    const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
    const [isConfirmed, setIsConfirmed] = useState(false);
    
    // Data fetching
    const schedule = getSchedule();
    const deadlines = getUpcomingDeadlines();
    const today = new Date();
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const todayName = dayNames[today.getDay()];
    const todaysClasses = schedule.filter(item => item.day === todayName);

    // For dynamic welcome message
    const deadlinesThisWeek = deadlines.filter(d => {
        const dueDate = new Date(d.dueDate);
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(today.getDate() + 7);
        return dueDate > today && dueDate <= oneWeekFromNow;
    }).length;

    let summaryText = `Hoy tienes ${todaysClasses.length} clase(s)`;
    if (deadlinesThisWeek > 0) {
        summaryText += ` y ${deadlinesThisWeek} entrega(s) esta semana.`
    } else {
        summaryText += '.';
    }

    const handleOpenModal = (modal: 'finals' | 'event') => {
        setSelectedSubjects(new Set());
        setIsConfirmed(false);
        setModalContent(modal);
    };

    // Effect to open a modal if requested from an external component
    React.useEffect(() => {
        if (initialModal && (initialModal === 'finals' || initialModal === 'event')) {
            handleOpenModal(initialModal as 'finals' | 'event');
            clearInitialModal?.();
        }
    }, [initialModal, clearInitialModal]);


    if (!user) return null;
    
    const enrollableSubjects = [
        { subject: 'Algoritmos Avanzados', date: '25 de Julio, 09:00hs' },
        { subject: 'Sistemas Operativos', date: '26 de Julio, 14:00hs' },
        { subject: 'Diseño de Bases de Datos', date: '29 de Julio, 09:00hs' },
        { subject: 'Redes de Computadoras', date: '30 de Julio, 11:00hs' },
        { subject: 'Ingeniería de Software', date: '01 de Agosto, 10:00hs' },
    ];

    const handleSubjectToggle = (subject: string) => {
        const newSelection = new Set(selectedSubjects);
        if (newSelection.has(subject)) {
            newSelection.delete(subject);
        } else {
            newSelection.add(subject);
        }
        setSelectedSubjects(newSelection);
    };

    const notifications = [
        { id: 'finals', title: 'Inscripción a Finales Abierta', description: 'Fecha límite: 20 de Julio', icon: <BookOpenIcon className="text-green-400" />, action: () => handleOpenModal('finals') },
        { id: 'event', title: 'Jornada Estudiantil', description: 'Comienza el próximo Lunes', icon: <BellIcon className="text-sky-400" />, action: () => handleOpenModal('event') },
    ];

    const renderModal = () => {
        if (!modalContent) return null;

        const handleClose = () => setModalContent(null);

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleClose}>
                <div className="w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                    <Card>
                        <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10">
                            <XIcon className="w-6 h-6" />
                        </button>
                        
                        {modalContent === 'finals' && (
                            <div>
                                <div className="pr-8">
                                    <h3 className="text-xl sm:text-2xl font-bold mb-1">Inscripción a Exámenes Finales</h3>
                                    <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-4">Selecciona las materias que deseas rendir.</p>
                                </div>
                                {isConfirmed ? (
                                    <div className="text-center p-8">
                                        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                        <h4 className="text-xl font-semibold">¡Inscripción Exitosa!</h4>
                                        <p className="text-[rgb(var(--color-text-secondary))] mt-2">Te has inscripto correctamente a {selectedSubjects.size} materia(s).</p>
                                        <button onClick={handleClose} className="mt-6 bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                                            Cerrar
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3 max-h-[50vh] sm:max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            {enrollableSubjects.map(subjectInfo => (
                                                <label key={subjectInfo.subject} className="flex items-start p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                                                    <input 
                                                        type="checkbox"
                                                        checked={selectedSubjects.has(subjectInfo.subject)}
                                                        onChange={() => handleSubjectToggle(subjectInfo.subject)}
                                                        className="w-5 h-5 rounded bg-slate-800 border-slate-600 text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 focus:ring-offset-slate-700/50 mt-1 flex-shrink-0"
                                                    />
                                                    <div className="ml-4">
                                                        <span className="font-medium block">{subjectInfo.subject}</span>
                                                        <span className="text-sm text-[rgb(var(--color-text-secondary))] flex items-center gap-1.5 mt-1">
                                                            <CalendarIcon className="w-4 h-4" />
                                                            {subjectInfo.date}
                                                        </span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="mt-6 flex justify-center sm:justify-end">
                                            <button 
                                                onClick={() => setIsConfirmed(true)}
                                                disabled={selectedSubjects.size === 0}
                                                className="w-full sm:w-auto bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:bg-slate-600 disabled:cursor-not-allowed"
                                            >
                                                Confirmar Inscripción
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        
                        {modalContent === 'event' && (
                           <div>
                                <h3 className="text-2xl font-bold mb-4">Jornada Estudiantil</h3>
                                <div className="space-y-4 text-[rgb(var(--color-text-secondary))]">
                                    <p>Un espacio para conectar, aprender y compartir con compañeros y profesores. Habrá charlas, talleres y actividades recreativas.</p>
                                    <div>
                                        <p className="font-semibold text-[rgb(var(--color-text-primary))]">Ubicación:</p>
                                        <p>Salón de Actos Principal</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[rgb(var(--color-text-primary))]">Día y Hora:</p>
                                        <p>Lunes, 15 de Julio - 09:00 hs</p>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button onClick={handleClose} className="bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity">
                                        Entendido
                                    </button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">¡Bienvenido, {user.name}!</h1>
            <p className="text-md md:text-lg text-[rgb(var(--color-text-secondary))] mb-8">{summaryText}</p>

            <Card className="mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                    <ClockIcon className="w-6 h-6 text-[rgb(var(--color-primary))]" />
                    <span>Clases de Hoy <span className="text-base font-normal text-[rgb(var(--color-text-secondary))]">({today.toLocaleDateString('es-ES', { weekday: 'long' })})</span></span>
                </h3>
                {todaysClasses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {todaysClasses.map((item, index) => {
                            const locationParts = item.location.split(' ');
                            const locationType = locationParts[0];
                            const locationNumber = locationParts.slice(1).join(' ');

                            return (
                                <div key={index} className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg">
                                    <div>
                                        <p className="font-semibold">{item.subject}</p>
                                        <p className="text-sm text-[rgb(var(--color-text-secondary))]">{item.time}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-lg font-bold bg-slate-800 px-3 py-1 rounded">{locationNumber || locationType}</p>
                                        <p className="text-xs text-[rgb(var(--color-text-secondary))] capitalize">{locationNumber ? 'Aula' : 'Ubicación'}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-[rgb(var(--color-text-secondary))] py-4">No tienes clases programadas para hoy. ¡Disfruta tu día libre!</p>
                )}
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AcademicStats />
                </div>
                
                <div className="space-y-6">
                    <UpcomingDeadlines />
                    <Card>
                        <h3 className="text-xl font-semibold mb-4">Notificaciones Importantes</h3>
                        <ul className="space-y-2">
                           {notifications.map(item => (
                                <li key={item.id}>
                                    <button onClick={item.action} className="flex items-start gap-4 text-left w-full p-2 -m-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mt-1">{item.icon}</div>
                                        <div>
                                            <h4 className="font-semibold">{item.title}</h4>
                                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">{item.description}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </Card>
                    <ForumWidget />
                </div>
            </div>
            {renderModal()}
        </div>
    );
};

export default StudentDashboard;