import { useState } from 'react';
import { useData } from '../context/DataContext';
import { getMesAnoKey } from '../utils/helpers';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Save, Trash2 } from 'lucide-react';

const camposLancamento = [
  { key: 'psicologicos', label: 'Atendimentos Psicológicos', type: 'number' },
  { key: 'psiquiatricos', label: 'Atendimentos Psiquiátricos', type: 'number' },
  { key: 'emergenciais', label: 'Atendimentos Sociais Emergenciais', type: 'number' },
  { key: 'livres', label: 'Famílias no programa LIVRES', type: 'number' },
  { key: 'mulheresScfv', label: 'Mulheres no SCFV', type: 'number' },
  { key: 'novasFamilias', label: 'Novas famílias acolhidas', type: 'number' },
  { key: 'altas', label: 'Altas do mês', type: 'number' },
  { key: 'receitas', label: 'Receitas totais (R$)', type: 'number' },
  { key: 'despesas', label: 'Despesas totais (R$)', type: 'number' },
];

const initialForm = {
  mesAno: getMesAnoKey(),
  psicologicos: '',
  psiquiatricos: '',
  emergenciais: '',
  livres: '',
  mulheresScfv: '',
  novasFamilias: '',
  altas: '',
  receitas: '',
  despesas: '',
  observacoes: '',
};

export default function Lancamento() {
  const { lancamentos, adicionarLancamento, excluirLancamento } = useData();
  const [form, setForm] = useState(initialForm);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    adicionarLancamento({
      ...form,
      psicologicos: Number(form.psicologicos) || 0,
      psiquiatricos: Number(form.psiquiatricos) || 0,
      emergenciais: Number(form.emergenciais) || 0,
      livres: Number(form.livres) || 0,
      mulheresScfv: Number(form.mulheresScfv) || 0,
      novasFamilias: Number(form.novasFamilias) || 0,
      altas: Number(form.altas) || 0,
      receitas: Number(form.receitas) || 0,
      despesas: Number(form.despesas) || 0,
    });
    setForm(initialForm);
  };

  const formatMesAno = (mesAno) => {
    try {
      const date = parse(mesAno, 'yyyy-MM', new Date());
      return format(date, 'MMMM/yyyy', { locale: ptBR });
    } catch {
      return mesAno;
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Lançamento Mensal</h1>
      </div>

      <form onSubmit={handleSubmit} className="lancamento-form">
        <div className="form-group">
          <label>Mês/Ano de Referência</label>
          <input
            type="month"
            value={form.mesAno}
            onChange={(e) => handleChange('mesAno', e.target.value)}
            required
          />
        </div>

        <div className="form-grid">
          {camposLancamento.map((campo) => (
            <div key={campo.key} className="form-group">
              <label>{campo.label}</label>
              <input
                type="number"
                min="0"
                step={campo.key === 'receitas' || campo.key === 'despesas' ? '0.01' : '1'}
                value={form[campo.key]}
                onChange={(e) => handleChange(campo.key, e.target.value)}
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>Observações</label>
          <textarea
            value={form.observacoes}
            onChange={(e) => handleChange('observacoes', e.target.value)}
            rows={3}
            placeholder="Notas e observações livres..."
          />
        </div>

        <button type="submit" className="btn btn-primary">
          <Save size={18} />
          Salvar Lançamento
        </button>
      </form>

      {lancamentos.length > 0 && (
        <div className="lancamentos-historico">
          <h2>Histórico de Lançamentos</h2>
          <div className="historico-list">
            {[...lancamentos].reverse().map((l) => (
              <div key={l.id} className="historico-card">
                <div className="historico-header">
                  <h3>{formatMesAno(l.mesAno)}</h3>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => {
                      if (window.confirm('Excluir este lançamento?')) excluirLancamento(l.id);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="historico-grid">
                  <span>Psicológicos: <strong>{l.psicologicos}</strong></span>
                  <span>Psiquiátricos: <strong>{l.psiquiatricos}</strong></span>
                  <span>Emergenciais: <strong>{l.emergenciais}</strong></span>
                  <span>LIVRES: <strong>{l.livres}</strong></span>
                  <span>Mulheres SCFV: <strong>{l.mulheresScfv}</strong></span>
                  <span>Novas Famílias: <strong>{l.novasFamilias}</strong></span>
                  <span>Altas: <strong>{l.altas}</strong></span>
                  <span>Receitas: <strong>R$ {Number(l.receitas).toLocaleString('pt-BR')}</strong></span>
                  <span>Despesas: <strong>R$ {Number(l.despesas).toLocaleString('pt-BR')}</strong></span>
                </div>
                {l.observacoes && <p className="historico-obs">{l.observacoes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
