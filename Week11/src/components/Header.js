import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Header() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button component={Link} to="/" color="inherit">
            {t("Home")}
          </Button>
          <Button component={Link} to="/about" color="inherit">
            {t("About")}
          </Button>
          <Button id="fi" onClick={() => changeLanguage("fi")} color="inherit">
            FI
          </Button>
          <Button id="en" onClick={() => changeLanguage("en")} color="inherit">
            EN
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
