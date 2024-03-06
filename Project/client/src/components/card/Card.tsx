import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import "./Card.css";
import { useTranslation } from "react-i18next";
interface IUserCard {
  _id: string;
  username: string;
  profilePictureID: string;
  profilePictureURL: string;
}

interface IgetImageRes {
  success: boolean;
  imageUrl: string;
}

function Card() {
  const { t } = useTranslation();
  let mounted = false;
  const [users, setUsers] = useState<IUserCard[]>([]);

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

  const getUserMatches = () => {
    fetch("http://localhost:3001/user/potentialMatches", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res: Response) => res.json())
      .then((data: any) => setUsersMatches(data.matches))
      .catch((err: Error) => console.log(err));
  };

  const setUsersMatches = async (data: any) => {
    //ImageId to url
    console.log("data", data);
    for (let i = 0; i < data.length; i++) {
      data[i].profilePictureURL = await getImage(data[i].profilePictureID);
    }
    console.log("data", data);
    setUsers(data);
    console.log("users", users);
  };
  useEffect(() => {
    if (mounted === false) {
      getUserMatches();
      mounted = true;
    }
  }, []);

  const onSwipe = (direction: string, userId: string) => {
    console.log("You swiped: " + direction);
    const liked: Boolean = direction === "right" ? true : false;
    afterSwipe(userId, liked);
  };

  const afterSwipe = (userId: string, liked: Boolean) => {
    fetch("http://localhost:3001/user/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        liked: liked,
        userId: userId,
      }),
    })
      .then((res: Response) => res.json())
      .then((data: any) => {
        console.log(data);
      })
      .catch((err: Error) => console.log(err));
  };

  const onCardLeftScreen = (myIdentifier: string) => {
    console.log(myIdentifier + " left the screen");
  };
  return (
    <div className="cardContainer">
      <TinderCard
        className="swipe"
        key="LastCard"
        preventSwipe={["up", "down", "left", "right"]}
      >
        <div className="card">
          <h1>{t("no more new users")}</h1>
        </div>
      </TinderCard>
      {users.map((user) => (
        <TinderCard
          className="swipe"
          key={user._id}
          onSwipe={(direction) => onSwipe(direction, user._id)}
          onCardLeftScreen={() => onCardLeftScreen("foo")}
          preventSwipe={["up", "down"]}
        >
          <div
            style={{
              backgroundImage: `url(${user.profilePictureURL})`,
            }}
            className="card"
          >
            <h1>{user.username}</h1>
          </div>
        </TinderCard>
      ))}
    </div>
  );
}

export default Card;
