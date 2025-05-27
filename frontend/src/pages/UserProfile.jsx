import { Box } from "@mui/material";
import NavigationBar from "../components/NavigationBar";


const UserProfile = () => {
    return (
        <Box sx={{
            backgroundColor: "#F8F9FD",
            minHeight: "100vh",
            overflow: "hidden"
        }}>
            <NavigationBar />

        
        </Box>
    );
}

export default UserProfile;