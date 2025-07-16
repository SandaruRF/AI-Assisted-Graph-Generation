from app.state import State

def generate_metadata_response(state: State):
    """Generate response for metadata requests."""
    if hasattr(state, 'metadata') and state.metadata:
        return f"Dataset Metadata:\n{state.metadata}"
    else:
        return "Metadata information is not available."

def generate_system_response(state: State):
    """Generate response for system requests."""
    if hasattr(state, 'system_info') and state.system_info:
        return state.system_info
    else:
        return "System information processed."

def generate_customization_response(state: State):
    """Generate response for customization requests."""
    if hasattr(state, 'customization_result') and state.customization_result:
        return state.customization_result
    else:
        return "Customization completed."

def generate_analysis_response(state: State, intents: list):
    """Generate response for visualization, insight, and explanation intents."""
    response_parts = []
    
    # Add visualization information if requested
    if "visualization" in intents:
        if hasattr(state, 'suitable_graphs') and state.suitable_graphs:
            response_parts.append(f"**Recommended Visualizations:**\n{format_graph_recommendations(state.suitable_graphs)}")
        
        if hasattr(state, 'ranked_graphs') and state.ranked_graphs:
            response_parts.append(f"**Top Graph Recommendations:**\n{format_ranked_graphs(state.ranked_graphs)}")
    
    # Add insights if requested
    if "insight" in intents:
        if hasattr(state, 'response') and state.response:
            response_parts.append(f"**Data Insights:**\n{state.response}")
        elif hasattr(state, 'insights') and state.insights:
            response_parts.append(f"**Key Insights:**\n{format_insights(state.insights)}")
            response_parts.append(f"**Key Insights:**\n{format_insights(state.insights_response)}")
    
    # Add explanations if requested
    if "explanation" in intents:
        if hasattr(state, 'explanation') and state.explanation:
            response_parts.append(f"**Detailed Explanation:**\n{state.explanation}")
            response_parts.append(f"**Data Insights:**\n{state.response}")
        else:
            response_parts.append("**Explanation:**\nDetailed analysis explanation is being processed.")
    
    # Combine all parts or provide fallback
    if response_parts:
        return "\n\n".join(response_parts)
    else:
        return "Analysis completed. Results are being processed."

def format_graph_recommendations(suitable_graphs):
    """Format graph recommendations for display."""
    if isinstance(suitable_graphs, list):
        return "\n".join([f"• {graph}" for graph in suitable_graphs])
    else:
        return str(suitable_graphs)

def format_ranked_graphs(ranked_graphs):
    """Format ranked graphs for display."""
    if isinstance(ranked_graphs, list):
        return "\n".join([f"{i+1}. {graph}" for i, graph in enumerate(ranked_graphs)])
    else:
        return str(ranked_graphs)

def format_insights(insights):
    """Format insights for display."""
    if isinstance(insights, list):
        return "\n".join([f"• {insight}" for insight in insights])
    else:
        return str(insights)