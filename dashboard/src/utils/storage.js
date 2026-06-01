const STORAGE_KEYS = {
  FAMILIAS: 'hope_familias',
  LANCAMENTOS: 'hope_lancamentos',
};

export function getFamilias() {
  const data = localStorage.getItem(STORAGE_KEYS.FAMILIAS);
  return data ? JSON.parse(data) : [];
}

export function saveFamilias(familias) {
  localStorage.setItem(STORAGE_KEYS.FAMILIAS, JSON.stringify(familias));
}

export function getLancamentos() {
  const data = localStorage.getItem(STORAGE_KEYS.LANCAMENTOS);
  return data ? JSON.parse(data) : [];
}

export function saveLancamentos(lancamentos) {
  localStorage.setItem(STORAGE_KEYS.LANCAMENTOS, JSON.stringify(lancamentos));
}
