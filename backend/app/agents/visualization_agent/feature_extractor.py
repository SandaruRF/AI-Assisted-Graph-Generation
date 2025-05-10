from datetime import datetime, date, time
from dateutil.parser import parse
from decimal import Decimal

TEMPORAL_KEYWORDS = ['date', 'time', 'year', 'month', 'day', 'timestamp']


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


def process_and_clean_dataset(dataset):
    if not dataset:
        return {"reordered_dataset": [], "type": "empty", "num_rows": 0, "cardinalities": {}}

    sample_row = dataset[0]

    num_cols = []
    cat_cols = []
    temp_cols = []
    num_numeric = 0
    num_cat = 0
    num_temporal = 0
    reordered_dataset = []

    for key, value in sample_row.items():
        if is_temporal(key, value):
            temp_cols.append(key)
            num_temporal += 1
        elif isinstance(value, (int, float, Decimal)):
            num_cols.append(key)
            num_numeric += 1
        elif isinstance(value, str):
            cat_cols.append(key)
            num_cat += 1

    new_order = num_cols + cat_cols + temp_cols
    cardinalities = {key: {"unique_values": set(), "count": 0} for key in new_order}

    x = dataset[0]
    for value in x.values():
        if isinstance(value, Decimal):
            value = float(value)
        print(f"Value: {value}, Type: {type(value)}")
    for row in dataset:
        if all(row.get(key) is not None and str(row.get(key)).strip() != '' for key in row):
            reordered_row = {}
            for key in new_order:
                if key in row:
                    val = row.get(key)
                    if isinstance(val, Decimal):
                        val = float(val)
                    reordered_row[key] = val
                    if val not in cardinalities[key]["unique_values"]:
                        cardinalities[key]["count"] += 1
                        cardinalities[key]["unique_values"].add(val)
            reordered_dataset.append(reordered_row)
        
    # Convert sets to lists for JSON compatibility
    for key in cardinalities:
        cardinalities[key]["unique_values"] = list(cardinalities[key]["unique_values"])

    print(f"Original dataset: {dataset}")
    print(f"Rearranged dataset: {reordered_dataset}")
    print(f"Type: {type}")
    print(f"Number of rows: {len(reordered_dataset)}")
    print(f"Cardinalities: {cardinalities}")
    return {
        "reordered_dataset": reordered_dataset, 
        "num_numeric": num_numeric,
        "num_cat": num_cat,
        "num_temporal": num_temporal,
        "num_rows": len(reordered_dataset),
        "cardinalities": cardinalities
    }


if __name__ == "__main__":
    dataset = [
        { "year": 2019, "region": "North America", "avgRevenue": 120000, "customerCount": 4000 },
        { "year": 2019, "region": "Europe", "avgRevenue": 95000, "customerCount": 3500 },
        { "year": 2019, "region": "Asia", "avgRevenue": "", "customerCount": None },

        { "year": 2020, "region": "North America", "avgRevenue": 125000, "customerCount": 4200 },
        { "year": 2020, "region": "Europe", "avgRevenue": 98000, "customerCount": 3600 },
        { "year": 2020, "region": "Asia", "avgRevenue": 85000, "customerCount": 5300 },

        { "year": 2021, "region": "North America", "avgRevenue": 130000, "customerCount": 4400 },
        { "year": 2021, "region": "Europe", "avgRevenue": 102000, "customerCount": 3700 },
        { "year": 2021, "region": "Asia", "avgRevenue": 89000, "customerCount": 5500 },

        { "year": None, "region": "North America", "avgRevenue": 135000, "customerCount": 4600 },
        { "year": 2022, "region": "Europe", "avgRevenue": 105000, "customerCount": 3900 },
        { "year": 2022, "region": "Asia", "avgRevenue": 94000, "customerCount": 5700 },

        { "year": 2023, "region": "North America", "avgRevenue": 140000, "customerCount": 4800 },
        { "year": 2023, "region": "Europe", "avgRevenue": 110000, "customerCount": 4100 },
        { "year": 2023, "region": "Asia", "avgRevenue": 99000, "customerCount": 5900 }
    ]
    process_and_clean_dataset(dataset)