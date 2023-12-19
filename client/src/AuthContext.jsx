import { createContext, useContext, useState } from "react";

const Authcontext = createContext();

export function AuthUser({ children }) {
  const [user, setUser] = useState(null);
  const [currentuserId, setCurrentuserId] = useState("");
  // const navigate = useNavigate();
  //  login and logout functions to set the user state

  return (
    <Authcontext.Provider
      value={{ user, setUser, currentuserId, setCurrentuserId }}
    >
      {children}
    </Authcontext.Provider>
  );
}
export function useAuth() {
  return useContext(Authcontext);
}
