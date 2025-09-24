import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/ui/Card';
import { getProfessorCourses, getStudentsForAttendance } from '../services/mockData';
import type { StudentDailyAttendance, AttendanceStatus } from '../types';
import { ChevronLeftIcon, AttendanceIcon } from '../components/Icon';

interface AttendanceManagementPageProps {
  setPage: (page: string) => void;
}

const AttendanceManagementPage: React.FC<AttendanceManagementPageProps> = ({ setPage }) => {
    const courses = useMemo(() => getProfessorCourses(), []);
    const [selectedSubject, setSelectedSubject] = useState(courses[0]?.subject || '');
    const [availableYears, setAvailableYears] = useState<string[]>(courses[0]?.years || []);
    const [selectedYear, setSelectedYear] = useState(courses[0]?.years[0] || '');
    const [students, setStudents] = useState<StudentDailyAttendance[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    const todayFormatted = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        const course = courses.find(c => c.subject === selectedSubject);
        const years = course?.years || [];
        setAvailableYears(years);
        if (!years.includes(selectedYear)) {
            setSelectedYear(years[0] || '');
        }
    }, [selectedSubject, courses, selectedYear]);
    
    useEffect(() => {
        if (selectedSubject && selectedYear) {
            setIsLoading(true);
            setTimeout(() => {
                setStudents(getStudentsForAttendance(selectedSubject, selectedYear));
                setIsLoading(false);
            }, 500);
        } else {
            setStudents([]);
        }
    }, [selectedSubject, selectedYear]);
    
    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setStudents(prev => 
            prev.map(s => s.id === studentId ? { ...s, status } : s)
        );
    };
    
    const handleSaveAttendance = () => {
        console.log('Saving attendance:', students);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };
    
    const StatusButton: React.FC<{ student: StudentDailyAttendance, status: AttendanceStatus, label: string, color: string }> = ({ student, status, label, color }) => {
        const isSelected = student.status === status;
        return (
            <button 
                onClick={() => handleStatusChange(student.id, status)}
                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${isSelected ? `bg-${color}-500 text-white` : 'bg-slate-700 hover:bg-slate-600'}`}
            >{label}</button>
        )
    };

    return (
        <div>
            <button onClick={() => setPage('dashboard')} className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] font-semibold mb-6">
                <ChevronLeftIcon className="w-5 h-5" />
                Volver al Panel
            </button>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
                <AttendanceIcon className="w-8 h-8 text-[rgb(var(--color-primary))]"/>
                Gestión de Asistencia
            </h1>
            <p className="text-md text-[rgb(var(--color-text-secondary))] mb-6 capitalize">{todayFormatted}</p>
            
            <Card className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <label htmlFor="subject-filter" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Materia</label>
                        <select
                            id="subject-filter"
                            value={selectedSubject}
                            onChange={e => setSelectedSubject(e.target.value)}
                            className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition"
                        >
                            {courses.map(course => <option key={course.subject} value={course.subject}>{course.subject}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="year-filter" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Año</label>
                        <select
                            id="year-filter"
                            value={selectedYear}
                            onChange={e => setSelectedYear(e.target.value)}
                            disabled={availableYears.length === 0}
                            className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition disabled:bg-slate-900 disabled:cursor-not-allowed"
                        >
                            {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-semibold mb-4">Alumnos de {selectedSubject} - {selectedYear}</h2>
                 <div className="space-y-3">
                    {isLoading ? (
                        <p className="text-center p-8">Cargando alumnos...</p>
                    ) : students.length === 0 ? (
                        <p className="text-center p-8 text-[rgb(var(--color-text-secondary))]">Seleccione filtros para ver alumnos.</p>
                    ) : (
                        students.map(student => (
                            <div key={student.id} className="flex flex-col sm:flex-row items-center justify-between p-3 bg-slate-800/50 rounded-lg gap-3">
                                <p className="font-medium">{student.name}</p>
                                <div className="flex items-center gap-2">
                                    <StatusButton student={student} status="present" label="P" color="green" />
                                    <StatusButton student={student} status="absent" label="A" color="red" />
                                    <StatusButton student={student} status="late" label="T" color="amber" />
                                </div>
                            </div>
                        ))
                    )}
                 </div>
                {students.length > 0 && (
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSaveAttendance}
                            className="bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            {showSuccess ? '¡Guardado!' : 'Guardar Asistencia'}
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AttendanceManagementPage;
