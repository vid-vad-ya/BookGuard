import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Analysis from "./pages/Analysis";
import How from "./pages/How";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="pt-16 flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/analysis/:id" element={<Analysis />} />
            <Route path="/how" element={<How />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
