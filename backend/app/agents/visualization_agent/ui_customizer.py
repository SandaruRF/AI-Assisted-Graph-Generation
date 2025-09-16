# AI-Assisted-Graph-Generation/backend/app/agents/visualization_agent/ui_customizer.py

import json
from typing import Any, Dict, Optional

import google.generativeai as genai
from pydantic import BaseModel, Field, ValidationError

from app.config import settings
from app.agents.intent_agent.intent_classifier import IntentClassifier
from app.utils.logging import logger


class AgentCustomizationSpec(BaseModel):
    """
    Minimal, safe customization schema aligned with prior expectations.
    """

    graph_type: Optional[str] = Field(default=None)
    title: Optional[str] = Field(default=None)
    x_label: Optional[str] = Field(default=None)
    y_label: Optional[str] = Field(default=None)
    color: Optional[str] = Field(default=None)
   


def _build_prompt(user_prompt: str, current_state: Dict[str, Any]) -> str:
    allowed_graph_types = [
        "bar",
        "line",
        "pie",
        "scatter",
        "area",
        "histogram",
        "candlestick",
        "boxplot",
    ]

    schema_hint = {
        "graph_type": "one of: " + ", ".join(allowed_graph_types),
        "title": "string",
        "x_label": "string",
        "y_label": "string",
        "color": "hex like #3366cc or color name"
    }

    return f"""
You are a chart customization agent. Convert the user's instruction into a JSON object
that matches this schema (keys are optional; omit unknowns):
{json.dumps(schema_hint)}

Rules:
- Output JSON only. No prose, no comments, no markdown.
- If a requested option is incompatible or unclear, omit it.
- Use lowercase graph_type values exactly as listed.

Current chart state (may be partial):
{json.dumps(current_state, default=str)}

User instruction:
{user_prompt}
"""


def _check_compatibility(spec: AgentCustomizationSpec, current_state: Dict[str, Any]) -> AgentCustomizationSpec:
    allowed_graph_types = {"bar", "line", "pie", "scatter", "area", "histogram", "candlestick", "boxplot"}
    if spec.graph_type and spec.graph_type not in allowed_graph_types:
        logger.warning(f"CustomizationAgent: invalid graph_type '{spec.graph_type}', dropping.")
        spec.graph_type = None

    if spec.color:
        spec.color = spec.color.strip()
    return spec


class CustomizationAgent:
    def __init__(self) -> None:
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash")

    def apply(self, prompt: str, current_state: Dict[str, Any]) -> Dict[str, Any]:
        message = _build_prompt(prompt, current_state)
        response = self.model.generate_content(message)
        raw_text = response.text.strip() if hasattr(response, "text") else "{}"
        cleaned = raw_text.replace("```json", "").replace("```", "").strip()

        try:
            parsed = json.loads(cleaned or "{}")
        except json.JSONDecodeError as e:
            logger.error(f"CustomizationAgent JSON parse error: {e}\nRaw: {raw_text}")
            raise

        try:
            spec = AgentCustomizationSpec(**parsed)
        except ValidationError as e:
            logger.error(f"CustomizationAgent validation error: {e}")
            raise

        spec = _check_compatibility(spec, current_state)
        return {k: v for k, v in spec.model_dump().items() if v is not None}

    def summarize(self, updates: Dict[str, Any], current_state: Dict[str, Any]) -> str:
        """
        Generate a concise, user-facing summary of applied customization updates.
        Returns a single sentence without markdown or extra formatting.
        """
        instruction = {
            "task": "Summarize customization updates concisely",
            "constraints": [
                "One sentence",
                "No markdown, no bullets",
                "Use plain language",
            ],
            "updates": updates,
            "current_state": current_state,
        }
        prompt = (
            "You are a helpful assistant. Given a JSON object of customization updates and the current chart state, "
            "produce a single concise sentence summarizing what changed. Do not include markdown."
            f"\n\nINPUT:\n{json.dumps(instruction)}\n\nOUTPUT:"
        )
        response = self.model.generate_content(prompt)
        text = (response.text or "").strip() if hasattr(response, "text") else ""
        # Ensure it's one line and short
        return " ".join(text.split())[:300] or "Customization updated."


_customization_agent: CustomizationAgent | None = None
_intent_classifier: IntentClassifier | None = None


def _get_agent() -> CustomizationAgent | None:
    global _customization_agent
    if _customization_agent is None:
        try:
            _customization_agent = CustomizationAgent()
        except Exception as e:
            logger.error(f"Failed to initialize CustomizationAgent: {e}")
            return None
    return _customization_agent


def _get_intent_classifier() -> IntentClassifier | None:
    global _intent_classifier
    if _intent_classifier is None:
        try:
            _intent_classifier = IntentClassifier()
        except Exception as e:
            logger.error(f"Failed to initialize IntentClassifier: {e}")
            return None
    return _intent_classifier


def parse_customization_prompt(prompt: str, current_state: dict = None):
    """
    Agent-only customization parsing. Returns a dict of updates.

    Raises:
        RuntimeError: if the customization agent cannot be initialized or fails to parse.
    """
    agent = _get_agent()
    if agent is None:
        raise RuntimeError("CustomizationAgent is unavailable")
    try:
        agent_updates = agent.apply(prompt, current_state or {})
        return agent_updates
    except Exception as e:
        logger.error(f"CustomizationAgent error: {e}")
        raise RuntimeError("Failed to parse customization via agent")


def is_customization_prompt(prompt: str):
    """
    Use the global intent classifier to detect whether this is a customization intent.
    Falls back to False if classifier is unavailable or low confidence.
    """
    classifier = _get_intent_classifier()
    if classifier is None:
        return False
    try:
        result = classifier.classify_intent(prompt) or {}
        intents = result.get("intent", [])
        confidence = result.get("confidence", 0.0)
        if isinstance(intents, str):
            intents = [intents]
        return ("customization" in [i.lower() for i in intents]) and (confidence >= 0.5)
    except Exception as e:
        logger.error(f"Intent classification failed in is_customization_prompt: {e}")
    return False


def generate_customization_response(updates: dict, current_state: dict):
    """
    Agent-only summary for customization changes.

    Raises:
        RuntimeError: if no agent is available or summarization fails.
    """
    agent = _get_agent()
    if agent is None:
        raise RuntimeError("CustomizationAgent is unavailable for summary generation")
    if not updates:
        return "No customization changes detected."
    try:
        summary = agent.summarize(updates, current_state or {})
        if not summary:
            raise RuntimeError("Empty summary from agent")
        return summary
    except Exception as e:
        logger.error(f"CustomizationAgent summarize error: {e}")
        raise RuntimeError("Failed to generate customization summary via agent")
