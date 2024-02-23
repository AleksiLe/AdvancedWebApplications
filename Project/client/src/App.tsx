import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Index from "./components/index/Index";
import Login from "./components/index/Login";
import Cards from "./components/card/Cards";
import Chat from "./components/chat/Chat";
import PrivateRoutes from "./components/PrivateRoutes";
import EditProfile from "./components/edit/EditProfile";
import "./App.css";
import Register from "./components/index/Register";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Index />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Header />
                <Login />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Header />
                <Register />
              </>
            }
          />
          //Private Routes
          <Route element={<PrivateRoutes />}>
            <Route
              element={
                <>
                  <Header /> <Cards />
                </>
              }
              path="/cards"
            />
            <Route
              path="/chat"
              element={
                <>
                  <Header />
                  <Chat />
                </>
              }
            />
            <Route
              path="/edit"
              element={
                <>
                  <Header />
                  <EditProfile />
                </>
              }
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
