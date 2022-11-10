
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Layout from './components/Layout';
import Users from './pages/Users';
import View from './pages/View';

function App() {
  return (
    <Layout>
    <Router>
      <Routes>
        <Route path='/' element={<Users/>} />
        <Route path='/user/:id' element={<View/>} />
      </Routes>
    </Router>
    </Layout>
  );
}

export default App;
