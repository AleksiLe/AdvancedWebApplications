import { Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
function Register() {
  interface Idata {
    success: boolean;
    message: String | null;
    error: String | null;
  }
  const sendForm = (
    email: String,
    password: String,
    username: String,
    image: File[]
  ) => {
    let formData: FormData = new FormData();
    formData.append("email", email as string);
    formData.append("password", password as string);
    formData.append("username", username as string);
    formData.append("image", image[0]);
    fetch("http://localhost:3001/user/register", {
      method: "POST",
      body: formData,
    })
      .then((res: Response) => res.json())
      .then((data: Idata) => {
        console.log(data);
        if (data.success) {
          alert(data.success);
        } else if (data.message) {
          if (data.message === "Email already in use.") {
            alert(t("email already in use"));
          } else {
            alert(data.message);
          }
        } else {
          alert(data.error);
        }
      })
      .catch((err: Error) => console.log(err));
  };
  const { t } = useTranslation();
  return (
    <Box sx={{ boxShadow: 5, borderRadius: 3, padding: 3 }}>
      <form
        onSubmit={(e: React.SyntheticEvent) => {
          e.preventDefault();
          const target = e.target as typeof e.target & {
            email: { value: string };
            password: { value: string };
            username: { value: string };
            image: { files: File[] };
          };
          const email = target.email.value;
          const password = target.password.value;
          const username = target.username.value;
          const image = target.image.files;
          sendForm(email, password, username, image);
        }}
      >
        <div>
          <Stack spacing={2}>
            <h2>{t("register")}</h2>
            <label>
              {" "}
              {t("email")}: <input type="email" name="email" />
            </label>
            <label>
              {" "}
              {t("password")}: <input type="password" name="password" />
            </label>
            <label>
              {" "}
              {t("username")}: <input type="text" name="username" />
            </label>
            <label>
              {" "}
              {t("profile picture")}:{" "}
              <input type="file" accept="image/*" name="image" />
            </label>
            <input type="submit" value={t("register")} />
          </Stack>
        </div>
      </form>
    </Box>
  );
}

export default Register;
