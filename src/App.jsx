import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserDashboard from "./components/dashboard";
import { Footer } from "./components/footer";
import DynamicForm from "./components/form";
import { Home } from "./components/home";
import { Login } from "./components/login";
import NavBar from "./components/nav";
import { Registration } from "./components/registration";
import { AuthModal } from "./components/authContainer";
import { MyAppContext } from "../context/appContext";
import ProtectedRoute from "./components/protectedRoute/protected";


function App() {
  return (
    <MyAppContext>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/form"
            element={
              <ProtectedRoute>
                <DynamicForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<AuthModal />} />
          {/* <Route path="/register" element={<Registration />} /> */}
        </Routes>
        <Footer />
      </Router>
    </MyAppContext>
  );
}

export default App;