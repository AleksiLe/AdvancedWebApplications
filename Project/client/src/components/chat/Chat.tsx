import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Conversation,
  Avatar,
  Sidebar,
  ConversationList,
  ConversationHeader,
} from "@chatscope/chat-ui-kit-react";
import { useState, useCallback, useEffect } from "react";
import { MessageDirection } from "@chatscope/chat-ui-kit-react/src/types/unions";
import { sendMessage } from "../functions/messageFunctions";
import getImage from "../functions/getImageFunction";
import { useTranslation } from "react-i18next";

interface IUser {
  username: string;
  profilePictureID: string;
  _id: string;
  profilePictureURL: string;
  messages: Message[];
}
interface Message {
  message: string;
  direction: MessageDirection;
  timeStamp?: Date;
}

interface IgetUserMessages {
  success: boolean;
  users: IUser[];
}

function Chat() {
  const { t } = useTranslation();
  //Backarrow and styling
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarStyle, setSidebarStyle] = useState({});
  const [chatContainerStyle, setChatContainerStyle] = useState({});
  const [conversationContentStyle, setConversationContentStyle] = useState({});
  const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});

  const handleBackClick = () => setSidebarVisible(!sidebarVisible);

  const handleConversationClick = useCallback(
    (userID: string) => {
      setActiveUser(users.find((user) => user._id === userID));
      if (sidebarVisible) {
        setSidebarVisible(false);
      }
    },
    [sidebarVisible, setSidebarVisible]
  );
  useEffect(() => {
    if (sidebarVisible) {
      setSidebarStyle({
        display: "flex",
        flexBasis: "auto",
        width: "100%",
        maxWidth: "100%",
      });
      setConversationContentStyle({
        display: "flex",
      });
      setConversationAvatarStyle({
        marginRight: "1em",
      });
      setChatContainerStyle({
        display: "none",
      });
    } else {
      setSidebarStyle({});
      setConversationContentStyle({});
      setConversationAvatarStyle({});
      setChatContainerStyle({});
    }
  }, [
    sidebarVisible,
    setSidebarVisible,
    setConversationContentStyle,
    setConversationAvatarStyle,
    setSidebarStyle,
    setChatContainerStyle,
  ]);

  //Chat logic and reft of functionality
  const [messageInputValue, setMessageInputValue] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);

  const [activeUser, setActiveUser] = useState<IUser>();

  const handleSend = () => {
    if (activeUser) {
      console.log("sending message");
      sendMessage(messageInputValue, activeUser._id);
      activeUser.messages.push({
        message: messageInputValue,
        direction: "outgoing",
      });
      setMessageInputValue("");
    }
  };

  let mounted = false;
  useEffect(() => {
    if (mounted == false) {
      mounted = true;
      fetch("http://localhost:3001/chat/getUserMessages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") as string}`,
        },
      })
        .then((res: Response) => res.json())
        .then(async (data: IgetUserMessages) => {
          console.log(data);
          for (let i = 0; i < data.users.length; i++) {
            data.users[i].profilePictureURL =
              (await getImage(data.users[i].profilePictureID)) || "";
          }
          setUsers(data.users);

          if (data.users[0]) {
            setActiveUser(data.users[0]);
          } //else no matches so no active user
        });
    }
  }, []);

  return (
    <div
      style={{
        height: "600px",
        position: "relative",
        minWidth: "400px",
        maxWidth: "800px",
      }}
    >
      <MainContainer responsive /* style={{ minWidth: 1200 }} */>
        <Sidebar position="left" scrollable={true} style={sidebarStyle}>
          <ConversationList>
            {users.map((user) => (
              <Conversation
                key={user._id}
                onClick={() => handleConversationClick(user._id)}
              >
                <Avatar
                  src={user.profilePictureURL}
                  style={conversationAvatarStyle}
                  name={user.username}
                />
                <Conversation.Content
                  name={user.username}
                  style={conversationContentStyle}
                  lastSenderName={
                    user.messages.length > 0 ?
                    user.messages[user.messages.length - 1].direction ===
                    "incoming"
                      ? user.username
                      : "me"
                    : null
                  }
                  info={user.messages.length > 0 ? user.messages[user.messages.length - 1].message : ""}
                />
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>
        <ChatContainer style={chatContainerStyle}>
          <ConversationHeader>
            <ConversationHeader.Back onClick={handleBackClick} />
            <ConversationHeader.Content
              userName={activeUser ? activeUser.username : t("no matches yet")}
              style={conversationContentStyle}
            />
            <Avatar src={activeUser ? activeUser.profilePictureURL : ""} />
          </ConversationHeader>
          <MessageList>
            {activeUser &&
              activeUser.messages.map((messages, index) => (
                <Message
                  key={index}
                  model={{
                    message: messages.message,
                    /* sender: "me", */
                    position: "single",
                    direction: messages.direction,
                  }}
                />
              ))}
          </MessageList>
          <MessageInput
            attachButton={false}
            value={messageInputValue}
            onChange={(val) => setMessageInputValue(val)}
            onSend={handleSend}
            placeholder={t("type message here")}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default Chat;
