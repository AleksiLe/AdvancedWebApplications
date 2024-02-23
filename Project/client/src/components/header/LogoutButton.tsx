import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
function LogoutButton(props: { removeToken: Function }) {
  const { t } = useTranslation();
  return (
    <Button
      component={Link}
      to="/"
      color="inherit"
      onClick={() => props.removeToken()}
    >
      {t("logout")}
    </Button>
  );
}
export default LogoutButton;
