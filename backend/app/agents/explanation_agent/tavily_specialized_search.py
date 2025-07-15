import asyncio
from typing import List, Optional, Dict, Any, Literal
from langchain_core.tools import tool
from .tavily_search_manager import TavilySearchManager

# Domain-specific configurations
DOMAIN_CONFIGS = {
    "news": {
        "primary_domains": [
            "reuters.com", "bloomberg.com", "ap.org", "bbc.com", 
            "cnn.com", "npr.org", "wsj.com", "nytimes.com"
        ],
        "exclude_domains": [
            "reddit.com", "twitter.com", "facebook.com", "instagram.com"
        ]
    },
    "academic": {
        "primary_domains": [
            "scholar.google.com", "arxiv.org", "researchgate.net", 
            "academia.edu", "pubmed.ncbi.nlm.nih.gov", "ieee.org",
            "springer.com", "sciencedirect.com", "jstor.org"
        ],
        "exclude_domains": [
            "wikipedia.org", "reddit.com", "quora.com"
        ]
    },
    "financial": {
        "primary_domains": [
            "bloomberg.com", "reuters.com", "marketwatch.com", 
            "yahoo.com/finance", "morningstar.com", "sec.gov",
            "wsj.com", "ft.com", "cnbc.com", "investing.com"
        ],
        "exclude_domains": [
            "reddit.com", "seekingalpha.com", "motleyfool.com"
        ]
    },
    "industry": {
        "primary_domains": [
            "techcrunch.com", "crunchbase.com", "pitchbook.com", 
            "cbinsights.com", "venturebeat.com", "forbes.com",
            "mckinsey.com", "bcg.com", "deloitte.com", "pwc.com"
        ],
        "exclude_domains": [
            "reddit.com", "medium.com", "linkedin.com/pulse"
        ]
    }
}

# Search configuration templates
SEARCH_TEMPLATES = {
    "news": {
        "topic": "news",
        "search_depth": "advanced",
        "days": 7,
        "include_images": True,
        "include_answer": True,
        "max_results": 15
    },
    "academic": {
        "topic": "general",
        "search_depth": "advanced",
        "include_raw_content": True,
        "include_answer": True,
        "chunks_per_source": 3,
        "max_results": 10
    },
    "financial": {
        "topic": "general",
        "search_depth": "advanced",
        "include_answer": True,
        "include_raw_content": True,
        "max_results": 12
    },
    "industry": {
        "topic": "general",
        "search_depth": "advanced",
        "include_answer": True,
        "include_raw_content": True,
        "chunks_per_source": 3,
        "max_results": 10
    }
}

@tool
async def tavily_news_search(
    query: str,
    time_period: Literal["day", "week", "month"] = "week",
    max_results: int = 15,
    include_breaking: bool = True,
    region: Optional[str] = None
) -> str:
    """
    Search current events and breaking news with optimized news sources.
    
    Args:
        query: News search query
        time_period: Time range for news search (day, week, month)
        max_results: Maximum number of news results
        include_breaking: Whether to prioritize breaking news
        region: Geographic region to focus on (optional)
    
    Returns:
        Formatted news search results with timestamps and sources
    """
    
    search_manager = TavilySearchManager()
    
    # Configure news search parameters
    search_config = SEARCH_TEMPLATES["news"].copy()
    search_config.update({
        "max_results": max_results,
        "include_domains": DOMAIN_CONFIGS["news"]["primary_domains"],
        "exclude_domains": DOMAIN_CONFIGS["news"]["exclude_domains"]
    })
    
    # Set time period
    time_mapping = {"day": 1, "week": 7, "month": 30}
    search_config["days"] = time_mapping.get(time_period, 7)
    
    # Add region if specified
    if region:
        search_config["country"] = region.lower()
    
    # Execute search
    results = await search_manager.execute_search(query=query, **search_config)
    
    return format_news_results(results, time_period, include_breaking)

@tool
async def tavily_academic_search(
    query: str,
    field: Literal["general", "computer_science", "medicine", "business", "engineering"] = "general",
    publication_period: Optional[Literal["year", "month"]] = None,
    max_results: int = 10,
    include_preprints: bool = True
) -> str:
    """
    Search scholarly articles and research papers from academic sources.
    
    Args:
        query: Academic search query
        field: Academic field to focus on
        publication_period: Recent publication timeframe
        max_results: Maximum number of academic results
        include_preprints: Whether to include preprint servers
    
    Returns:
        Formatted academic search results with citations and abstracts
    """
    
    search_manager = TavilySearchManager()
    
    # Configure academic search parameters
    search_config = SEARCH_TEMPLATES["academic"].copy()
    search_config.update({
        "max_results": max_results,
        "include_domains": DOMAIN_CONFIGS["academic"]["primary_domains"],
        "exclude_domains": DOMAIN_CONFIGS["academic"]["exclude_domains"]
    })
    
    # Add field-specific domains
    field_domains = get_field_specific_domains(field, include_preprints)
    if field_domains:
        search_config["include_domains"].extend(field_domains)
    
    # Add publication period filter
    if publication_period:
        search_config["time_range"] = publication_period
    
    # Enhance query for academic search
    academic_query = enhance_academic_query(query, field)
    
    # Execute search
    results = await search_manager.execute_search(query=academic_query, **search_config)
    
    return format_academic_results(results, field)

@tool
async def tavily_financial_search(
    query: str,
    data_type: Literal["market_data", "company_info", "economic_indicators", "analysis"] = "market_data",
    time_horizon: Optional[Literal["day", "week", "month", "year"]] = None,
    max_results: int = 12,
    include_regulatory: bool = True
) -> str:
    """
    Search financial data and market information from trusted financial sources.
    
    Args:
        query: Financial search query
        data_type: Type of financial information to prioritize
        time_horizon: Time range for financial data
        max_results: Maximum number of financial results
        include_regulatory: Whether to include regulatory filings
    
    Returns:
        Formatted financial search results with market data and analysis
    """
    
    search_manager = TavilySearchManager()
    
    # Configure financial search parameters
    search_config = SEARCH_TEMPLATES["financial"].copy()
    search_config.update({
        "max_results": max_results,
        "include_domains": DOMAIN_CONFIGS["financial"]["primary_domains"],
        "exclude_domains": DOMAIN_CONFIGS["financial"]["exclude_domains"]
    })
    
    # Add regulatory sources if requested
    if include_regulatory:
        search_config["include_domains"].extend([
            "sec.gov", "edgar.sec.gov", "investor.gov"
        ])
    
    # Add time filtering
    if time_horizon:
        search_config["time_range"] = time_horizon
    
    # Enhance query for financial search
    financial_query = enhance_financial_query(query, data_type)
    
    # Execute search
    results = await search_manager.execute_search(query=financial_query, **search_config)
    
    return format_financial_results(results, data_type)

@tool
async def tavily_industry_search(
    query: str,
    industry_sector: Literal["technology", "healthcare", "finance", "energy", "retail", "manufacturing"] = "technology",
    analysis_type: Literal["trends", "competitive", "market_size", "innovation"] = "trends",
    max_results: int = 10,
    include_consulting: bool = True
) -> str:
    """
    Search for business and industry insights from professional sources.
    
    Args:
        query: Industry search query
        industry_sector: Specific industry sector to focus on
        analysis_type: Type of industry analysis needed
        max_results: Maximum number of industry results
        include_consulting: Whether to include consulting firm reports
    
    Returns:
        Formatted industry search results with business insights and analysis
    """
    
    search_manager = TavilySearchManager()
    
    # Configure industry search parameters
    search_config = SEARCH_TEMPLATES["industry"].copy()
    search_config.update({
        "max_results": max_results,
        "include_domains": DOMAIN_CONFIGS["industry"]["primary_domains"],
        "exclude_domains": DOMAIN_CONFIGS["industry"]["exclude_domains"]
    })
    
    # Add consulting firm sources if requested
    if include_consulting:
        search_config["include_domains"].extend([
            "mckinsey.com", "bcg.com", "bain.com", "deloitte.com", 
            "pwc.com", "ey.com", "kpmg.com"
        ])
    
    # Add sector-specific domains
    sector_domains = get_sector_specific_domains(industry_sector)
    if sector_domains:
        search_config["include_domains"].extend(sector_domains)
    
    # Enhance query for industry search
    industry_query = enhance_industry_query(query, industry_sector, analysis_type)
    
    # Execute search
    results = await search_manager.execute_search(query=industry_query, **search_config)
    
    return format_industry_results(results, industry_sector, analysis_type)

# Helper functions for domain and query enhancement

def get_field_specific_domains(field: str, include_preprints: bool) -> List[str]:
    """Get domain list specific to academic field."""
    field_domains = {
        "computer_science": ["acm.org", "ieee.org", "arxiv.org/cs"],
        "medicine": ["pubmed.ncbi.nlm.nih.gov", "nejm.org", "bmj.com"],
        "business": ["hbr.org", "sloanreview.mit.edu", "ssrn.com"],
        "engineering": ["ieee.org", "asme.org", "asce.org"]
    }
    
    domains = field_domains.get(field, [])
    
    if include_preprints and field == "computer_science":
        domains.extend(["arxiv.org", "biorxiv.org"])
    
    return domains

def get_sector_specific_domains(sector: str) -> List[str]:
    """Get domain list specific to industry sector."""
    sector_domains = {
        "technology": ["techcrunch.com", "wired.com", "arstechnica.com"],
        "healthcare": ["fiercehealthcare.com", "modernhealthcare.com"],
        "finance": ["americanbanker.com", "bankingdive.com"],
        "energy": ["energynews.us", "platts.com"],
        "retail": ["retaildive.com", "nrf.com"],
        "manufacturing": ["manufacturingdive.com", "industryweek.com"]
    }
    
    return sector_domains.get(sector, [])

def enhance_academic_query(query: str, field: str) -> str:
    """Enhance query for academic search."""
    field_terms = {
        "computer_science": "research paper algorithm",
        "medicine": "clinical study medical research",
        "business": "business study case analysis",
        "engineering": "engineering research technical"
    }
    
    enhancement = field_terms.get(field, "research paper")
    return f"{query} {enhancement}"

def enhance_financial_query(query: str, data_type: str) -> str:
    """Enhance query for financial search."""
    type_terms = {
        "market_data": "stock price market performance",
        "company_info": "financial statements earnings",
        "economic_indicators": "economic data GDP inflation",
        "analysis": "financial analysis investment"
    }
    
    enhancement = type_terms.get(data_type, "financial")
    return f"{query} {enhancement}"

def enhance_industry_query(query: str, sector: str, analysis_type: str) -> str:
    """Enhance query for industry search."""
    analysis_terms = {
        "trends": "industry trends market outlook",
        "competitive": "competitive analysis market share",
        "market_size": "market size industry report",
        "innovation": "innovation technology disruption"
    }
    
    enhancement = analysis_terms.get(analysis_type, "industry analysis")
    return f"{query} {sector} {enhancement}"

# Result formatting functions

def format_news_results(results: Dict[str, Any], time_period: str, include_breaking: bool) -> str:
    """Format news search results with timestamps and source credibility."""
    if results.get("error"):
        return f"News search failed: {results['error']}"
    
    formatted_output = []
    
    # Add AI summary
    if results.get("answer"):
        formatted_output.append(f"**News Summary ({time_period}):**\n{results['answer']}\n")
    
    # Add breaking news indicator
    if include_breaking:
        formatted_output.append("**Latest News Coverage:**")
    else:
        formatted_output.append("**News Articles:**")
    
    if results.get("results"):
        for i, result in enumerate(results["results"], 1):
            article = f"{i}. **{result.get('title', 'No title')}**"
            article += f"\n   📰 Source: {extract_domain(result.get('url', ''))}"
            article += f"\n   🔗 URL: {result.get('url', 'No URL')}"
            
            if result.get("published_date"):
                article += f"\n   📅 Published: {result['published_date']}"
            
            if result.get("content"):
                content = result["content"][:400] + "..." if len(result["content"]) > 400 else result["content"]
                article += f"\n   📝 Summary: {content}"
            
            article += f"\n   ⭐ Relevance: {result.get('score', 'N/A')}\n"
            formatted_output.append(article)
    
    # Add images info
    if results.get("images"):
        formatted_output.append(f"📸 **Related Images:** {len(results['images'])} images available")
        for i, image_url in enumerate(results["images"], 1):
            formatted_output.append(f"   {i}. {image_url}")
    
    return "\n".join(formatted_output)

def format_academic_results(results: Dict[str, Any], field: str) -> str:
    """Format academic search results with citation information."""
    if results.get("error"):
        return f"Academic search failed: {results['error']}"
    
    formatted_output = []
    
    # Add AI summary
    if results.get("answer"):
        formatted_output.append(f"**Academic Summary ({field}):**\n{results['answer']}\n")
    
    formatted_output.append("**Research Papers & Articles:**")
    
    if results.get("results"):
        for i, result in enumerate(results["results"], 1):
            paper = f"{i}. **{result.get('title', 'No title')}**"
            paper += f"\n   🏛️ Source: {extract_domain(result.get('url', ''))}"
            paper += f"\n   🔗 URL: {result.get('url', 'No URL')}"
            paper += f"\n   📊 Relevance Score: {result.get('score', 'N/A')}"
            
            if result.get("content"):
                content = result["content"][:500] + "..." if len(result["content"]) > 500 else result["content"]
                paper += f"\n   📋 Abstract/Summary: {content}"
            
            paper += "\n"
            formatted_output.append(paper)
    
    formatted_output.append(f"**Field:** {field.replace('_', ' ').title()}")
    formatted_output.append(f"**Search Type:** Academic Research")
    
    return "\n".join(formatted_output)

def format_financial_results(results: Dict[str, Any], data_type: str) -> str:
    """Format financial search results with market context."""
    if results.get("error"):
        return f"Financial search failed: {results['error']}"
    
    formatted_output = []
    
    # Add AI summary
    if results.get("answer"):
        formatted_output.append(f"**Financial Analysis ({data_type.replace('_', ' ').title()}):**\n{results['answer']}\n")
    
    formatted_output.append("**Financial Information & Analysis:**")
    
    if results.get("results"):
        for i, result in enumerate(results["results"], 1):
            financial_item = f"{i}. **{result.get('title', 'No title')}**"
            financial_item += f"\n   💼 Source: {extract_domain(result.get('url', ''))}"
            financial_item += f"\n   🔗 URL: {result.get('url', 'No URL')}"
            
            if result.get("published_date"):
                financial_item += f"\n   📅 Date: {result['published_date']}"
            
            if result.get("content"):
                content = result["content"][:450] + "..." if len(result["content"]) > 450 else result["content"]
                financial_item += f"\n   📈 Summary: {content}"
            
            financial_item += f"\n   ⭐ Relevance: {result.get('score', 'N/A')}\n"
            formatted_output.append(financial_item)
    
    formatted_output.append(f"**Data Type:** {data_type.replace('_', ' ').title()}")
    formatted_output.append(f"**Search Focus:** Financial Markets & Data")
    
    return "\n".join(formatted_output)

def format_industry_results(results: Dict[str, Any], sector: str, analysis_type: str) -> str:
    """Format industry search results with business insights."""
    if results.get("error"):
        return f"Industry search failed: {results['error']}"
    
    formatted_output = []
    
    # Add AI summary
    if results.get("answer"):
        formatted_output.append(f"**Industry Insights ({sector} - {analysis_type.replace('_', ' ').title()}):**\n{results['answer']}\n")
    
    formatted_output.append("**Business & Industry Analysis:**")
    
    if results.get("results"):
        for i, result in enumerate(results["results"], 1):
            business_item = f"{i}. **{result.get('title', 'No title')}**"
            business_item += f"\n   🏢 Source: {extract_domain(result.get('url', ''))}"
            business_item += f"\n   🔗 URL: {result.get('url', 'No URL')}"
            
            if result.get("published_date"):
                business_item += f"\n   📅 Published: {result['published_date']}"
            
            if result.get("content"):
                content = result["content"][:400] + "..." if len(result["content"]) > 400 else result["content"]
                business_item += f"\n   📋 Insights: {content}"
            
            business_item += f"\n   ⭐ Relevance: {result.get('score', 'N/A')}\n"
            formatted_output.append(business_item)
    
    formatted_output.append(f"**Industry Sector:** {sector.replace('_', ' ').title()}")
    formatted_output.append(f"**Analysis Type:** {analysis_type.replace('_', ' ').title()}")
    formatted_output.append(f"**Search Focus:** Industry Intelligence & Business Insights")
    
    return "\n".join(formatted_output)

def extract_domain(url: str) -> str:
    """Extract clean domain name from URL."""
    if not url:
        return "Unknown"
    
    try:
        from urllib.parse import urlparse
        domain = urlparse(url).netloc
        return domain.replace("www.", "") if domain else "Unknown"
    except:
        return "Unknown"


async def test_searches():
    print("📰 Testing News Search...\n")

    result = await tavily_news_search.ainvoke({
        "query": "AI regulation by governments",
        "time_period": "week",
        "max_results": 10,
        "include_breaking": True,
        "region": "us"
    })

    print("News Search Results:")
    print(result)
    print("\n" + "=" * 50 + "\n")

    print("📖 Testing Academic Search...\n")

    result = await tavily_academic_search.ainvoke({
        "query": "transformer architectures in NLP",
        "field": "computer_science",
        "publication_period": "year",
        "max_results": 5,
        "include_preprints": True
    })

    print("Academic Search Results:")
    print(result)
    print("\n" + "=" * 50 + "\n")

    print("💼 Testing Financial Search...\n")

    result = await tavily_financial_search.ainvoke({
        "query": "Tesla Q2 earnings report",
        "data_type": "company_info",
        "time_horizon": "month",
        "max_results": 8,
        "include_regulatory": True
    })

    print("Financial Search Results:")
    print(result)
    print("\n" + "=" * 50 + "\n")

    print("🏭 Testing Industry Search...\n")

    result = await tavily_industry_search.ainvoke({
        "query": "AI in retail automation",
        "industry_sector": "retail",
        "analysis_type": "innovation",
        "max_results": 6,
        "include_consulting": True
    })

    print("Industry Search Results:")
    print(result)
    print("\n" + "=" * 50 + "\n")

if __name__ == "__main__":
    asyncio.run(test_searches())
