import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { attemptLogin } from '../services/authService';
import { LogoIcon, ClockIcon, MapPinIcon, MailIcon, FacebookIcon } from '../components/Icon';
import type { Role } from '../types';

const LoginPage: React.FC = () => {
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [error, setError] = useState('');

  useEffect(() => {
    let creds;
    switch (selectedRole) {
        case 'professor':
            creds = { email: 'profesor@academia.com', pass: '1234' };
            break;
        case 'preceptor':
            creds = { email: 'preceptor@academia.com', pass: '1234' };
            break;
        case 'student_union_member':
            creds = { email: 'presidente.ce@academia.com', pass: '1234' };
            break;
        case 'student':
        default:
            creds = { email: 'alumno@academia.com', pass: '1234' };
            break;
    }
    setEmail(creds.email);
    setPassword(creds.pass);
  }, [selectedRole]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = attemptLogin(email, password);
    if (user) {
      login(user);
    } else {
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="md:min-h-screen md:flex md:items-center md:justify-center md:bg-[rgb(var(--color-background))]">
      <div className="min-h-screen bg-[rgb(var(--color-background))] flex flex-col justify-between p-6 sm:p-8 md:min-h-0 md:w-full md:max-w-sm md:bg-[rgb(var(--color-surface))] md:rounded-2xl md:shadow-2xl">
          
          {/* Top Section: Header, Form, and secondary actions */}
          <div>
              <div className="text-center mb-8">
                  <LogoIcon className="mx-auto h-12 w-12 md:h-16 md:w-16 mb-4 text-[rgb(var(--color-primary))]"/>
                  <h1 className="text-2xl md:text-3xl font-bold text-[rgb(var(--color-text-primary))]">Academia Digital</h1>
                  <p className="text-[rgb(var(--color-text-secondary))] mt-1">Ingresa a tu cuenta</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2" htmlFor="role-select">Soy...</label>
                    <div className="relative">
                      <select 
                        id="role-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as Role)}
                        className="w-full bg-black/20 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition appearance-none"
                      >
                        <option value="student">Alumno</option>
                        <option value="professor">Profesor</option>
                        <option value="preceptor">Preceptor</option>
                        <option value="student_union_member">Centro de Estudiantes</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[rgb(var(--color-text-secondary))]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2" htmlFor="email">Correo Electrónico</label>
                      <input 
                          type="email" 
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full bg-black/20 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition"
                      />
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2" htmlFor="password">Contraseña</label>
                      <input 
                          type="password" 
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full bg-black/20 rounded-lg p-3 border border-slate-700 focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none transition"
                      />
                  </div>

                  <div className="text-right text-sm">
                      <a href="#" className="font-medium text-sky-400 hover:text-sky-300 transition-colors">Olvidé mi contraseña</a>
                  </div>
                  
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  
                  <button
                    type="submit"
                    className="w-full bg-[rgb(var(--color-primary))] text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Ingresar
                  </button>
              </form>

              <div className="mt-6 text-center">
                  <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                      ¿No tienes cuenta? <a href="#" className="font-medium text-[rgb(var(--color-primary))] hover:underline">Regístrate</a>
                  </p>
              </div>
          </div>

          {/* Bottom Section: Contact Info */}
          <div className="text-center mt-8 pt-6 border-t border-white/10 text-xs text-slate-400 space-y-3">
              <div className="flex items-center justify-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>HORARIOS DE ATENCIÓN: 18:20 a 22:20 hs.</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>DIRECCIÓN: Marquez 51</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                  <MailIcon className="w-4 h-4" />
                  <a href="mailto:consultasinstituto26@gmail.com" className="hover:underline">consultasinstituto26@gmail.com</a>
              </div>
              <div className="flex items-center justify-center gap-2">
                  <FacebookIcon className="w-4 h-4" />
                  <a href="https://www.facebook.com/isfdyt.dolores" target="_blank" rel="noopener noreferrer" className="hover:underline">/isfdyt.dolores</a>
              </div>
          </div>

      </div>
    </div>
  );
};

export default LoginPage;