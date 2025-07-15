from typing import Dict, List, Any, Optional, Tuple

class ParameterOptimizer:
    """Optimizes search parameters based on context and tool selection."""
    
    def __init__(self):
        self.parameter_templates = {
            "tavily_universal_search": {
                "defaults": {
                    "search_type": "general",
                    "depth": "basic",
                    "max_results": 10,
                    "include_content": True,
                    "include_answer": True
                },
                "optimizations": {
                    "recent_events": {"search_type": "news", "time_filter": "week"},
                    "academic_research": {"search_type": "academic", "depth": "advanced"},
                    "financial_data": {"search_type": "financial", "depth": "advanced"},
                    "industry_trends": {"search_type": "industry", "depth": "advanced"}
                }
            },
            "tavily_news_search": {
                "defaults": {
                    "time_period": "week",
                    "max_results": 15,
                    "include_breaking": True
                },
                "optimizations": {
                    "breaking_news": {"time_period": "day", "include_breaking": True},
                    "trend_analysis": {"time_period": "month", "max_results": 20}
                }
            },
            "tavily_academic_search": {
                "defaults": {
                    "field": "general",
                    "max_results": 10,
                    "include_preprints": True
                },
                "optimizations": {
                    "recent_research": {"publication_period": "year"},
                    "comprehensive_study": {"max_results": 15, "include_preprints": True}
                }
            },
            "tavily_financial_search": {
                "defaults": {
                    "data_type": "market_data",
                    "max_results": 12,
                    "include_regulatory": True
                },
                "optimizations": {
                    "market_analysis": {"data_type": "analysis", "time_horizon": "month"},
                    "company_research": {"data_type": "company_info", "include_regulatory": True}
                }
            },
            "tavily_industry_search": {
                "defaults": {
                    "industry_sector": "technology",
                    "analysis_type": "trends",
                    "max_results": 10,
                    "include_consulting": True
                },
                "optimizations": {
                    "competitive_analysis": {"analysis_type": "competitive", "include_consulting": True},
                    "market_research": {"analysis_type": "market_size", "max_results": 15}
                }
            }
        }
    
    def optimize_parameters(self, 
                          tool_name: str, 
                          insight: str, 
                          user_context: str,
                          base_parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize parameters based on insight content and context."""
        
        # Get base template
        template = self.parameter_templates.get(tool_name, {})
        defaults = template.get("defaults", {})
        optimizations = template.get("optimizations", {})
        
        # Start with defaults
        optimized_params = defaults.copy()
        
        # Apply base parameters
        optimized_params.update(base_parameters)
        
        # Apply context-based optimizations
        insight_lower = insight.lower()
        
        # Detect optimization patterns
        if any(keyword in insight_lower for keyword in ["recent", "latest", "current"]):
            if "recent_events" in optimizations:
                optimized_params.update(optimizations["recent_events"])
        
        if any(keyword in insight_lower for keyword in ["research", "study", "academic"]):
            if "academic_research" in optimizations:
                optimized_params.update(optimizations["academic_research"])
        
        if any(keyword in insight_lower for keyword in ["market", "financial", "stock"]):
            if "financial_data" in optimizations:
                optimized_params.update(optimizations["financial_data"])
        
        if any(keyword in insight_lower for keyword in ["industry", "business", "competitive"]):
            if "industry_trends" in optimizations:
                optimized_params.update(optimizations["industry_trends"])
        
        return optimized_params
