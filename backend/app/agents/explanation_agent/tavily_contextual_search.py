from langchain_core.tools import tool
from typing import List, Optional, Dict, Any, Literal
import asyncio

from app.agents.explanation_agent.tavily_search_manager import TavilySearchManager 
from app.agents.explanation_agent.tavily_universal_search import configure_search_by_type

@tool
async def tavily_contextual_search(
    primary_query: str,
    context_type: Literal["background", "recent_events", "expert_opinion", "data_statistics", "related_topics"] = "background",
    depth: Literal["basic", "advanced"] = "advanced"
) -> str:
    """
    Search for specific types of context around a primary query.
    
    Args:
        primary_query: Main search query
        context_type: Type of context to search for
        depth: Search depth level
    
    Returns:
        Context-specific search results
    """
    
    search_manager = TavilySearchManager()
    
    # Generate context-specific queries
    context_queries = generate_context_queries(primary_query, context_type)
    
    # Execute searches
    results = []
    for query in context_queries:
        config = configure_search_by_type("general", depth, 8, None)
        result = await search_manager.execute_search(query=query, **config)
        results.append(result)
    
    # Format results by context type
    return format_contextual_results(results, context_queries, context_type)

def generate_context_queries(primary_query: str, context_type: str) -> List[str]:
    """Generate context-specific search queries."""
    
    base_query = primary_query
    
    if context_type == "background":
        return [
            f"{base_query} definition explanation",
            f"{base_query} history background",
            f"{base_query} overview summary"
        ]
    
    elif context_type == "recent_events":
        return [
            f"{base_query} latest news 2024",
            f"{base_query} recent developments",
            f"{base_query} current events"
        ]
    
    elif context_type == "expert_opinion":
        return [
            f"{base_query} expert analysis",
            f"{base_query} professional opinion",
            f"{base_query} industry experts"
        ]
    
    elif context_type == "data_statistics":
        return [
            f"{base_query} statistics data",
            f"{base_query} market research",
            f"{base_query} survey results"
        ]
    
    elif context_type == "related_topics":
        return [
            f"{base_query} related topics",
            f"{base_query} similar concepts",
            f"{base_query} connected ideas"
        ]
    
    return [primary_query]

def format_contextual_results(results: List[Dict], queries: List[str], context_type: str) -> str:
    """Format contextual search results."""
    
    output = [f"**{context_type.replace('_', ' ').title()} Context for Query**\n"]
    
    for i, (result, query) in enumerate(zip(results, queries), 1):
        if result.get("error"):
            output.append(f"Query {i} failed: {result['error']}")
            continue
        
        output.append(f"**Context Query {i}:** {query}")
        
        if result.get("answer"):
            output.append(f"**AI Summary:** {result['answer']}")
        
        if result.get("results"):
            output.append("**Top Sources:**")
            for j, source in enumerate(result["results"][:3], 1):
                output.append(f"{j}. {source.get('title', 'No title')}")
                output.append(f"   {source.get('url', 'No URL')}")
                if source.get("content"):
                    content = source["content"][:200] + "..." if len(source["content"]) > 200 else source["content"]
                    output.append(f"   {content}")
        
        output.append("")
    
    return "\n".join(output)


async def test_contextual_search():
    """Test contextual Tavily search with a primary query and context type."""
    
    print("Testing Contextual Search...\n")

    result = await tavily_contextual_search.ainvoke({
        "primary_query": "blockchain technology",
        "context_type": "recent_events",
        "depth": "advanced"
    })

    print("Contextual Search Results:")
    print(result)
    print("\n" + "=" * 50 + "\n")

if __name__ == "__main__":
    asyncio.run(test_contextual_search())