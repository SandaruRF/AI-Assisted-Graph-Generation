import asyncio
import os
from typing import List, Optional, Dict, Any, Literal
from tavily import AsyncTavilyClient
import json

from app.config import settings

class TavilySearchManager:
    """Enhanced Tavily search manager with comprehensive search capabilities."""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or settings.TAVILY_API_KEY
        self.client = AsyncTavilyClient(api_key=self.api_key)
        self.search_history = []
    
    async def execute_search(self, 
                           query: str,
                           topic: Literal["general", "news"] = "general",
                           search_depth: Literal["basic", "advanced"] = "basic",
                           max_results: int = 5,
                           time_range: Optional[Literal["day", "week", "month", "year"]] = None,
                           days: int = 7,
                           include_answer: bool = False,
                           include_raw_content: bool = False,
                           include_images: bool = False,
                           include_image_descriptions: bool = False,
                           include_domains: Optional[List[str]] = None,
                           exclude_domains: Optional[List[str]] = None,
                           country: Optional[str] = None,
                           chunks_per_source: int = 3,
                           auto_parameters: bool = False) -> Dict[str, Any]:
        """Execute a comprehensive Tavily search with all available parameters."""
        
        try:
            # Build search parameters
            search_params = {
                "query": query,
                "topic": topic,
                "search_depth": search_depth,
                "max_results": max_results,
                "include_answer": include_answer,
                "include_raw_content": include_raw_content,
                "include_images": include_images,
                "include_image_descriptions": include_image_descriptions,
                "auto_parameters": auto_parameters
            }
            
            # Add optional parameters
            if time_range:
                search_params["time_range"] = time_range
            if topic == "news":
                search_params["days"] = days
            if include_domains:
                search_params["include_domains"] = include_domains
            if exclude_domains:
                search_params["exclude_domains"] = exclude_domains
            if country and topic == "general":
                search_params["country"] = country
            if search_depth == "advanced":
                search_params["chunks_per_source"] = chunks_per_source
            
            # Execute search
            response = await self.client.search(**search_params)
            
            # Store search history
            self.search_history.append({
                "query": query,
                "params": search_params,
                "timestamp": asyncio.get_event_loop().time()
            })
            
            return response
            
        except Exception as e:
            return {
                "error": str(e),
                "query": query,
                "results": [],
                "success": False
            }
