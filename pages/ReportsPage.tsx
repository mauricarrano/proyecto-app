import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import { getAttendanceSummary, getAtRiskStudents } from '../services/mockData';
import type { Career, AtRiskStudent } from '../types';
import { ChevronLeftIcon, StatsIcon, UserIcon, CommunicationsIcon } from '../components/Icon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportsPageProps {
  setPage: (page: string) => void;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ setPage }) => {
    const [careerFilter, setCareerFilter] = useState<Career>('software');
    const [yearFilter, setYearFilter] = useState('1er Año');

    const attendanceData = useMemo(() => getAttendanceSummary(careerFilter, yearFilter), [careerFilter, yearFilter]);
    const atRiskStudents = useMemo(() => getAtRiskStudents(careerFilter, yearFilter), [careerFilter, yearFilter]);

    const yearOptions = ['1er Año', '2do Año', '3er Año', '4to Año'];

    return (
        <div>
            <button onClick={() => setPage('dashboard')} className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] font-semibold mb-6">
                <ChevronLeftIcon className="w-5 h-5" />
                Volver al Panel
            </button>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <StatsIcon className="w-8 h-8 text-[rgb(var(--color-primary))]"/>
                Reportes Académicos
            </h1>

            <Card className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Carrera</label>
                        <select
                            value={careerFilter}
                            onChange={e => setCareerFilter(e.target.value as Career)}
                            className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition"
                        >
                            <option value="software">Software</option>
                            <option value="design">Diseño</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Año</label>
                        <select
                             value={yearFilter}
                             onChange={e => setYearFilter(e.target.value)}
                            className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition"
                        >
                            {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Resumen de Asistencia General</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={attendanceData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)"/>
                                <XAxis type="number" domain={[0, 100]} tick={{ fill: 'rgb(var(--color-text-secondary))' }} unit="%"/>
                                <YAxis type="category" dataKey="subject" width={80} tick={{ fill: 'rgb(var(--color-text-secondary))' }}/>
                                <Tooltip
                                    cursor={{fill: 'rgba(var(--color-surface), 0.5)'}}
                                    contentStyle={{
                                        backgroundColor: 'rgb(var(--color-surface))',
                                        borderColor: 'rgba(var(--color-primary), 0.5)',
                                        borderRadius: '0.75rem',
                                    }}
                                />
                                <Legend formatter={(value) => <span className="capitalize text-slate-300">{value}</span>} />
                                <Bar dataKey="present" name="Presentes" stackId="a" fill="#22c55e" />
                                <Bar dataKey="absent" name="Ausentes" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-semibold mb-4">Alumnos en Riesgo Académico</h2>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {atRiskStudents.length > 0 ? (
                            atRiskStudents.map(student => (
                                <div key={student.id} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                        <UserIcon className="w-6 h-6 text-slate-400"/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{student.name}</p>
                                        <p className={`text-sm font-medium ${student.reason === 'Baja Asistencia' ? 'text-amber-400' : 'text-red-400'}`}>
                                            {student.reason} en {student.subject}
                                        </p>
                                        <p className="text-xs text-slate-400">{student.value}</p>
                                    </div>
                                    <button className="p-2 rounded-full hover:bg-slate-700 transition-colors" aria-label={`Contactar a ${student.name}`}>
                                        <CommunicationsIcon className="w-5 h-5 text-sky-400"/>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-[rgb(var(--color-text-secondary))] pt-8">No se detectaron alumnos en riesgo con los filtros actuales.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ReportsPage;