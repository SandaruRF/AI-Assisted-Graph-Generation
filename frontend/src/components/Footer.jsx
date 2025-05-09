import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Button,
  Container,
  Grid
} from "@mui/material";

const Footer = () => {
  // Function to handle scroll to top
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Optional smooth scroll
    });
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 6,
        bgcolor: "#002244",
        color: "#DDE6ED",
        borderTopLeftRadius: "30px",
        borderTopRightRadius: "30px",
        boxShadow: "inset 0 1px 10px rgba(255,255,255,0.05)",
      }}
    >
      <Container>
        <Grid container spacing={4}>
          {/* Logo Section */}
          <Grid item xs={12} md={3}>
            <Box
              component="img"
              src="/images/logo.png"
              alt="Logo"
              sx={{ height: 50, mb: 2 }}
            />
            <Typography variant="body2" sx={{ color: "#ccc", mt: 1 }}>
              Empowering your data with AI-driven insights.
            </Typography>
          </Grid>

          {/* Footer Links */}
          {[
            {
              title: "Features",
              items: ["Connect DB", "Chat"],
            },
            {
              title: "Guides",
              items: ["Docs", "FAQs", "Start Guides"],
            },
            {
              title: "Company",
              items: [
                { name: "About Us", path: "/about" },
                { name: "Contact Us", path: "/contact" },
                { name: "Privacy Policy", path: "/privacy" }
              ],
            },
          ].map((section, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 700, color: "#ffffff" }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {section.items.map((item, itemIndex) => (
                  <motion.div key={itemIndex} whileHover={{ x: 6 }}>
                    <Button
                      component={Link}
                      to={item.path || "/"}
                      onClick={handleScrollToTop} 
                      sx={{
                        justifyContent: "flex-start",
                        color: "#b0c4de",
                        textTransform: "none",
                        px: 0,
                        "&:hover": {
                          backgroundColor: "transparent",
                          color: "#00BFFF",
                        },
                      }}
                    >
                      {item.name || item}
                    </Button>
                  </motion.div>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Copyright */}
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 4, color: "#A9A9A9", fontSize: "0.875rem" }}
        >
          © 2025 VizeGen. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;