import { useData } from '../context/DataContext';
import { getMesCorrenteLabel, getMesAnoKey, calcularMeses } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserPlus, UserCheck, Heart, AlertTriangle, Shield } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const { familias, lancamentos } = useData();
  const mesAtual = getMesAnoKey();

  const familiasAtivas = familias.filter((f) => f.status === 'Ativa').length;

  const familiasNovasMes = familias.filter((f) => {
    return f.dataInscricao && f.dataInscricao.startsWith(mesAtual);
  }).length;

  const familiasAltaMes = familias.filter((f) => {
    return f.status === 'ALTA' && f.dataAlta && f.dataAlta.startsWith(mesAtual);
  }).length;

  const lancamentoAtual = lancamentos.find((l) => l.mesAno === mesAtual);

  const psicologicos = lancamentoAtual?.psicologicos || 0;
  const psiquiatricos = lancamentoAtual?.psiquiatricos || 0;
  const saudeMental = psicologicos + psiquiatricos;
  const emergenciais = lancamentoAtual?.emergenciais || 0;
  const livres = lancamentoAtual?.livres || 0;

  // Build chart data - last 6 months
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const key = format(date, 'yyyy-MM');
    const label = format(date, 'MMM/yy', { locale: ptBR });
    const ativasNoMes = familias.filter((f) => {
      const inscricao = f.dataInscricao;
      if (!inscricao || inscricao > format(date, 'yyyy-MM-dd')) return false;
      if (f.status === 'ALTA' && f.dataAlta && f.dataAlta < format(date, 'yyyy-MM') + '-01') return false;
      return true;
    }).length;
    chartData.push({ mes: label, familias: ativasNoMes });
  }

  const cards = [
    { label: 'Famílias Ativas', value: familiasAtivas, icon: Users, color: '#00B4D8' },
    { label: 'Novas este mês', value: familiasNovasMes, icon: UserPlus, color: '#06D6A0' },
    { label: 'Altas este mês', value: familiasAltaMes, icon: UserCheck, color: '#F4845F' },
    { label: 'Saúde Mental', value: saudeMental, icon: Heart, color: '#9B5DE5' },
    { label: 'Emergenciais', value: emergenciais, icon: AlertTriangle, color: '#FFC43D' },
    { label: 'Programa LIVRES', value: livres, icon: Shield, color: '#00B4D8' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <span className="mes-corrente">Mês Corrente: {getMesCorrenteLabel()}</span>
      </div>

      <div className="cards-grid">
        {cards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="stat-card-icon" style={{ backgroundColor: card.color + '20', color: card.color }}>
              <card.icon size={24} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{card.value}</span>
              <span className="stat-card-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-section">
        <h2>Evolução Mensal — Famílias Ativas</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2a4a" />
              <XAxis dataKey="mes" stroke="#8892a4" />
              <YAxis stroke="#8892a4" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f1f3d', border: '1px solid #1a2a4a', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#00B4D8' }}
              />
              <Bar dataKey="familias" fill="#00B4D8" radius={[4, 4, 0, 0]} name="Famílias Ativas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
