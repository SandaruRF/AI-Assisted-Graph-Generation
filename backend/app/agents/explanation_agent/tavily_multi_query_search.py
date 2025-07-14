from langchain_core.tools import tool
from typing import List, Optional, Dict, Any, Literal
import asyncio

from app.agents.explanation_agent.tavily_search_manager import TavilySearchManager 
from app.agents.explanation_agent.tavily_universal_search import configure_search_by_type

@tool
async def tavily_multi_query_search(
    queries: List[str],
    search_type: str = "general",
    max_results_per_query: int = 5,
    combine_results: bool = True
) -> str:
    """
    Execute multiple search queries simultaneously and combine results.
    
    Args:
        queries: List of search queries to execute
        search_type: Type of search to perform
        max_results_per_query: Maximum results per individual query
        combine_results: Whether to combine and deduplicate results
    
    Returns:
        Combined search results from all queries
    """
    
    search_manager = TavilySearchManager()
    
    # Execute searches concurrently
    search_tasks = []
    for query in queries:
        config = configure_search_by_type(search_type, "basic", max_results_per_query, None)
        task = search_manager.execute_search(query=query, **config)
        search_tasks.append(task)
    
    # Wait for all searches to complete
    results = await asyncio.gather(*search_tasks, return_exceptions=True)
    
    # Process and combine results
    combined_results = {
        "queries": queries,
        "individual_results": [],
        "combined_sources": [],
        "all_answers": []
    }
    
    seen_urls = set()
    
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            combined_results["individual_results"].append({
                "query": queries[i],
                "error": str(result)
            })
            continue
        
        combined_results["individual_results"].append({
            "query": queries[i],
            "result_count": len(result.get("results", []))
        })
        
        # Add AI answers
        if result.get("answer"):
            combined_results["all_answers"].append({
                "query": queries[i],
                "answer": result["answer"]
            })
        
        # Combine unique sources
        if combine_results and result.get("results"):
            for source in result["results"]:
                url = source.get("url")
                if url and url not in seen_urls:
                    seen_urls.add(url)
                    source["source_query"] = queries[i]
                    combined_results["combined_sources"].append(source)
    
    # Format combined output
    output = []
    
    # Add combined answers
    if combined_results["all_answers"]:
        output.append("**AI Answers by Query:**")
        for answer_data in combined_results["all_answers"]:
            output.append(f"Q: {answer_data['query']}")
            output.append(f"A: {answer_data['answer']}\n")
    
    # Add combined sources
    if combined_results["combined_sources"]:
        output.append("**Combined Sources:**")
        for i, source in enumerate(combined_results["combined_sources"][:15], 1):
            output.append(f"{i}. {source.get('title', 'No title')}")
            output.append(f"   URL: {source.get('url')}")
            output.append(f"   From Query: {source.get('source_query')}")
            output.append(f"   Score: {source.get('score', 'N/A')}")
            if source.get("content"):
                content = source["content"][:300] + "..." if len(source["content"]) > 300 else source["content"]
                output.append(f"   Content: {content}\n")
    
    # Add search summary
    output.append("**Search Summary:**")
    output.append(f"- Total queries executed: {len(queries)}")
    output.append(f"- Unique sources found: {len(combined_results['combined_sources'])}")
    output.append(f"- Answers generated: {len(combined_results['all_answers'])}")
    
    return "\n".join(output)
