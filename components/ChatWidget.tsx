
import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage as ChatMessageType, ChatContact } from '../types';
import { getPreceptorsForChat } from '../services/mockData';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { MessageSquareIcon, XIcon, ChevronLeftIcon, PreceptorIcon, StudentUnionIcon } from './Icon';

// New canned responses
const studentUnionCannedResponses = [
    "Gracias por tu sugerencia, la vamos a plantear en la próxima reunión del centro.",
    "Entendido. Estamos al tanto de la situación y trabajando para encontrar una solución. Te mantendremos informado.",
    "¡Excelente idea! Nos pondremos en contacto contigo para ver cómo podemos llevarla a cabo juntos.",
    "Tu opinión es muy importante para nosotros. Gracias por compartirla.",
];

const preceptorCannedResponses = [
    "Hola, para justificar una inasistencia, necesitas presentar un certificado médico en preceptoría o iniciar el trámite desde la sección 'Trámites'.",
    "Las fechas de finales se publican en la cartelera digital y en la sección 'Agenda' de la app. ¿Ya te fijaste ahí?",
    "Recibido. Voy a consultar tu situación con el departamento de alumnos y te respondo por aquí a la brevedad.",
];

type ChatTarget = {
    id: string;
    name: string;
    type: 'preceptor' | 'student_union';
    avatar: string;
}

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'selection' | 'preceptors' | 'chat'>('selection');
    const [chatTarget, setChatTarget] = useState<ChatTarget | null>(null);
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [preceptors, setPreceptors] = useState<ChatContact[]>([]);
    const chatBodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setPreceptors(getPreceptorsForChat());
    }, []);

    useEffect(() => {
        if (chatBodyRef.current) {
          chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        // Reset state on close after animation
        setTimeout(() => {
            setView('selection');
            setChatTarget(null);
            setMessages([]);
        }, 300);
    };
    
    const startChat = (target: ChatTarget) => {
        setChatTarget(target);
        
        const initialMessage: ChatMessageType = target.type === 'student_union' 
            ? { author: 'student_union', content: '¡Hola! Somos del Centro de Estudiantes. ¿En qué podemos ayudarte? Escuchamos tus propuestas, dudas o inquietudes.' }
            : { author: 'preceptor', content: `¡Hola! Soy ${target.name}. ¿Necesitas ayuda con justificativos, constancias o fechas de examen?` };
            
        setMessages([initialMessage]);
        setView('chat');
    };

    const handleSendMessage = (text: string) => {
        if (!chatTarget) return;

        const userMessage: ChatMessageType = { author: 'user', content: text };
        setMessages(prev => [...prev, userMessage, { author: chatTarget.type, content: '' }]);
        setIsLoading(true);

        setTimeout(() => {
            const responses = chatTarget.type === 'student_union' ? studentUnionCannedResponses : preceptorCannedResponses;
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const responseMessage: ChatMessageType = { author: chatTarget.type, content: randomResponse };
            
            setMessages(prev => [...prev.slice(0, -1), responseMessage]);
            setIsLoading(false);
        }, 1500 + Math.random() * 1000);
    };

    const renderHeader = () => (
        <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2">
                {view !== 'selection' && (
                    <button 
                        onClick={() => setView(view === 'chat' ? (chatTarget?.type === 'preceptor' ? 'preceptors' : 'selection') : 'selection')} 
                        className="p-1 -ml-2 rounded-full hover:bg-white/10"
                    >
                        <ChevronLeftIcon className="w-5 h-5"/>
                    </button>
                )}
                 <h3 className="font-bold text-lg">
                    {view === 'selection' && 'Elige con quién hablar'}
                    {view === 'preceptors' && 'Elige un Preceptor'}
                    {view === 'chat' && `Chat con ${chatTarget?.name}`}
                </h3>
            </div>
            <button onClick={handleClose} className="p-1 rounded-full hover:bg-white/10"><XIcon className="w-5 h-5"/></button>
        </header>
    );

    const renderContent = () => {
        if (view === 'selection') {
            return (
                <div className="p-4 space-y-4">
                    <button onClick={() => setView('preceptors')} className="w-full flex flex-col items-center justify-center p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                        <PreceptorIcon className="w-10 h-10 mb-2 text-sky-400"/>
                        <span className="font-semibold">Preceptor</span>
                    </button>
                    <button onClick={() => startChat({ id: 'student-union', name: 'Centro de Estudiantes', type: 'student_union', avatar: '' })} className="w-full flex flex-col items-center justify-center p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                        <StudentUnionIcon className="w-10 h-10 mb-2 text-green-400"/>
                        <span className="font-semibold">Centro de Estudiantes</span>
                    </button>
                </div>
            );
        }

        if (view === 'preceptors') {
            return (
                <div className="p-2 space-y-2">
                    {preceptors.map(p => (
                        <button key={p.id} onClick={() => startChat({ id: p.id, name: p.name, type: 'preceptor', avatar: p.profilePictureUrl })} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-left">
                            <div className="relative">
                                <img src={p.profilePictureUrl} alt={p.name} className="w-10 h-10 rounded-full" />
                                {p.isOnline && <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[rgb(var(--color-surface))]"></span>}
                            </div>
                            <span className="font-medium">{p.name}</span>
                        </button>
                    ))}
                </div>
            );
        }

        if (view === 'chat') {
            return (
                 <>
                    <div ref={chatBodyRef} className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
                        {messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
                    </div>
                    <div className="p-4 border-t border-white/10 flex-shrink-0">
                        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} placeholder="Escribe tu mensaje..." />
                    </div>
                </>
            );
        }

        return null;
    };


    return (
        <>
            <div className={`fixed bottom-36 right-4 sm:right-6 w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[500px] bg-[rgb(var(--color-surface))] rounded-xl shadow-2xl flex flex-col transition-all duration-300 z-40 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                {renderHeader()}
                {view === 'chat' ? renderContent() : <div className="flex-1 overflow-y-auto custom-scrollbar">{renderContent()}</div>}
            </div>

            <button
                onClick={isOpen ? handleClose : handleOpen}
                className="fixed bottom-20 right-4 sm:right-6 w-14 h-14 bg-[rgb(var(--color-primary))] rounded-full text-black flex items-center justify-center shadow-lg hover:opacity-90 transition-all duration-300 z-50 transform hover:scale-110"
                aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
            >
                {isOpen ? <XIcon /> : <MessageSquareIcon />}
            </button>
        </>
    );
};

export default ChatWidget;