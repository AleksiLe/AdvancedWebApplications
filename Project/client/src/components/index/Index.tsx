import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
function Index() {
  const { t } = useTranslation();
  return (
    <div>
      <Link to="/register" color="inherit">
        <Button variant="outlined">{t("register")}</Button>
      </Link>
    </div>
  );
}

export default Index;
