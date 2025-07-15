import asyncio
from typing import Dict, List, Any, Optional, Tuple
from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from .search_tools import search_tools_by_name
import json

class IntelligentQueryGenerator:
    """LLM-powered query and parameter generator for search tools."""
    
    def __init__(self, llm_model: str = "gemini-2.0-flash"):
        self.llm = ChatGoogleGenerativeAI(
            model=llm_model, 
            max_tokens=1500, 
            temperature=0.2
        )
        self.search_tools = search_tools_by_name
        
    async def generate_search_strategy(self, 
                                     insights: List[str], 
                                     user_prompt: str,
                                     domain_context: str = None) -> Dict[str, Any]:
        """Generate comprehensive search strategy with tools, queries, and parameters."""
        
        strategy_prompt = f"""
        You are an expert search strategist. Analyze the following insights and generate an optimal search strategy.
        
        USER QUERY: "{user_prompt}"
        DOMAIN CONTEXT: {domain_context or "General analysis"}
        
        INSIGHTS TO EXPLAIN:
        {chr(10).join([f"• {insight}" for insight in insights])}
        
        AVAILABLE SEARCH TOOLS:
        1. tavily_universal_search - General purpose, all search types
        2. tavily_multi_query_search - Multiple parallel queries
        3. tavily_contextual_search - Context-specific searches
        4. tavily_news_search - Current events and breaking news
        5. tavily_academic_search - Scholarly articles and research
        6. tavily_financial_search - Financial data and market info
        7. tavily_industry_search - Business and industry insights
        
        For each insight that needs explanation, provide:
        1. TOOL_SELECTION: Which tool is most appropriate and why
        2. SEARCH_QUERIES: 1-3 optimized search queries
        3. PARAMETERS: Optimal parameters for the selected tool
        4. REASONING: Why this approach will provide the best context
        
        Respond in JSON format:
        {{
            "search_strategy": [
                {{
                    "insight": "insight text",
                    "tool_name": "selected_tool_name",
                    "reasoning": "why this tool is best",
                    "queries": ["query1", "query2"],
                    "parameters": {{
                        "parameter1": "value1",
                        "parameter2": "value2"
                    }},
                    "expected_context": "what context this will provide"
                }}
            ],
            "overall_strategy": "explanation of the overall approach"
        }}
        """
        
        try:
            response = await self.llm.ainvoke([
                SystemMessage(content="You are an expert search strategist. Always respond with valid JSON."),
                HumanMessage(content=strategy_prompt)
            ])
            
            # Parse JSON response
            strategy = json.loads(response.content)
            return strategy
            
        except Exception as e:
            return self._fallback_strategy(insights, user_prompt)
    
    def _fallback_strategy(self, insights: List[str], user_prompt: str) -> Dict[str, Any]:
        """Fallback strategy when LLM fails to generate strategy."""
        return {
            "search_strategy": [
                {
                    "insight": insight,
                    "tool_name": "tavily_universal_search",
                    "reasoning": "fallback to universal search",
                    "queries": [f"explain {insight}"],
                    "parameters": {
                        "search_type": "general",
                        "depth": "advanced",
                        "max_results": 10
                    },
                    "expected_context": "general context"
                }
                for insight in insights
            ],
            "overall_strategy": "fallback strategy due to generation error"
        }
