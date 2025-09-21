import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css"
import Home from "./components/Home/Home";
import Project from "./components/Project/Project";
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Collabe from './components/Collabe/Collabe';

const App = () => {

  return (
    <Router>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/project/:id" element={<Project />} />
      <Route path="/project/collabe/:session" element={<Collabe />} />
     </Routes>
    </Router>
  );
};

export default App;