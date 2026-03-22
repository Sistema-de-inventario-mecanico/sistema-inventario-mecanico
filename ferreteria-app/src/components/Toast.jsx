import React, { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/* ─────────────────────────────────────────────
   TOAST NOTIFICATION (bottom-right slide-in)
───────────────────────────────────────────── */
export function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 4500);
        return () => clearTimeout(t);
    }, [onClose]);

    const styles = {
        success: 'bg-green-50 border-green-400 text-green-800',
        error:   'bg-red-50   border-red-400   text-red-800',
        warning: 'bg-orange-50 border-orange-400 text-orange-800',
        info:    'bg-blue-50  border-blue-400  text-blue-800',
    };
    const icons = {
        success: <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />,
        error:   <XCircleIcon    className="w-5 h-5 text-red-500   shrink-0" />,
        warning: <ExclamationCircleIcon className="w-5 h-5 text-orange-500 shrink-0" />,
        info:    <ExclamationCircleIcon className="w-5 h-5 text-blue-500  shrink-0" />,
    };

    return ReactDOM.createPortal(
        <div className={`fixed bottom-6 right-6 z-[10000] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm ${styles[type] || styles.info}`}
             style={{ minWidth: '280px', animation: 'slideInRight 0.3s ease' }}>
            {icons[type]}
            <p className="text-sm font-medium flex-1">{message}</p>
            <button onClick={onClose} className="ml-auto hover:opacity-60 transition-opacity">
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>,
        document.body
    );
}

/* Hook – returns showToast + <ToastContainer /> */
export function useToast() {
    const [toasts, setToasts] = React.useState([]);

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const remove = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const ToastContainer = () => (
        <>
            {toasts.map(t => (
                <Toast key={t.id} message={t.message} type={t.type} onClose={() => remove(t.id)} />
            ))}
        </>
    );

    return { showToast, ToastContainer };
}

/* ─────────────────────────────────────────────
   CONFIRM DIALOG  (replaces window.confirm)
   Usage:
     const { confirmDialog, ConfirmDialogContainer } = useConfirm();
     const ok = await confirmDialog('¿Eliminar?', 'Esto no se puede deshacer.');
     if (ok) { ... }
───────────────────────────────────────────── */
export function useConfirm() {
    const [state, setState] = React.useState(null); // { message, detail, resolve }

    const confirmDialog = useCallback((message, detail = '') =>
        new Promise(resolve => setState({ message, detail, resolve })), []);

    const handleResponse = (answer) => {
        state?.resolve(answer);
        setState(null);
    };

    const ConfirmDialogContainer = () => {
        if (!state) return null;
        return ReactDOM.createPortal(
            <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 border-t-4 border-orange-500">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="bg-orange-100 rounded-full p-2 shrink-0">
                            <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="font-bold text-dark text-base">{state.message}</p>
                            {state.detail && <p className="text-sm text-gray-500 mt-1">{state.detail}</p>}
                        </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                        <button
                            onClick={() => handleResponse(false)}
                            className="flex-1 py-2 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => handleResponse(true)}
                            className="flex-1 py-2 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors shadow-sm"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    return { confirmDialog, ConfirmDialogContainer };
}

/* ─────────────────────────────────────────────
   PORTAL MODAL  (replaces overflow-clipped modals)
───────────────────────────────────────────── */
export function PortalModal({ title, onClose, children }) {
    return ReactDOM.createPortal(
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', width: '28rem', maxWidth: '92vw', maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', borderTop: '4px solid #f97316' }}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-dark">{title}</h3>
                    {onClose && (
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
}
