import { useState } from 'react';
import { useData } from '../context/DataContext';
import { calcularMeses, formatarData, getMesCorrenteLabel } from '../utils/helpers';
import Modal from '../components/Modal';
import { Plus, Edit2, UserCheck, Trash2 } from 'lucide-react';

export default function Familias() {
  const { familias, adicionarFamilia, editarFamilia, marcarAlta, excluirFamilia } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nome: '', dataInscricao: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editando) {
      editarFamilia(editando, form);
    } else {
      adicionarFamilia(form);
    }
    setForm({ nome: '', dataInscricao: '' });
    setEditando(null);
    setModalOpen(false);
  };

  const handleEdit = (familia) => {
    setForm({ nome: familia.nome, dataInscricao: familia.dataInscricao });
    setEditando(familia.id);
    setModalOpen(true);
  };

  const handleAlta = (id) => {
    if (window.confirm('Confirma marcar esta família como ALTA?')) {
      marcarAlta(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Confirma exclusão desta família?')) {
      excluirFamilia(id);
    }
  };

  const openNew = () => {
    setForm({ nome: '', dataInscricao: '' });
    setEditando(null);
    setModalOpen(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Gestão de Famílias</h1>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={18} />
          Nova Família
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome da Família</th>
              <th>Data de Inscrição</th>
              <th>Qtd Meses</th>
              <th>Status</th>
              <th>Mês Corrente</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {familias.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  Nenhuma família cadastrada ainda.
                </td>
              </tr>
            ) : (
              familias.map((f) => (
                <tr key={f.id} className={f.status === 'ALTA' ? 'row-alta' : ''}>
                  <td className="td-nome">{f.nome}</td>
                  <td>{f.dataInscricao ? formatarData(f.dataInscricao) : '—'}</td>
                  <td>{f.dataInscricao ? calcularMeses(f.dataInscricao) : '—'}</td>
                  <td>
                    <span className={`status-badge ${f.status === 'ALTA' ? 'status-alta' : 'status-ativa'}`}>
                      {f.status}
                    </span>
                  </td>
                  <td>{f.status === 'ALTA' ? 'ALTA' : getMesCorrenteLabel()}</td>
                  <td className="td-actions">
                    {f.status !== 'ALTA' && (
                      <>
                        <button className="btn-icon" title="Editar" onClick={() => handleEdit(f)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-icon btn-alta" title="Marcar ALTA" onClick={() => handleAlta(f.id)}>
                          <UserCheck size={16} />
                        </button>
                      </>
                    )}
                    <button className="btn-icon btn-danger" title="Excluir" onClick={() => handleDelete(f.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editando ? 'Editar Família' : 'Nova Família'}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nome da Família</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              placeholder="Ex: Família Silva"
            />
          </div>
          <div className="form-group">
            <label>Data de Inscrição (1º dia do mês)</label>
            <input
              type="date"
              value={form.dataInscricao}
              onChange={(e) => setForm({ ...form, dataInscricao: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            {editando ? 'Salvar Alterações' : 'Cadastrar Família'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
