import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for transition
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message && !visible) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-[9999] p-4 rounded-xl shadow-lg border flex items-center gap-3 transition-all duration-300 ease-in-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
      {type === 'success' ? <CheckCircle className="text-emerald-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
      <p className="font-semibold text-sm">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-2 text-slate-400 hover:text-slate-600 transition-colors">
        <X size={18} />
      </button>
    </div>
  );
}
