import React, { useState } from 'react';
import { Settings, Lock, Eye, EyeOff, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useNewspaper } from '../context/NewspaperContext';

export const AdminPasswordModal: React.FC = () => {
  const { 
    adminModalOpen, 
    setAdminModalOpen, 
    verifyAdminPassword, 
    setCurrentTab 
  } = useNewspaper();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!adminModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = verifyAdminPassword(password);
    if (success) {
      setAdminModalOpen(false);
      setPassword('');
      setCurrentTab('redactor');
    } else {
      setError('Contraseña de administración incorrecta. Verifique sus credenciales.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-xs">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-100 font-headline">
                Acceso de Administración
              </h3>
              <p className="text-xs text-stone-400">
                Mesa de Redacción • El Debate de los Calentanos
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setAdminModalOpen(false);
              setPassword('');
              setError(null);
            }}
            className="p-1 rounded text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-stone-900 dark:text-stone-100 font-serif leading-relaxed font-medium">
            Área restringida para corresponsales, editores y administradores. Ingrese la clave de seguridad para redactar, editar o moderar notas.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-950 dark:text-stone-100">
              Contraseña de Acceso:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="Ingrese contraseña..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full bg-stone-50 dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-600 focus:border-amber-600 dark:focus:border-amber-500 rounded-xl pl-10 pr-10 py-2.5 text-sm font-bold outline-none text-stone-950 dark:text-stone-50 transition"
              />
              <Lock className="w-4 h-4 text-stone-600 dark:text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-900 dark:hover:text-stone-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-lg flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setAdminModalOpen(false);
                setPassword('');
                setError(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg cursor-pointer transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Ingresar al Panel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
