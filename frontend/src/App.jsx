import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Explore from './pages/Explore';
import SubmitIdea from './pages/SubmitIdea';
import ProjectDetails from './pages/ProjectDetails';
import Community from './pages/Community';
import IdeaGraph from './pages/IdeaGraph';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Alumni from './pages/Alumni';
import Analytics from './pages/Analytics';
import AIAssistant from './pages/AIAssistant';
import ExtendIdea from './pages/ExtendIdea';
import Dashboard from './pages/Dashboard';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/submit" element={<PrivateRoute><SubmitIdea /></PrivateRoute>} />
            <Route path="/extend" element={<PrivateRoute><ExtendIdea /></PrivateRoute>} />
            <Route path="/ai-assistant" element={<PrivateRoute><AIAssistant /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/project/:id" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
            <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
            <Route path="/graph" element={<IdeaGraph />} />
            <Route path="/alumni" element={<PrivateRoute><Alumni /></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          </Routes>
          <Chatbot />
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
