# AI-Assisted-Graph-Generation/backend/app/agents/visualization_agent/ui_customizer.py

import re
import json

def parse_customization_prompt(prompt: str):
    """
    Parse natural language prompt to extract graph customization commands
    """
    updates = {}
    prompt_lower = prompt.lower()
    
    # Graph type changes
    if any(word in prompt_lower for word in ["bar chart", "bar graph", "switch to bar", "change to bar"]):
        updates["graph_type"] = "bar"
    elif any(word in prompt_lower for word in ["line chart", "line graph", "switch to line", "change to line"]):
        updates["graph_type"] = "line"
    elif any(word in prompt_lower for word in ["pie chart", "pie graph", "switch to pie", "change to pie"]):
        updates["graph_type"] = "pie"
    elif any(word in prompt_lower for word in ["scatter plot", "scatter chart", "switch to scatter", "change to scatter"]):
        updates["graph_type"] = "scatter"
    elif any(word in prompt_lower for word in ["area chart", "area graph", "switch to area", "change to area"]):
        updates["graph_type"] = "area"
    elif any(word in prompt_lower for word in ["histogram", "switch to histogram", "change to histogram"]):
        updates["graph_type"] = "histogram"
    elif any(word in prompt_lower for word in ["candlestick", "candlestick chart", "candlestick graph", "switch to candlestick", "change to candlestick"]):
        updates["graph_type"] = "candlestick"
    elif any(word in prompt_lower for word in ["boxplot", "box plot", "boxplot chart", "boxplot graph", "box plot chart", "box plot graph", "switch to boxplot", "switch to box plot", "change to boxplot", "change to box plot", "box"]):
        updates["graph_type"] = "boxplot"

    # X label changes
    x_patterns = [
        r"x.?label\s+(?:to|as|change\s+to)\s+['\"]?([^'\"]+)['\"]?",
        r"x.?axis\s+(?:to|as|change\s+to)\s+['\"]?([^'\"]+)['\"]?",
        r"horizontal\s+label\s+(?:to|as|change\s+to)\s+['\"]?([^'\"]+)['\"]?"
    ]
    for pattern in x_patterns:
        match = re.search(pattern, prompt_lower)
        if match:
            updates["x_label"] = match.group(1).strip()
            break

    # Y label changes
    y_patterns = [
        r"y.?label\s+(?:to|as|change\s+to)\s+['\"]?([^'\"]+)['\"]?",
        r"y.?axis\s+(?:to|as|change\s+to)\s+['\"]?([^'\"]+)['\"]?",
        r"vertical\s+label\s+(?:to|as|change\s+to)\s+['\"]?([^'\"]+)['\"]?"
    ]
    for pattern in y_patterns:
        match = re.search(pattern, prompt_lower)
        if match:
            updates["y_label"] = match.group(1).strip()
            break

    # Title changes
    title_patterns = [
        r"title\s+(?:to|as|change\s+to)\s+['\"]?([^'\"]+)['\"]?",
        r"graph\s+title\s+(?:to|as|change\s+to)\s+['\"]?([^'\"]+)['\"]?",
        r"chart\s+title\s+(?:to|as|change\s+to)\s+['\"]?([^'\"]+)['\"]?",
        r"rename\s+(?:title|graph)\s+to\s+['\"]?([^'\"]+)['\"]?"
    ]
    for pattern in title_patterns:
        match = re.search(pattern, prompt_lower)
        if match:
            updates["title"] = match.group(1).strip()
            updates["legend_label"] = match.group(1).strip()
            break

    # Color changes
    color_patterns = [
        r"color\s+(?:to|as|change\s+to)\s+['\"]?([#\w]+)['\"]?",
        r"colour\s+(?:to|as|change\s+to)\s+['\"]?([#\w]+)['\"]?",
        r"make\s+(?:it\s+)?(red|blue|green|yellow|purple|orange|pink|brown|black|white|gray|grey)",
        r"change\s+color\s+to\s+(red|blue|green|yellow|purple|orange|pink|brown|black|white|gray|grey)"
    ]
    
    color_map = {
        "red": "#ff0000",
        "blue": "#0000ff", 
        "green": "#00ff00",
        "yellow": "#ffff00",
        "purple": "#800080",
        "orange": "#ffa500",
        "pink": "#ffc0cb",
        "brown": "#a52a2a",
        "black": "#000000",
        "white": "#ffffff",
        "gray": "#808080",
        "grey": "#808080"
    }
    
    for pattern in color_patterns:
        match = re.search(pattern, prompt_lower)
        if match:
            color_value = match.group(1)
            if color_value.startswith("#"):
                updates["color"] = color_value
            else:
                updates["color"] = color_map.get(color_value.lower(), "#3366cc")
            break

    # Multiple colors for different categories
    if "different colors" in prompt_lower or "multiple colors" in prompt_lower:
        updates["use_multiple_colors"] = True
        updates["colors"] = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]

    return updates

def is_customization_prompt(prompt: str):
    """
    Check if the prompt is a customization request
    """
    customization_keywords = [
        "change", "modify", "update", "switch", "rename", "color", "colour",
        "title", "label", "axis", "make", "set", "customize", "to"
    ]
    
    prompt_lower = prompt.lower()
    
    # Check for specific patterns that indicate customization
    if any(keyword in prompt_lower for keyword in customization_keywords):
        # Additional check for "to" keyword which is common in customization
        if " to " in prompt_lower:
            return True
        # Check for specific customization patterns
        if any(pattern in prompt_lower for pattern in ["change", "make", "switch", "rename"]):
            return True
    
    return False

def generate_customization_response(updates: dict, current_state: dict):
    """
    Generate a response message for customization changes
    """
    changes = []
    
    if "graph_type" in updates:
        changes.append(f"Graph type changed to {updates['graph_type']}")
    
    if "x_label" in updates:
        changes.append(f"X-axis label changed to '{updates['x_label']}'")
    
    if "y_label" in updates:
        changes.append(f"Y-axis label changed to '{updates['y_label']}'")
    
    if "title" in updates:
        changes.append(f"Title changed to '{updates['title']}'")
    
    if "color" in updates:
        changes.append(f"Color changed to {updates['color']}")
    
    if "use_multiple_colors" in updates:
        changes.append("Applied multiple colors for different categories")
    
    if changes:
        return f"✅ Customization applied: {', '.join(changes)}. The graph has been updated with your changes."
    else:
        return "No customization changes detected. Please specify what you'd like to change (e.g., 'change title to Sales Data', 'make it red', 'switch to bar chart')."