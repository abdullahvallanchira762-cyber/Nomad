import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
          containerStyle={{
            top: 100,
          }}
        toastOptions={{
          duration: 2500,
          style: {
            background: "#121416",
            color: "#ffffff",
            border: "1px solid #2a2d31",
          },
        }}
      />

      <AppRoutes />
    </>
  );
}

export default App;