from langgraph.graph import StateGraph, MessagesState
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI

from app.state import State, connected_clients
from app.utils.web_socket_update import send_websocket_update
from app.agents.analysis_agents.anomaly_detection_agent.pyod_anomaly_detector import (
    detect_anomalies_iforest, detect_anomalies_autoencoder, detect_anomalies_hbos, detect_anomalies_knn, detect_anomalies_lof, detect_anomalies_ocsvm
)
from app.agents.analysis_agents.anomaly_detection_agent.sklearn_anomaly_detector import detect_anomalies_sklearn
from app.agents.analysis_agents.trend_detection_agent.tsfresh_trend_features import tsfresh_feature_extraction
from app.agents.analysis_agents.trend_detection_agent.stumpy_motif_detection import stumpy_pattern_search
from app.agents.analysis_agents.trend_detection_agent.prophet_trend_forecast import prophet_forecast    


# claude-3-5-haiku-20241022	
# llm = ChatAnthropic(model="claude-sonnet-4-20250514", max_tokens=2000, temperature=0)
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", max_tokens=2000, temperature=0)

# Augment the LLM with tools
tools = [detect_anomalies_sklearn, 
         detect_anomalies_iforest, 
         detect_anomalies_hbos, 
         detect_anomalies_knn,
         detect_anomalies_autoencoder,
         detect_anomalies_lof,
         detect_anomalies_ocsvm,
         prophet_forecast,
         stumpy_pattern_search,
         tsfresh_feature_extraction]

tools_by_name = {tool.name: tool for tool in tools}
llm_with_tools = llm.bind_tools(tools)

async def generate_insights(state: State):

    # Prepare data context for the LLM
    data_context = {
        "num_rows": state.num_rows,
        "num_numeric": state.num_numeric,
        "num_cat": state.num_cat,
        "num_temporal": state.num_temporal,
        "cardinalities": state.cardinalities
    }
    
    # Create analysis prompt for autonomous tool selection
    analysis_prompt = f"""
    User Request: "{state.user_prompt}"
    
    Dataset Information:
    - Rows: {state.num_rows}
    - Numeric columns: {state.num_numeric}
    - Categorical columns: {state.num_cat}
    - Temporal columns: {state.num_temporal}
    - Cardinalities: {state.cardinalities}
    
    Based on the user's request and dataset characteristics, analyze the data using the most appropriate tools.
    
    Available analysis capabilities:
    - Anomaly detection (multiple algorithms)
    - Time series forecasting with Prophet
    - Pattern/motif detection with STUMPY
    - Feature extraction with TSFresh
    
    Select and use the tools that best address the user's question and dataset type.
    """
    
    # Let LLM autonomously decide which tools to use
    tool_messages = [HumanMessage(content=analysis_prompt)]
    
    try:
        messages = state.messages.copy()
        # Get LLM response with tool calls
        response = await llm_with_tools.ainvoke(tool_messages)
        
        insights = []
        tool_results = {}
        
        # Process any tool calls the LLM decided to make
        if hasattr(response, 'tool_calls') and response.tool_calls:
            for tool_call in response.tool_calls:
                tool_name = tool_call["name"]
                tool_args = tool_call["args"]
                
                update_message = f"Executing {tool_name}..."
                print("==================================================")
                print(f"Update message:")
                print(update_message)
                print("==================================================")
                messages.append(update_message)
                if state.session_id in connected_clients:
                    await send_websocket_update(state.session_id, update_message)
                
                # Execute the selected tool
                try:
                    tool_function = tools_by_name[tool_name]
                    # print("==================================================")
                    # print(f"Tool function:")
                    # print(tool_function)
                    # print("==================================================")
                    
                    # Prepare arguments with data
                    final_args = {"data": state.rearranged_data}
                    if tool_args:
                        # Only update non-data arguments
                        for key, value in tool_args.items():
                            if key != "data":  # Don't overwrite the data
                                final_args[key] = value
                    
                    # print("==================================================")
                    # print(f"Rearranged data:")
                    # print(state.rearranged_data)
                    # print("==================================================")
                    # print(f"Final args:")
                    # print(final_args)
                    # print("==================================================")
                    # Execute tool
                    result = tool_function.invoke(final_args)
                    # print("==================================================")
                    # print(f"Tool result:")
                    # print(result)
                    # print("==================================================")
                    tool_results[tool_name] = result
                    
                    # Generate insight from result
                    insight = await generate_insight_from_tool_result(
                        tool_name, result, state.user_prompt
                    )
                    insights.append(insight)
                    
                except Exception as e:
                    error_msg = f"Error executing {tool_name}: {str(e)}"
                    print(error_msg)
                    insights.append(f"Could not complete {tool_name} analysis: {error_msg}")
        
        # Generate final comprehensive response
        if insights:
            final_response = await synthesize_insights(insights, state.user_prompt)
        else:
            # Fallback if no tools were called
            final_response = await generate_direct_insight(state.user_prompt, data_context)
        
        return state.copy(update={
            "messages": messages,
            "insights": insights,
            "tool_results": tool_results,
            "insights_response": final_response
        })
        
    except Exception as e:
        error_response = f"Error in insight generation: {str(e)}"
        return state.copy(update={
            "messages": messages,
            "insights": [],
            "tool_results": {},
            "insights_response": error_response
        })

async def generate_insight_from_tool_result(tool_name, result, user_prompt):
    """Generate human-readable insight from tool execution result."""
    insight_prompt = f"""
    Tool: {tool_name}
    Result: {result}
    Original Question: "{user_prompt}"
    
    Based on this analysis result, provide a clear, actionable insight that:
    1. Explains what was discovered in simple terms
    2. Relates the finding to the user's original question
    3. Suggests what this means and any recommended actions
    
    Keep the response concise and business-focused.
    """
    
    response = await llm.ainvoke([HumanMessage(content=insight_prompt)])
    print("==================================================")
    print(f"Insight generated from {tool_name}:")
    print(response.content)
    print("==================================================")
    return response.content

async def synthesize_insights(insights, user_prompt):
    """Combine multiple insights into a comprehensive response."""
    synthesis_prompt = f"""
    Original Question: "{user_prompt}"
    
    Analysis Results:
    {chr(10).join([f"• {insight}" for insight in insights])}
    
    Provide a comprehensive summary that:
    1. Directly answers the user's question
    2. Highlights the most important findings
    3. Explains how different insights connect
    4. Provides clear recommendations or next steps
    
    Structure the response clearly and make it actionable.
    """
    
    response = await llm.ainvoke([HumanMessage(content=synthesis_prompt)])
    print("==================================================")
    print(f"Synthesized insights:")
    print(response.content)
    print("==================================================")
    return response.content

async def generate_direct_insight(user_prompt, data_context):
    """Generate insight when no tools were automatically selected."""
    direct_prompt = f"""
    User Question: "{user_prompt}"
    Dataset: {data_context}
    
    Based on the user's question and dataset characteristics, provide helpful guidance on:
    1. What type of analysis would be most appropriate
    2. What insights might be discoverable
    3. Any limitations or considerations
    
    Be specific and actionable in your response.
    """
    
    response = await llm.ainvoke([HumanMessage(content=direct_prompt)])
    print("==================================================")
    print(f"Direct insights:")
    print(response.content)
    print("==================================================")
    return response.content
