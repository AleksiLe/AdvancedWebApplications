function sendMessage(message: string, userID: string) {
  try {
    fetch("http://localhost:3001/chat/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") as string}`,
      },
      body: JSON.stringify({ message, userID }),
    })
      .then((res: Response) => res.json())
      .then((data) => console.log(data));
  } catch (error) {
    console.log(error);
  }
}

export { sendMessage };
