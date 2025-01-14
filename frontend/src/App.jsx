import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <div>
      <Toaster
        richColors
        toastOptions={{
          style: {
            height: "40px",
            paddingLeft: "20px",
            fontSize: "14px",
            letterSpacing: "0.8px",
            textTransform: "capitalize",
            wordSpacing: "1px",
          },
          className: "my-toast",
        }}
      />
      <Outlet />
    </div>
  );
}

export default App;
