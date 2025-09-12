import { createContext, useState, useEffect } from "react";

export let AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);



  //--------Register-----------

    let register = async (name, username, password) => {
      try {
        let response = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, username, password }),
        });

        let data = await response.json();
        if (response.ok) {
          alert("Registration successful! You can now log in.");
          return true;
        } else {
          alert(data.message);
          return false;
        }
      } catch (error) {
        console.log("Registration Failed", error);
        return false;
      }
    };

  //-----------LOGIN-------
  let login = async (username, password) => {
    try {
      let response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      let data = await response.json();
      if (response.ok) {
        setToken(data.token);
        setUser({ username: data.username });
        return true;
      } else {
        alert(data.message);
        return false;
      }
    } catch (error) {
      console.log("Login Failed", error);
      return false;
    }
  };


  let logout = () => {
    setToken(null);
    setUser(null);
  };

return(

    <AuthContext.Provider value={{user,token,register,login,logout}}>
        {children}
    </AuthContext.Provider>
)
}

