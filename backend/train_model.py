import pandas as pd
from app.models import GraphModel
from pathlib import Path

def train_and_save_model():
    
    model = GraphModel()
    
    data_path = Path("data/graph_recommendation_dataset.csv")
    
    if not data_path.exists():
        print(f"Error: Training data not found at {data_path}")
        return
    
    print("Starting model training...")
    result = model.train_model(str(data_path))
    
    print("\nTraining Results:")
    print(f"Status: {result['status']}")
    print(f"Training Accuracy: {result['train_accuracy']:.4f}")
    print(f"Testing Accuracy: {result['test_accuracy']:.4f}")
    print(f"Number of Classes: {result['num_classes']}")
    
    print("\nModel saved to the 'models' directory")

if __name__ == "__main__":
    train_and_save_model()