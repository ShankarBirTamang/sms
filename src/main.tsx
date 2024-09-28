import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import Layout from "./layout/Layout.tsx";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Layout>
                <App/>
            </Layout>
        </BrowserRouter>
    </StrictMode>,
)
