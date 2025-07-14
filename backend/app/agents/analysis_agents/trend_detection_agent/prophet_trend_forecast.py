from prophet import Prophet
import pandas as pd
import matplotlib.pyplot as plt
from langchain.agents import tool
from typing import List, Dict, Any
import tempfile

@tool
def prophet_forecast(data: List[Dict[str, Any]], forecast_period: int = 6, holiday_country: str = "US") -> str:
    """
    Forecasts future values using Facebook Prophet.
    Args:
        data: List of dictionaries with numerical and temporal column.
        forecast_period: Number of days to forecast.
        holiday_country: Optional, country code for holidays (e.g., "US", "UK").
    Returns:
        A string summarizing the forecast with optional plot or file output.
    """

    df = pd.DataFrame(data)
    df.rename(columns={df.columns[0]: 'y', df.columns[1]: 'ds'}, inplace=True)
    df['ds'] = pd.to_datetime(df['ds'])

    model = Prophet()
    if holiday_country:
        try:
            model.add_country_holidays(country_name=holiday_country)
        except Exception as e:
            return f"Warning: Holidays not added. Reason: {str(e)}"

    model.fit(df)
    future = model.make_future_dataframe(periods=forecast_period, freq="MS") # Monthtly frequency
    forecast = model.predict(future)

    # Save and return the plot as an image path or base64
    fig = model.plot(forecast)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
        fig.savefig(tmp.name)
        return f"Forecast completed. Plot saved at: {tmp.name}"


if __name__ == "__main__":
    data = [
        {'MonthlySales': 15.20, 'Month': '2023-01'},
        {'MonthlySales': 18.45, 'Month': '2023-02'},
        {'MonthlySales': 21.00, 'Month': '2023-03'},
        {'MonthlySales': 25.60, 'Month': '2023-04'},
        {'MonthlySales': 30.10, 'Month': '2023-05'},
        {'MonthlySales': 28.90, 'Month': '2023-06'},
        {'MonthlySales': 35.00, 'Month': '2023-07'},
        {'MonthlySales': 33.50, 'Month': '2023-08'},
        {'MonthlySales': 29.80, 'Month': '2023-09'},
        {'MonthlySales': 26.40, 'Month': '2023-10'},
        {'MonthlySales': 24.00, 'Month': '2023-11'},
        {'MonthlySales': 20.50, 'Month': '2023-12'},
        {'MonthlySales': 22.30, 'Month': '2024-01'},
        {'MonthlySales': 27.80, 'Month': '2024-02'},
        {'MonthlySales': 32.40, 'Month': '2024-03'},
        {'MonthlySales': 36.10, 'Month': '2024-04'},
        {'MonthlySales': 39.75, 'Month': '2024-05'},
        {'MonthlySales': 41.30, 'Month': '2024-06'},
        {'MonthlySales': 43.00, 'Month': '2024-07'},
        {'MonthlySales': 40.20, 'Month': '2024-08'}
    ]
    
    result = prophet_forecast.invoke({
        "data": data,
        "forecast_period": 6,
        "holiday_country": "US"
    })
    print(result)