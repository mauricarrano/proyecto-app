import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from './ui/Card';
import { getGradesData } from '../services/mockData';

const AcademicStats: React.FC = () => {
    const gradesData = getGradesData();
    
    const abbreviateSubject = (subject: string): string => {
        const abbreviations: Record<string, string> = {
            'Algoritmos': 'Algo.',
            'Sist. Operativos': 'Sist. Op.',
            'Bases de Datos': 'BD',
            'Ing. de Software': 'Ing. Soft.',
            'Int. Artificial': 'IA',
        };
        return abbreviations[subject] || subject;
    };

    // Process data for chart: use final grade, fallback to 2nd sem, then 1st sem.
    const chartData = gradesData.map(stat => ({
        subject: abbreviateSubject(stat.subject),
        score: stat.finalGrade ?? stat.secondSemester ?? stat.firstSemester ?? 0,
    })).filter(stat => stat.score > 0);

    const totalScore = chartData.reduce((acc, stat) => acc + stat.score, 0);
    const averageScore = chartData.length > 0 ? (totalScore / chartData.length).toFixed(2) : 'N/A';

    return (
        <Card className="h-[480px]">
            <h3 className="text-xl font-semibold mb-4">Estadísticas Académicas</h3>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 20,
                        left: -10,
                        bottom: 20, // Increased bottom margin for label space
                    }}
                >
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="rgb(var(--color-primary))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="rgb(var(--color-primary))" stopOpacity={0.2}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                        dataKey="subject" 
                        tick={{ fill: 'rgb(var(--color-text-secondary))', fontSize: 12 }} 
                        angle={-45} // Increased angle for better fit
                        textAnchor="end"
                        height={60}
                        interval={0}
                    />
                    <YAxis 
                        domain={[0, 10]} 
                        tick={{ fill: 'rgb(var(--color-text-secondary))', fontSize: 12 }} 
                    />
                    <Tooltip
                        cursor={{fill: 'rgba(var(--color-surface), 0.5)'}}
                        contentStyle={{
                            backgroundColor: 'rgb(var(--color-surface))',
                            borderColor: 'rgba(var(--color-primary), 0.5)',
                            borderRadius: '0.75rem',
                        }}
                        labelStyle={{ color: 'rgb(var(--color-text-primary))' }}
                    />
                    <Legend 
                        wrapperStyle={{ color: 'rgb(var(--color-text-primary))' }}
                        formatter={(value) => `Rendimiento Actual (Promedio: ${averageScore})`}
                    />
                    <Bar dataKey="score" name="Nota" fill="url(#colorScore)" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default AcademicStats;