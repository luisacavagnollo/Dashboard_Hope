import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Familias from './pages/Familias';
import Lancamento from './pages/Lancamento';
import Relatorio from './pages/Relatorio';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="familias" element={<Familias />} />
            <Route path="lancamento" element={<Lancamento />} />
            <Route path="relatorio" element={<Relatorio />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
