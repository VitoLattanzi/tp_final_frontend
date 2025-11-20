import { Routes, Route } from "react-router-dom";
import InitialScreen from "./Screens/InitialScreen/InitialScreen";
import HomeScreen from "./Screens/HomeScreen/HomeScreen.jsx";
export default function App() {


  return (
    <Routes>
      <Route path="/" element={<InitialScreen />} />
      <Route path="/home" element={< HomeScreen/>} />
        {/* 
        <Route path="/" element={< />} />
        <Route path="/" element={< />} />
        <Route path="/" element={< />} />
        */}
    </Routes>
  );
}