import React from 'react';
import Card from '../components/ui/Card';
import { getGradesData } from '../services/mockData';

const GradesPage: React.FC = () => {
    const gradesData = getGradesData();
    
    const finalGrades = gradesData.map(g => g.finalGrade).filter((g): g is number => g !== null);
    const totalScore = finalGrades.reduce((acc, score) => acc + score, 0);
    const averageScore = finalGrades.length > 0 ? (totalScore / finalGrades.length).toFixed(2) : 'N/A';

    const renderGrade = (grade: number | null) => {
        if (grade === null) {
            return <span className="text-sm text-[rgb(var(--color-text-secondary))]">-</span>;
        }
        const isApproved = grade >= 6;
        const colorClass = isApproved ? 'text-green-400' : 'text-red-400';
        return <span className={`font-bold text-lg ${colorClass}`}>{grade.toFixed(1)}</span>;
    };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Mis Notas</h1>
      
      <Card className="mb-8">
        <div className="text-center">
            <div className="text-4xl font-bold text-[rgb(var(--color-primary))]">{averageScore}</div>
            <div className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">Promedio General (Finales)</div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Detalle por Materia</h2>
        
        {/* Mobile View */}
        <div className="space-y-4 md:hidden">
            {gradesData.map((grade, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-3">{grade.subject}</h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-1">1er Cuatri.</p>
                            {renderGrade(grade.firstSemester)}
                        </div>
                        <div>
                            <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-1">2do Cuatri.</p>
                            {renderGrade(grade.secondSemester)}
                        </div>
                        <div>
                            <p className="text-xs text-[rgb(var(--color-primary))] font-semibold mb-1">Nota Final</p>
                            {renderGrade(grade.finalGrade)}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
                <thead className="border-b border-white/10">
                    <tr>
                        <th className="p-3">Materia</th>
                        <th className="p-3 text-center">1er Cuatrimestre</th>
                        <th className="p-3 text-center">2do Cuatrimestre</th>
                        <th className="p-3 text-center">Nota Final</th>
                    </tr>
                </thead>
                <tbody>
                    {gradesData.map((grade, index) => (
                        <tr key={index} className="border-b border-white/10 last:border-none">
                            <td className="p-3 font-medium">{grade.subject}</td>
                            <td className="p-3 text-center">{renderGrade(grade.firstSemester)}</td>
                            <td className="p-3 text-center">{renderGrade(grade.secondSemester)}</td>
                            <td className="p-3 text-center">{renderGrade(grade.finalGrade)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default GradesPage;
