from langchain.agents import create_openai_tools_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_tavily import TavilySearch
from langchain_google_genai import ChatGoogleGenerativeAI

# Updated LLM without deprecated parameter
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0
)

# Enhanced search tool configuration
tavily_search_tool = TavilySearch(
    max_results=15,
    search_depth="advanced",
    include_answer=True,
    include_raw_content=True
)

# Enhanced prompt for better research
prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a comprehensive research assistant. When users ask for information:
    - Conduct thorough searches using multiple queries if needed
    - Provide detailed, well-researched responses
    - Include specific examples, statistics, and recent developments
    - Aim for comprehensive coverage of the topic"""),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

# Create agent
agent = create_openai_tools_agent(
    llm=llm,
    tools=[tavily_search_tool],
    prompt=prompt
)

# Create agent executor
agent_executor = AgentExecutor(
    agent=agent, 
    tools=[tavily_search_tool],
    verbose=True  # Enable to see search queries being made
)

# This will now work without the KeyError
response = agent_executor.invoke({"input": "What's the latest news about AI?"})
print(response["output"])
