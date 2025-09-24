import React from 'react';
import { DashboardIcon, AttendanceIcon, GraduationCapIcon, CalendarIcon, UserCircleIcon, CommunicationsIcon, PenSquareIcon, StatsIcon } from '../Icon';
import { useAppContext } from '../../hooks/useAppContext';

interface BottomNavProps {
    setPage: (page: string) => void;
    currentPage: string;
}

interface NavItem {
    label: string;
    icon: React.ReactNode;
    page: string;
}

const STUDENT_NAV_ITEMS: NavItem[] = [
    { label: 'Panel', icon: <DashboardIcon />, page: 'dashboard' },
    { label: 'Notas', icon: <GraduationCapIcon />, page: 'grades' },
    { label: 'Asistencia', icon: <AttendanceIcon />, page: 'attendance' },
    { label: 'Agenda', icon: <CalendarIcon />, page: 'schedule' },
    { label: 'Trámites', icon: <PenSquareIcon />, page: 'procedures' },
];

const PROFESSOR_NAV_ITEMS: NavItem[] = [
    { label: 'Panel', icon: <DashboardIcon />, page: 'dashboard' },
    { label: 'Comms', icon: <CommunicationsIcon />, page: 'communications' },
    { label: 'Agenda', icon: <CalendarIcon />, page: 'schedule' },
    { label: 'Perfil', icon: <UserCircleIcon />, page: 'profile' },
];

const PRECEPTOR_NAV_ITEMS: NavItem[] = [
    { label: 'Panel', icon: <DashboardIcon />, page: 'dashboard' },
    { label: 'Comms', icon: <CommunicationsIcon />, page: 'communications' },
    { label: 'Trámites', icon: <PenSquareIcon />, page: 'procedures-management' },
    { label: 'Agenda', icon: <CalendarIcon />, page: 'schedule' },
    { label: 'Perfil', icon: <UserCircleIcon />, page: 'profile' },
];

const STUDENT_UNION_NAV_ITEMS: NavItem[] = [
    { label: 'Panel', icon: <DashboardIcon />, page: 'dashboard' },
    { label: 'Comms', icon: <CommunicationsIcon />, page: 'communications' },
    { label: 'Reportes', icon: <StatsIcon />, page: 'reports' },
    { label: 'Agenda', icon: <CalendarIcon />, page: 'schedule' },
    { label: 'Perfil', icon: <UserCircleIcon />, page: 'profile' },
];


const BottomNav: React.FC<BottomNavProps> = ({ setPage, currentPage }) => {
    const { user } = useAppContext();

    const getNavItems = () => {
        if (!user) return [];
        switch (user.role) {
            case 'student': return STUDENT_NAV_ITEMS;
            case 'professor': return PROFESSOR_NAV_ITEMS;
            case 'preceptor': return PRECEPTOR_NAV_ITEMS;
            case 'student_union_member': return STUDENT_UNION_NAV_ITEMS;
            default: return [];
        }
    };
    
    const navItems = getNavItems();

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[rgb(var(--color-surface))] border-t border-white/10 flex justify-around items-center z-20">
            {navItems.map(item => (
                <button
                    key={item.label}
                    onClick={() => setPage(item.page)}
                    className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                        currentPage === item.page 
                            ? 'text-[rgb(var(--color-primary))]' 
                            : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
                    }`}
                >
                    {item.icon}
                    <span className="text-xs font-medium">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;