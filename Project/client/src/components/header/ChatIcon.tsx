import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import { Link } from "react-router-dom";

function ChatIcon() {
  return (
    <Link to="/chat" style={{ color: "inherit", marginRight: "10px" }}>
      <ChatBubbleRoundedIcon color="inherit" />
    </Link>
  );
}

export default ChatIcon;
