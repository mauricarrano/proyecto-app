import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { getStudentAttendance, getSubjectsByCareer } from '../services/mockData';
import type { AttendanceRecord, AttendanceStatus, Career } from '../types';
import Card from '../components/ui/Card';
import { UploadIcon, CheckCircleIcon, XIcon } from '../components/Icon';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AttendancePage: React.FC = () => {
  const { user } = useAppContext();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(getStudentAttendance());
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justificationRecordId, setJustificationRecordId] = useState<number | null>(null);
  const [isJustified, setIsJustified] = useState(false);

  if (user?.role !== 'student') {
    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4">Gestión de Asistencias</h2>
            <p className="text-[rgb(var(--color-text-secondary))]">Esta función está implementada actualmente para la vista de alumno. Por favor, inicia sesión como alumno para ver tu registro de asistencias.</p>
        </Card>
    )
  }
  
  const subjects = ['all', ...getSubjectsByCareer(user.career as Career)];
  
  const filteredData = useMemo(() => {
    if (selectedSubject === 'all') {
      return attendanceData;
    }
    return attendanceData.filter(record => record.subject === selectedSubject);
  }, [attendanceData, selectedSubject]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const present = filteredData.filter(r => r.status === 'present').length;
    const absent = filteredData.filter(r => r.status === 'absent').length;
    const justified = filteredData.filter(r => r.status === 'justified').length;
    const late = filteredData.filter(r => r.status === 'late').length;
    return { present, absent, justified, late, total };
  }, [filteredData]);
  
  const pieData = [
      { name: 'Presentes', value: stats.present },
      { name: 'Ausentes', value: stats.absent },
      { name: 'Justificados', value: stats.justified },
      { name: 'Tardes', value: stats.late },
  ].filter(d => d.value > 0);

  const COLORS = {
      Presentes: '#22c55e', // green-500
      Ausentes: '#ef4444', // red-500
      Justificados: '#f59e0b', // amber-500
      Tardes: '#3b82f6', // blue-500
  };

  const handleOpenModal = (recordId: number) => {
    setJustificationRecordId(recordId);
    setIsJustified(false);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setJustificationRecordId(null);
  }

  const handleJustify = () => {
    setTimeout(() => {
        if (justificationRecordId !== null) {
            setAttendanceData(prevData =>
                prevData.map(record =>
                    record.id === justificationRecordId
                        ? { ...record, status: 'justified' }
                        : record
                )
            );
        }
        setIsJustified(true);
    }, 1000);
  }

  const getStatusChip = (status: AttendanceStatus) => {
    const statusStyles: Record<AttendanceStatus, string> = {
        present: "text-green-300 bg-green-500/10 border border-green-500/20",
        absent: "text-red-300 bg-red-500/10 border border-red-500/20",
        justified: "text-amber-300 bg-amber-500/10 border border-amber-500/20",
        late: "text-blue-300 bg-blue-500/10 border border-blue-500/20"
    };
    const statusText: Record<AttendanceStatus, string> = {
        present: 'Presente',
        absent: 'Ausente',
        justified: 'Justificado',
        late: 'Tarde'
    };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>{statusText[status]}</span>;
  }

  const JustificationModal = () => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
            <div className="w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                <Card>
                    <button onClick={handleCloseModal} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <h3 className="text-2xl font-bold mb-4">Justificar Ausencia</h3>
                    {isJustified ? (
                        <div className="text-center p-8">
                            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h4 className="text-xl font-semibold">¡Justificante Enviado!</h4>
                            <p className="text-[rgb(var(--color-text-secondary))] mt-2">Tu justificante ha sido cargado y el estado de la asistencia fue actualizado.</p>
                            <button onClick={handleCloseModal} className="mt-6 bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                                Cerrar
                            </button>
                        </div>
                    ) : (
                        <div>
                            <p className="text-[rgb(var(--color-text-secondary))] mb-6">Sube un certificado médico u otro documento válido para justificar tu ausencia.</p>
                            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-slate-500 transition-colors">
                                <UploadIcon className="w-10 h-10 text-slate-500 mb-3" />
                                <p className="font-semibold">Arrastra y suelta tu archivo aquí</p>
                                <p className="text-sm text-slate-400">o</p>
                                <button className="text-sm font-bold text-[rgb(var(--color-primary))] hover:underline mt-1">
                                    Selecciona un archivo
                                </button>
                                <p className="text-xs text-slate-500 mt-3">PDF, JPG, PNG (Max 5MB)</p>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button 
                                    onClick={handleJustify}
                                    className="bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Enviar Justificante
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Mis Asistencias</h1>
        <div className="relative">
            <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full md:w-64 bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition appearance-none"
            >
                {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject === 'all' ? 'Todas las Materias' : subject}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[rgb(var(--color-text-secondary))]">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
      </div>
      
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Resumen de Asistencia</h2>
        {filteredData.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                  <PieChart>
                      <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                      >
                          {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                          ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                            backgroundColor: 'rgb(var(--color-surface))',
                            borderColor: 'rgba(var(--color-primary), 0.5)',
                            borderRadius: '0.75rem',
                        }}
                      />
                      <Legend formatter={(value, entry) => {
                        const { payload } = entry;
                        return <span className="text-[rgb(var(--color-text-secondary))]">{`${value} (${payload.value})`}</span>;
                      }}/>
                  </PieChart>
              </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center text-[rgb(var(--color-text-secondary))] py-8">No hay datos de asistencia para mostrar.</p>
        )}
      </Card>
      
      <Card>
        <h2 className="text-xl font-semibold mb-4">Registro Detallado</h2>
          <div className="space-y-4 md:hidden">
              {filteredData.map(record => (
                  <div key={record.id} className="bg-slate-800 rounded-lg p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                          <span className="font-bold">{record.subject}</span>
                          {getStatusChip(record.status)}
                      </div>
                      <div className="flex justify-between items-center text-sm text-[rgb(var(--color-text-secondary))]">
                           <span>{record.date}</span>
                            {record.status === 'absent' && (
                                <button 
                                    onClick={() => handleOpenModal(record.id)}
                                    className="font-semibold text-[rgb(var(--color-primary))] hover:underline"
                                >
                                    Justificar
                                </button>
                            )}
                      </div>
                  </div>
              ))}
          </div>
          <table className="w-full text-left hidden md:table">
              <thead className="border-b border-white/10">
                  <tr>
                      <th className="p-3">Fecha</th>
                      <th className="p-3">Materia</th>
                      <th className="p-3 text-center">Estado</th>
                      <th className="p-3 text-right">Acciones</th>
                  </tr>
              </thead>
              <tbody>
                  {filteredData.map(record => (
                      <tr key={record.id} className="border-b border-white/10 last:border-none">
                          <td className="p-3">{record.date}</td>
                          <td className="p-3">{record.subject}</td>
                          <td className="p-3 text-center">{getStatusChip(record.status)}</td>
                          <td className="p-3 text-right">
                              {record.status === 'absent' && (
                                  <button 
                                      onClick={() => handleOpenModal(record.id)}
                                      className="text-sm font-semibold text-[rgb(var(--color-primary))] hover:underline"
                                  >
                                      Justificar
                                  </button>
                              )}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </Card>
      <JustificationModal />
    </div>
  );
};

export default AttendancePage;