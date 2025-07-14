from typing import List, Dict, Any
from langchain.tools import tool
import stumpy
import numpy as np

@tool
def stumpy_pattern_search(data: List[Dict[str, Any]], window_size: int = 3) -> Dict:
    """
    Detect motifs and discords in time series data using STUMPY.
    :param data: List of dicts with time series entries.
    :param window_size: The size of the sliding window.
    :return: Dict with motif and discord indices.
    """
    if not data:
        return {"error": "Empty data list."}

    first_key = list(data[0].keys())[0] 
    series = [point[first_key] for point in data]
    series_np = np.array(series)
    
    if len(series_np) < window_size * 2:
        return {"error": "Not enough data points for the selected window size."}
    
    # Compute matrix profile
    matrix_profile = stumpy.stump(series_np, m=window_size)
    
    motif_idx = int(np.argmin(matrix_profile[:, 0]))
    discord_idx = int(np.argmax(matrix_profile[:, 0]))
    
    return {
        "motif_indices": [motif_idx, motif_idx + window_size],
        "discord_index": discord_idx,
        "motif_values": series_np[motif_idx:motif_idx + window_size].tolist(),
        "discord_value": series_np[discord_idx]
    }


if __name__ == "__main__": 
    data = [{'TotalInvoiceValue': 22.77, 'InvoiceMonth': '2024-05'}, 
            {'TotalInvoiceValue': 37.62, 'InvoiceMonth': '2024-06'}, 
            {'TotalInvoiceValue': 39.62, 'InvoiceMonth': '2024-07'}, 
            {'TotalInvoiceValue': 47.62, 'InvoiceMonth': '2024-08'}, 
            {'TotalInvoiceValue': 46.71, 'InvoiceMonth': '2024-09'}, 
            {'TotalInvoiceValue': 42.62, 'InvoiceMonth': '2024-10'}, 
            {'TotalInvoiceValue': 37.62, 'InvoiceMonth': '2024-11'}, 
            {'TotalInvoiceValue': 37.62, 'InvoiceMonth': '2024-12'}, 
            {'TotalInvoiceValue': 37.62, 'InvoiceMonth': '2025-01'}, 
            {'TotalInvoiceValue': 27.72, 'InvoiceMonth': '2025-02'}, 
            {'TotalInvoiceValue': 37.62, 'InvoiceMonth': '2025-03'}, 
            {'TotalInvoiceValue': 33.66, 'InvoiceMonth': '2025-04'}, 
            {'TotalInvoiceValue': 37.62, 'InvoiceMonth': '2025-05'}, 
            {'TotalInvoiceValue': 37.62, 'InvoiceMonth': '2025-06'}, 
            {'TotalInvoiceValue': 37.62, 'InvoiceMonth': '2025-07'}, 
            {'TotalInvoiceValue': 37.62, 'InvoiceMonth': '2025-08'}, 
            {'TotalInvoiceValue': 37.62, 'InvoiceMonth': '2025-09'}, 
            {'TotalInvoiceValue': 37.62, 'InvoiceMonth': '2025-10'}, 
            {'TotalInvoiceValue': 49.62, 'InvoiceMonth': '2025-11'}, 
            {'TotalInvoiceValue': 38.62, 'InvoiceMonth': '2025-12'}]

    result = stumpy_pattern_search.invoke({
        "data": data,
        "window_size": 6
    })
    print(result)