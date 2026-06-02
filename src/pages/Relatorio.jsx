import { useState } from 'react';
import { useData } from '../context/DataContext';
import { getMesAnoKey } from '../utils/helpers';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Relatorio() {
  const { familias, lancamentos } = useData();
  const [mesSelecionado, setMesSelecionado] = useState(getMesAnoKey());

  const lancamento = lancamentos.find((l) => l.mesAno === mesSelecionado);

  const familiasAtivasNoMes = familias.filter((f) => {
    if (!f.dataInscricao) return false;
    if (f.dataInscricao > mesSelecionado + '-31') return false;
    if (f.status === 'ALTA' && f.dataAlta && f.dataAlta < mesSelecionado + '-01') return false;
    return true;
  }).length;

  const formatMesLabel = () => {
    try {
      const date = parse(mesSelecionado, 'yyyy-MM', new Date());
      return format(date, "MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return mesSelecionado;
    }
  };

  const receitas = lancamento?.receitas || 0;
  const despesas = lancamento?.despesas || 0;
  const saldo = receitas - despesas;

  const financeiroData = [
    { name: 'Receitas', valor: receitas, color: '#06D6A0' },
    { name: 'Despesas', valor: despesas, color: '#F4845F' },
    { name: 'Saldo', valor: saldo, color: saldo >= 0 ? '#00B4D8' : '#EF476F' },
  ];

  const ecosistema = [
    {
      categoria: 'Saúde Mental',
      items: [
        { label: 'Atendimentos Psicológicos', value: lancamento?.psicologicos || 0 },
        { label: 'Atendimentos Psiquiátricos', value: lancamento?.psiquiatricos || 0 },
      ],
    },
    {
      categoria: 'Suporte',
      items: [
        { label: 'Programa LIVRES', value: lancamento?.livres || 0 },
        { label: 'Mulheres SCFV', value: lancamento?.mulheresScfv || 0 },
      ],
    },
    {
      categoria: 'Necessidades Básicas',
      items: [
        { label: 'Atend. Emergenciais', value: lancamento?.emergenciais || 0 },
        { label: 'Novas Famílias Acolhidas', value: lancamento?.novasFamilias || 0 },
      ],
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Relatório Visual</h1>
        <input
          type="month"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value)}
          className="month-selector"
        />
      </div>

      <div className="relatorio-slide" id="relatorio-slide">
        <div className="slide-header">
          <h2>Instituto HOPE — Onda Dura</h2>
          <p className="slide-subtitle">Relatório Mensal: {formatMesLabel()}</p>
        </div>

        <div className="slide-stats">
          <div className="slide-stat-card accent-cyan">
            <span className="slide-stat-value">{familiasAtivasNoMes}</span>
            <span className="slide-stat-label">Famílias Ativas</span>
          </div>
          <div className="slide-stat-card accent-orange">
            <span className="slide-stat-value">{lancamento?.altas || 0}</span>
            <span className="slide-stat-label">Altas no Mês</span>
          </div>
          <div className="slide-stat-card accent-purple">
            <span className="slide-stat-value">
              {(lancamento?.psicologicos || 0) + (lancamento?.psiquiatricos || 0)}
            </span>
            <span className="slide-stat-label">Atend. Saúde Mental</span>
          </div>
          <div className="slide-stat-card accent-green">
            <span className="slide-stat-value">{lancamento?.novasFamilias || 0}</span>
            <span className="slide-stat-label">Novas Famílias</span>
          </div>
        </div>

        <div className="slide-section">
          <h3>Financeiro</h3>
          <div className="chart-container-sm">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={financeiroData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2a4a" />
                <XAxis dataKey="name" stroke="#8892a4" />
                <YAxis stroke="#8892a4" />
                <Tooltip
                  formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                  contentStyle={{ backgroundColor: '#0f1f3d', border: '1px solid #1a2a4a', borderRadius: '8px', color: '#f0f4f8' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#f0f4f8' }}
                />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                  {financeiroData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="slide-section">
          <h3>Ecossistema de Cuidado</h3>
          <div className="ecosistema-grid">
            {ecosistema.map((cat) => (
              <div key={cat.categoria} className="eco-card">
                <h4>{cat.categoria}</h4>
                {cat.items.map((item) => (
                  <div key={item.label} className="eco-item">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {lancamento?.observacoes && (
          <div className="slide-section">
            <h3>Observações</h3>
            <p className="slide-obs">{lancamento.observacoes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
