import { differenceInMonths, parse, format, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function calcularMeses(dataInscricao) {
  const inicio = parse(dataInscricao, 'yyyy-MM-dd', new Date());
  const hoje = startOfMonth(new Date());
  return differenceInMonths(hoje, inicio) + 1;
}

export function formatarMesAno(date) {
  return format(date, 'MMMM yyyy', { locale: ptBR });
}

export function getMesCorrenteLabel() {
  return format(new Date(), 'MMMM/yyyy', { locale: ptBR });
}

export function getMesAnoKey(date = new Date()) {
  return format(date, 'yyyy-MM');
}

export function formatarData(dateStr) {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  return format(date, 'dd/MM/yyyy');
}

export function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
