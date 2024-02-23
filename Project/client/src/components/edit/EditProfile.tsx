import { Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

function EditProfile() {
  interface Idata {
    success: boolean | null;
    message: string | null;
    error: String | null;
  }

  const sendForm = (email: String, password: String, username: String) => {
    if (email === "" || password === "" || username === "") {
      alert(t("please fill all fields"));
    } else {
      fetch("http://localhost:3001/user/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email, password, username }),
      })
        .then((res: Response) => res.json())
        .then((data: Idata) => {
          console.log(data);
          if (data.success) {
            alert(t("profile edited"));
          } else if (!data.success) {
            if (data.message === "Email already in use.") {
              alert(t("email already in use"));
            }
          } else {
            alert(data.error);
          }
        })
        .catch((err: Error) => console.log(err));
    }
  };
  const { t } = useTranslation();
  return (
    <Box sx={{ boxShadow: 3, borderRadius: 3, padding: 3 }}>
      <form
        onSubmit={(e: React.SyntheticEvent) => {
          e.preventDefault();
          const target = e.target as typeof e.target & {
            email: { value: string };
            password: { value: string };
            username: { value: string };
          };
          const email = target.email.value;
          const password = target.password.value;
          const username = target.username.value;
          sendForm(email, password, username);
        }}
      >
        <div>
          <Stack spacing={2}>
            <h2>{t("edit your profile")}</h2>
            <label>
              {" "}
              {t("email")}: <input type="email" name="email" placeholder="" />
            </label>
            <label>
              {" "}
              {t("password")}: <input type="password" name="password" />
            </label>
            <label>
              {" "}
              {t("username")}: <input type="text" name="username" />
            </label>
            <input type="submit" value={t("edit")} />
          </Stack>
        </div>
      </form>
    </Box>
  );
}

export default EditProfile;
