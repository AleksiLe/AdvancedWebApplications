import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import CardsIcon from "./CardsIcon";
import ChatIcon from "./ChatIcon";
import ProfileIcon from "./ProfileIcon";
import { useTranslation } from "react-i18next";
//wip alert
function Header() {
  //i18n
  const { t, i18n } = useTranslation();
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  //login/log out button
  let mount = true;
  const [logButton, setLogButton] = useState<JSX.Element | null>(null);
  //removes token from local storage and sets loggedIn to false
  function removeToken() {
    localStorage.removeItem("token");
    window.location.href = "/login";
    alert(t("logged out"));
  }
  //checks if token is valid
  //tried to put it on app.tsx but it wouldnt work because strict mode calls app useeffect twice
  useEffect(() => {
    const token: String = localStorage.getItem("token") as string;
    if (token && mount) {
      mount = false;
      fetch("http://localhost:3001/user/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res: Response) => {
          if (res.status === 401) {
            alert(t("login again"));
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
          return res.json();
        })
        .then((res) => {
          if (res.success) {
            setLogButton(<LogoutButton removeToken={removeToken} />);
            console.log("logged in");
          }
        })
        .catch((err: Error) => {
          console.log(err);
        });
    } else {
      setLogButton(<LoginButton />);
    }
    mount = false;
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <CardsIcon />
          <ChatIcon />
          <ProfileIcon />
          <Box sx={{ flexGrow: 1 }} />
          <Button key="en" onClick={() => changeLanguage("en")} color="inherit">
            EN
          </Button>
          <Button key="fi" onClick={() => changeLanguage("fi")} color="inherit">
            FI
          </Button>
          {logButton}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
