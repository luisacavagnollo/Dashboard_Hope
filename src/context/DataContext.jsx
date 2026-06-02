import { createContext, useContext, useState, useEffect } from 'react';
import { getFamilias, saveFamilias, getLancamentos, saveLancamentos } from '../utils/storage';
import { gerarId } from '../utils/helpers';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [familias, setFamilias] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);

  useEffect(() => {
    setFamilias(getFamilias());
    setLancamentos(getLancamentos());
  }, []);

  useEffect(() => {
    saveFamilias(familias);
  }, [familias]);

  useEffect(() => {
    saveLancamentos(lancamentos);
  }, [lancamentos]);

  const adicionarFamilia = (familia) => {
    const nova = { ...familia, id: gerarId(), status: 'Ativa' };
    setFamilias((prev) => [...prev, nova]);
  };

  const editarFamilia = (id, dados) => {
    setFamilias((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...dados } : f))
    );
  };

  const marcarAlta = (id) => {
    setFamilias((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: 'ALTA', dataAlta: new Date().toISOString().slice(0, 10) } : f
      )
    );
  };

  const excluirFamilia = (id) => {
    setFamilias((prev) => prev.filter((f) => f.id !== id));
  };

  const adicionarLancamento = (lancamento) => {
    const novo = { ...lancamento, id: gerarId() };
    setLancamentos((prev) => [...prev, novo]);
  };

  const excluirLancamento = (id) => {
    setLancamentos((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        familias,
        lancamentos,
        adicionarFamilia,
        editarFamilia,
        marcarAlta,
        excluirFamilia,
        adicionarLancamento,
        excluirLancamento,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
