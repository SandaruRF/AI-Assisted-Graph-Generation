from pyod.models.iforest import IForest
from pyod.models.hbos import HBOS
from pyod.models.knn import KNN
from pyod.models.auto_encoder import AutoEncoder
from pyod.models.lof import LOF
from pyod.models.ocsvm import OCSVM
from langchain.agents import tool
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Any
import random

@tool
def detect_anomalies_iforest(data: List[Dict[str, Any]]) -> str:
    """
    Detects anomalies using PyOD's Isolation Forest.
    Input: List of dicts with numerical and temporal column.
    Returns: List of outlier months
    """
    df = pd.DataFrame(data)

    numerical_column = df.columns[0]
    temporal_column = df.columns[1]
    df['ds'] = pd.to_datetime(df[temporal_column])
    df['y'] = df[numerical_column]

    contamination = min(0.1, max(0.02, 3 / len(df)))
    model = IForest(contamination=contamination)
    model.fit(df[['y']].values)
    
    df['anomaly'] = model.predict(df[['y']].values)
    df['score'] = model.decision_function(df[['y']].values)

    df = df.sort_values(by='ds')
    outliers = df[df['anomaly'] == 1][['ds', 'y', 'score']].to_dict(orient='records')

    return f"PyOD Isolation Forest detected {len(outliers)} anomalies:\n{outliers}"


@tool
def detect_anomalies_hbos(data: List[Dict[str, Any]]) -> str:
    """
    Detect anomalies using PyOD's HBOS (Histogram-Based Outlier Score).
    Input: List of dicts with at least one numerical column.
    Returns: Detected anomalies with their scores.
    """
    df = pd.DataFrame(data)
    
    if len(df.columns) < 1:
        return "Error: Input must contain at least one numerical column."
    
    numerical_column = df.columns[0]
    df['y'] = df[numerical_column]

    model = HBOS()
    model.fit(df[['y']].values)

    df['anomaly'] = model.predict(df[['y']].values)  # 1 = anomaly, 0 = normal
    df['score'] = model.decision_function(df[['y']].values)

    outliers = df[df['anomaly'] == 1][[numerical_column, 'score']].to_dict(orient='records')
    return f"PyOD HBOS detected {len(outliers)} anomalies:\n{outliers}"


@tool
def detect_anomalies_knn(data: List[Dict[str, Any]]) -> str:
    """
    Detect anomalies using PyOD's KNN (k-Nearest Neighbors).
    Input: List of dicts with at least one numerical column.
    Returns: Detected anomalies with their anomaly scores.
    """
    df = pd.DataFrame(data)
    
    if len(df.columns) < 1:
        return "Error: Input must contain at least one numerical column."
    
    numerical_column = df.columns[0]
    df['y'] = df[numerical_column]

    # Initialize KNN model, tune n_neighbors as needed (default 5)
    model = KNN()
    model.fit(df[['y']].values)

    df['anomaly'] = model.predict(df[['y']].values)  # 1 = anomaly, 0 = normal
    df['score'] = model.decision_function(df[['y']].values)

    outliers = df[df['anomaly'] == 1][[numerical_column, 'score']].to_dict(orient='records')
    return f"PyOD KNN detected {len(outliers)} anomalies:\n{outliers}"


@tool
def detect_anomalies_autoencoder(data: List[Dict[str, Any]]) -> str:
    """
    Detect anomalies using PyOD's AutoEncoder.
    Input: List of dicts with at least one numerical column.
    Returns: Detected anomalies with their reconstruction error scores.
    """
    df = pd.DataFrame(data)
    
    if len(df.columns) < 1:
        return "Error: Input must contain at least one numerical column."
    if df.shape[0] < 32:
        return "Error: AutoEncoder requires at least 50 samples. Use a classical model for small datasets."
    
    numerical_column = df.columns[0]
    df['y'] = df[numerical_column]

    model = AutoEncoder(epoch_num=30, contamination=0.1)
    model.fit(df[['y']].values)

    df['anomaly'] = model.predict(df[['y']].values)  # 1 = anomaly, 0 = normal
    df['score'] = model.decision_function(df[['y']].values)

    outliers = df[df['anomaly'] == 1][[numerical_column, 'score']].to_dict(orient='records')
    return f"PyOD AutoEncoder detected {len(outliers)} anomalies:\n{outliers}"


@tool
def detect_anomalies_lof(data: List[Dict[str, Any]]) -> str:
    """
    Detect anomalies using PyOD's Local Outlier Factor (LOF).
    Input: List of dicts with at least one numerical column.
    Returns: Detected anomalies with their LOF scores.
    """
    df = pd.DataFrame(data)
    
    if len(df.columns) < 1:
        return "Error: Input must contain at least one numerical column."
    
    numerical_column = df.columns[0]
    df['y'] = df[numerical_column]

    model = LOF()
    model.fit(df[['y']].values)

    df['anomaly'] = model.predict(df[['y']].values)  # 1 = anomaly, 0 = normal
    df['score'] = model.decision_function(df[['y']].values)

    outliers = df[df['anomaly'] == 1][[numerical_column, 'score']].to_dict(orient='records')
    return f"LOF detected {len(outliers)} anomalies:\n{outliers}"


@tool
def detect_anomalies_ocsvm(data: List[Dict[str, Any]]) -> str:
    """
    Detect anomalies using PyOD's One-Class SVM.
    Input: List of dicts with at least one numerical column.
    Returns: Detected anomalies with their scores.
    """
    df = pd.DataFrame(data)
    
    if len(df.columns) < 1:
        return "Error: Input must contain at least one numerical column."
    
    numerical_column = df.columns[0]
    df['y'] = df[numerical_column]

    model = OCSVM(kernel='rbf', nu=0.05)  # nu ~ contamination, 'rbf' captures nonlinear boundaries
    model.fit(df[['y']].values)

    df['anomaly'] = model.predict(df[['y']].values)  # 1 = anomaly, 0 = normal
    df['score'] = model.decision_function(df[['y']].values)

    outliers = df[df['anomaly'] == 1][[numerical_column, 'score']].to_dict(orient='records')
    return f"One-Class SVM detected {len(outliers)} anomalies:\n{outliers}"


# if __name__ == "__main__":
#     data_with_outliers = [
#         {"MonthlyRevenue": 42.13, "Month": "2024-01"},
#         {"MonthlyRevenue": 39.88, "Month": "2024-02"},
#         {"MonthlyRevenue": 41.23, "Month": "2024-03"},
#         {"MonthlyRevenue": 44.01, "Month": "2024-04"},
#         {"MonthlyRevenue": 38.95, "Month": "2024-05"},
#         {"MonthlyRevenue": 2800.00, "Month": "2024-06"},  # Outlier
#         {"MonthlyRevenue": 40.62, "Month": "2024-07"},
#         {"MonthlyRevenue": 39.45, "Month": "2024-08"},
#         {"MonthlyRevenue": 42.90, "Month": "2024-09"},
#         {"MonthlyRevenue": 37.85, "Month": "2024-10"},
#         {"MonthlyRevenue": 0.75, "Month": "2024-11"},  # Outlier
#         {"MonthlyRevenue": 41.74, "Month": "2024-12"},
#         {"MonthlyRevenue": 39.33, "Month": "2025-01"},
#         {"MonthlyRevenue": 43.67, "Month": "2025-02"},
#         {"MonthlyRevenue": 3100.55, "Month": "2025-03"},  # Outlier
#     ]

#     result = detect_anomalies_autoencoder.invoke({
#         "data": data_with_outliers
#     })
#     print(result)

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

    result = detect_anomalies_ocsvm.invoke({
        "data": data_with_outliers
    })
    print(result)