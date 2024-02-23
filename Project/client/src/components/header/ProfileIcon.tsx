import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { Link } from "react-router-dom";

function ChatIcon() {
  return (
    <Link to="/edit" style={{ color: "inherit", marginRight: "10px" }}>
      <AccountBoxIcon color="inherit" />
    </Link>
  );
}

export default ChatIcon;
