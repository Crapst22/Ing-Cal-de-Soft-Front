import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConfiguracionSistemaProvider } from "./componentes/sistema/ConfiguracionSistemaContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FiltrosProvider } from "./context/filtros-contesxt.tsx";
import { CatalogosProvider } from "./context/catalogos-context.tsx";


createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="145763953821-7kop2u3no3g56g244l0c49g7m34vqd14.apps.googleusercontent.com">
    <StrictMode>
      <ConfiguracionSistemaProvider>
        <FiltrosProvider>
          <CatalogosProvider>
            <App />
          </CatalogosProvider>
        </FiltrosProvider>
      </ConfiguracionSistemaProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);