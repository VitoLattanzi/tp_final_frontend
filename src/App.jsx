import { Routes, Route } from "react-router-dom";
import InitialScreen from "./Screens/InitialScreen/InitialScreen";

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<InitialScreen />} />

    </Routes>
  );
}