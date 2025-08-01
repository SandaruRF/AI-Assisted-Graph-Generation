import React from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Container,
  Grid,
  Paper,
} from "@mui/material";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [smsNotifications, setSmsNotifications] = React.useState(false);

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        {/* Theme */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h6">Appearance</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            }
            label="Dark Mode"
          />
        </Box>

        <Divider />

        {/* Notifications */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h6">Notifications</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
              />
            }
            label="Email Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={smsNotifications}
                onChange={() => setSmsNotifications(!smsNotifications)}
              />
            }
            label="SMS Notifications"
          />
        </Box>

        <Divider />

        {/* Account */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h6">Account</Typography>
          <Button variant="outlined" color="error" sx={{ mt: 1 }}>
            Deactivate Account
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
