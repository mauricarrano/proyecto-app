import React from 'react';
import Card from './ui/Card';
import { getUpcomingDeadlines } from '../services/mockData';
import { PenSquareIcon, GraduationCapIcon } from './Icon';
import type { UpcomingDeadline } from '../types';

const DeadlineTypeIcon: React.FC<{ type: 'assignment' | 'exam' }> = ({ type }) => {
    if (type === 'exam') {
        return <GraduationCapIcon className="w-5 h-5 text-red-400" />;
    }
    return <PenSquareIcon className="w-5 h-5 text-sky-400" />;
};

const formatTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffInMs = due.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = Math.round(diffInHours / 24);

    if (diffInHours < 0) return 'Vencido';
    if (diffInHours < 1) return 'Vence en menos de una hora';
    if (diffInHours < 24) return `Vence hoy`;
    if (diffInDays === 1) return `Vence mañana`;
    
    return `Vence en ${diffInDays} días`;
};


const UpcomingDeadlines: React.FC = () => {
    const deadlines = getUpcomingDeadlines();

    return (
        <Card>
            <h3 className="text-xl font-semibold mb-4">Próximos Vencimientos</h3>
            {deadlines.length > 0 ? (
                <ul className="space-y-4">
                    {deadlines.slice(0,4).map(deadline => (
                        <li key={deadline.id} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mt-1">
                                <DeadlineTypeIcon type={deadline.type} />
                            </div>
                            <div>
                                <h4 className="font-semibold">{deadline.title}</h4>
                                <p className="text-sm text-[rgb(var(--color-text-secondary))]">{deadline.subject}</p>
                                <p className="text-sm font-medium text-[rgb(var(--color-primary))] mt-1">{formatTimeRemaining(deadline.dueDate)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-[rgb(var(--color-text-secondary))] py-4">No tienes vencimientos próximos. ¡Buen trabajo!</p>
            )}
        </Card>
    );
};

export default UpcomingDeadlines;
