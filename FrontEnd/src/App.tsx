import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DEFAULT_STORE_IP } from "./config/storeRoutes";
import { IntroPage } from "./pages/IntroPage";
import { ResultPage } from "./pages/ResultPage";

const defaultIntroPath = `/pages/intro?iP=${DEFAULT_STORE_IP}`;

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pages/intro" element={<IntroPage />} />
        <Route path="/pages/result" element={<ResultPage />} />
        <Route path="/" element={<Navigate to={defaultIntroPath} replace />} />
        <Route path="*" element={<Navigate to={defaultIntroPath} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
