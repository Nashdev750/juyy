
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Layout from './components/Layout';
import Account from './pages/Account';
import Page404 from './pages/Page404';
import Statistics from './pages/Statistics';
import Users from './pages/Users';
import View from './pages/View';

function App() {
  return (
    <Layout>
    <Router>
      <Routes>
        <Route path='/' element={<Users/>} />
        <Route path='/account' element={<Account/>} />
        <Route path='/statistics' element={<Statistics/>} />
        <Route path='/user/:id' element={<View/>} />
        <Route path='*' element={<Page404/>} />
      </Routes>
    </Router>
    </Layout>
  );
}

export default App;
