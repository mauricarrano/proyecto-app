import React, { useState } from 'react';
import Card from './ui/Card';
import { getForumPosts } from '../services/mockData';
import { useAppContext } from '../hooks/useAppContext';
import type { ForumPost } from '../types';
import { HelpCircleIcon, ChevronDownIcon, SendIcon, ProfessorIcon, PreceptorIcon, PlusIcon, XIcon } from './Icon';

const ForumWidget: React.FC = () => {
    const { user } = useAppContext();
    const [posts, setPosts] = useState<ForumPost[]>(getForumPosts());
    const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
    const [newAnswer, setNewAnswer] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostDescription, setNewPostDescription] = useState('');

    const togglePost = (id: number) => {
        setExpandedPostId(prevId => (prevId === id ? null : id));
    };

    const handleAnswerSubmit = (postId: number) => {
        if (!newAnswer.trim() || !user) return;

        const answer = {
            id: Date.now(),
            author: user.name,
            role: user.role as 'professor' | 'preceptor',
            content: newAnswer,
            timestamp: 'Ahora mismo',
        };

        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? { ...post, answers: [...post.answers, answer] }
                    : post
            )
        );
        setNewAnswer('');
    };
    
    const handleNewPostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostTitle.trim() || !newPostDescription.trim() || !user) return;

        const newPost: ForumPost = {
            id: Date.now(),
            author: user.name,
            title: newPostTitle,
            description: newPostDescription,
            timestamp: 'Ahora mismo',
            answers: [],
        };
        
        setPosts([newPost, ...posts]);
        setIsModalOpen(false);
        setNewPostTitle('');
        setNewPostDescription('');
    };

    const AnswerIcon: React.FC<{ role: 'professor' | 'preceptor' }> = ({ role }) => {
        const icon = role === 'professor' ? <ProfessorIcon className="w-5 h-5" /> : <PreceptorIcon className="w-5 h-5" />;
        const color = role === 'professor' ? 'text-sky-400' : 'text-purple-400';
        return <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center ${color}`}>{icon}</div>;
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-semibold flex items-center gap-3">
                    <HelpCircleIcon className="w-6 h-6 text-[rgb(var(--color-primary))]" />
                    <span>Foro de Preguntas</span>
                </h3>
                {user?.role === 'student' && (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Añadir pregunta"
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
            <div className="space-y-3">
                {posts.map(post => (
                    <div key={post.id} className="bg-slate-700/50 rounded-lg transition-all duration-300">
                        <button
                            onClick={() => togglePost(post.id)}
                            className="flex justify-between items-center w-full p-4 text-left"
                        >
                            <div>
                                <h4 className="font-semibold">{post.title}</h4>
                                <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                                    Preguntado por {post.author} - {post.timestamp}
                                </p>
                            </div>
                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedPostId === post.id ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedPostId === post.id && (
                            <div className="p-4 border-t border-slate-600/50">
                                <p className="text-[rgb(var(--color-text-secondary))] mb-6">{post.description}</p>
                                
                                <h5 className="font-semibold mb-3 text-sm">{post.answers.length} Respuesta(s)</h5>
                                <div className="space-y-4">
                                    {post.answers.length === 0 && (
                                        <p className="text-sm text-center text-[rgb(var(--color-text-secondary))] py-4">Aún no hay respuestas.</p>
                                    )}
                                    {post.answers.map(answer => (
                                        <div key={answer.id} className="flex items-start gap-3">
                                            <AnswerIcon role={answer.role} />
                                            <div>
                                                <p className="font-semibold text-sm">
                                                    {answer.author} <span className="font-normal text-xs text-[rgb(var(--color-text-secondary))] capitalize ml-1">({answer.role})</span>
                                                </p>
                                                <p className="text-sm text-slate-300 mt-1">{answer.content}</p>
                                                <p className="text-xs text-slate-500 mt-1.5">{answer.timestamp}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {(user?.role === 'professor' || user?.role === 'preceptor') && (
                                    <div className="mt-6 pt-4 border-t border-slate-600/50">
                                        <h5 className="font-semibold text-sm mb-2">Añadir una respuesta</h5>
                                        <div className="flex items-start gap-2">
                                            <textarea
                                                value={newAnswer}
                                                onChange={e => setNewAnswer(e.target.value)}
                                                placeholder="Escribe tu respuesta..."
                                                rows={2}
                                                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 p-2 resize-none focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all duration-200"
                                            />
                                            <button
                                                onClick={() => handleAnswerSubmit(post.id)}
                                                disabled={!newAnswer.trim()}
                                                className="w-10 h-10 flex-shrink-0 bg-[rgb(var(--color-primary))] text-black rounded-full flex items-center justify-center transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                                            >
                                                <SendIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

             {isModalOpen && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                        <Card className="relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10">
                                <XIcon className="w-6 h-6" />
                            </button>
                            <h3 className="text-2xl font-bold mb-6">Nueva Pregunta</h3>
                            <form onSubmit={handleNewPostSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="post-title" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Título</label>
                                    <input
                                        id="post-title"
                                        type="text"
                                        value={newPostTitle}
                                        onChange={(e) => setNewPostTitle(e.target.value)}
                                        className="w-full bg-black/20 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition"
                                        placeholder="¿Cuál es tu duda?"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label htmlFor="post-description" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">Descripción</label>
                                    <textarea
                                        id="post-description"
                                        rows={5}
                                        value={newPostDescription}
                                        onChange={(e) => setNewPostDescription(e.target.value)}
                                        className="w-full bg-black/20 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition"
                                        placeholder="Añade más detalles para que puedan ayudarte mejor..."
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-4 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="bg-[rgb(var(--color-primary))] text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:bg-slate-600 disabled:opacity-50"
                                        disabled={!newPostTitle.trim() || !newPostDescription.trim()}
                                    >
                                        Publicar
                                    </button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default ForumWidget;