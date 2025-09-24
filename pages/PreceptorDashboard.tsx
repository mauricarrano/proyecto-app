import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Card from '../components/ui/Card';
import { AttendanceIcon, SendIcon, StatsIcon, BellIcon, ClockIcon, CheckCircleIcon } from '../components/Icon';
import { getPreceptorTasks } from '../services/mockData';
import type { PreceptorTask } from '../types';

interface PreceptorDashboardProps {
    setPage: (page: string) => void;
    openAnnouncementModal: () => void;
}

const PreceptorDashboard: React.FC<PreceptorDashboardProps> = ({ setPage, openAnnouncementModal }) => {
    const { user } = useAppContext();
    const tasks = getPreceptorTasks();

    const priorityStyles: Record<PreceptorTask['priority'], { icon: React.ReactNode; borderColor: string }> = {
        high: { icon: <BellIcon className="w-5 h-5 text-red-400" />, borderColor: 'border-red-400' },
        medium: { icon: <ClockIcon className="w-5 h-5 text-amber-400" />, borderColor: 'border-amber-400' },
        low: { icon: <CheckCircleIcon className="w-5 h-5 text-sky-400" />, borderColor: 'border-sky-400' },
    };
    
    if (!user) return null;

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Panel del Preceptor</h1>
            <p className="text-md md:text-lg text-[rgb(var(--color-text-secondary))] mb-8">Bienvenido, {user.name}. Aquí tienes un resumen de tu jornada.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Left Column: Actions */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Card onClick={() => setPage('attendance-management')} className="md:col-span-1 flex flex-col items-center justify-center p-6 text-center">
                        <AttendanceIcon className="w-10 h-10 text-sky-400 mb-3"/>
                        <span className="font-semibold text-lg">Gestionar Asistencias</span>
                    </Card>
                    <Card onClick={openAnnouncementModal} className="md:col-span-1 flex flex-col items-center justify-center p-6 text-center">
                        <SendIcon className="w-10 h-10 text-green-400 mb-3"/>
                        <span className="font-semibold text-lg">Enviar Comunicado</span>
                    </Card>
                    <Card onClick={() => setPage('reports')} className="md:col-span-1 flex flex-col items-center justify-center p-6 text-center">
                        <StatsIcon className="w-10 h-10 text-amber-400 mb-3"/>
                        <span className="font-semibold text-lg">Ver Reportes</span>
                    </Card>
                </div>

                {/* Right Column: Pending Tasks */}
                <div className="lg:col-span-2">
                    <Card>
                        <h3 className="text-xl font-semibold mb-4">Tareas Pendientes</h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                            {tasks.map(task => (
                                <button
                                    key={task.id}
                                    onClick={() => task.action && setPage(task.action.target)}
                                    className={`w-full text-left p-4 flex items-start gap-4 rounded-lg border-l-4 bg-slate-800/50 transition-colors hover:bg-slate-700 ${priorityStyles[task.priority].borderColor}`}
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        {priorityStyles[task.priority].icon}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{task.title}</h4>
                                        <p className="text-sm text-[rgb(var(--color-text-secondary))]">{task.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PreceptorDashboard;