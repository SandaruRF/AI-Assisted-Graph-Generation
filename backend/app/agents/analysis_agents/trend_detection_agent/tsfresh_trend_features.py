from typing import List, Dict, Any
from langchain_core.tools import tool
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

    print("==================================================")
    print(f"TS Fresh Data:")
    print(data)
    print("==================================================")
    first_item = data[0]
    keys = list(first_item.keys())
    if len(keys) < 2:
        return {"error": "Data must contain at least two keys (e.g., time and value)."}

    time_key = keys[1] 
    value_key = keys[0]  

    try:
        df = pd.DataFrame(data)
        df['id'] = 0  # Single time series (same ID)
        
        # **CRITICAL FIX: Ensure proper data types**
        # Convert value column to numeric
        df[value_key] = pd.to_numeric(df[value_key], errors='coerce')
        
        # Convert time column to numeric or datetime
        if df[time_key].dtype == 'object':  # String column
            # Try to convert to datetime first, then to numeric
            try:
                df[time_key] = pd.to_datetime(df[time_key])
                df[time_key] = df[time_key].astype(int) // 10**9  # Convert to timestamp
            except:
                # If datetime conversion fails, try numeric conversion
                df[time_key] = pd.to_numeric(df[time_key], errors='coerce')
        
        # Remove rows with NaN values
        df = df.dropna()
        
        if df.empty:
            return {"error": "No valid numeric data found after type conversion."}
        
        df = df.rename(columns={value_key: 'value', time_key: 'time'})
    
        # Extract features
        features = extract_features(
                df,
                column_id="id",
                column_sort="time",
                column_value="value",  # **ADD THIS LINE**
                default_fc_parameters=custom_fc_parameters,
                impute_function=None
            )
            
        if features.empty:
            return {"error": "No features could be extracted from the data."}
        
        impute(features)  # Handle missing/NaN values
        
        # Convert to dictionary
        features_dict = features.iloc[0].dropna().to_dict()
        
        return features_dict
            
    except Exception as e:
        return {"error": f"TSFresh extraction failed: {str(e)}"}


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

