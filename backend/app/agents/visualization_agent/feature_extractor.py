from datetime import datetime, date, time
from dateutil.parser import parse

TEMPORAL_KEYWORDS = ['date', 'time', 'year', 'month', 'day', 'timestamp']

dataset = [
    { "year": 2019, "region": "North America", "avgRevenue": 120000, "customerCount": 4000 },
    { "year": 2019, "region": "Europe", "avgRevenue": 95000, "customerCount": 3500 },
    { "year": 2019, "region": "Asia", "avgRevenue": 80000, "customerCount": 5000 },

    { "year": 2020, "region": "North America", "avgRevenue": 125000, "customerCount": 4200 },
    { "year": 2020, "region": "Europe", "avgRevenue": 98000, "customerCount": 3600 },
    { "year": 2020, "region": "Asia", "avgRevenue": 85000, "customerCount": 5300 },

    { "year": 2021, "region": "North America", "avgRevenue": 130000, "customerCount": 4400 },
    { "year": 2021, "region": "Europe", "avgRevenue": 102000, "customerCount": 3700 },
    { "year": 2021, "region": "Asia", "avgRevenue": 89000, "customerCount": 5500 },

    { "year": 2022, "region": "North America", "avgRevenue": 135000, "customerCount": 4600 },
    { "year": 2022, "region": "Europe", "avgRevenue": 105000, "customerCount": 3900 },
    { "year": 2022, "region": "Asia", "avgRevenue": 94000, "customerCount": 5700 },

    { "year": 2023, "region": "North America", "avgRevenue": 140000, "customerCount": 4800 },
    { "year": 2023, "region": "Europe", "avgRevenue": 110000, "customerCount": 4100 },
    { "year": 2023, "region": "Asia", "avgRevenue": 99000, "customerCount": 5900 }
]
    

def is_temporal(key, value):
    if any(kw in key.lower() for kw in TEMPORAL_KEYWORDS):
        return True
    if isinstance(value, (datetime, date, time)):
        return True
    if isinstance(value, str):
        try:
            parse(value)
            return True
        except Exception:
            return False
    return False


def rearrange_dataset(dataset):
    if not dataset:
        return []

    sample_row = dataset[0]

    num_cols = []
    cat_cols = []
    temp_cols = []
    num_numeric = 0
    num_cat = 0
    num_temporal = 0

    for key, value in sample_row.items():
        if is_temporal(key, value):
            temp_cols.append(key)
            num_temporal += 1
        elif isinstance(value, (int, float)):
            num_cols.append(key)
            num_numeric += 1
        elif isinstance(value, str):
            cat_cols.append(key)
            num_cat += 1

    new_order = num_cols + cat_cols + temp_cols
    type = f"num_{num_numeric}_cat_{num_cat}_temp_{num_temporal}"

    # Rearranging each row
    reordered_dataset = [
        {key: row[key] for key in new_order if key in row}
        for row in dataset
    ]
    return {"reordered_dataset": reordered_dataset, "type": type}


if __name__ == "__main__":
    rearrange_dataset(dataset)