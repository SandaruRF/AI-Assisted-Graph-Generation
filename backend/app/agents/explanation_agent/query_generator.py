from typing import List, Dict, Any, Optional
import json
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

class InsightExplanationQueryGenerator:
    def __init__(self, model="gemini-2.0-flash"):
        self.llm = ChatGoogleGenerativeAI(model=model, temperature=0.1)
        self.search_tools = {
            "tavily_contextual_search": {
                "description": "Search for background, recent events, expert opinions, data/statistics, or related topics",
                "parameters": ["primary_query", "context_type", "depth"]
            },
            "tavily_multi_query_search": {
                "description": "Execute multiple related queries simultaneously",
                "parameters": ["queries", "search_type", "max_results_per_query", "combine_results"]
            },
            "tavily_news_search": {
                "description": "Search current events and breaking news",
                "parameters": ["query", "time_period", "max_results", "include_breaking", "region"]
            },
            "tavily_academic_search": {
                "description": "Search scholarly articles and research papers",
                "parameters": ["query", "field", "publication_period", "max_results", "include_preprints"]
            },
            "tavily_financial_search": {
                "description": "Search financial data and market information",
                "parameters": ["query", "data_type", "time_horizon", "max_results", "include_regulatory"]
            },
            "tavily_industry_search": {
                "description": "Search business and industry insights",
                "parameters": ["query", "industry_sector", "analysis_type", "max_results", "include_consulting"]
            },
            "tavily_universal_search": {
                "description": "General purpose search tool",
                "parameters": ["query", "search_type", "depth", "max_results", "time_filter"]
            }
        }
    
    async def generate_explanation_search_plan(
        self, 
        user_query: str,
        insights: List[str],
        metadata: Dict[str, Any],
        tool_results: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate search plan focused on explaining discovered insights."""
        
        prompt = ChatPromptTemplate.from_template("""
        You are an expert search strategist for data insight explanations. Your task is to generate search queries that will help explain discovered data insights with external context.

        Available Search Tools:
        {tools_info}

        Original User Query: {user_query}

        Database Context:
        {database_context}

        Discovered Insights:
        {insights_summary}

        Analysis Results:
        {analysis_results}

        Your task:
        1. Analyze the insights to identify what external context would help explain them
        2. Consider the database domain to select appropriate search tools
        3. Generate search queries that provide explanations for the discovered patterns/trends/anomalies
        4. Focus on "why" these insights might be occurring and what they mean
        5. Plan searches that complement the data findings with external knowledge

        Output your response as a JSON object with this structure:
        {{
            "analysis": "Brief analysis of what external context is needed to explain these insights",
            "search_calls": [
                {{
                    "tool": "tool_name",
                    "query": "search query focused on explaining the insight",
                    "parameters": {{
                        "param1": "value1",
                        "param2": "value2"
                    }},
                    "reasoning": "Why this search will help explain the insight",
                    "insight_connection": "Which specific insight this search addresses"
                }}
            ],
            "execution_strategy": "parallel" or "sequential",
            "expected_coverage": "What explanatory context will be provided"
        }}

        Guidelines for insight explanations:
        - Focus searches on explaining WHY patterns exist, not just describing them
        - Consider industry trends, market conditions, or domain-specific factors
        - Look for external validation of discovered patterns
        - Search for expert opinions on similar findings
        - Include recent developments that might explain temporal patterns
        - Use domain-appropriate search tools (financial for finance data, academic for research, etc.)
        - Limit to 3 search calls maximum for efficiency
        """)
        
        tools_info = self._format_tools_info()
        database_context = self._format_database_context(metadata)
        insights_summary = self._format_insights(insights)
        analysis_results = self._format_analysis_results(tool_results)
        
        response = await self.llm.ainvoke(
            prompt.format(
                tools_info=tools_info,
                user_query=user_query,
                database_context=database_context,
                insights_summary=insights_summary,
                analysis_results=analysis_results
            )
        )
        
        try:
            search_plan = json.loads(response.content)
            return search_plan
        except json.JSONDecodeError:
            # Fallback to contextual search for insights
            return self._create_insight_fallback_plan(insights, metadata)
    
    def _format_database_context(self, metadata: Dict[str, Any]) -> str:
        """Format database metadata for context."""
        if not metadata:
            return "No database context available"
        
        context_parts = []
        
        # Database name and type
        db_name = metadata.get("database_name", "Unknown")
        db_type = metadata.get("connection_info", {}).get("database_type", "Unknown")
        context_parts.append(f"Database: {db_name} ({db_type})")
        
        # Tables and their purposes
        tables = metadata.get("tables", {})
        if tables:
            context_parts.append(f"Tables: {len(tables)} total")
            for table_name, table_info in list(tables.items())[:5]:  # Show first 5 tables
                columns = table_info.get("columns", [])
                context_parts.append(f"  - {table_name}: {len(columns)} columns")
                
                # Show key column types to hint at domain
                numeric_cols = table_info.get("numeric_columns", [])
                temporal_cols = table_info.get("temporal_columns", [])
                
                if numeric_cols:
                    context_parts.append(f"    Numeric: {', '.join(numeric_cols[:3])}")
                if temporal_cols:
                    context_parts.append(f"    Temporal: {', '.join(temporal_cols[:3])}")
        
        return "\n".join(context_parts)
    
    def _format_insights(self, insights: List[str]) -> str:
        """Format insights for the prompt."""
        if not insights:
            return "No insights discovered"
        
        formatted_insights = []
        for i, insight in enumerate(insights, 1):
            formatted_insights.append(f"{i}. {insight}")
        
        return "\n".join(formatted_insights)
    
    def _format_analysis_results(self, tool_results: Dict[str, Any]) -> str:
        """Format tool results for context."""
        if not tool_results:
            return "No analysis results available"
        
        result_summary = []
        for tool_name, result in tool_results.items():
            result_summary.append(f"**{tool_name}:**")
            # Truncate long results
            result_str = str(result)
            if len(result_str) > 200:
                result_str = result_str[:200] + "..."
            result_summary.append(f"  {result_str}")
        
        return "\n".join(result_summary)
    
    def _format_tools_info(self) -> str:
        """Format tools information for the prompt."""
        tools_text = []
        for tool_name, tool_info in self.search_tools.items():
            tools_text.append(f"- {tool_name}: {tool_info['description']}")
            tools_text.append(f"  Parameters: {', '.join(tool_info['parameters'])}")
        return "\n".join(tools_text)
    
    def _create_insight_fallback_plan(self, insights: List[str], metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Create fallback search plan focused on insights."""
        # Try to determine database domain for search context
        db_name = metadata.get("database_name", "").lower()
        search_context = "general"
        
        # Simple domain detection
        if any(term in db_name for term in ["sales", "revenue", "customer", "order"]):
            search_context = "business"
        elif any(term in db_name for term in ["financial", "finance", "stock", "market"]):
            search_context = "financial"
        elif any(term in db_name for term in ["health", "medical", "patient"]):
            search_context = "healthcare"
        
        # Create search query from insights
        insight_keywords = []
        for insight in insights:
            # Extract key terms from insights
            words = insight.split()
            insight_keywords.extend([word for word in words if len(word) > 4])
        
        search_query = f"{search_context} trends " + " ".join(insight_keywords[:5])
        
        return {
            "analysis": "Fallback search to provide context for discovered insights",
            "search_calls": [
                {
                    "tool": "tavily_contextual_search",
                    "query": search_query,
                    "parameters": {
                        "context_type": "background",
                        "depth": "advanced"
                    },
                    "reasoning": "Provide general context for discovered patterns",
                    "insight_connection": "General insight explanation"
                }
            ],
            "execution_strategy": "sequential",
            "expected_coverage": "General context for discovered insights"
        }
