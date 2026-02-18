import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./app/router";

function App() {
  return (
    <>
      {/* Toast Renderer */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#1f2937",
            color: "#fff",
          },
        }}
      />

      {/* Router */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
