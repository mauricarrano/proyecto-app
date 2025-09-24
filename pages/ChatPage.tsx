import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getConversations, getProfessorCourses, getConversationDetails, getPreceptorConversations } from '../services/mockData';
import type { Conversation, FullConversation, ChatMessage as ChatMessageType } from '../types';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { UserIcon, ChevronLeftIcon, ProfessorIcon, StudentIcon } from '../components/Icon';
import { useAppContext } from '../hooks/useAppContext';

const ConversationListItem: React.FC<{ conversation: Conversation; isSelected: boolean; onSelect: (id: string) => void; }> = ({ conversation, isSelected, onSelect }) => (
    <button 
        onClick={() => onSelect(conversation.id)}
        className={`w-full text-left p-3 flex items-center gap-3 rounded-lg transition-colors ${isSelected ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
    >
        <div className="relative flex-shrink-0">
            <img src={conversation.profilePictureUrl || 'https://i.pravatar.cc/150?u=default'} alt={conversation.name} className="w-12 h-12 rounded-full object-cover" />
            {conversation.isOnline && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-[rgb(var(--color-surface))]"></span>}
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold truncate">{conversation.name}</h3>
                <p className="text-xs text-slate-400 flex-shrink-0">{conversation.lastMessageTimestamp}</p>
            </div>
            <div className="flex justify-between items-start mt-1">
                <p className="text-sm text-slate-400 truncate">{conversation.lastMessage}</p>
                {conversation.unreadCount > 0 && <span className="text-xs font-bold bg-[rgb(var(--color-primary))] text-black w-5 h-5 flex items-center justify-center rounded-full">{conversation.unreadCount}</span>}
            </div>
        </div>
    </button>
);

const PreceptorCommunicationsView: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'students' | 'professors'>('all');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<FullConversation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const allConversations = getPreceptorConversations();
        if (filter === 'all') {
            setConversations(allConversations);
        } else {
            setConversations(allConversations.filter(c => c.type === (filter === 'students' ? 'student' : 'professor')));
        }
    }, [filter]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation?.messages]);

    const handleSelectConversation = (id: string) => {
        const fullConvo = getConversationDetails(id);
        setSelectedConversation(fullConvo);
        setConversations(prev => prev.map(c => c.id === id ? {...c, unreadCount: 0} : c));
    };

    const handleSendMessage = (text: string) => {
        if (!selectedConversation) return;

        const preceptorMessage: ChatMessageType = { author: 'preceptor', content: text };
        
        const updatedMessages = [...selectedConversation.messages, preceptorMessage];
        const updatedConversation = { ...selectedConversation, messages: updatedMessages, lastMessage: text };
        setSelectedConversation(updatedConversation);
        
        setIsLoading(true);
        setTimeout(() => {
             // Simulate student/professor seeing the message and do not send auto-reply
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="flex h-full -mx-4 -my-4 md:-mx-6 md:-my-6 bg-slate-900">
            {/* Conversation List Sidebar */}
            <aside className={`w-full md:w-1/3 lg:w-1/4 h-full flex flex-col border-r border-white/10 bg-[rgb(var(--color-surface))] ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                <header className="p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold mb-4">Comunicaciones</h2>
                    <div className="flex gap-2 p-1 bg-slate-900 rounded-lg">
                        <button onClick={() => setFilter('all')} className={`w-full px-3 py-1.5 text-sm rounded-md transition-colors ${filter === 'all' ? 'bg-slate-700' : 'hover:bg-slate-700/50'}`}>Todos</button>
                        <button onClick={() => setFilter('students')} className={`w-full px-3 py-1.5 text-sm rounded-md transition-colors ${filter === 'students' ? 'bg-slate-700' : 'hover:bg-slate-700/50'}`}>Alumnos</button>
                        <button onClick={() => setFilter('professors')} className={`w-full px-3 py-1.5 text-sm rounded-md transition-colors ${filter === 'professors' ? 'bg-slate-700' : 'hover:bg-slate-700/50'}`}>Profes</button>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {conversations.map(convo => (
                        <ConversationListItem 
                            key={convo.id} 
                            conversation={convo}
                            isSelected={selectedConversation?.id === convo.id}
                            onSelect={handleSelectConversation}
                        />
                    ))}
                </div>
            </aside>

             {/* Chat View */}
             <main className={`w-full md:w-2/3 lg:w-3/4 h-full flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
                {selectedConversation ? (
                    <>
                        <header className="flex-shrink-0 flex items-center gap-4 p-4 border-b border-white/10 bg-[rgb(var(--color-surface))]">
                            <button onClick={() => setSelectedConversation(null)} className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/10">
                                <ChevronLeftIcon />
                            </button>
                             <div className="relative flex-shrink-0">
                                <img src={selectedConversation.profilePictureUrl || `https://i.pravatar.cc/150?u=${selectedConversation.id}`} alt={selectedConversation.name} className="w-11 h-11 rounded-full object-cover" />
                                {selectedConversation.isOnline && <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[rgb(var(--color-surface))]"></span>}
                            </div>
                            <div>
                                <h1 className="font-bold">{selectedConversation.name}</h1>
                                {selectedConversation.isOnline && <p className="text-sm text-green-400">En línea</p>}
                            </div>
                        </header>
                        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                            {selectedConversation.messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
                            <div ref={messagesEndRef} />
                        </div>
                        <footer className="p-4 border-t border-white/10 bg-[rgb(var(--color-surface))]">
                            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} placeholder="Escribe tu respuesta..." />
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                            <UserIcon className="w-12 h-12 text-slate-500" />
                        </div>
                        <h2 className="text-xl font-semibold">Selecciona una conversación</h2>
                        <p className="text-slate-400 max-w-xs mt-2">Elige un alumno o profesor de la lista para ver el historial de chat y enviar mensajes.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

const ProfessorChatView: React.FC = () => {
    const courses = useMemo(() => getProfessorCourses(), []);
    const uniqueYears = useMemo(() => {
        const years = new Set<string>();
        courses.forEach(c => c.years.forEach(y => years.add(y)));
        return ['all', ...Array.from(years).sort()];
    }, [courses]);
    const [yearFilter, setYearFilter] = useState<string>('all');

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<FullConversation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setConversations(getConversations(yearFilter));
    }, [yearFilter]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation?.messages]);

    const handleSelectConversation = (id: string) => {
        const fullConvo = getConversationDetails(id);
        setSelectedConversation(fullConvo);
        setConversations(prev => prev.map(c => c.id === id ? {...c, unreadCount: 0} : c));
    };
    
    const handleSendMessage = (text: string) => {
        if (!selectedConversation) return;

        const userMessage: ChatMessageType = { author: 'user', content: text };
        
        const updatedMessages = [...selectedConversation.messages, userMessage];
        const updatedConversation = { ...selectedConversation, messages: updatedMessages, lastMessage: text };
        setSelectedConversation(updatedConversation);
        
        setIsLoading(true);
        setTimeout(() => {
            const replyAuthor = selectedConversation.id.startsWith('prof-') || selectedConversation.id === 'preceptor' ? 'professor' : 'student';
            const replyMessage: ChatMessageType = { author: replyAuthor, content: 'Recibido, te responderé a la brevedad.'};
            setSelectedConversation(prev => {
                if (!prev) return null;
                return { ...prev, messages: [...prev.messages, replyMessage] };
            });
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="flex h-full -mx-4 -my-4 md:-mx-6 md:-my-6 bg-slate-900">
            {/* Conversation List Sidebar */}
            <aside className={`w-full md:w-1/3 lg:w-1/4 h-full flex flex-col border-r border-white/10 bg-[rgb(var(--color-surface))] ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                <header className="p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold mb-4">Comunicaciones</h2>
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition"
                    >
                        {uniqueYears.map(year => <option key={year} value={year}>{year === 'all' ? 'Todos los Años' : year}</option>)}
                    </select>
                </header>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {conversations.map(convo => (
                        <ConversationListItem 
                            key={convo.id} 
                            conversation={convo}
                            isSelected={selectedConversation?.id === convo.id}
                            onSelect={handleSelectConversation}
                        />
                    ))}
                </div>
            </aside>

            {/* Chat View */}
            <main className={`w-full md:w-2/3 lg:w-3/4 h-full flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
                {selectedConversation ? (
                    <>
                        <header className="flex-shrink-0 flex items-center gap-4 p-4 border-b border-white/10 bg-[rgb(var(--color-surface))]">
                            <button onClick={() => setSelectedConversation(null)} className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/10">
                                <ChevronLeftIcon />
                            </button>
                             <div className="relative flex-shrink-0">
                                <img src={selectedConversation.profilePictureUrl || `https://i.pravatar.cc/150?u=${selectedConversation.id}`} alt={selectedConversation.name} className="w-11 h-11 rounded-full object-cover" />
                                {selectedConversation.isOnline && <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[rgb(var(--color-surface))]"></span>}
                            </div>
                            <div>
                                <h1 className="font-bold">{selectedConversation.name}</h1>
                                {selectedConversation.isOnline && <p className="text-sm text-green-400">En línea</p>}
                            </div>
                        </header>
                        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                            {selectedConversation.messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
                            {isLoading && <ChatMessage message={{ author: selectedConversation.id.startsWith('prof-') ? 'professor' : 'student', content: '' }} />}
                            <div ref={messagesEndRef} />
                        </div>
                        <footer className="p-4 border-t border-white/10 bg-[rgb(var(--color-surface))]">
                            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} placeholder="Escribe tu mensaje..." />
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                            <UserIcon className="w-12 h-12 text-slate-500" />
                        </div>
                        <h2 className="text-xl font-semibold">Selecciona una conversación</h2>
                        <p className="text-slate-400 max-w-xs mt-2">Elige un alumno o profesor de la lista para ver el historial de chat y enviar mensajes.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

const ChatPage: React.FC = () => {
    const { user } = useAppContext();

    if (user?.role === 'preceptor') {
        return <PreceptorCommunicationsView />;
    }

    if (user?.role === 'professor') {
        return <ProfessorChatView />;
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-xl font-semibold">Página en construcción</h2>
            <p className="text-slate-400 max-w-xs mt-2">La mensajería para alumnos estará disponible próximamente.</p>
        </div>
    );
};

export default ChatPage;