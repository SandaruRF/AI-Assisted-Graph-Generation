import pandas as pd
import numpy as np
from ast import literal_eval
from sklearn.decomposition import PCA
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
import joblib
from config import MODEL_PATH, PCA_PATH, LABEL_ENCODER_PATH, FEATURE_COLUMNS_PATH

class GraphModel:
    def __init__(self):
        self.model = None
        self.pca = None
        self.label_encoder = None
        self.feature_columns = None
        self.is_trained = False

    def train_model(self, data_path: str):
        """Train the model from scratch"""
        df = pd.read_csv(data_path, encoding='latin-1')

        # Convert booleans
        for col in ['has_temporal', 'trend', 'compare']:
            df[col] = df[col].astype(bool).astype(int)

        # Handle data_domain
        df['data_domain'] = df.get('data_domain', 'Unknown')
        df['data_domain'] = df['data_domain'].astype(str).replace('nan', 'Unknown').fillna('Unknown')
        df = pd.get_dummies(df, columns=['data_domain'], prefix='domain', dtype='int8')

        # Handle missing values
        num_cols = ['num_numeric', 'cardinality', 'skewness', 'correlation']
        df[num_cols] = df[num_cols].fillna(df[num_cols].median())

        # Create features
        df['num_numeric_bin'] = pd.cut(df['num_numeric'], bins=[-1, 0.5, 1.5, 2.5], labels=[0, 1, 2]).astype(int)
        df['num_cardinality'] = df['num_numeric'] * df['cardinality']
        df['corr_skew'] = df['correlation'] * df['skewness']
        df['skewness_sq'] = df['skewness'] ** 2

        # Query Embedding to PCA
        def safe_embedding(x, target_length=384):
            try:
                vec = literal_eval(str(x))
                if len(vec) == target_length:
                    return vec
            except:
                pass
            return [0.0] * target_length

        embeddings = np.stack(df['query_embedding'].apply(safe_embedding))
        self.pca = PCA(n_components=10)
        embed_pca = self.pca.fit_transform(embeddings)
        for i in range(10):
            df[f'embed_pca_{i}'] = embed_pca[:, i]

        # Drop unneeded columns
        df.drop(columns=['query', 'query_embedding'], errors='ignore', inplace=True)

        # Label encode target
        df = df[df['ranked_graphs'].map(df['ranked_graphs'].value_counts()) >= 2]
        self.label_encoder = LabelEncoder()
        df['ranked_graphs_encoded'] = self.label_encoder.fit_transform(df['ranked_graphs'])
        df.drop(columns=['ranked_graphs'], inplace=True)

        # Train-test split
        X = df.drop(columns=['ranked_graphs_encoded'])
        y = df['ranked_graphs_encoded']
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

        # XGBoost Model
        self.model = XGBClassifier(
            objective='multi:softmax',
            num_class=len(self.label_encoder.classes_),
            eval_metric='mlogloss',
            early_stopping_rounds=10,
            max_depth=5,
            learning_rate=0.1,
            n_estimators=200,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )

        self.model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=10)
        self.feature_columns = X.columns
        self.is_trained = True

        # Save models
        self.save_models()

        # Return training metrics
        train_pred = self.model.predict(X_train)
        train_accuracy = accuracy_score(y_train, train_pred)
        test_pred = self.model.predict(X_test)
        test_accuracy = accuracy_score(y_test, test_pred)

        return {
            "status": "success",
            "train_accuracy": train_accuracy,
            "test_accuracy": test_accuracy,
            "num_classes": len(self.label_encoder.classes_)
        }

    def save_models(self):
        """Save all models to disk"""
        MODEL_PATH.parent.mkdir(exist_ok=True)
        
        # Save XGBoost model
        self.model.save_model(MODEL_PATH)
        
        # Save other components
        joblib.dump(self.pca, PCA_PATH)
        joblib.dump(self.label_encoder, LABEL_ENCODER_PATH)
        joblib.dump(self.feature_columns, FEATURE_COLUMNS_PATH)

    def load_models(self):
        """Load models from disk"""
        try:
            self.model = XGBClassifier()
            self.model.load_model(MODEL_PATH)
            self.pca = joblib.load(PCA_PATH)
            self.label_encoder = joblib.load(LABEL_ENCODER_PATH)
            self.feature_columns = joblib.load(FEATURE_COLUMNS_PATH)
            self.is_trained = True
            return True
        except Exception as e:
            print(f"Error loading models: {e}")
            return False

    def predict(self, user_input: dict):
        """Predict graph type from user input"""
        if not self.is_trained:
            if not self.load_models():
                return {
                    "status": "error",
                    "message": "Model not trained and could not load from disk"
                }

        # Convert user input into DataFrame
        input_df = pd.DataFrame([user_input])

        # Convert boolean columns to integers
        for col in ['has_temporal', 'trend', 'compare']:
            input_df[col] = input_df[col].astype(bool).astype(int)

        # One-hot encode data_domain
        for domain in [col for col in self.feature_columns if col.startswith('domain_')]:
            input_df[domain] = 0
        col_name = f"domain_{user_input['data_domain']}"
        if col_name in input_df.columns:
            input_df[col_name] = 1
        input_df.drop(columns=['data_domain'], inplace=True)

        # Add derived features
        input_df['num_numeric_bin'] = pd.cut([user_input['num_numeric']], bins=[-1, 0.5, 1.5, 2.5], labels=[0, 1, 2])[0]
        input_df['num_cardinality'] = user_input['num_numeric'] * user_input['cardinality']
        input_df['corr_skew'] = user_input['correlation'] * user_input['skewness']
        input_df['skewness_sq'] = user_input['skewness'] ** 2

        # Transform query embedding using PCA (using dummy embedding for now)
        embedding = self._embed_query(user_input['query'])
        embedding_pca = self.pca.transform([embedding])
        for i in range(10):
            input_df[f'embed_pca_{i}'] = embedding_pca[0, i]

        # Ensure all feature columns are present
        for col in self.feature_columns:
            if col not in input_df:
                input_df[col] = 0

        input_df = input_df[self.feature_columns]

        # Make prediction with probabilities
        pred_proba = self.model.predict_proba(input_df)[0]
        pred_class = self.model.predict(input_df)[0]
        
        # Get class probabilities
        classes = self.label_encoder.classes_
        probabilities = {cls: prob for cls, prob in zip(classes, pred_proba)}
        
        return {
            "predicted_graph": self.label_encoder.inverse_transform([pred_class])[0],
            "confidence": max(pred_proba),
            "all_predictions": probabilities,
            "status": "success"
        }

    def _embed_query(self, query: str, target_length=384) -> np.ndarray:
        """Dummy embedding function - replace with actual embedding model"""
        return np.zeros(target_length)