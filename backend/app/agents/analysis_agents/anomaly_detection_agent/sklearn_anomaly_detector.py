from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler
from langchain.agents import tool
import pandas as pd
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random

@tool
def detect_anomalies_sklearn(data: List[Dict[str, Any]]) -> str:
    """
    Detects anomalies using sklearn's One-Class SVM.
    Returns: List of outlier months
    """
    df = pd.DataFrame(data)
    
    numerical_column = df.columns[0]
    temporal_column = df.columns[1]
    df['ds'] = pd.to_datetime(df[temporal_column])
    df['y'] = df[numerical_column]

    y = df['y'].values.reshape(-1, 1)
    
    # Scale data
    scaler = StandardScaler()
    y_scaled = scaler.fit_transform(y)
    
    # Dynamically set nu
    n = len(y)
    nu = min(max(5 / n, 0.05), 0.2)
    
    clf = OneClassSVM(nu=nu, kernel='rbf', gamma="scale")
    clf.fit(y_scaled)
    preds = clf.predict(y_scaled)
    df['anomaly'] = [1 if p == -1 else 0 for p in preds]

    outliers = df[df['anomaly'] == 1][['ds', 'y']].to_dict(orient='records')
    return f"Sklearn One-Class SVM found {len(outliers)} anomalies: {outliers}"


if __name__ == "__main__":
    # Generate 32 normal data points
    base_date = datetime(2020, 1, 1)
    data_with_outliers = []
    for i in range(29):
        # Simulate normal monthly revenue between 38 and 45
        revenue = round(random.uniform(38, 45), 2)
        date = (base_date + timedelta(days=30 * i)).strftime("%Y-%m")
        data_with_outliers.append({"MonthlyRevenue": revenue, "Month": date})

    # Add 3 outliers
    data_with_outliers.append({"MonthlyRevenue": 2800.00, "Month": "2024-06"})
    data_with_outliers.append({"MonthlyRevenue": 0.75, "Month": "2024-11"})
    data_with_outliers.append({"MonthlyRevenue": 3100.55, "Month": "2025-03"})

    # Now data_with_outliers has 55 rows

    result = detect_anomalies_sklearn.invoke({
        "data": data_with_outliers
    })
    print(result)