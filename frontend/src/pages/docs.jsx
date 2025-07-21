import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

const docsSections = [
  {
    title: "Overview",
    content:
      "Our AI Assisted Graph Generator transforms your raw data into clean, interactive visuals quickly and easily. Whether you're working with SQL databases or CSV files, just upload your data and generate insightful graphs with minimal effort.",
  },
  {
    title: "Getting Started",
    content:
      "1. Create your free account.\n2. Connect your preferred database (MySQL, PostgreSQL, SQLite, and more).\n3. Upload your dataset or connect live.\n4. Use the AI chat assistant to generate graphs by describing your needs in natural language.\n5. Customize and download your visuals.",
  },
  {
    title: "Supported Data Sources",
    content:
      "We support a wide range of data sources including:\n- MySQL\n- PostgreSQL\n- MariaDB\n- SQL Server\n- Oracle\n- You can connect securely using your database credentials or upload static files like CSV and Excel.",
  },
  {
    title: "Features",
    content:
      "- AI-powered natural language graph generation\n- Multi-database compatibility\n- Real-time data visualization updates\n- Export visuals in PNG, SVG, PDF formats\n- Secure data handling with bank-grade encryption",
  },
  {
    title: "FAQ",
    content:
      "Q: Do I need design skills?\nA: No, our AI assistant handles styling and layout.\n\nQ: Can I edit the generated graphs?\nA: Yes, you can customize labels, colors, and chart types.\n\nQ: Is my data safe?\nA: Absolutely, all data is encrypted and access-controlled.",
  },
];

const DocumentationPage = () => {
  return (
    <Box sx={{ backgroundColor: "#F8F9FD", minHeight: "100vh" }}>
      <NavigationBar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 4,
              textAlign: "center",
              background: "linear-gradient(90deg, #045D9F, #00B4DB)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Documentation
          </Typography>

          {docsSections.map(({ title, content }, index) => (
            <Box
              key={index}
              sx={{
                mb: 6,
                p: 4,
                backgroundColor: "#EAF2F8",
                borderRadius: 3,
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 6,
                  backgroundColor: "#D0E4FB",
                },
              }}
              component={motion.div}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "#045D9F",
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-line", color: "#191970", lineHeight: 1.7 }}
              >
                {content}
              </Typography>
            </Box>
          ))}
        </motion.div>
      </Container>
      <Footer />
    </Box>
  );
};

export default DocumentationPage;
