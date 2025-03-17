import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import BlackjackScreen from "./screens/BlackjackScreen";

function App() {
  return (
    <main>
      <BrowserRouter>
        <header id="header">
          <nav>
            <ul>
              <li>
                <NavLink
                  to={"/"}
                  id="navlink"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/blackjack"}
                  id="navlink"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-500 font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }
                >
                  Blackjack
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/blackjack" element={<BlackjackScreen />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
