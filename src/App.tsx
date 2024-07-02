import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SessionHandler from "./components/SessionHandler";
import { BrowseProjects, Editor, Login } from "./pages";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <SessionHandler>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/browse-projects" element={<BrowseProjects />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </SessionHandler>
      </Router>
    </ApolloProvider>
  );
};

export default App;
