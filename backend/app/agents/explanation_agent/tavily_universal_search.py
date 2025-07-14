from langchain_core.tools import tool
from typing import List, Optional, Dict, Any, Literal

from app.agents.explanation_agent.tavily_search_manager import TavilySearchManager

@tool
async def tavily_universal_search(
    query: str,
    search_type: Literal["general", "news", "academic", "financial", "industry", "recent"] = "general",
    depth: Literal["basic", "advanced"] = "basic",
    max_results: int = 10,
    time_filter: Optional[str] = None,
    include_content: bool = True,
    include_answer: bool = True,
    target_domains: Optional[List[str]] = None,
    exclude_domains: Optional[List[str]] = None,
    country_focus: Optional[str] = None
) -> str:
    """
    Universal search tool that can gather any type of context using Tavily.
    
    Args:
        query: The search query (max 400 characters)
        search_type: Type of search - general, news, academic, financial, industry, recent
        depth: Search depth - basic (1 credit) or advanced (2 credits)
        max_results: Maximum number of results (0-20)
        time_filter: Time range filter - day, week, month, year
        include_content: Whether to include raw content
        include_answer: Whether to include AI-generated answer
        target_domains: List of domains to specifically search
        exclude_domains: List of domains to exclude
        country_focus: Country to prioritize results from
    
    Returns:
        Formatted search results with context
    """
    
    # Initialize search manager
    search_manager = TavilySearchManager()
    
    # Configure search parameters based on search type
    search_config = configure_search_by_type(search_type, depth, max_results, time_filter)
    
    # Add domain filtering
    if target_domains:
        search_config["include_domains"] = target_domains
    if exclude_domains:
        search_config["exclude_domains"] = exclude_domains
    if country_focus:
        search_config["country"] = country_focus
    
    # Execute search
    results = await search_manager.execute_search(
        query=query,
        include_raw_content=include_content,
        include_answer=include_answer,
        **search_config
    )
    
    # Format results
    return format_search_results(results, search_type)

def configure_search_by_type(search_type: str, depth: str, max_results: int, time_filter: str) -> Dict[str, Any]:
    """Configure search parameters based on search type."""
    
    base_config = {
        "search_depth": depth,
        "max_results": max_results,
        "include_images": False,
        "chunks_per_source": 3 if depth == "advanced" else 1
    }
    
    if search_type == "news":
        base_config.update({
            "topic": "news",
            "days": 7 if not time_filter else {"day": 1, "week": 7, "month": 30}.get(time_filter, 7),
            "include_images": True
        })
    
    elif search_type == "academic":
        base_config.update({
            "topic": "general",
            "include_domains": ["scholar.google.com", "arxiv.org", "researchgate.net", "academia.edu"],
            "search_depth": "advanced"
        })
    
    elif search_type == "financial":
        base_config.update({
            "topic": "general",
            "include_domains": ["bloomberg.com", "reuters.com", "marketwatch.com", "yahoo.com/finance"],
            "search_depth": "advanced"
        })
    
    elif search_type == "industry":
        base_config.update({
            "topic": "general",
            "include_domains": ["techcrunch.com", "crunchbase.com", "pitchbook.com", "cbinsights.com"],
            "search_depth": "advanced"
        })
    
    elif search_type == "recent":
        base_config.update({
            "topic": "news",
            "days": 1,
            "time_range": "day"
        })
    
    # Add time filtering
    if time_filter and search_type != "news":
        base_config["time_range"] = time_filter
    
    return base_config

def format_search_results(results: Dict[str, Any], search_type: str) -> str:
    """Format search results for LLM consumption."""
    
    if results.get("error"):
        return f"Search failed: {results['error']}"
    
    formatted_output = []
    
    # Add AI-generated answer if available
    if results.get("answer"):
        formatted_output.append(f"**AI Summary:**\n{results['answer']}\n")
    
    # Add search results
    if results.get("results"):
        formatted_output.append("**Search Results:**")
        
        for i, result in enumerate(results["results"][:10], 1):
            result_text = f"{i}. **{result.get('title', 'No title')}**"
            result_text += f"\n   URL: {result.get('url', 'No URL')}"
            result_text += f"\n   Score: {result.get('score', 'N/A')}"
            
            if result.get("content"):
                content = result["content"][:500] + "..." if len(result["content"]) > 500 else result["content"]
                result_text += f"\n   Content: {content}"
            
            if result.get("published_date"):
                result_text += f"\n   Published: {result['published_date']}"
            
            formatted_output.append(result_text)
    
    # Add images if available
    if results.get("images"):
        formatted_output.append(f"\n**Related Images:** {len(results['images'])} images found")
    
    # Add metadata
    formatted_output.append(f"\n**Search Metadata:**")
    formatted_output.append(f"- Query: {results.get('query', 'Unknown')}")
    formatted_output.append(f"- Response Time: {results.get('response_time', 'N/A')} seconds")
    formatted_output.append(f"- Search Type: {search_type}")
    
    return "\n".join(formatted_output)

import asyncio

async def test_searches():
    """Test the search tool with proper async invoke syntax."""
    
    # General search
    print("Testing General Search...")
    result = await tavily_universal_search.ainvoke({
        "query": "artificial intelligence trends 2024",
        "search_type": "general",
        "depth": "advanced",
        "max_results": 10
    })
    print("General Search Results:")
    print(result)
    print("\n" + "="*50 + "\n")

    # News search
    print("Testing News Search...")
    result = await tavily_universal_search.ainvoke({
        "query": "latest AI developments",
        "search_type": "news",
        "time_filter": "week",
        "max_results": 15
    })
    print("News Search Results:")
    print(result)
    print("\n" + "="*50 + "\n")

    # Academic search
    print("Testing Academic Search...")
    result = await tavily_universal_search.ainvoke({
        "query": "machine learning research papers",
        "search_type": "academic",
        "depth": "advanced"
    })
    print("Academic Search Results:")
    print(result)

if __name__ == "__main__":
    asyncio.run(test_searches())
