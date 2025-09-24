import type { User } from '../types';

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
