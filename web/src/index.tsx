import { StrictMode } from 'react';
import ReactDOM from "react-dom/client";

import App from '@/App';

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement)

root.render(<StrictMode><App /></StrictMode>);