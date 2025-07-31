# VizGen – AI-Assisted Graph Generator

> 🌐 Natural Language to Visualization Platform powered by Multi-Agent AI.

VizGen is a cutting-edge AI-powered web application that allows users to generate intelligent, real-time graphs from natural language prompts. Designed for both technical and non-technical users, it supports seamless SQL database connections, automated chart recommendations, and deep data insight generation.

---

## ✨ Key Features

- 🧠 **Text-to-Graph**: Convert natural language queries into visual charts using advanced LLMs (Claude 3.7 Sonnet & Gemini 2.0 Flash).
- 🤖 **Multi-Agent Architecture**: Specialized agents handle query generation, graph recommendation, insights, and explanation.
- 📊 **AI-Driven Graph Recommendations**: Suggests the best graph types based on data patterns and user intent.
- ⚡ **Real-Time Interaction**: Connect live databases, auto-refresh graphs, and interact dynamically.
- 🧩 **Schema-Free Operation**: Works with any SQL database without prior schema knowledge.
- 🗃️ **User Preferences & History**: Stores connection settings and user feedback for personalized experiences.
- 🔐 **JWT-Based Authentication**: Supports login, signup, and secure OAuth integration.
- 🎨 **Interactive UI**: Built with React, Material UI, and framer-motion for a smooth experience.

---

## 🧰 Tech Stack

### 🔷 Frontend

- React.js + Material UI
- framer-motion for animations
- Plotly.js for graph rendering

### 🔶 Backend

- FastAPI (Python) with async support
- LangChain, LangGraph, LangSmith
- Claude 3.7 Sonnet, Gemini 2.0 Flash for LLM processing
- MongoDB for dynamic data storage
- SQLAlchemy, JWT, and OAuth2 for auth

---

## 🏗️ Multi-Agent System Architecture

VizGen’s intelligent graph generation is powered by a **modular multi-agent system**:

- 🧮 **SQL Agent** – Converts NL to SQL, manages query generation, dialect handling
- 📈 **Visualization Agent** – Classifies columns, calculates cardinality, maps chart types
- 📊 **Analysis Agent** – Detects patterns, performs forecasting and statistical insight generation
- 💬 **Explanation Agent** – Uses external search (Tavily API) and LLMs to explain insights
- 🧠 **Orchestrator** – Coordinates all agents to process user queries and return optimal visualizations

Agents are designed using LangGraph workflows, allowing dynamic execution and adaptive reasoning.

---

## 🧪 Screenshots

| Interface                            | Description                                        |
| ------------------------------------ | -------------------------------------------------- |
| ![Landing](assets/landing.png)       | Simple login/signup with email or Google/GitHub    |
| ![Prompt](assets/prompt_query.png)   | Enter natural language query to generate graph     |
| ![Graph](assets/generated_graph.png) | Real-time Plotly.js graph with customization tools |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/VizGen.git
cd VizGen
```
