
import type { User, Career } from '../types';

export interface MockUser extends User {
  password_hash: string;
}

const mockUsers: MockUser[] = [
  {
    email: 'alumno@academia.com',
    password_hash: '1234',
    name: 'Juan Alumno',
    role: 'student',
    career: 'software',
    profilePictureUrl: 'https://picsum.photos/seed/student/200',
    studentId: 'S-12345',
    yearOfStudy: '3er Año',
    aboutMe: 'Apasionado por el desarrollo backend y la inteligencia artificial. En mi tiempo libre, me gusta contribuir a proyectos de código abierto.'
  },
  {
    email: 'profesor@academia.com',
    password_hash: '1234',
    name: 'Ana Profesora',
    role: 'professor',
    career: 'software',
  },
  {
    email: 'preceptor@academia.com',
    password_hash: '1234',
    name: 'Carlos Preceptor',
    role: 'preceptor',
    career: 'design',
  },
  {
    email: 'presidente.ce@academia.com',
    password_hash: '1234',
    name: 'Lucas Presidente',
    role: 'student_union_member',
    career: 'software',
    profilePictureUrl: 'https://picsum.photos/seed/union/200',
    aboutMe: 'Presidente del Centro de Estudiantes. Comprometido con el bienestar y la voz de todos los alumnos.'
  },
  {
    email: 'director@academia.com',
    password_hash: '1234',
    name: 'Laura Directora',
    role: 'director',
    career: 'software',
    profilePictureUrl: 'https://picsum.photos/seed/director/200',
    aboutMe: 'Directora del Instituto. Dedicada a la excelencia académica y al desarrollo integral de la comunidad educativa.'
  },
];

export const attemptLogin = (email: string, password: string): User | null => {
  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password_hash === password
  );

  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  return null;
};

interface RegisterData {
    firstName: string;
    lastName: string;
    dni: string;
    address: string;
    career: Career;
    email: string;
    password: string;
}

export const registerUser = (data: RegisterData): User | { error: string } => {
    // Check if email already exists
    const exists = mockUsers.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
        return { error: 'El correo electrónico ya está registrado.' };
    }

    // Generate a mock student ID
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const studentId = `S-${randomId}`;

    const newUser: MockUser = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password_hash: data.password,
        role: 'student', // Default to student for self-registration
        career: data.career,
        studentId: studentId,
        yearOfStudy: '1er Año', // Default for new students
        dni: data.dni,
        address: data.address,
        profilePictureUrl: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=random`,
    };

    mockUsers.push(newUser);
    
    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};