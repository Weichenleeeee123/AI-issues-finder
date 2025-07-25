import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import IssueDetail from "@/pages/IssueDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/issue/:owner/:repo/:issueNumber" element={<IssueDetail />} />
      </Routes>
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
    </Router>
  );
}
