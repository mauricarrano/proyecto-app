import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { useAppContext } from '../hooks/useAppContext';
import { getInstituteKPIs, getProcedureRequests, getAtRiskStudents } from '../services/mockData';
import type { InstituteKPIs, ProcedureRequest, AtRiskStudent } from '../types';
import { UsersIcon, CheckCircleIcon, GraduationCapIcon, StatsIcon, SendIcon, CalendarIcon, BriefcaseIcon, PenSquareIcon } from '../components/Icon';

interface DirectorDashboardProps {
    setPage: (page: string) => void;
    openAnnouncementModal: () => void;
}

// Fix: Changed icon prop type from React.ReactNode to React.ReactElement to fix a TypeScript error with React.cloneElement.
const KPICard: React.FC<{ icon: React.ReactElement; title: string; value: string | number; color: string; }> = ({ icon, title, value, color }) => (
    <div className="bg-slate-800 p-4 rounded-lg flex items-center gap-4">
        <div className={`p-3 rounded-full bg-${color}-500/10`}>
            {React.cloneElement(icon, { className: `w-6 h-6 text-${color}-400` })}
        </div>
        <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-slate-400">{title}</p>
        </div>
    </div>
);


const DirectorDashboard: React.FC<DirectorDashboardProps> = ({ setPage, openAnnouncementModal }) => {
    const { user } = useAppContext();
    const [kpis, setKpis] = useState<InstituteKPIs | null>(null);
    const [recentProcedures, setRecentProcedures] = useState<ProcedureRequest[]>([]);
    const [atRiskStudents, setAtRiskStudents] = useState<AtRiskStudent[]>([]);

    useEffect(() => {
        // Simulate fetching data
        setKpis(getInstituteKPIs());
        setRecentProcedures(getProcedureRequests().filter(p => p.status === 'pending').slice(0, 3));
        setAtRiskStudents(getAtRiskStudents('software', '1er Año').slice(0,3));
    }, []);

    if (!user) return null;

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Panel de Dirección</h1>
            <p className="text-md md:text-lg text-slate-400 mb-8">Bienvenido, {user.name}. Aquí está la vista general de la institución.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {kpis && <>
                    <KPICard icon={<UsersIcon />} title="Alumnos Totales" value={kpis.totalStudents} color="sky" />
                    <KPICard icon={<BriefcaseIcon />} title="Personal Total" value={kpis.totalStaff} color="green" />
                    <KPICard icon={<CheckCircleIcon />} title="Asistencia General" value={`${kpis.attendanceRate}%`} color="amber" />
                    <KPICard icon={<GraduationCapIcon />} title="Promedio General" value={kpis.averageGrade} color="purple" />
                </>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h3 className="text-xl font-semibold mb-4">Accesos Rápidos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <button onClick={() => setPage('reports')} className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                                <StatsIcon className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                                <span className="font-semibold">Reportes</span>
                            </button>
                            <button onClick={openAnnouncementModal} className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                                <SendIcon className="w-8 h-8 mx-auto mb-2 text-green-400" />
                                <span className="font-semibold">Comunicados</span>
                            </button>
                            <button onClick={() => setPage('schedule')} className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                                <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-sky-400" />
                                <span className="font-semibold">Calendario</span>
                            </button>
                            <button onClick={() => alert('Próximamente: Gestión de Personal')} className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                                <BriefcaseIcon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                                <span className="font-semibold">Personal</span>
                            </button>
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-semibold mb-4">Trámites Pendientes Recientes</h3>
                        <div className="space-y-3">
                            {recentProcedures.length > 0 ? recentProcedures.map(req => (
                                <div key={req.id} className="p-3 bg-slate-800 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{req.procedureTitle}</p>
                                        <p className="text-sm text-slate-400">{req.studentName}</p>
                                    </div>
                                    <button onClick={() => setPage('procedures-management')} className="text-sm font-semibold text-sky-400 hover:underline">Revisar</button>
                                </div>
                            )) : <p className="text-slate-400 text-center py-4">No hay trámites pendientes.</p>}
                        </div>
                    </Card>
                </div>
                <div>
                     <Card>
                        <h3 className="text-xl font-semibold mb-4">Seguimiento de Alumnos</h3>
                        <div className="space-y-3">
                            {atRiskStudents.map(student => (
                                <div key={student.id} className="p-3 bg-slate-800 rounded-lg">
                                    <p className="font-semibold">{student.name}</p>
                                    <p className={`text-sm font-medium ${student.reason === 'Baja Asistencia' ? 'text-amber-400' : 'text-red-400'}`}>
                                        {student.reason}
                                    </p>
                                </div>
                            ))}
                            <button onClick={() => setPage('student-files')} className="w-full mt-4 text-center p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                                Ver todos los legajos
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DirectorDashboard;