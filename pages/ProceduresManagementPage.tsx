import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { getProcedureRequests } from '../services/mockData';
import type { ProcedureRequest } from '../types';
import { ChevronLeftIcon, PenSquareIcon, CheckCircleIcon, XIcon, ClockIcon } from '../components/Icon';

const ProceduresManagementPage: React.FC<{ setPage: (page: string) => void }> = ({ setPage }) => {
    const [requests, setRequests] = useState<ProcedureRequest[]>(getProcedureRequests());
    const [filter, setFilter] = useState<'pending' | 'all'>('pending');

    const handleUpdateRequest = (id: string, status: 'approved' | 'rejected') => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
    };
    
    const filteredRequests = requests.filter(req => filter === 'all' || req.status === 'pending');
    
    const StatusIndicator: React.FC<{ status: ProcedureRequest['status'] }> = ({ status }) => {
        const styles = {
            pending: { icon: <ClockIcon className="w-5 h-5 text-amber-400" />, text: 'Pendiente' },
            approved: { icon: <CheckCircleIcon className="w-5 h-5 text-green-400" />, text: 'Aprobado' },
            rejected: { icon: <XIcon className="w-5 h-5 text-red-400" />, text: 'Rechazado' },
        };
        const textClass = {
            pending: 'text-amber-300',
            approved: 'text-green-300',
            rejected: 'text-red-300',
        }
        return <div className={`flex items-center gap-2 font-medium ${textClass[status]}`}><span className="flex-shrink-0">{styles[status].icon}</span> {styles[status].text}</div>
    };

    return (
        <div>
            <button onClick={() => setPage('dashboard')} className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] font-semibold mb-6">
                <ChevronLeftIcon className="w-5 h-5" />
                Volver al Panel
            </button>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <PenSquareIcon className="w-8 h-8 text-[rgb(var(--color-primary))]"/>
                Gestión de Trámites
            </h1>
            
            <Card>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <h2 className="text-xl font-semibold">Solicitudes de Alumnos</h2>
                    <div className="flex-shrink-0 flex gap-2 p-1 bg-slate-900 rounded-lg self-start sm:self-center">
                        <button onClick={() => setFilter('pending')} className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === 'pending' ? 'bg-slate-700' : 'hover:bg-slate-700/50'}`}>Pendientes</button>
                        <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === 'all' ? 'bg-slate-700' : 'hover:bg-slate-700/50'}`}>Todas</button>
                    </div>
                </div>
                
                <div className="space-y-3">
                    {filteredRequests.map(req => (
                        <div key={req.id} className="p-4 bg-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <p className="font-bold">{req.procedureTitle}</p>
                                <p className="text-sm text-slate-300">{req.studentName} - <span className="font-mono">{req.studentId}</span></p>
                                <p className="text-xs text-slate-400 mt-1">Solicitado: {new Date(req.requestDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-4">
                               <StatusIndicator status={req.status} />
                               {req.status === 'pending' && (
                                   <div className="flex gap-2 border-l border-slate-600 pl-4">
                                       <button onClick={() => handleUpdateRequest(req.id, 'approved')} className="p-2 rounded-full bg-green-500/10 hover:bg-green-500/20" aria-label="Aprobar"><CheckCircleIcon className="w-5 h-5 text-green-400"/></button>
                                       <button onClick={() => handleUpdateRequest(req.id, 'rejected')} className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20" aria-label="Rechazar"><XIcon className="w-5 h-5 text-red-400"/></button>
                                   </div>
                               )}
                            </div>
                        </div>
                    ))}
                    {filteredRequests.length === 0 && <p className="text-center text-slate-400 p-8">No hay solicitudes {filter === 'pending' ? 'pendientes' : 'para mostrar'}.</p>}
                </div>
            </Card>
        </div>
    );
};

export default ProceduresManagementPage;