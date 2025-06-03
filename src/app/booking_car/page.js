import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CarBookingPage from '../finding_car/page'; 
import HomePage from '../page'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/car-booking" element={<CarBookingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
