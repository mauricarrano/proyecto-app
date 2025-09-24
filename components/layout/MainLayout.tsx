import React, { useState, useMemo } from 'react';
import Header from './Header';
import BottomNav from './Sidebar';
import StudentDashboard from '../../pages/StudentDashboard';
import ProfessorDashboard from '../../pages/ProfessorDashboard';
import PreceptorDashboard from '../../pages/PreceptorDashboard';
import StudentUnionDashboard from '../../pages/StudentUnionDashboard';
import DirectorDashboard from '../../pages/DirectorDashboard';
import AttendancePage from '../../pages/AttendancePage';
import GradesPage from '../../pages/GradesPage';
import SchedulePage from '../../pages/SchedulePage';
import ChatPage from '../../pages/ChatPage';
import GradesManagementPage from '../../pages/GradesManagementPage';
import AttendanceManagementPage from '../../pages/AttendanceManagementPage';
import ReportsPage from '../../pages/ReportsPage';
import ProceduresPage from '../../pages/ProceduresPage';
import ProceduresManagementPage from '../../pages/ProceduresManagementPage';
import StudentFilePage from '../../pages/StudentFilePage';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../ui/Card';
import { LogoutIcon, SettingsIcon, PenSquareIcon, XIcon, StatsIcon, HelpCircleIcon, CommunicationsIcon, AttendanceIcon, SendIcon, CheckCircleIcon } from '../Icon';
import ChatWidget from '../ChatWidget';
import { getGradesData } from '../../services/mockData';
import type { User, Notification, Career } from '../../types';

const ProfilePage: React.FC<{ setPage: (page: string) => void, openAnnouncementModal: () => void }> = ({ setPage, openAnnouncementModal }) => {
    const { user, logout, updateUser } = useAppContext();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Form states for the settings modal
    const [nameInput, setNameInput] = useState(user?.name || '');
    const [picUrlInput, setPicUrlInput] = useState(user?.profilePictureUrl || '');
    const [aboutMeInput, setAboutMeInput] = useState(user?.aboutMe || '');

    const handleOpenSettings = () => {
        if (!user) return;
        // Reset form state to current user data when opening
        setNameInput(user.name);
        setPicUrlInput(user.profilePictureUrl || '');
        setAboutMeInput(user.aboutMe || '');
        setIsSettingsOpen(true);
    };

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        
        updateUser({
            name: nameInput,
            profilePictureUrl: picUrlInput,
            aboutMe: aboutMeInput,
        });
        
        setIsSettingsOpen(false);
    };
    
    // The grade calculation is needed only for student role
    const gradesData = user?.role === 'student' ? getGradesData() : [];
    const finalGrades = gradesData.map(g => g.finalGrade).filter((g): g is number => g !== null);
    const totalScore = finalGrades.reduce((acc, score) => acc + score, 0);
    const averageScore = finalGrades.length > 0 ? (totalScore / finalGrades.length).toFixed(2) : 'N/A';

    if (!user) return null;

    const { name, email, role, career, profilePictureUrl, aboutMe, studentId, yearOfStudy } = user;
    const roleTextMapping: Record<User['role'], string> = {
        student: 'Alumno',
        professor: 'Profesor',
        preceptor: 'Preceptor',
        student_union_member: 'Centro de Estudiantes',
        director: 'Director',
    };
    const roleText = roleTextMapping[role];

    return (
        <div className="max-w-4xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">Mi Perfil</h1>
                <button onClick={handleOpenSettings} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Configuración">
                    <SettingsIcon className="w-6 h-6 text-[rgb(var(--color-text-secondary))]" />
                </button>
            </div>

            <div className="space-y-6">
                <Card>
                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-6">
                         <div className="relative flex-shrink-0">
                            <img 
                                src={profilePictureUrl || `https://i.pravatar.cc/150?u=${email}`} 
                                alt={name}
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[rgb(var(--color-surface))] ring-2 ring-[rgb(var(--color-primary))]"
                            />
                            <button onClick={handleOpenSettings} className="absolute bottom-0 right-0 bg-[rgb(var(--color-primary))] text-black w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity border-2 border-[rgb(var(--color-surface))]">
                                <PenSquareIcon className="w-4 h-4"/>
                            </button>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{name}</h2>
                            <p className="text-[rgb(var(--color-text-secondary))]">{email}</p>
                            <span className="mt-2 inline-block px-3 py-1 text-sm font-medium bg-[rgb(var(--color-primary))] text-black rounded-full capitalize">{roleText}</span>
                        </div>
                    </div>
                </Card>

                {(aboutMe || role !== 'student') && (
                    <Card>
                         <h3 className="text-xl font-semibold mb-3">Sobre Mí</h3>
                         {aboutMe ? (
                            <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">{aboutMe}</p>
                         ) : (
                            <p className="text-[rgb(var(--color-text-secondary))] italic">No has añadido información sobre ti. ¡Edita tu perfil para añadirla!</p>
                         )}
                    </Card>
                )}

                {role === 'student' && (
                    <Card>
                        <h3 className="text-xl font-semibold mb-4">Información Académica</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <dt className="font-medium text-[rgb(var(--color-text-secondary))]">Carrera</dt>
                                <dd className="font-semibold capitalize">{career}</dd>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <dt className="font-medium text-[rgb(var(--color-text-secondary))]">Año de Cursada</dt>
                                <dd className="font-semibold">{yearOfStudy || 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <dt className="font-medium text-[rgb(var(--color-text-secondary))]">Nº de Legajo</dt>
                                <dd className="font-semibold font-mono">{studentId || 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <dt className="font-medium text-[rgb(var(--color-text-secondary))]">Promedio General</dt>
                                <dd className="font-bold text-lg text-[rgb(var(--color-primary))]">{averageScore}</dd>
                            </div>
                        </dl>
                    </Card>
                )}
                
                <Card>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-3 p-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                        <LogoutIcon />
                        <span>Cerrar Sesión</span>
                    </button>
                </Card>
            </div>
            
            {isSettingsOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsSettingsOpen(false)}>
                    <div className="w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                        <Card className="relative">
                            <button onClick={() => setIsSettingsOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10">
                                <XIcon className="w-6 h-6" />
                            </button>
                            <h3 className="text-2xl font-bold mb-6">Configuración de Perfil</h3>
                            <form onSubmit={handleSaveChanges} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Nombre</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        className="w-full bg-black/20 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="picUrl" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">URL Foto de Perfil</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            id="picUrl"
                                            type="text"
                                            value={picUrlInput}
                                            onChange={(e) => setPicUrlInput(e.target.value)}
                                            className="flex-1 w-full bg-black/20 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition"
                                        />
                                        {picUrlInput && (
                                            <img src={picUrlInput} alt="Preview" className="w-12 h-12 rounded-full object-cover"/>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="aboutMe" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Sobre Mí</label>
                                    <textarea
                                        id="aboutMe"
                                        rows={4}
                                        value={aboutMeInput}
                                        onChange={(e) => setAboutMeInput(e.target.value)}
                                        className="w-full bg-black/20 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition"
                                        placeholder={role === 'student' ? 'Cuéntanos un poco sobre ti...' : 'Añade una breve biografía profesional...'}
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-4 pt-4">
                                    <button type="button" onClick={() => setIsSettingsOpen(false)} className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity">
                                        Guardar Cambios
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


const MainLayout: React.FC = () => {
    const { user } = useAppContext();
    const [page, setPage] = useState('dashboard');
    const [initialModalForDashboard, setInitialModalForDashboard] = useState<string | null>(null);
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const handleNotificationAction = (action: Notification['action']) => {
        if (action.type === 'navigate') {
            setPage(action.target);
        } else if (action.type === 'modal') {
            // Modals are on the dashboard, so navigate there first
            setPage('dashboard');
            setInitialModalForDashboard(action.target);
        }
    };
    
    const handleSendAnnouncement = () => {
        // In a real app, this would trigger an API call
        setShowSuccessToast(true);
        setIsAnnouncementModalOpen(false);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const AnnouncementModal = () => {
        const [title, setTitle] = useState('');
        const [message, setMessage] = useState('');
        const [careerFilter, setCareerFilter] = useState<Career | 'all'>('all');
        const [yearFilter, setYearFilter] = useState('all');
        const [eventDate, setEventDate] = useState('');
        const [location, setLocation] = useState('');

        const yearOptions = ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'];

        if (!isAnnouncementModalOpen) return null;

        const resetAndClose = () => {
            setTitle('');
            setMessage('');
            setCareerFilter('all');
            setYearFilter('all');
            setEventDate('');
            setLocation('');
            setIsAnnouncementModalOpen(false);
        };
        
        return (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={resetAndClose}>
                <div className="w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
                    <Card>
                        <button onClick={resetAndClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10"><XIcon /></button>
                        <h3 className="text-2xl font-bold mb-6">Nuevo Comunicado</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleSendAnnouncement(); }} className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Enviar A</label>
                                <div className="grid grid-cols-2 gap-4">
                                     <select value={careerFilter} onChange={e => setCareerFilter(e.target.value as Career | 'all')} className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none">
                                        <option value="all">Todas las Carreras</option>
                                        <option value="software">Software</option>
                                        <option value="design">Diseño</option>
                                    </select>
                                    <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none">
                                        <option value="all">Todos los Años</option>
                                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Título</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Ej: Recordatorio de Fechas de Examen" className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Mensaje</label>
                                <textarea rows={5} value={message} onChange={e => setMessage(e.target.value)} required placeholder="Escribe aquí el cuerpo del comunicado..." className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Fecha del Evento (Opcional)</label>
                                    <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Ubicación (Opcional)</label>
                                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ej: Aula Magna" className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none" />
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="submit" disabled={!title || !message} className="bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed">Enviar</button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        )
    }
    
    const SuccessToast = () => {
        if (!showSuccessToast) return null;
        return (
            <div className="fixed top-20 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-out z-[60]">
                <CheckCircleIcon />
                <span>Comunicado enviado con éxito.</span>
            </div>
        );
    }

    const renderPage = () => {
        const studentDashboardProps = {
            setPage: setPage,
            initialModal: initialModalForDashboard,
            clearInitialModal: () => setInitialModalForDashboard(null)
        };
        
        const professorDashboardProps = {
            setPage: setPage,
        };
        
        const openAnnouncementModal = () => setIsAnnouncementModalOpen(true);

        const renderDashboard = () => {
            if (!user) return null;
            switch(user.role) {
                case 'student':
                    return <StudentDashboard {...studentDashboardProps} />;
                case 'professor':
                    return <ProfessorDashboard {...professorDashboardProps} />;
                case 'preceptor':
                    return <PreceptorDashboard setPage={setPage} openAnnouncementModal={openAnnouncementModal} />;
                case 'student_union_member':
                    return <StudentUnionDashboard setPage={setPage} />;
                case 'director':
                    return <DirectorDashboard setPage={setPage} openAnnouncementModal={openAnnouncementModal} />;
                default:
                    return <StudentDashboard {...studentDashboardProps} />;
            }
        };

        switch (page) {
            case 'dashboard':
                return renderDashboard();
            case 'attendance':
                return <AttendancePage />;
            case 'grades':
                return <GradesPage />;
            case 'schedule':
                return <SchedulePage />;
            case 'procedures':
                return <ProceduresPage />;
            case 'profile':
                return <ProfilePage setPage={setPage} openAnnouncementModal={() => setIsAnnouncementModalOpen(true)} />;
            case 'communications':
                return <ChatPage />;
            case 'grades-management':
                return <GradesManagementPage setPage={setPage} />;
            case 'attendance-management':
                return <AttendanceManagementPage setPage={setPage} />;
            case 'reports':
                return <ReportsPage setPage={setPage} />;
            case 'procedures-management':
                return <ProceduresManagementPage setPage={setPage} />;
            case 'student-files':
                return <StudentFilePage setPage={setPage} />;
            default:
                return renderDashboard();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-text-primary))]">
            <Header onProfileClick={() => setPage('profile')} onNotificationAction={handleNotificationAction} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[rgb(var(--color-background))] p-4 md:p-6 pb-20">
                {renderPage()}
            </main>
            <BottomNav setPage={setPage} currentPage={page} />
            { user?.role === 'student' && <ChatWidget /> }
            <AnnouncementModal />
            <SuccessToast />
        </div>
    );
};

export default MainLayout;