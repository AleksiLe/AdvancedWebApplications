import { useTranslation } from "react-i18next";

const MyContainer = () => {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t("Index")}</p>
    </div>
  );
};

export default MyContainer;
