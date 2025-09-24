import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { getProcedures } from '../services/mockData';
import type { Procedure } from '../types';
import { MaterialsIcon, PenSquareIcon, CalendarIcon, XIcon, CheckCircleIcon } from '../components/Icon';

const ProcedureIcon: React.FC<{ iconName: Procedure['icon'] }> = ({ iconName }) => {
    const className = "w-10 h-10 text-[rgb(var(--color-primary))] mb-4";
    switch (iconName) {
        case 'MaterialsIcon': return <MaterialsIcon className={className} />;
        case 'PenSquareIcon': return <PenSquareIcon className={className} />;
        case 'CalendarIcon': return <CalendarIcon className={className} />;
        default: return <PenSquareIcon className={className} />;
    }
};

const ProceduresPage: React.FC = () => {
    const procedures = getProcedures();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleOpenModal = (procedure: Procedure) => {
        setSelectedProcedure(procedure);
        setIsConfirmed(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProcedure(null);
    };

    const handleConfirm = () => {
        // Simulate API call
        setTimeout(() => {
            setIsConfirmed(true);
        }, 500);
    };

    const ConfirmationModal = () => {
        if (!isModalOpen || !selectedProcedure) return null;

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
                <div className="w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                    <Card>
                        <button onClick={handleCloseModal} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10">
                            <XIcon className="w-6 h-6" />
                        </button>
                        {isConfirmed ? (
                            <div className="text-center p-8">
                                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h4 className="text-xl font-semibold">Trámite Iniciado</h4>
                                <p className="text-[rgb(var(--color-text-secondary))] mt-2">Tu solicitud para "{selectedProcedure.title}" ha sido registrada. Recibirás una notificación cuando se procese.</p>
                                <button onClick={handleCloseModal} className="mt-6 bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                                    Cerrar
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Confirmar Solicitud</h3>
                                <p className="text-lg font-semibold text-[rgb(var(--color-primary))] mb-4">{selectedProcedure.title}</p>
                                <p className="text-[rgb(var(--color-text-secondary))] mb-6">Estás a punto de iniciar este trámite. ¿Deseas continuar?</p>
                                <div className="flex justify-end gap-4">
                                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                                        Cancelar
                                    </button>
                                    <button onClick={handleConfirm} className="bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity">
                                        Confirmar
                                    </button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Trámites y Solicitudes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {procedures.map(procedure => (
                    <Card key={procedure.id} className="flex flex-col text-center items-center">
                        <ProcedureIcon iconName={procedure.icon} />
                        <h2 className="text-xl font-semibold mb-2">{procedure.title}</h2>
                        <p className="text-[rgb(var(--color-text-secondary))] flex-1 mb-6">{procedure.description}</p>
                        <button 
                            onClick={() => handleOpenModal(procedure)}
                            className="w-full bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity mt-auto"
                        >
                            Iniciar Trámite
                        </button>
                    </Card>
                ))}
            </div>
            <ConfirmationModal />
        </div>
    );
};

export default ProceduresPage;
