from typing import List, Dict, Any, Optional
import json
from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic

class InsightExplanationQueryGenerator:
    def __init__(self, model="claude-3-5-sonnet-20241022"):
        self.llm = ChatAnthropic(model=model, temperature=0.1)
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

        SYSTEM PARAMETER CONSTRAINTS (EXACT VALUES ONLY):
        
        tavily_industry_search:
        - industry_sector: "technology" | "healthcare" | "finance" | "energy" | "retail" | "manufacturing"
        - analysis_type: "trends" | "competitive" | "market_size" | "innovation"
        - max_results: 1-10 | include_consulting: true/false
        
        tavily_contextual_search:
        - context_type: "background" | "recent_events" | "expert_opinion" | "data_statistics" | "related_topics"
        - depth: "basic" | "advanced"
        - primary_query: string
        
        tavily_news_search:
        - time_period: "day" | "week" | "month"
        - max_results: 1-15 | include_breaking: true/false | region: string
        
        tavily_academic_search:
        - field: "general" | "computer_science" | "medicine" | "business" | "engineering"
        - publication_period: "year" | "month" | null
        - max_results: 1-10 | include_preprints: true/false
        
        tavily_financial_search:
        - data_type: "market_data" | "company_info" | "economic_indicators" | "analysis"
        - time_horizon: "day" | "week" | "month" | "year" | null
        - max_results: 1-12 | include_regulatory: true/false
        
        tavily_universal_search:
        - search_type: "general" | "news" | "academic"
        - depth: "basic" | "advanced"
        - max_results: 1-10 | time_filter: "day" | "week" | "month" | "year"

        INTELLIGENT DOMAIN MAPPING RULES:

        For industry_sector parameter, map ANY domain to these 6 categories:
        - Arts, Entertainment, Music, Media, Publishing, Gaming → "retail"
        - Software, AI, Computing, Electronics, Telecommunications → "technology"  
        - Pharmaceuticals, Biotechnology, Medical Devices, Life Sciences → "healthcare"
        - Banking, Insurance, Investment, Cryptocurrency, Fintech → "finance"
        - Oil, Gas, Solar, Wind, Nuclear, Utilities, Mining → "energy"
        - Automotive, Aerospace, Construction, Chemicals, Food Production → "manufacturing"

        For academic field parameter, map ANY domain to these 5 categories:
        - Programming, AI, Data Science, Cybersecurity, Electronics → "computer_science"
        - Biology, Chemistry, Physics, Environmental Science, Psychology → "medicine"
        - Marketing, Management, Economics, Finance, Strategy → "business"
        - Civil, Mechanical, Electrical, Chemical, Aerospace → "engineering"
        - ALL OTHER DOMAINS → "general"

        For analysis_type parameter, map ANY request to these 4 types:
        - Market trends, seasonal patterns, growth patterns → "trends"
        - Competitor analysis, market share, benchmarking → "competitive"
        - Market size, revenue, industry value → "market_size"
        - New technologies, disruption, R&D → "innovation"

        For context_type parameter, map ANY request to these 5 types:
        - Historical context, industry overview, fundamentals → "background"
        - Current events, breaking news, recent developments → "recent_events"
        - Analyst opinions, expert commentary, predictions → "expert_opinion"
        - Statistics, data, metrics, research findings → "data_statistics"
        - Adjacent topics, related industries, broader context → "related_topics"

        UNIVERSAL QUERY CONSTRUCTION STRATEGY:

        1. ALWAYS put specific domain terms in the query text, NEVER in parameters
        2. For ANY domain not explicitly listed, find the closest category match
        3. Use multiple search tools with different parameter combinations
        4. Include domain-specific keywords in queries for better results
        5. Default to "general" or "basic" values when uncertain

        EXAMPLE MAPPINGS FOR COMMON DOMAINS:

        Music Industry:
        - industry_sector: "retail" (entertainment is retail)
        - field: "business" (music business research)
        - query: "music industry trends streaming revenue"

        Biotechnology:
        - industry_sector: "healthcare" (biotech is healthcare)
        - field: "medicine" (biotech research)
        - query: "biotechnology market trends drug development"

        Nuclear Energy:
        - industry_sector: "energy" (nuclear is energy)
        - field: "engineering" (nuclear engineering)
        - query: "nuclear energy industry trends reactor technology"

        Artificial Intelligence:
        - industry_sector: "technology" (AI is technology)
        - field: "computer_science" (AI research)
        - query: "artificial intelligence market trends machine learning"

        Space Technology:
        - industry_sector: "manufacturing" (aerospace manufacturing)
        - field: "engineering" (aerospace engineering)
        - query: "space technology industry trends satellite launch"

        PARAMETER SELECTION ALGORITHM:

        1. Identify the main domain from user query/insights
        2. Map domain to closest available parameter using rules above
        3. Select appropriate analysis focus based on insight type
        4. Choose context type based on what explanation is needed
        5. Construct query with domain-specific terms + analysis focus
        6. Use fallback values: "retail"/"general"/"trends"/"background"/"basic"

        Original User Query: {user_query}
        Database Context: {database_context}
        Discovered Insights: {insights_summary}
        Analysis Results: {analysis_results}

        IMPORTANT: Return ONLY the JSON object. No markdown, no explanations.

        {{
            "analysis": "Brief analysis of what external context is needed",
            "search_calls": [
                {{
                    "tool": "tool_name",
                    "query": "domain-specific search query with exact terms",
                    "parameters": {{
                        "param1": "mapped_value_from_constraints",
                        "param2": "mapped_value_from_constraints"
                    }},
                    "reasoning": "Why this search helps explain the insight",
                    "insight_connection": "Which insight this addresses"
                }}
            ],
            "execution_strategy": "parallel",
            "expected_coverage": "What explanatory context will be provided"
        }}

        Guidelines:
        - Map ANY domain to available parameter values using rules above
        - Put domain-specific terms in query text, not parameters
        - Use multiple tools with different parameter combinations
        - Default to safe fallback values when uncertain
        - Limit to 3 search calls maximum
        - Focus on explaining WHY patterns exist
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
        
        response = response.content.strip()
        response = response.replace("```json", "").replace("```", "").strip()
        try:
            print("Generated search plan:", response)
            search_plan = json.loads(response)
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
