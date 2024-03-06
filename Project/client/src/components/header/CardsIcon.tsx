import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import { Link } from "react-router-dom";

function CardsIcon() {
  return (
    <Link to="/cards" style={{ color: "inherit", marginRight: "10px" }}>
      <AutoAwesomeMotionIcon color="inherit" />
    </Link>
  );
}

export default CardsIcon;
