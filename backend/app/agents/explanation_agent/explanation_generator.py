from .query_generator import SearchOrchestrator

async def explanation_generator(state: State):
    """Generate explanations using intelligent search orchestration."""
    
    update_message = "Analyzing insights and generating search strategy..."
    messages = state.messages.copy()
    messages.append(update_message)
    if state.session_id in connected_clients:
        await send_websocket_update(state.session_id, update_message)
    
    # Initialize intelligent search orchestrator
    orchestrator = SearchOrchestrator()
    
    # Determine domain context from user prompt
    domain_context = determine_domain_context(state.user_prompt, state.rearranged_data)
    
    # Execute intelligent search
    update_message = "Executing intelligent search strategy..."
    messages.append(update_message)
    if state.session_id in connected_clients:
        await send_websocket_update(state.session_id, update_message)
    
    search_results = await orchestrator.execute_intelligent_search(
        insights=state.insights,
        user_prompt=state.user_prompt,
        domain_context=domain_context
    )
    
    # Generate explanations from search results
    explanations = await synthesize_explanations_from_search_results(
        search_results, state.insights, state.user_prompt
    )
    
    # Update messages with search execution details
    for plan_item in search_results["execution_plan"]:
        if plan_item["status"] == "success":
            messages.append(f"✅ Used {plan_item['tool']} for: {plan_item['insight'][:50]}...")
        else:
            messages.append(f"❌ Failed {plan_item['tool']} for: {plan_item['insight'][:50]}...")
    
    return state.copy(update={
        "messages": messages,
        "explanation": explanations,
        "search_results": search_results["search_results"],
        "search_strategy": search_results["strategy"]
    })

def determine_domain_context(user_prompt: str, data: Any) -> str:
    """Determine domain context from user prompt and data."""
    prompt_lower = user_prompt.lower()
    
    if any(keyword in prompt_lower for keyword in ["financial", "market", "stock", "revenue"]):
        return "financial_analysis"
    elif any(keyword in prompt_lower for keyword in ["news", "current", "recent", "latest"]):
        return "current_events"
    elif any(keyword in prompt_lower for keyword in ["research", "study", "academic"]):
        return "academic_research"
    elif any(keyword in prompt_lower for keyword in ["industry", "business", "competitive"]):
        return "industry_analysis"
    else:
        return "general_analysis"

async def synthesize_explanations_from_search_results(
    search_results: Dict[str, Any],
    insights: List[str],
    user_prompt: str
) -> str:
    """Synthesize final explanations from search results."""
    
    explanation_parts = []
    
    for insight, result_data in search_results["search_results"].items():
        if result_data.get("result"):
            explanation_parts.append(f"**Explanation for: {insight}**")
            explanation_parts.append(f"Source: {result_data['tool_used']}")
            explanation_parts.append(f"Context: {result_data['result']}")
            explanation_parts.append("")
    
    return "\n".join(explanation_parts)
