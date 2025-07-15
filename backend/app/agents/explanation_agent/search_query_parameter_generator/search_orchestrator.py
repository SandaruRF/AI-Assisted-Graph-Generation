class SearchOrchestrator:
    """Orchestrates the entire search process with automatic query and parameter generation."""
    
    def __init__(self):
        self.query_generator = IntelligentQueryGenerator()
        self.parameter_optimizer = ParameterOptimizer()
        self.advanced_query_gen = AdvancedQueryGenerator(self.query_generator.llm)
        
    async def execute_intelligent_search(self, 
                                       insights: List[str], 
                                       user_prompt: str,
                                       domain_context: str = None) -> Dict[str, Any]:
        """Execute comprehensive search with automatic query and parameter generation."""
        
        # Generate search strategy
        strategy = await self.query_generator.generate_search_strategy(
            insights, user_prompt, domain_context
        )
        
        search_results = {}
        execution_plan = []
        
        # Process each insight's search strategy
        for search_plan in strategy["search_strategy"]:
            tool_name = search_plan["tool_name"]
            insight = search_plan["insight"]
            base_queries = search_plan["queries"]
            base_parameters = search_plan["parameters"]
            
            # Optimize parameters
            optimized_params = self.parameter_optimizer.optimize_parameters(
                tool_name, insight, user_prompt, base_parameters
            )
            
            # Generate additional optimized queries
            enhanced_queries = await self.advanced_query_gen.generate_optimized_queries(
                insight, tool_name, user_prompt, num_queries=2
            )
            
            # Combine base and enhanced queries
            all_queries = base_queries + enhanced_queries
            
            # Execute search
            tool_function = self.query_generator.search_tools.get(tool_name)
            if tool_function:
                try:
                    # Execute search with optimized parameters
                    if tool_name == "tavily_multi_query_search":
                        result = await tool_function.ainvoke({
                            "queries": all_queries,
                            **optimized_params
                        })
                    else:
                        # For single query tools, use the first optimized query
                        result = await tool_function.ainvoke({
                            "query": all_queries[0],
                            **optimized_params
                        })
                    
                    search_results[insight] = {
                        "tool_used": tool_name,
                        "queries": all_queries,
                        "parameters": optimized_params,
                        "result": result,
                        "reasoning": search_plan["reasoning"]
                    }
                    
                    execution_plan.append({
                        "insight": insight,
                        "tool": tool_name,
                        "status": "success",
                        "queries_used": len(all_queries)
                    })
                    
                except Exception as e:
                    search_results[insight] = {
                        "tool_used": tool_name,
                        "error": str(e),
                        "queries": all_queries,
                        "parameters": optimized_params
                    }
                    
                    execution_plan.append({
                        "insight": insight,
                        "tool": tool_name,
                        "status": "error",
                        "error": str(e)
                    })
        
        return {
            "search_results": search_results,
            "execution_plan": execution_plan,
            "strategy": strategy,
            "total_searches": len(search_results)
        }
