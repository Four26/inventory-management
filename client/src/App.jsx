import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Content from './components/Content';

function App() {
    const [selectedView, setSelectedView] = useState('dashboard');

    return (
        <Router>
            <div className='app'>
                <Navbar />
                <main>
                    {/* {isSidebarVisible && <Sidebar setSelectedView={setSelectedView} />}*/}

                    <Sidebar setSelectedView={setSelectedView} />
                    <Routes>
                        <Route path="/" element={<Content selectedView="dashboard" />} />
                        <Route path="/dashboard" element={<Content selectedView={selectedView} />} />
                        <Route path="/categories" element={<Content selectedView={selectedView} />} />
                        <Route path="/products" element={<Content selectedView={selectedView} />} />
                    </Routes>
                </main>
                <footer>
                    <p>Made with React, Express, and Postgres</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
