import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
function LoginButton() {
  const { t } = useTranslation();
  return (
    <Button component={Link} to="/login" color="inherit">
      {t("login")}
    </Button>
  );
}
export default LoginButton;
