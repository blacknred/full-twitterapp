import { AppProvider } from '@/providers';
import { AppRoutes } from '@/routes';
import { hot } from "react-hot-loader/root";

import "./globals.css";

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default hot(App);

