import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import api from '../services/api';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { useToast, useConfirm, PortalModal } from '../components/Toast';

export default function AdminUsuarios() {
    const { showToast, ToastContainer } = useToast();
    const { confirmDialog, ConfirmDialogContainer } = useConfirm();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewMoreItem, setViewMoreItem] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({ first_name: '', last_name: '', rol: 'EMPLEADO', password: '' });

    const roleCodes = { ADMIN: '01', ENCARGADO_OFICINA: '02', ENCARGADO_AREA: '03', EMPLEADO: '04' };
    const roleBadge = {
        ADMIN: 'bg-red-100 text-red-800',
        ENCARGADO_OFICINA: 'bg-purple-100 text-purple-800',
        ENCARGADO_AREA: 'bg-blue-100 text-blue-800',
        EMPLEADO: 'bg-gray-100 text-gray-800',
    };

    const loadUsers = async () => {
        try { setUsuarios((await api.get('usuarios/')).data); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        loadUsers();
        const intervalId = setInterval(loadUsers, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const openModal = (u = null) => {
        setEditingUser(u);
        setForm(u
            ? { first_name: u.first_name, last_name: u.last_name, rol: u.rol, password: '' }
            : { first_name: '', last_name: '', rol: 'EMPLEADO', password: '' }
        );
        setShowModal(true);
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const generarMatricula = (n, a, r) => {
        const baseId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
        return `${(n.charAt(0) || 'X').toUpperCase()}${(a.charAt(0) || 'X').toUpperCase()}${roleCodes[r] || '04'}${baseId.toString().padStart(4, '0')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                const payload = { first_name: form.first_name, last_name: form.last_name, rol: form.rol };
                if (form.password) payload.password = form.password;
                await api.patch(`usuarios/${editingUser.id}/`, payload);
                showToast('Usuario actualizado correctamente.', 'success');
            } else {
                const matricula = generarMatricula(form.first_name, form.last_name, form.rol);
                await api.post('usuarios/', {
                    username: matricula,
                    first_name: form.first_name,
                    last_name: form.last_name,
                    rol: form.rol,
                    password: form.password,
                });
                showToast(`Usuario creado. Matrícula: ${matricula}`, 'success');
            }
            setShowModal(false);
            loadUsers();
        } catch (err) {
            const detail = err.response?.data;
            showToast('Error: ' + (detail?.username?.[0] || detail?.password?.[0] || 'Verifica los datos ingresados.'), 'error');
        }
    };

    const handleDelete = async (id, name) => {
        const ok = await confirmDialog(
            `¿Eliminar a ${name}?`,
            'Esta acción es permanente. El usuario ya no podrá ingresar al sistema.'
        );
        if (!ok) return;
        try {
            await api.delete(`usuarios/${id}/`);
            showToast('Usuario eliminado.', 'success');
            loadUsers();
        } catch {
            showToast('No se pudo eliminar el usuario.', 'error');
        }
    };

    if (loading) return <div className="text-center p-10 text-gray-500">Cargando personal...</div>;

    const previewBaseId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
    const preview = `${(form.first_name?.charAt(0) || 'X').toUpperCase()}${(form.last_name?.charAt(0) || 'X').toUpperCase()}${roleCodes[form.rol] || '04'}${previewBaseId.toString().padStart(4, '0')}`;

    return (
        <div className="space-y-6">
            <ToastContainer />
            <ConfirmDialogContainer />

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-dark">Gestión de Usuarios</h2>
                    <p className="text-gray-500 mt-1 text-sm">El sistema genera la Matrícula automáticamente al crear personal.</p>
                </div>
                <button onClick={() => openModal()} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition-colors font-medium text-sm">
                    <UserPlusIcon className="w-5 h-5" />
                    <span>Nuevo Personal</span>
                </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Matrícula</th>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Rol</th>
                            <th className="px-6 py-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {usuarios.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-mono font-bold text-dark tracking-wider">{u.username}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {u.first_name || u.last_name
                                        ? `${u.first_name} ${u.last_name}`
                                        : <span className="text-gray-400 font-normal">Sin nombre</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge[u.rol]}`}>
                                        {u.rol.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-3">
                                    <button className="text-primary hover:underline text-sm font-medium" onClick={() => openModal(u)}>Editar</button>
                                    <button className="text-red-500 hover:underline text-sm font-medium" onClick={() => handleDelete(u.id, `${u.first_name} ${u.last_name}`.trim() || u.username)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
                {usuarios.map(u => (
                    <div key={u.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="font-bold text-gray-900">{u.first_name || u.last_name ? `${u.first_name} ${u.last_name}` : <span className="text-gray-400 font-normal">Sin nombre</span>}</p>
                                <p className="text-xs font-mono text-gray-600">{u.username}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${roleBadge[u.rol]}`}>
                                {u.rol.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <button 
                            onClick={() => setViewMoreItem(u)}
                            className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-primary font-medium rounded-lg text-sm border border-gray-200 mt-1"
                        >
                            Ver Detalles y Acciones
                        </button>
                    </div>
                ))}
            </div>

            {/* View More Modal */}
            {viewMoreItem && (
                <PortalModal title="Información del Empleado" onClose={() => setViewMoreItem(null)}>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="w-14 h-14 bg-primary text-white flex items-center justify-center rounded-full text-xl font-bold mb-2">
                                {(viewMoreItem.first_name?.charAt(0) || 'U').toUpperCase()}{(viewMoreItem.last_name?.charAt(0) || '').toUpperCase()}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 text-center">
                                {viewMoreItem.first_name || viewMoreItem.last_name ? `${viewMoreItem.first_name} ${viewMoreItem.last_name}` : 'Sin nombre'}
                            </h3>
                            <p className="font-mono text-gray-500 font-medium tracking-wide">{viewMoreItem.username}</p>
                            <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${roleBadge[viewMoreItem.rol]}`}>
                                {viewMoreItem.rol.replace(/_/g, ' ')}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                            <button 
                                onClick={() => { setViewMoreItem(null); openModal(viewMoreItem); }}
                                className="flex flex-col items-center justify-center gap-1 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                                Editar Datos
                            </button>
                            <button 
                                onClick={() => { setViewMoreItem(null); handleDelete(viewMoreItem.id, `${viewMoreItem.first_name} ${viewMoreItem.last_name}`.trim() || viewMoreItem.username); }}
                                className="flex flex-col items-center justify-center gap-1 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                Dar de Baja
                            </button>
                        </div>
                    </div>
                </PortalModal>
            )}

            {showModal && (
                <PortalModal title={editingUser ? 'Modificar Usuario' : 'Alta de Personal'} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input className="form-input" type="text" name="first_name" required value={form.first_name} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                                <input className="form-input" type="text" name="last_name" required value={form.last_name} onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                            <select className="form-input bg-white" name="rol" value={form.rol} onChange={handleChange}>
                                <option value="EMPLEADO">Empleado</option>
                                <option value="ENCARGADO_AREA">Encargado de Área</option>
                                <option value="ENCARGADO_OFICINA">Encargado de Oficina</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña {editingUser && <span className="text-gray-400 font-normal">(vacía = sin cambio)</span>}
                            </label>
                            <input className="form-input" type="password" name="password" required={!editingUser} value={form.password} onChange={handleChange} placeholder={editingUser ? '••••••••' : 'Nueva contraseña'} />
                        </div>

                        {!editingUser && (
                            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-xs text-orange-800">
                                Matrícula generada automáticamente:<br />
                                <strong className="text-lg tracking-widest font-mono">{preview}</strong>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancelar</button>
                            <button type="submit" className="login-btn">{editingUser ? 'Guardar Cambios' : 'Crear Usuario'}</button>
                        </div>
                    </form>
                </PortalModal>
            )}
        </div>
    );
}
