from langchain_core.messages import HumanMessage
from typing import Dict, List, Any, Optional, Tuple

class AdvancedQueryGenerator:
    """Generates optimized search queries for different tools and contexts."""
    
    def __init__(self, llm):
        self.llm = llm
        self.query_templates = {
            "explanation": [
                "why {topic} {context}",
                "reasons for {topic} {context}",
                "factors causing {topic} {context}"
            ],
            "trend_analysis": [
                "{topic} trends {timeframe}",
                "{topic} market analysis {timeframe}",
                "{topic} industry outlook {timeframe}"
            ],
            "background": [
                "{topic} background information",
                "{topic} overview summary",
                "{topic} definition explanation"
            ],
            "recent_events": [
                "{topic} latest news {timeframe}",
                "{topic} recent developments {timeframe}",
                "{topic} current events {timeframe}"
            ]
        }
    
    async def generate_optimized_queries(self, 
                                       insight: str, 
                                       tool_name: str,
                                       user_context: str,
                                       num_queries: int = 3) -> List[str]:
        """Generate optimized queries for specific insight and tool."""
        
        query_prompt = f"""
        Generate {num_queries} optimized search queries for the following:
        
        INSIGHT TO EXPLAIN: "{insight}"
        SEARCH TOOL: {tool_name}
        USER CONTEXT: {user_context}
        
        Requirements:
        1. Queries should be concise (under 400 characters each)
        2. Focus on finding explanatory context for the insight
        3. Optimize for the specific search tool capabilities
        4. Ensure queries are complementary, not redundant
        5. Use keywords likely to return relevant results
        
        Tool-specific optimizations:
        - News tools: Include temporal keywords, current events
        - Academic tools: Include research terminology, formal language
        - Financial tools: Include market terms, financial metrics
        - Industry tools: Include business terminology, sector keywords
        
        Return only the queries, one per line, without numbering or bullets.
        """
        
        try:
            response = await self.llm.ainvoke([HumanMessage(content=query_prompt)])
            queries = [q.strip() for q in response.content.strip().split('\n') if q.strip()]
            return queries[:num_queries]
            
        except Exception as e:
            return self._fallback_queries(insight, tool_name, num_queries)
    
    def _fallback_queries(self, insight: str, tool_name: str, num_queries: int) -> List[str]:
        """Generate fallback queries when LLM fails."""
        base_query = f"explain {insight}"
        return [
            base_query,
            f"reasons for {insight}",
            f"context about {insight}"
        ][:num_queries]
