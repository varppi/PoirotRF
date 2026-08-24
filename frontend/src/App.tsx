import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import MainLayout from './MainLayout';
import Editor from './pages/Editor';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout/>}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="editor" element={<Editor/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}