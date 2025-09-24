
import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import { UserIcon, WeaverIcon, PreceptorIcon, StudentIcon, StudentUnionIcon } from './Icon';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.author === 'user';

  const containerClasses = isUser ? 'flex-row-reverse' : 'flex-row';
  const bubbleClasses = isUser
    ? 'bg-violet-600 text-white rounded-br-none'
    : 'bg-slate-800 text-slate-300 rounded-bl-none';
  
  const formattedContent = message.content.split('\n').map((paragraph, index) => (
    <p key={index} className="mb-2 last:mb-0">{paragraph || ' '}</p>
  ));

  const renderIcon = () => {
    if (isUser) return <UserIcon />;
    if (message.author === 'preceptor') return <PreceptorIcon />;
    if (message.author === 'student') return <StudentIcon />;
    if (message.author === 'student_union') return <StudentUnionIcon />;
    return <WeaverIcon />; // Fallback for 'model'
  };

  return (
    <div className={`flex items-start gap-4 animate-fade-in ${containerClasses}`}>
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600 shadow-md">
        {renderIcon()}
      </div>
      <div
        className={`w-full max-w-xl px-5 py-4 rounded-xl shadow-lg font-serif-display text-lg leading-relaxed ${bubbleClasses}`}
      >
        {message.content ? formattedContent : <BlinkingCursor />}
      </div>
    </div>
  );
};

const BlinkingCursor: React.FC = () => {
    return <div className="inline-block w-2 h-5 bg-slate-400 animate-pulse"></div>
}