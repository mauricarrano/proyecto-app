
/**
 * DATA SERVICE LAYER
 * 
 * INTEGRATION NOTICE:
 * The application has been configured to connect to MongoDB via the `backend/` module.
 * 
 * To activate the database connection:
 * 1. Deploy the files in `backend/` (db.ts, models.ts) to a Node.js server (e.g., Express or Next.js API).
 * 2. Replace the mock functions below with async `fetch()` calls to your new API endpoints.
 * 3. Ensure the MongoDB URI in `backend/db.ts` is secured in an environment variable in production.
 */

import type { AttendanceRecord, GradeStat, Career, ScheduleItem, CalendarEvent, ForumPost, UpcomingDeadline, Notification, AssignmentToGrade, ProfessorCourse, StudentGradeRecord, StudentDailyAttendance, AttendanceStatus, Role, Conversation, FullConversation, ChatMessage, AttendanceSummary, AtRiskStudent, User, StudentSearchResult, StudentFile, ObservationRecord, PreceptorTask, Procedure, ProcedureRequest, ChatContact, InstituteKPIs } from '../types';

const subjectsByCareer: Record<Career, string[]> = {
    software: [
        'Algoritmos',
        'Sist. Operativos',
        'Bases de Datos',
        'Redes',
        'Ing. de Software',
        'Int. Artificial',
    ],
    design: [
        'Teoría del Diseño',
        'Diseño Gráfico I',
        'Tipografía',
        'Historia del Arte',
        'Diseño Web',
        'UX/UI',
    ],
};

export const getSubjectsByCareer = (career: Career): string[] => {
    return subjectsByCareer[career] || [];
};

// Fix: Explicitly type `records` array as AttendanceRecord[] to resolve status type error.
export const getStudentAttendance = (): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [
        { id: 1, date: '2024-05-20', subject: 'Algoritmos', status: 'present' },
        { id: 2, date: '2024-05-21', subject: 'Sist. Operativos', status: 'present' },
        { id: 3, date: '2024-05-22', subject: 'Bases de Datos', status: 'absent' },
        { id: 4, date: '2024-05-23', subject: 'Algoritmos', status: 'late' },
        { id: 5, date: '2024-05-24', subject: 'Sist. Operativos', status: 'justified' },
        { id: 6, date: '2024-05-27', subject: 'Bases de Datos', status: 'present' },
        { id: 7, date: '2024-05-28', subject: 'Redes', status: 'present' },
        { id: 8, date: '2024-05-29', subject: 'Ing. de Software', status: 'present' },
        { id: 9, date: '2024-05-30', subject: 'Int. Artificial', status: 'absent' },
        { id: 10, date: '2024-05-31', subject: 'Algoritmos', status: 'present' },
        { id: 11, date: '2024-06-03', subject: 'Sist. Operativos', status: 'absent' },
        { id: 12, date: '2024-06-04', subject: 'Bases de Datos', status: 'late' },
    ];
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getGradesData = (): GradeStat[] => {
    return [
        { subject: 'Algoritmos', firstSemester: 8, secondSemester: 9, finalGrade: 8.5 },
        { subject: 'Sist. Operativos', firstSemester: 9, secondSemester: 9.5, finalGrade: 9.2 },
        { subject: 'Bases de Datos', firstSemester: 7, secondSemester: 8.5, finalGrade: 7.8 },
        { subject: 'Redes', firstSemester: 6, secondSemester: 7, finalGrade: 6.5 },
        { subject: 'Ing. de Software', firstSemester: 9, secondSemester: 8.5, finalGrade: 8.8 },
        { subject: 'Int. Artificial', firstSemester: 9.5, secondSemester: null, finalGrade: null },
    ];
};

export const getSchedule = (): ScheduleItem[] => {
    return [
        { day: 'Lunes', time: '08:00 - 10:00', subject: 'Algoritmos', location: 'Aula 101' },
        { day: 'Lunes', time: '10:00 - 12:00', subject: 'Sist. Operativos', location: 'Aula 203' },
        { day: 'Martes', time: '09:00 - 11:00', subject: 'Bases de Datos', location: 'Lab 3' },
        { day: 'Miércoles', time: '08:00 - 10:00', subject: 'Algoritmos', location: 'Aula 101' },
        { day: 'Miércoles', time: '10:00 - 12:00', subject: 'Redes', location: 'Lab 5' },
        { day: 'Jueves', time: '09:00 - 11:00', subject: 'Ing. de Software', location: 'Aula 301' },
        { day: 'Jueves', time: '11:00 - 13:00', subject: 'Sist. Operativos', location: 'Aula 203' },
        { day: 'Viernes', time: '10:00 - 12:00', subject: 'Int. Artificial', location: 'Lab IA' },
    ];
};

export const getFixedCalendarEvents = (): CalendarEvent[] => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const pad = (num: number) => String(num).padStart(2, '0');

    return [
        { date: `${year}-${pad(month)}-15`, title: 'Examen Parcial: Redes', type: 'exam' },
        { date: `${year}-${pad(month)}-16`, title: 'Examen Parcial: Ing. de Software', type: 'exam' },
        { date: `${year}-${pad(month)}-22`, title: 'Jornada Estudiantil', type: 'event' },
        { date: `${year}-${pad(month)}-29`, title: 'Examen Final: Algoritmos', type: 'final' },
        { date: `${year}-${pad(month)}-30`, title: 'Examen Final: Sist. Operativos', type: 'final' },
    ];
};

export const getForumPosts = (): ForumPost[] => {
    return [
        {
            id: 1,
            author: 'Laura Estudiante',
            title: '¿Cuándo se publican las notas del parcial de Algoritmos?',
            description: 'Hola, rendí el parcial la semana pasada y todavía no veo la nota cargada en el sistema. ¿Alguien sabe cuándo estarán disponibles?',
            timestamp: 'Hace 2 días',
            answers: [
                {
                    id: 1,
                    author: 'Ana Profesora',
                    role: 'professor',
                    content: 'Hola Laura, ya estoy terminando de corregir. Estimo que las notas estarán publicadas mañana por la tarde. ¡Paciencia!',
                    timestamp: 'Hace 1 día',
                },
            ],
        },
        {
            id: 2,
            author: 'Marcos Estudiante',
            title: 'Duda sobre el final de Bases de Datos',
            description: 'Quería consultar si para el final de Bases de Datos se puede tener material de estudio a mano, como resúmenes o el libro de la materia. Gracias.',
            timestamp: 'Hace 5 días',
            answers: [
                {
                    id: 2,
                    author: 'Carlos Preceptor',
                    role: 'preceptor',
                    content: 'Hola Marcos, por lo general los finales son sin material, pero lo mejor es que le consultes directamente al profesor de la cátedra para estar 100% seguro.',
                    timestamp: 'Hace 5 días',
                },
                {
                    id: 3,
                    author: 'Ana Profesora',
                    role: 'professor',
                    content: 'Confirmado, el final es sin material de consulta. Se evaluarán los temas vistos en clase.',
                    timestamp: 'Hace 4 días',
                },
            ],
        },
        {
            id: 3,
            author: 'Sofía Estudiante',
            title: 'Inscripción a materias de 2do año',
            description: '¿Hay alguna fecha límite para inscribirse a las materias del próximo cuatrimestre? No encuentro la información en la cartelera.',
            timestamp: 'Hace 1 semana',
            answers: [],
        },
    ];
};

export const getUpcomingDeadlines = (): UpcomingDeadline[] => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const inThreeDays = new Date(today);
    inThreeDays.setDate(today.getDate() + 3);
    const inAWeek = new Date(today);
    inAWeek.setDate(today.getDate() + 7);

    // Fix: Explicitly type the deadlines array as UpcomingDeadline[] to resolve the type error.
    const deadlines: UpcomingDeadline[] = [
        {
            id: 'd1',
            title: 'Entrega Práctica 3',
            subject: 'Sist. Operativos',
            dueDate: tomorrow.toISOString(),
            type: 'assignment'
        },
        {
            id: 'd2',
            title: 'Parcial I',
            subject: 'Algoritmos',
            dueDate: inThreeDays.toISOString(),
            type: 'exam'
        },
        {
            id: 'd3',
            title: 'Presentación Proyecto Final',
            subject: 'Ing. de Software',
            dueDate: inAWeek.toISOString(),
            type: 'assignment'
        },
        {
            id: 'd4',
            title: 'Examen Final',
            subject: 'Redes',
            dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'exam'
        }
    ];
    
    return deadlines.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
};

export const getNotifications = (role: Role): Notification[] => {
  if (role === 'professor' || role === 'preceptor' || role === 'director') {
    return [
      {
        id: 'p1',
        icon: 'MaterialsIcon',
        title: 'Nueva entrega: TP2',
        description: 'Juan Alumno - Algoritmos',
        action: { type: 'navigate', target: 'grades-management' },
      },
      {
        id: 'p2',
        icon: 'CommunicationsIcon',
        title: 'Nuevo mensaje de Carlos Preceptor',
        description: 'Toca para leer el mensaje.',
        action: { type: 'navigate', target: 'communications' },
      },
      {
        id: 'p3',
        icon: 'HelpCircleIcon',
        title: 'Nueva pregunta en el Foro',
        description: 'Bases de Datos',
        action: { type: 'navigate', target: 'dashboard' },
      },
      {
        id: 'p4',
        icon: 'CalendarIcon',
        title: 'Recordatorio: Final de Redes',
        description: 'El examen es mañana a las 9hs.',
        action: { type: 'navigate', target: 'schedule' },
      }
    ]
  }

  // Default to student notifications
  return [
    {
      id: 'n1',
      icon: 'BookOpenIcon',
      title: 'Inscripción a Finales Abierta',
      description: 'Hace 5 minutos',
      action: {
        type: 'modal',
        target: 'finals',
      },
    },
    {
      id: 'n2',
      icon: 'BellIcon',
      title: 'Jornada Estudiantil',
      description: 'Hace 1 hora',
      action: {
        type: 'modal',
        target: 'event',
      },
    },
    {
      id: 'n3',
      icon: 'GraduationCapIcon',
      title: 'Nuevas notas publicadas',
      description: 'Hace 3 horas',
      action: {
        type: 'navigate',
        target: 'grades',
      },
    },
  ];
};

export const getProfessorAssignmentsToGrade = (): AssignmentToGrade[] => {
    const today = new Date();
    const inTwoDays = new Date(today);
    inTwoDays.setDate(today.getDate() + 2);
    const inFiveDays = new Date(today);
    inFiveDays.setDate(today.getDate() + 5);

    return [
        {
            id: 'a1',
            subject: 'Algoritmos',
            title: 'Trabajo Práctico 2',
            submissions: 15,
            totalStudents: 30,
            dueDate: inTwoDays.toISOString(),
        },
        {
            id: 'a2',
            subject: 'Ing. de Software',
            title: 'Entrega de Prototipo',
            submissions: 22,
            totalStudents: 25,
            dueDate: inFiveDays.toISOString(),
        },
        {
            id: 'a3',
            subject: 'Bases de Datos',
            title: 'Parcial I Corregido',
            submissions: 30,
            totalStudents: 30,
            dueDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];
};

// Professor specific mock data
export const getProfessorCourses = (): ProfessorCourse[] => {
    return [
        { subject: 'Algoritmos', years: ['1er Año', '2do Año'] },
        { subject: 'Sist. Operativos', years: ['2do Año'] },
        { subject: 'Ing. de Software', years: ['3er Año', '4to Año'] },
        { subject: 'Bases de Datos', years: ['2do Año'] }
    ];
};

const studentNames = [
    'Sofía García', 'Mateo Rodríguez', 'Valentina Martínez', 'Santiago Hernández',
    'Isabella González', 'Sebastián Pérez', 'Camila López', 'Matías Sánchez',
    'Valeria Díaz', 'Alejandro Ramírez', 'Mariana Torres', 'Daniel Gómez'
];

const generateStudents = (subject: string, year: string): StudentGradeRecord[] => {
    // Use a simple hash to make student list deterministic but different for each course
    const seed = subject.length + year.charCodeAt(1);
    return studentNames.slice(seed % 4, (seed % 4) + 8).map((name, index) => {
        const id = (seed * 100 + index).toString();
        return {
            id: `s-${id}`,
            name: name,
            studentId: `S-${id}`,
            firstSemester: Math.random() > 0.2 ? Math.floor(Math.random() * 6) + 4 : null,
            secondSemester: null,
        };
    });
};


export const getStudentsForGrades = (subject: string, year: string): StudentGradeRecord[] => {
    if (!subject || !year) return [];
    return generateStudents(subject, year);
};

export const getStudentsForAttendance = (subject: string, year: string): StudentDailyAttendance[] => {
    if (!subject || !year) return [];
    return generateStudents(subject, year).map(student => ({
        id: student.id,
        name: student.name,
        studentId: student.studentId,
        status: 'unmarked' as const,
    }));
};

// --- Mock Data for Inbox/Chat ---

export const getPreceptorsForChat = (): ChatContact[] => [
    { id: 'preceptor-carlos', name: 'Carlos Preceptor', profilePictureUrl: 'https://i.pravatar.cc/150?u=preceptor', isOnline: true },
    { id: 'preceptor-laura', name: 'Laura Gómez', profilePictureUrl: 'https://picsum.photos/seed/laura-preceptor/200', isOnline: false },
];

const allStudentsForChat = studentNames.map((name, index) => {
    const yearIndex = Math.floor(index / 4);
    const year = yearIndex === 0 ? '1er Año' : yearIndex === 1 ? '2do Año' : '3er Año';
    const id = `S-1110${index}`;
    return {
        id,
        name,
        year,
        profilePictureUrl: `https://picsum.photos/seed/${id}/200`
    };
});

const mockProfessorsForChat = [
    { id: 'prof-ana', name: 'Ana Profesora', profilePictureUrl: 'https://i.pravatar.cc/150?u=profesor' },
    { id: 'prof-marcos', name: 'Marcos Gutierrez', profilePictureUrl: 'https://picsum.photos/seed/prof-marcos/200' },
];


const mockChatHistories: Record<string, ChatMessage[]> = {
    'preceptor': [
        { author: 'preceptor', content: 'Hola Ana, te recuerdo que la fecha límite para cargar las notas del primer parcial es este viernes.' },
        { author: 'user', content: 'Hola Carlos, gracias por el recordatorio. ¿Hay alguna novedad sobre las mesas de finales de Agosto?' },
        { author: 'preceptor', content: 'Todavía no están definidas, pero la reunión para coordinarlas es el próximo martes. Te mantendremos al tanto.' },
    ],
    'S-11100': [
        { author: 'student', content: 'Hola profe, ¿subió las notas del último TP de Algoritmos?'},
        { author: 'user', content: 'Hola Sofía, sí, ya deberían estar visibles en el sistema. Avísame si no las encuentras.' },
    ],
    'S-11101': [
        { author: 'user', content: 'Hola Mateo, recordá que mañana vence la entrega del TP.' },
    ],
    'S-11106': [
        { author: 'user', content: 'Camila, recibí tu consulta por mail. Te respondo por aquí: el recuperatorio será el día Viernes a las 10hs.'},
        { author: 'student', content: 'Genial, gracias profe!'},
    ],
    'S-11107': [
        { author: 'preceptor', content: 'Hola Matías, vi que tenés varias faltas en Redes. ¿Está todo bien?'},
        { author: 'student', content: 'Hola Carlos, sí, tuve unos problemas personales. Ya estoy poniéndome al día.' },
        { author: 'preceptor', content: 'De acuerdo, no dudes en hablar conmigo si necesitas algo.' },
    ],
    'prof-ana': [
      { author: 'preceptor', content: 'Hola Ana, te recuerdo que la fecha límite para cargar las notas del primer parcial es este viernes.' },
      { author: 'professor', content: 'Hola Carlos, gracias por el recordatorio. Ya casi termino.' },
    ],
    'prof-marcos': [
      { author: 'preceptor', content: 'Marcos, necesito el listado de alumnos regulares de tu materia. Saludos.' },
    ],
};

// For Professor
export const getConversations = (year: string): Conversation[] => {
    const preceptorConversation: Conversation = {
        id: 'preceptor',
        name: 'Carlos Preceptor',
        lastMessage: 'Todavía no están definidas, pero la...',
        lastMessageTimestamp: 'Ayer',
        unreadCount: 1,
        isOnline: true,
        type: 'professor' // Special type? Let's just say it's not a student
    };
    
    const studentConversations = allStudentsForChat
        .filter(student => student.year === year || year === 'all')
        .map(student => {
            const history = mockChatHistories[student.id] || [];
            const lastMessage = history.length > 0 ? history[history.length - 1].content : 'No hay mensajes aún.';
            return {
                id: student.id,
                name: student.name,
                profilePictureUrl: student.profilePictureUrl,
                lastMessage: lastMessage.substring(0, 30) + (lastMessage.length > 30 ? '...' : ''),
                lastMessageTimestamp: 'Hace 2h',
                unreadCount: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
                isOnline: Math.random() > 0.5,
                type: 'student' as const,
            };
        });

    return [preceptorConversation, ...studentConversations];
};

// For Preceptor
export const getPreceptorConversations = (): Conversation[] => {
    const studentConversations = allStudentsForChat
        .slice(5, 9) // A subset of students for the preceptor
        .map(student => {
            const history = mockChatHistories[student.id] || [];
            const lastMessage = history.length > 0 ? history[history.length - 1].content : 'Inicia una conversación.';
            return {
                id: student.id,
                name: student.name,
                profilePictureUrl: student.profilePictureUrl,
                lastMessage: lastMessage.substring(0, 30) + (lastMessage.length > 30 ? '...' : ''),
                lastMessageTimestamp: 'Hace 1h',
                unreadCount: student.id === 'S-11107' ? 1 : 0,
                isOnline: Math.random() > 0.3,
                type: 'student' as const,
            };
        });

    const professorConversations = mockProfessorsForChat
        .map(prof => {
            const history = mockChatHistories[prof.id] || [];
            const lastMessage = history.length > 0 ? history[history.length - 1].content : 'Inicia una conversación.';
            return {
                id: prof.id,
                name: prof.name,
                profilePictureUrl: prof.profilePictureUrl,
                lastMessage: lastMessage.substring(0, 30) + (lastMessage.length > 30 ? '...' : ''),
                lastMessageTimestamp: 'Ayer',
                unreadCount: prof.id === 'prof-ana' ? 1 : 0,
                isOnline: true,
                type: 'professor' as const,
            };
        });

    return [...professorConversations, ...studentConversations];
};


export const getConversationDetails = (id: string): FullConversation | null => {
    const history = mockChatHistories[id] || [];

    if (id === 'preceptor') { // Professor messaging preceptor
        return {
            id: 'preceptor',
            name: 'Carlos Preceptor',
            profilePictureUrl: 'https://i.pravatar.cc/150?u=preceptor',
            lastMessage: 'Todavía no están definidas, pero la...',
            lastMessageTimestamp: 'Ayer',
            unreadCount: 1,
            isOnline: true,
            messages: history,
            type: 'professor',
        };
    }

    const student = allStudentsForChat.find(s => s.id === id);
    if (student) {
        const lastMessage = history.length > 0 ? history[history.length - 1].content : 'No hay mensajes aún.';
        return {
            id: student.id,
            name: student.name,
            profilePictureUrl: student.profilePictureUrl,
            lastMessage: lastMessage,
            lastMessageTimestamp: 'Hace 2h',
            unreadCount: 0,
            isOnline: Math.random() > 0.5,
            messages: history.length > 0 ? history : [{ author: 'preceptor', content: `Inicia una conversación con ${student.name}.` }],
            type: 'student',
        };
    }
    
    const professor = mockProfessorsForChat.find(p => p.id === id);
    if (professor) {
        const lastMessage = history.length > 0 ? history[history.length - 1].content : 'No hay mensajes aún.';
        return {
            id: professor.id,
            name: professor.name,
            profilePictureUrl: professor.profilePictureUrl,
            lastMessage: lastMessage,
            lastMessageTimestamp: 'Hace 3h',
            unreadCount: 0,
            isOnline: true,
            messages: history.length > 0 ? history : [{ author: 'preceptor', content: `Inicia una conversación con ${professor.name}.` }],
            type: 'professor',
        };
    }

    return null;
};


// --- Mock Data for Reports Page ---

export const getAttendanceSummary = (career: Career, year: string): AttendanceSummary[] => {
    const subjects = getSubjectsByCareer(career);
    return subjects.map(subject => {
        const present = Math.floor(Math.random() * 30) + 65; // 65-95%
        const absent = 100 - present;
        return {
            subject,
            present,
            absent,
            justified: Math.floor(absent * (Math.random() * 0.5)), // Justified are a fraction of absents
        }
    });
};

export const getAtRiskStudents = (career: Career, year: string): AtRiskStudent[] => {
    const allStudents = generateStudents('any', 'any').map(s => s.name);
    const subjects = getSubjectsByCareer(career);
    
    const atRisk: AtRiskStudent[] = [];

    // Student with low attendance
    atRisk.push({
        id: 's-risk-1',
        name: allStudents[2],
        reason: 'Baja Asistencia',
        subject: subjects[0],
        value: `${Math.floor(Math.random() * 20) + 40}% Presentismo` // 40-60%
    });

    // Student with failing grades
    atRisk.push({
        id: 's-risk-2',
        name: allStudents[5],
        reason: 'Notas Bajas',
        subject: subjects[2],
        value: `Promedio: ${(Math.random() * 2 + 2).toFixed(1)}` // 2.0-4.0
    });
    
    // Another low attendance
     atRisk.push({
        id: 's-risk-3',
        name: allStudents[7],
        reason: 'Baja Asistencia',
        subject: subjects[1],
        value: `${Math.floor(Math.random() * 15) + 50}% Presentismo` // 50-65%
    });

    return atRisk;
};

// --- Mock Data for Preceptor Tasks ---
export const getPreceptorTasks = (): PreceptorTask[] => [
    { id: 't1', title: 'Revisar Justificativos', description: 'Hay 3 justificativos pendientes de aprobación.', priority: 'high', action: { type: 'navigate', target: 'attendance-management' } },
    { id: 't2', title: 'Contactar a Matías Sánchez', description: 'Presenta baja asistencia en Redes.', priority: 'high', action: { type: 'navigate', target: 'communications' } },
    { id: 't3', title: 'Preparar Reporte Semanal', description: 'Generar reporte para la reunión del viernes.', priority: 'medium', action: { type: 'navigate', target: 'reports' } },
    { id: 't4', title: 'Seguimiento de Sofía García', description: 'Verificar si mejoraron sus notas en Algoritmos.', priority: 'low', action: { type: 'navigate', target: 'communications' } },
];

export const getStudentUnionTasks = (): PreceptorTask[] => [
    { id: 'su1', title: 'Revisar sugerencias del buzón', description: 'Hay 5 nuevas sugerencias de alumnos.', priority: 'high', action: { type: 'navigate', target: 'dashboard' } },
    { id: 'su2', title: 'Planificar reunión sobre mesas de examen', description: 'Coordinar con preceptores y profesores.', priority: 'medium', action: { type: 'navigate', target: 'schedule' } },
    { id: 'su3', title: 'Organizar evento de bienvenida', description: 'Definir fecha y actividades para nuevos ingresantes.', priority: 'low' },
];

// Fix: Add mock data and functions for Student File feature
const allMockStudents: User[] = studentNames.map((name, index) => {
    const studentId = `S-123${index.toString().padStart(2, '0')}`;
    const career = (index % 2 === 0 ? 'software' : 'design') as Career;
    const yearOfStudy = `${(index % 3) + 1}er Año`;
    return {
        name,
        studentId,
        email: `${name.replace(/\s/g, '.').toLowerCase()}@academia.com`,
        role: 'student',
        career,
        yearOfStudy,
        profilePictureUrl: `https://picsum.photos/seed/${studentId}/200`,
        aboutMe: `Estudiante de ${career} cursando ${yearOfStudy}.`
    };
});

export const searchStudents = (query: string): StudentSearchResult[] => {
    if (!query) return [];
    const lowerCaseQuery = query.toLowerCase();
    return allMockStudents
        .filter(student => 
            student.name.toLowerCase().includes(lowerCaseQuery) || 
            (student.studentId && student.studentId.toLowerCase().includes(lowerCaseQuery))
        )
        .map(student => ({
            id: student.studentId!,
            name: student.name,
            studentId: student.studentId!,
        }));
};

export const getStudentFile = (studentId: string): StudentFile | null => {
    const student = allMockStudents.find(s => s.studentId === studentId);
    if (!student) return null;

    // Generate some mock data for the student file
    const grades = getGradesData().slice(0, 3 + Math.floor(Math.random() * 4));
    const attendance = getStudentAttendance().slice(0, 5 + Math.floor(Math.random() * 8));
    const observations: ObservationRecord[] = [
        { id: 'obs1', author: 'Carlos Preceptor', timestamp: '2024-05-15', content: 'El alumno muestra gran interés en las clases de Bases de Datos.' },
        { id: 'obs2', author: 'Ana Profesora', timestamp: '2024-04-22', content: 'Presentó un excelente trabajo práctico en Algoritmos.' },
    ].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
        user: student,
        grades,
        attendance,
        observations,
    };
};

export const getProcedures = (): Procedure[] => {
    return [
        {
            id: 'proc1',
            title: 'Constancia de Alumno Regular',
            description: 'Genera un certificado oficial que acredita tu condición de alumno regular en la institución.',
            icon: 'MaterialsIcon',
        },
        {
            id: 'proc2',
            title: 'Solicitud de Mesa Especial',
            description: 'Pide una fecha de examen final extraordinaria si cumples con los requisitos académicos.',
            icon: 'CalendarIcon',
        },
        {
            id: 'proc3',
            title: 'Certificado Analítico Parcial',
            description: 'Solicita un informe detallado con todas las materias aprobadas y tus notas hasta la fecha.',
            icon: 'PenSquareIcon',
        },
        {
            id: 'proc4',
            title: 'Justificar Inasistencia',
            description: 'Sube la documentación necesaria para justificar ausencias a clases o exámenes.',
            icon: 'MaterialsIcon',
        },
        {
            id: 'proc5',
            title: 'Baja de Materia',
            description: 'Date de baja de una materia en la que te hayas inscripto durante el período habilitado.',
            icon: 'PenSquareIcon',
        },
        {
            id: 'proc6',
            title: 'Consulta de Legajo',
            description: 'Accede a tu legajo completo para revisar tu historial y documentación personal.',
            icon: 'MaterialsIcon',
        },
    ];
};

// --- Mock Data for Procedures Management ---
const procedureRequests: ProcedureRequest[] = [
    { id: 'pr1', studentName: 'Camila López', studentId: 'S-12306', procedureTitle: 'Constancia de Alumno Regular', status: 'pending', requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'pr2', studentName: 'Matías Sánchez', studentId: 'S-12307', procedureTitle: 'Certificado Analítico Parcial', status: 'pending', requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'pr3', studentName: 'Valeria Díaz', studentId: 'S-12308', procedureTitle: 'Justificar Inasistencia', status: 'approved', requestDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'pr4', studentName: 'Alejandro Ramírez', studentId: 'S-12309', procedureTitle: 'Solicitud de Mesa Especial', status: 'rejected', requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];

export const getProcedureRequests = (): ProcedureRequest[] => {
    return procedureRequests;
};

// --- Mock Data for Director Dashboard ---
export const getInstituteKPIs = (): InstituteKPIs => {
    return {
        totalStudents: 348,
        totalStaff: 42,
        attendanceRate: 87,
        averageGrade: 7.8
    };
};
