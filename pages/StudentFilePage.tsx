import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { searchStudents, getStudentFile } from '../services/mockData';
import type { StudentFile, StudentSearchResult, ObservationRecord, AttendanceStatus } from '../types';
import { ChevronLeftIcon, UserIcon, XIcon, GraduationCapIcon, AttendanceIcon, PenSquareIcon, PlusIcon, ChevronRightIcon } from '../components/Icon';
import { useAppContext } from '../hooks/useAppContext';

// Debounce hook
function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

interface StudentFilePageProps {
  setPage: (page: string) => void;
}

const StudentFilePage: React.FC<StudentFilePageProps> = ({ setPage }) => {
    const { user } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [searchResults, setSearchResults] = useState<StudentSearchResult[]>([]);
    const [selectedStudentFile, setSelectedStudentFile] = useState<StudentFile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [newObservationText, setNewObservationText] = useState('');

    useEffect(() => {
        if (debouncedSearchQuery) {
            setIsSearching(true);
            const results = searchStudents(debouncedSearchQuery);
            setSearchResults(results);
            setIsSearching(false);
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchQuery]);

    const handleSelectStudent = (studentId: string) => {
        setIsLoading(true);
        setTimeout(() => { // Simulate API latency
            const file = getStudentFile(studentId);
            setSelectedStudentFile(file);
            setSearchQuery('');
            setSearchResults([]);
            setIsLoading(false);
        }, 500);
    };

    const handleBackToSearch = () => {
        setSelectedStudentFile(null);
    };

    const handleAddObservation = () => {
        if (!newObservationText.trim() || !user || !selectedStudentFile) return;

        const newObservation: ObservationRecord = {
            id: `obs-${Date.now()}`,
            author: user.name,
            timestamp: new Date().toISOString().split('T')[0],
            content: newObservationText,
        };

        setSelectedStudentFile({
            ...selectedStudentFile,
            observations: [newObservation, ...selectedStudentFile.observations],
        });
        setNewObservationText('');
    };
    
    const getStatusChip = (status: AttendanceStatus) => {
        const styles: Record<AttendanceStatus, string> = {
            present: "bg-green-500/10 text-green-400",
            absent: "bg-red-500/10 text-red-400",
            justified: "bg-amber-500/10 text-amber-400",
            late: "bg-blue-500/10 text-blue-400"
        };
        const text: Record<AttendanceStatus, string> = {
            present: 'P', absent: 'A', justified: 'J', late: 'T'
        };
        return <span title={status} className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full ${styles[status]}`}>{text[status]}</span>;
    };

    const renderGrade = (grade: number | null) => {
        if (grade === null) return <span className="text-slate-500">-</span>;
        const color = grade >= 6 ? 'text-green-400' : 'text-red-400';
        return <span className={`font-semibold ${color}`}>{grade.toFixed(1)}</span>;
    };


    if (isLoading) {
        return <div className="text-center p-12">Cargando...</div>;
    }

    if (selectedStudentFile) {
        const student = selectedStudentFile.user;
        return (
            <div>
                <button onClick={handleBackToSearch} className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] font-semibold mb-6">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Volver a la Búsqueda
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Student Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <div className="text-center">
                                <img src={student.profilePictureUrl || `https://i.pravatar.cc/150?u=${student.email}`} alt={student.name} className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-slate-700 ring-2 ring-[rgb(var(--color-primary))]"/>
                                <h2 className="text-2xl font-bold">{student.name}</h2>
                                <p className="text-[rgb(var(--color-text-secondary))]">{student.email}</p>
                            </div>
                            <dl className="mt-6 space-y-3">
                                <div className="flex justify-between"><dt className="text-slate-400">Legajo</dt><dd className="font-mono">{student.studentId}</dd></div>
                                <div className="flex justify-between"><dt className="text-slate-400">Carrera</dt><dd className="capitalize">{student.career}</dd></div>
                                <div className="flex justify-between"><dt className="text-slate-400">Año</dt><dd>{student.yearOfStudy}</dd></div>
                            </dl>
                        </Card>
                        <Card>
                             <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><AttendanceIcon/> Registro de Asistencia</h3>
                             <div className="max-h-80 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                                {selectedStudentFile.attendance.map(record => (
                                    <div key={record.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-md">
                                        <div>
                                            <p className="text-sm font-medium">{record.subject}</p>
                                            <p className="text-xs text-slate-400">{record.date}</p>
                                        </div>
                                        {getStatusChip(record.status)}
                                    </div>
                                ))}
                             </div>
                        </Card>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                             <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><GraduationCapIcon/> Historial Académico</h3>
                             <div className="max-h-80 overflow-y-auto custom-scrollbar pr-2">
                                <table className="w-full text-left">
                                    <thead><tr className="border-b border-white/10"><th className="p-2">Materia</th><th className="p-2 text-center">1C</th><th className="p-2 text-center">2C</th><th className="p-2 text-center">Final</th></tr></thead>
                                    <tbody>
                                        {selectedStudentFile.grades.map(grade => (
                                            <tr key={grade.subject} className="border-b border-white/10 last:border-none">
                                                <td className="p-2 font-medium">{grade.subject}</td>
                                                <td className="p-2 text-center">{renderGrade(grade.firstSemester)}</td>
                                                <td className="p-2 text-center">{renderGrade(grade.secondSemester)}</td>
                                                <td className="p-2 text-center">{renderGrade(grade.finalGrade)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </Card>
                        <Card>
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><PenSquareIcon/> Observaciones y Seguimiento</h3>
                            <div className="space-y-4">
                                <div>
                                    <textarea 
                                        value={newObservationText}
                                        onChange={e => setNewObservationText(e.target.value)}
                                        rows={3}
                                        placeholder="Añadir nueva observación..."
                                        className="w-full bg-slate-800/50 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none"
                                    />
                                    <button
                                        onClick={handleAddObservation}
                                        disabled={!newObservationText.trim()}
                                        className="mt-2 w-full flex items-center justify-center gap-2 bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-4 rounded-lg hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed"
                                    >
                                        <PlusIcon className="w-5 h-5"/> Guardar Observación
                                    </button>
                                </div>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2 space-y-3 pt-4 border-t border-white/10">
                                    {selectedStudentFile.observations.map(obs => (
                                        <div key={obs.id} className="p-3 bg-slate-800/50 rounded-md">
                                            <p className="text-sm">{obs.content}</p>
                                            <p className="text-xs text-slate-400 mt-2 text-right">{obs.author} - {obs.timestamp}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
         <div>
            <button onClick={() => setPage('dashboard')} className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] font-semibold mb-6">
                <ChevronLeftIcon className="w-5 h-5" />
                Volver al Panel
            </button>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <PenSquareIcon className="w-8 h-8 text-[rgb(var(--color-primary))]"/>
                Consultar Legajos
            </h1>
            <Card>
                <div className="relative mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Buscar alumno por nombre o legajo..."
                        className="w-full bg-slate-800 rounded-lg p-4 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition"
                    />
                </div>

                {isSearching ? <p className="text-center p-4">Buscando...</p> : (
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {searchResults.length > 0 ? (
                             <ul className="divide-y divide-white/10">
                                {searchResults.map(student => (
                                    <li key={student.id}>
                                        <button onClick={() => handleSelectStudent(student.id)} className="w-full flex items-center justify-between text-left p-4 hover:bg-slate-700/50 rounded-lg transition-colors">
                                            <div>
                                                <p className="font-semibold">{student.name}</p>
                                                <p className="text-sm text-slate-400 font-mono">{student.studentId}</p>
                                            </div>
                                            <ChevronRightIcon />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : searchQuery && <p className="text-center text-slate-400 p-8">No se encontraron alumnos.</p> }
                    </div>
                )}
            </Card>
        </div>
    );
};

export default StudentFilePage;
