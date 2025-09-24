import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { BellIcon, LogoIcon, BookOpenIcon, GraduationCapIcon, CommunicationsIcon, CalendarIcon, HelpCircleIcon, MaterialsIcon } from '../Icon';
import { getNotifications } from '../../services/mockData';
import type { Notification } from '../../types';

interface HeaderProps {
    onProfileClick: () => void;
    onNotificationAction: (action: Notification['action']) => void;
}

// Helper to render icon from string
const NotificationIcon: React.FC<{ iconName: Notification['icon'], className?: string }> = ({ iconName, className }) => {
    const iconProps = { className: className || "w-5 h-5" };
    switch (iconName) {
        case 'BookOpenIcon': return <BookOpenIcon {...iconProps} />;
        case 'BellIcon': return <BellIcon {...iconProps} />;
        case 'GraduationCapIcon': return <GraduationCapIcon {...iconProps} />;
        case 'MaterialsIcon': return <MaterialsIcon {...iconProps} />;
        case 'CommunicationsIcon': return <CommunicationsIcon {...iconProps} />;
        case 'CalendarIcon': return <CalendarIcon {...iconProps} />;
        case 'HelpCircleIcon': return <HelpCircleIcon {...iconProps} />;
        default: return <BellIcon {...iconProps} />; // Fallback
    }
};

const Header: React.FC<HeaderProps> = ({ onProfileClick, onNotificationAction }) => {
  const { user } = useAppContext();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (user) {
        setNotifications(getNotifications(user.role));
    }
  }, [user]);
  
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationAreaRef.current && !notificationAreaRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setIsNotificationsOpen(prev => !prev);
    if (hasUnread) {
        setHasUnread(false);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    onNotificationAction(notification.action);
    setIsNotificationsOpen(false);
  };

  const today = new Date();
  const shortDateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  const longDateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  
  const shortFormattedDate = new Intl.DateTimeFormat('es-ES', shortDateOptions).format(today).replace(/\./g, '');
  const longFormattedDate = new Intl.DateTimeFormat('es-ES', longDateOptions).format(today);

  if (!user) return null;

  return (
    <header className="bg-[rgb(var(--color-surface))] shadow-md z-30 flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-3">
            <LogoIcon className="h-8 w-8 text-[rgb(var(--color-primary))]" />
            <div>
                <p className="block sm:hidden font-semibold text-sm capitalize text-[rgb(var(--color-text-secondary))]">{shortFormattedDate}</p>
                <p className="hidden sm:block font-semibold text-sm capitalize text-[rgb(var(--color-text-secondary))]">{longFormattedDate}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div ref={notificationAreaRef} className="relative">
                <button
                    onClick={handleBellClick} 
                    className="p-2 rounded-full hover:bg-white/10 relative" 
                    aria-label="Notifications"
                >
                    <BellIcon />
                    {hasUnread && (
                        <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[rgb(var(--color-surface))]"></span>
                    )}
                </button>
                
                <div className={`absolute top-full right-0 mt-2 w-80 max-w-sm bg-[rgb(var(--color-surface))] border border-white/10 rounded-xl shadow-2xl z-40 overflow-hidden transform transition-all duration-200 ease-out ${isNotificationsOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <div className="p-4 border-b border-white/10">
                        <h3 className="font-bold">Notificaciones</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            <ul>
                                {notifications.map(notification => (
                                    <li key={notification.id} className="border-b border-white/10 last:border-b-0">
                                        <button onClick={() => handleNotificationClick(notification)} className="flex items-start gap-4 p-4 text-left w-full hover:bg-white/5 transition-colors">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mt-1 text-[rgb(var(--color-primary))]">
                                                <NotificationIcon iconName={notification.icon} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm">{notification.title}</h4>
                                                <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-0.5">{notification.description}</p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="p-4 text-center text-sm text-[rgb(var(--color-text-secondary))]">No hay notificaciones nuevas.</p>
                        )}
                    </div>
                </div>
            </div>
            <button onClick={onProfileClick} className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--color-surface))] focus:ring-[rgb(var(--color-primary))]">
                 <img 
                    src={user.profilePictureUrl || `https://i.pravatar.cc/150?u=${user.email}`} 
                    alt="Perfil"
                    className="w-9 h-9 rounded-full object-cover"
                />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;