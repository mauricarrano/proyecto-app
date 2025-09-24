import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/ui/Card';
import { getProfessorCourses, getStudentsForGrades } from '../services/mockData';
import type { StudentGradeRecord } from '../types';
import { ChevronLeftIcon, GraduationCapIcon } from '../components/Icon';

interface GradesManagementPageProps {
  setPage: (page: string) => void;
}

const GradesManagementPage: React.FC<GradesManagementPageProps> = ({ setPage }) => {
    const courses = useMemo(() => getProfessorCourses(), []);
    const [selectedSubject, setSelectedSubject] = useState(courses[0]?.subject || '');
    const [availableYears, setAvailableYears] = useState<string[]>(courses[0]?.years || []);
    const [selectedYear, setSelectedYear] = useState(courses[0]?.years[0] || '');
    const [students, setStudents] = useState<StudentGradeRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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
            // Simulate API call
            setTimeout(() => {
                setStudents(getStudentsForGrades(selectedSubject, selectedYear));
                setIsLoading(false);
            }, 500);
        } else {
            setStudents([]);
        }
    }, [selectedSubject, selectedYear]);

    const handleGradeChange = (studentId: string, semester: 'firstSemester' | 'secondSemester', value: string) => {
        const grade = value === '' ? null : parseInt(value, 10);
        if (grade !== null && (isNaN(grade) || grade < 1 || grade > 10)) return;

        setStudents(prev => 
            prev.map(s => s.id === studentId ? { ...s, [semester]: grade } : s)
        );
    };

    const handleSaveChanges = () => {
        console.log('Saving grades:', students);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const gradeInput = (student: StudentGradeRecord, semester: 'firstSemester' | 'secondSemester') => (
      <input
          type="number"
          min="1" max="10"
          value={student[semester] ?? ''}
          onChange={e => handleGradeChange(student.id, semester, e.target.value)}
          className="w-full sm:w-20 bg-slate-800 text-center rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition"
      />
    );

    return (
        <div>
            <button onClick={() => setPage('dashboard')} className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] font-semibold mb-6">
                <ChevronLeftIcon className="w-5 h-5" />
                Volver al Panel
            </button>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <GraduationCapIcon className="w-8 h-8 text-[rgb(var(--color-primary))]"/>
                Gestión de Notas
            </h1>
            
            <Card className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
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
                     <div className="md:col-span-1">
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
                 
                {/* Mobile View */}
                <div className="space-y-4 md:hidden">
                    {isLoading ? (
                        <p className="text-center p-8">Cargando alumnos...</p>
                    ) : students.length === 0 ? (
                        <p className="text-center p-8 text-[rgb(var(--color-text-secondary))]">Seleccione filtros para ver alumnos.</p>
                    ) : (
                        students.map(student => (
                            <div key={student.id} className="bg-slate-800/50 rounded-lg p-4">
                                <div className="mb-3">
                                    <p className="font-medium">{student.name}</p>
                                    <p className="font-mono text-sm text-[rgb(var(--color-text-secondary))]">{student.studentId}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1">1er Cuatr.</label>
                                        {gradeInput(student, 'firstSemester')}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1">2do Cuatr.</label>
                                        {gradeInput(student, 'secondSemester')}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left min-w-[500px]">
                        <thead className="border-b border-white/10">
                            <tr>
                                <th className="p-3">Legajo</th>
                                <th className="p-3">Nombre</th>
                                <th className="p-3 text-center">1er Cuatr.</th>
                                <th className="p-3 text-center">2do Cuatr.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center p-8">Cargando alumnos...</td></tr>
                            ) : students.length === 0 ? (
                                <tr><td colSpan={4} className="text-center p-8 text-[rgb(var(--color-text-secondary))]">Seleccione filtros para ver alumnos.</td></tr>
                            ) : (
                                students.map(student => (
                                    <tr key={student.id} className="border-b border-white/10 last:border-none hover:bg-white/5">
                                        <td className="p-3 font-mono text-sm text-[rgb(var(--color-text-secondary))]">{student.studentId}</td>
                                        <td className="p-3 font-medium">{student.name}</td>
                                        <td className="p-3 text-center">
                                            {gradeInput(student, 'firstSemester')}
                                        </td>
                                        <td className="p-3 text-center">
                                            {gradeInput(student, 'secondSemester')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {students.length > 0 && (
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSaveChanges}
                            className="w-full md:w-auto bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            {showSuccess ? '¡Guardado!' : 'Guardar Cambios'}
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default GradesManagementPage;