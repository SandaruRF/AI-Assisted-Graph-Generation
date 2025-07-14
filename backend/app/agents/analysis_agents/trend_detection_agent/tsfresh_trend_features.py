from typing import List, Dict, Any
from langchain.tools import tool
import pandas as pd
from tsfresh import extract_features
from tsfresh.utilities.dataframe_functions import impute

custom_fc_parameters = {
    "linear_trend": [{"attr": "slope"}],
    "agg_linear_trend": [{"attr": "slope", "chunk_len": 5, "f_agg": "mean"}],
    "autocorrelation": [{"lag": 1}, {"lag": 2}],
    "partial_autocorrelation": [{"lag": 1}, {"lag": 2}],
    "mean": None,
    "variance": None,
    "skewness": None
}

@tool
def tsfresh_feature_extraction(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Extract statistical features from time series data using TSFresh.
    
    :param data: List of dictionaries with at least two keys: time and value.
    :return: A dictionary with extracted statistical features.
    """
    if not data:
        return {"error": "Empty data list."}

    first_item = data[0]
    keys = list(first_item.keys())
    if len(keys) < 2:
        return {"error": "Data must contain at least two keys (e.g., time and value)."}

    time_key = keys[1] 
    value_key = keys[0]  

    df = pd.DataFrame(data)
    df['id'] = 0  # Single time series (same ID)
    df = df.rename(columns={value_key: 'value', time_key: 'time'})
    
    # Extract features
    features = extract_features(
        df,
        column_id="id",
        column_sort="time",
        default_fc_parameters=custom_fc_parameters,
        impute_function=None  # optional: disables automatic imputation
    )
    impute(features)  # Handle missing/NaN values

    # Convert to dictionary
    features_dict = features.iloc[0].dropna().to_dict()
    
    return features_dict


if __name__ == "__main__":
    data = [
        {"TotalInvoiceValue": 22.77, "InvoiceMonth": "2024-05"},
        {"TotalInvoiceValue": 37.62, "InvoiceMonth": "2024-06"},
        {"TotalInvoiceValue": 39.62, "InvoiceMonth": "2024-07"},
        {"TotalInvoiceValue": 47.62, "InvoiceMonth": "2024-08"},
        {"TotalInvoiceValue": 46.71, "InvoiceMonth": "2024-09"},
        {"TotalInvoiceValue": 42.62, "InvoiceMonth": "2024-10"},
    ]

    result = tsfresh_feature_extraction.invoke({
        "data": data
    })
    print(result)

