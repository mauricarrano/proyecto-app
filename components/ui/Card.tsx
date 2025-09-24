import React from 'react';

interface CardProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, onClick, className = '' }) => {
    const baseClasses = 'bg-[rgb(var(--color-surface))] p-6 rounded-xl shadow-lg transition-all duration-300 transform';
    const interactiveClasses = onClick ? 'cursor-pointer hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-[rgb(var(--color-primary))]' : '';

    return (
        <div onClick={onClick} className={`${baseClasses} ${interactiveClasses} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
