import './styles.css';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

const App: React.FC = () => {
    return <div>Hello!</div>;
};

const rootElement = document.getElementById("app");
const root = createRoot(rootElement!);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
