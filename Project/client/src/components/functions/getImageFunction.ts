interface IgetImageRes {
  success: boolean;
  imageUrl: string;
}

const getImage = async (imageID: string): Promise<string | undefined> => {
  try {
    if (imageID === undefined) {
      console.log(imageID);
      return "";
    }
    const res = await fetch(`http://localhost:3001/user/image/${imageID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const resJson: IgetImageRes = await res.json();
    console.log(resJson);
    if (resJson.success === false) {
      console.log("Failed to get image");
      return "";
    } else {
      return resJson.imageUrl;
    }
  } catch (error) {
    console.log(error);
  }
};

export default getImage;
