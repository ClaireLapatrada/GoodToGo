import random
import numpy as np
import pandas as pd
from faker import Faker
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import ipaddress

fake = Faker()
app = FastAPI()

HIGH_RISK_IP_RANGES = [
    ("192.168.1.0", "192.168.1.255"),  # Example local network
    ("203.0.113.0", "203.0.113.255"),  # Example fraud-prone range
    ("45.134.56.0", "45.134.56.255"),  # Example suspicious IP block
]

def random_ip():
    return str(ipaddress.IPv4Address(random.randint(0, 2**32 - 1)))

def is_high_risk_ip(ip):
    ip_obj = ipaddress.IPv4Address(ip)
    for start, end in HIGH_RISK_IP_RANGES:
        if ipaddress.IPv4Address(start) <= ip_obj <= ipaddress.IPv4Address(end):
            return 1  # High risk
    return 0  # Low risk

def preprocess_user_data(user_data):
    payment_method_map = {"credit_card": 0, "paypal": 1, "crypto": 2}  # Default mapping
    payment_method = payment_method_map.get(user_data.get("payment_method", "credit_card"), 0)  # Default to credit_card

    return_rate = (user_data['productsReturned'] * user_data['amountReturned']) / (user_data['productsBought'] * user_data['amountBought']) if (user_data['productsBought'] > 0 and user_data['amountBought'] > 0) else 0
    is_high_risk_ip_flag = is_high_risk_ip(user_data["ip"])

    return np.array([
        user_data["amountReturned"],  # Keeping this for transparency, might not be used directly
        is_high_risk_ip_flag,
        user_data["numFailedAttempts"],
        return_rate,
        payment_method
    ]).reshape(1, -1)

def generate_mock_data(num_samples=1000, noise_level=0.1):
    data = []
    for _ in range(num_samples):
        ip = random_ip()
        amount = round(random.uniform(5, 2000), 2)
        amount += np.random.normal(0, noise_level * amount)  # Adding noise
        
        is_high_risk_ip_flag = is_high_risk_ip(ip)
        num_failed_attempts = random.randint(0, 5)
        num_failed_attempts += np.random.randint(-1, 2)  # Small random error
        
        return_rate = round(random.uniform(0, 1), 2)  
        return_rate += np.random.normal(0, noise_level * return_rate)  # Adding noise
        
        payment_method = random.choice(["credit_card", "paypal", "crypto"])
        
        # Fraud logic with noise
        is_fraud = 1 if (amount > 1000 or num_failed_attempts > 3 or return_rate > 0.7 or is_high_risk_ip_flag) else 0
        if random.random() < 0.05:  # Introduce 5% label flipping noise
            is_fraud = 1 - is_fraud  

        data.append([ip, amount, is_high_risk_ip_flag, num_failed_attempts, return_rate, payment_method, is_fraud])

    return pd.DataFrame(data, columns=["ip", "amount", "is_high_risk_ip", "num_failed_attempts", "return_rate", "payment_method", "is_fraud"])

df = generate_mock_data()
df["payment_method"] = df["payment_method"].map({"credit_card": 0, "paypal": 1, "crypto": 2})

X = df.drop(columns=["is_fraud", "ip"])
y = df["is_fraud"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(f"Model Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")

userData = {
    "name": "John Doe",
    "email": "johnd123@gmail.com",
    "ip": "45.134.56.0",
    "amountReturned": 10,
    "amountBought": 200,
    "productsBought": 5,
    "productsReturned": 1,
    "numFailedAttempts": 0,
}

def is_wardrobe(user_data):
    processed_data = preprocess_user_data(user_data)
    print("predict:", int(model.predict(processed_data)[0]))
    return int(model.predict(processed_data)[0])