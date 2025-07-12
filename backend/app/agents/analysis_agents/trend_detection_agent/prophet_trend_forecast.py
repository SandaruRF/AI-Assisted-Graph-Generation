from prophet import Prophet
import pandas as pd
import matplotlib.pyplot as plt
from langchain_core.tools import tool
from typing import List, Dict, Any
import tempfile

@tool
def prophet_forecast(data: List[Dict[str, Any]], forecast_period: int = 6, holiday_country: str = "US") -> Dict[str, Any]:
    """
    Forecasts future values using Facebook Prophet.
    Args:
        data: List of dictionaries with numerical and temporal column.
        forecast_period: Number of periods to forecast.
        holiday_country: Optional, country code for holidays (e.g., "US", "UK").
    Returns:
        Dictionary with forecast results and metadata.
    """
    
    if not data or len(data) < 2:
        return {"error": "Need at least 2 data points for forecasting"}
    
    print("==================================================")
    print(f"Prophet Data:")
    print(data)
    print("==================================================")
    
    try:
        df = pd.DataFrame(data)
        
        # Validate we have at least 2 columns
        if len(df.columns) < 2:
            return {"error": "Data must have at least 2 columns (value and date)"}
        
        df.rename(columns={df.columns[0]: 'y', df.columns[1]: 'ds'}, inplace=True)
        
        # **Enhanced date parsing with better error handling**
        try:
            # Handle YYYY-MM format specifically
            if df['ds'].dtype == 'object' and df['ds'].str.match(r'^\d{4}-\d{2}$').all():
                df['ds'] = df['ds'] + '-01'  # Add day for monthly data
            df['ds'] = pd.to_datetime(df['ds'])
        except Exception as e:
            return {"error": f"Could not parse dates: {str(e)}"}
        
        # Ensure numeric values
        df['y'] = pd.to_numeric(df['y'], errors='coerce')
        df = df.dropna()
        
        if len(df) < 2:
            return {"error": "Insufficient valid data after cleaning"}
            
        # **Detect data frequency automatically**
        date_diff = df['ds'].diff().median()
        if date_diff.days >= 25:  # Monthly data
            freq = "MS"
            weekly_seasonality = False
            daily_seasonality = False
        else:
            freq = "D"
            weekly_seasonality = True
            daily_seasonality = True
        
        # **Initialize Prophet with appropriate seasonality settings**
        model = Prophet(
            weekly_seasonality=weekly_seasonality,
            daily_seasonality=daily_seasonality,
            yearly_seasonality=True
        )
        
        # Add holidays if specified
        if holiday_country:
            try:
                model.add_country_holidays(country_name=holiday_country)
            except Exception as e:
                print(f"Warning: Could not add holidays for {holiday_country}: {e}")
        
        model.fit(df)
        
        # **Create future dataframe with detected frequency**
        future = model.make_future_dataframe(periods=forecast_period, freq=freq)
        forecast = model.predict(future)
        
        # **Return comprehensive results instead of just plot path**
        forecast_data = forecast.tail(forecast_period)
        
        result = {
            "forecast_values": forecast_data['yhat'].tolist(),
            "forecast_dates": forecast_data['ds'].dt.strftime('%Y-%m-%d').tolist(),
            "lower_bound": forecast_data['yhat_lower'].tolist(),
            "upper_bound": forecast_data['yhat_upper'].tolist(),
            "trend": forecast['trend'].iloc[-1],
            "seasonal_components": {
                "yearly": forecast.get('yearly', pd.Series([0])).iloc[-1]
            },
            "model_performance": {
                "data_points": len(df),
                "frequency": freq,
                "seasonality_components": {
                    "weekly": weekly_seasonality,
                    "daily": daily_seasonality,
                    "yearly": True
                }
            }
        }
        
        # **Optional: Save plot if needed**
        try:
            fig = model.plot(forecast)
            with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
                fig.savefig(tmp.name, dpi=150, bbox_inches='tight')
                result["plot_path"] = tmp.name
            plt.close(fig)
        except Exception as e:
            result["plot_error"] = f"Could not generate plot: {str(e)}"
        
        return result
        
    except Exception as e:
        return {"error": f"Prophet forecasting failed: {str(e)}"}


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