import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Card from '../components/ui/Card';
import { ClockIcon, PenSquareIcon, GraduationCapIcon, AttendanceIcon, SendIcon, XIcon, CheckCircleIcon } from '../components/Icon';
import ForumWidget from '../components/ForumWidget';
import { getSchedule, getProfessorAssignmentsToGrade, getProfessorCourses } from '../services/mockData';

interface ProfessorDashboardProps {
    setPage: (page: string) => void;
}

const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ setPage }) => {
    const { user } = useAppContext();
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const schedule = getSchedule(); // Can be filtered for professor later
    const assignmentsToGrade = getProfessorAssignmentsToGrade();
    
    const today = new Date();
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const todayName = dayNames[today.getDay()];
    const todaysClasses = schedule.filter(item => item.day === todayName);

    const formatDueDate = (dueDate: string) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diffInMs = due.getTime() - now.getTime();
        const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays < -1) return `Venció hace ${Math.abs(diffInDays)} días`;
        if (diffInDays === -1) return `Venció ayer`;
        if (diffInDays === 0) return 'Vence hoy';
        if (diffInDays === 1) return 'Vence mañana';
        return `Vence en ${diffInDays} días`;
    };

    const handleSendAnnouncement = () => {
        // Logic to send announcement would go here
        setShowSuccessToast(true);
        setIsAnnouncementModalOpen(false);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    if (!user) return null;

    const AnnouncementModal = () => {
        const courses = useMemo(() => getProfessorCourses(), []);
        const [selectedSubject, setSelectedSubject] = useState(courses[0]?.subject || '');
        const [availableYears, setAvailableYears] = useState<string[]>(courses[0]?.years || []);
        const [selectedYear, setSelectedYear] = useState(courses[0]?.years[0] || '');
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');

        React.useEffect(() => {
            const course = courses.find(c => c.subject === selectedSubject);
            setAvailableYears(course?.years || []);
            setSelectedYear(course?.years[0] || '');
        }, [selectedSubject, courses]);

        if (!isAnnouncementModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsAnnouncementModalOpen(false)}>
                <div className="w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                    <Card>
                        <button onClick={() => setIsAnnouncementModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10"><XIcon /></button>
                        <h3 className="text-2xl font-bold mb-6">Enviar Anuncio</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleSendAnnouncement(); }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Materia</label>
                                    <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none">
                                        {courses.map(c => <option key={c.subject} value={c.subject}>{c.subject}</option>)}
                                        <option value="all">Todas</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Año</label>
                                    <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none" disabled={!selectedSubject || selectedSubject === 'all'}>
                                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                        <option value="all">Todos</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Título</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Descripción</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none" />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="submit" disabled={!title.trim() || !description.trim()} className="bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed">Enviar</button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        );
    };
    
    const SuccessToast = () => {
        if (!showSuccessToast) return null;
        return (
            <div className="fixed top-20 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-out z-50">
                <CheckCircleIcon />
                <span>Anuncio enviado con éxito.</span>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Panel del Profesor</h1>
            <p className="text-md md:text-lg text-[rgb(var(--color-text-secondary))] mb-8">Bienvenido, {user.name}.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card onClick={() => setPage('grades-management')} className="flex items-center gap-4 !p-4 cursor-pointer hover:bg-slate-700/50">
                    <div className="p-3 bg-green-500/10 rounded-lg"><GraduationCapIcon className="w-6 h-6 text-green-400"/></div>
                    <span className="font-semibold">Cargar Notas</span>
                </Card>
                 <Card onClick={() => setPage('attendance-management')} className="flex items-center gap-4 !p-4 cursor-pointer hover:bg-slate-700/50">
                    <div className="p-3 bg-sky-500/10 rounded-lg"><AttendanceIcon className="w-6 h-6 text-sky-400"/></div>
                    <span className="font-semibold">Tomar Asistencia</span>
                </Card>
                 <Card onClick={() => setIsAnnouncementModalOpen(true)} className="flex items-center gap-4 !p-4 cursor-pointer hover:bg-slate-700/50">
                    <div className="p-3 bg-amber-500/10 rounded-lg"><SendIcon className="w-6 h-6 text-amber-400"/></div>
                    <span className="font-semibold">Enviar Anuncio</span>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                            <ClockIcon className="w-6 h-6 text-[rgb(var(--color-primary))]" />
                            <span>Clases de Hoy</span>
                        </h3>
                        {todaysClasses.length > 0 ? (
                            <div className="space-y-3">
                                {todaysClasses.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                                        <div>
                                            <p className="font-semibold">{item.subject}</p>
                                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">{item.time}</p>
                                        </div>
                                        <div className="font-mono text-lg font-bold bg-slate-800 px-3 py-1 rounded">{item.location}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-[rgb(var(--color-text-secondary))] py-4">No tienes clases programadas para hoy.</p>
                        )}
                    </Card>
                     <Card>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                            <PenSquareIcon className="w-6 h-6 text-[rgb(var(--color-primary))]" />
                            <span>Tareas para Corregir</span>
                        </h3>
                         <div className="space-y-4">
                            {assignmentsToGrade.map(assignment => (
                                <div key={assignment.id} className="flex items-start gap-4 p-3 bg-slate-700/50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-semibold">{assignment.title}</p>
                                        <p className="text-sm text-[rgb(var(--color-text-secondary))]">{assignment.subject}</p>
                                        <p className="text-sm font-medium text-amber-400 mt-1">{formatDueDate(assignment.dueDate)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">{`${assignment.submissions}/${assignment.totalStudents}`}</p>
                                        <p className="text-xs text-[rgb(var(--color-text-secondary))]">Entregas</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                 <ForumWidget />
            </div>
            <AnnouncementModal />
            <SuccessToast />
        </div>
    );
};

export default ProfessorDashboard;