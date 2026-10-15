import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Zap, 
  CheckCircle2, 
  Send, 
  AlertTriangle, 
  Clock,
  Sparkles
} from 'lucide-react';
import { useNewspaper } from '../context/NewspaperContext';

interface PushNotificationModalProps {
  onClose: () => void;
}

export const PushNotificationModal: React.FC<PushNotificationModalProps> = ({ onClose }) => {
  const { 
    alerts, 
    pushEnabled, 
    togglePushNotifications, 
    markAlertsAsRead,
    triggerBreakingNewsAlert,
    articles,
    openArticle
  } = useNewspaper();

  const [customTitle, setCustomTitle] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [sentToast, setSentToast] = useState(false);

  React.useEffect(() => {
    markAlertsAsRead();
  }, []);

  const handleSendTestAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customBody.trim()) return;

    triggerBreakingNewsAlert(customTitle, customBody);
    setCustomTitle('');
    setCustomBody('');
    setSentToast(true);
    setTimeout(() => setSentToast(false), 3000);
  };

  const handleSimulateQuick = (type: 'balsas' | 'maiz' | 'clima') => {
    if (type === 'balsas') {
      triggerBreakingNewsAlert(
        '⚠️ Alerta Balsas: Desfogue Preventivo',
        'Caudal incrementado en 450 m³/s en la presa. Se pide evacuar orillas bajas en Coyuca y Altamirano.',
        'art-2'
      );
    } else if (type === 'maiz') {
      triggerBreakingNewsAlert(
        '🌽 Aviso Campesino: Nuevo Precio de Maíz',
        'Acuerdan precio piso de $6,850 por tonelada en bodegas de Cutzamala y Arcelia.',
        'art-4'
      );
    } else {
      triggerBreakingNewsAlert(
        '☀️ Aviso Meteorológico: 41°C en Tierra Caliente',
        'Pico térmico previsto para las 15:00 horas. Mantener hidratación continua y ganado bajo techado.',
        'art-1'
      );
    }
    setSentToast(true);
    setTimeout(() => setSentToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-2xl shadow-2xl border border-stone-300 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Alertas y Notificaciones Push</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-stone-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Permission Toggle */}
          <div className="p-3.5 bg-stone-100 dark:bg-stone-850 rounded-xl flex items-center justify-between border border-stone-200 dark:border-stone-700">
            <div>
              <div className="font-bold text-stone-900 dark:text-stone-100">
                Recepción de Notificaciones Push
              </div>
              <div className="text-[11px] text-stone-500">
                {pushEnabled ? 'Activo en este dispositivo' : 'Desactivado'}
              </div>
            </div>
            <button
              onClick={togglePushNotifications}
              className={`px-3 py-1.5 rounded-full font-bold text-xs cursor-pointer transition ${
                pushEnabled ? 'bg-emerald-600 text-white' : 'bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              {pushEnabled ? 'Activadas ✓' : 'Desactivadas'}
            </button>
          </div>

          {/* Quick Simulation Buttons */}
          <div className="space-y-2">
            <span className="font-bold text-stone-700 dark:text-stone-300 block">
              Simular Alerta de Última Hora en Tiempo Real:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSimulateQuick('balsas')}
                className="p-2 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-lg font-medium hover:bg-red-100 transition cursor-pointer text-center"
              >
                🌊 Crecida Balsas
              </button>
              <button
                type="button"
                onClick={() => handleSimulateQuick('maiz')}
                className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-lg font-medium hover:bg-amber-100 transition cursor-pointer text-center"
              >
                🌽 Precios Campo
              </button>
              <button
                type="button"
                onClick={() => handleSimulateQuick('clima')}
                className="p-2 bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-900 rounded-lg font-medium hover:bg-orange-100 transition cursor-pointer text-center"
              >
                ☀️ Onda de Calor
              </button>
            </div>
          </div>

          {sentToast && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-400 text-emerald-800 dark:text-emerald-200 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Notificación push enviada en tiempo real al feed y cabecera.</span>
            </div>
          )}

          {/* List of Alerts */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
              <span>Historial de Alertas Recibidas</span>
              <span className="text-[10px] text-stone-400">{alerts.length} registros</span>
            </h4>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {alerts.map(alt => (
                <div
                  key={alt.id}
                  onClick={() => {
                    if (alt.articleId) {
                      const found = articles.find(a => a.id === alt.articleId);
                      if (found) {
                        onClose();
                        openArticle(found);
                      }
                    }
                  }}
                  className={`p-3 rounded-lg border transition ${
                    alt.urgent
                      ? 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900'
                      : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800'
                  } ${alt.articleId ? 'cursor-pointer hover:border-amber-600' : ''}`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                      {alt.urgent && <Zap className="w-3 h-3 text-red-600" />}
                      {alt.title}
                    </span>
                    <span className="text-[10px] text-stone-400">{alt.timestamp}</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-[11px]">
                    {alt.body}
                  </p>
                  {alt.articleId && (
                    <div className="mt-1 text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                      Toca para leer el artículo completo →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Custom alert composer */}
          <form onSubmit={handleSendTestAlert} className="p-3 bg-stone-100 dark:bg-stone-850 rounded-xl space-y-2 border border-stone-200 dark:border-stone-700">
            <div className="font-bold text-stone-800 dark:text-stone-200">
              Redactar Alerta Push Personalizada
            </div>
            <input
              type="text"
              placeholder="Título de la alerta (ej. 📢 Cierre de puente Coyuca)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-xs outline-none"
            />
            <input
              type="text"
              placeholder="Mensaje de texto..."
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-xs outline-none"
            />
            <button
              type="submit"
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-1.5 rounded text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Emitir Alerta a la Comunidad</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
