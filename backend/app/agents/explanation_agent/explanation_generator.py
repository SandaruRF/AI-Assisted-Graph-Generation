from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from typing import List, Dict, Any

async def generate_insight_explanation(
    user_query: str,
    data: List[Dict[str, Any]],
    insights: List[str],
    search_results: Dict[str, Any],
    metadata: Dict[str, Any],
    tool_results: Dict[str, Any]
) -> str:
    """Generate comprehensive explanation combining insights with external context."""
    
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.1)
    
    prompt = ChatPromptTemplate.from_template("""
    You are an expert data analyst providing explanations for discovered insights. Create a comprehensive explanation that connects data findings with external context.

    Original Query: {user_query}

    Database Context: {database_context}
                                              
    Retrieved Data: {data}

    Discovered Insights:
    {insights}

    Analysis Results:
    {analysis_results}

    External Context from Search:
    {search_context}

    Your task:
    1. Explain each insight in simple, business-friendly terms
    2. Connect insights to external factors, trends, or industry context
    3. Provide possible explanations for WHY these patterns exist
    4. Suggest actionable next steps based on the findings
    5. Highlight any limitations or considerations

    Structure your response with clear headings and maintain proper citations for external sources.
    """)
    
    # Format all the context
    database_context = f"Database: {metadata.get('database_name', 'Unknown')}"
    insights_text = "\n".join([f"• {insight}" for insight in insights])
    analysis_results = "\n".join([f"**{tool}:** {result}" for tool, result in tool_results.items()])
    
    # Format search results
    search_context = ""
    for result in search_results.get("search_results", []):
        search_context += f"**{result['tool']}** - {result['reasoning']}\n"
        if "result" in result:
            search_context += f"{result['result'][:800]}...\n\n"
    
    response = await llm.ainvoke(
        prompt.format(
            user_query=user_query,
            database_context=database_context,
            data=data,
            insights=insights_text,
            analysis_results=analysis_results,
            search_context=search_context
        )
    )
    
    return response.content
