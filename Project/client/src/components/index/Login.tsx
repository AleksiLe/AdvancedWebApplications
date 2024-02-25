import { Box, Stack } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function Login() {
  interface Idata {
    success: boolean;
    message: String | null;
    error: String | null;
    token: String | null;
  }

  useEffect(() => {
    const token: String = localStorage.getItem("token") as string;
    if (token) {
      fetch("http://localhost:3001/user/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res: Response) => res.json())
        .then((res) => {
          if (res.success) {
            window.location.href = "/";
          }
        });
    }
  }, []);

  const sendForm = (email: String, password: String) => {
    fetch("http://localhost:3001/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res: Response) => res.json())
      .then((data: Idata) => {
        console.log(data);
        if (data.success) {
          localStorage.setItem("token", data.token as string);
          window.location.href = "/cards";
        } else if (!data.success) {
          if (data.message === "Login failed") {
            alert(t("login failed"));
          }
        } else {
          alert(data.error);
        }
      });
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
          };
          const email = target.email.value;
          const password = target.password.value;
          sendForm(email, password);
        }}
      >
        <div>
          <Stack spacing={2}>
            <h2>{t("login")}</h2>
            <label>
              {" "}
              {t("email")}: <input type="email" name="email" />
            </label>
            <label>
              {" "}
              {t("password")}: <input type="password" name="password" />
            </label>
            <input type="submit" value={t("login")} />
          </Stack>
        </div>
      </form>
    </Box>
  );
}

export default Login;
