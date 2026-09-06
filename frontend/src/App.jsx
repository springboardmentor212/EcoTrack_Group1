import "./App.css";
import { Toaster } from "sonner";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <AppRoutes />
    </>
  );
}

export default App;
