from fastapi import FastAPI
from pydantic import BaseModel

from utils import PropertyDataTransformer
import joblib

app = FastAPI(title="Tokyo Housing Price Prediction API")

model = joblib.load('model.pkl')
pt = joblib.load('proptrans.pkl')


class PredictionInput(BaseModel):
    is_new: bool
    is_house: bool
    price: float
    orientation: str
    house_m2: int
    land_m2: int
    building_type: str
    age: int
    nearest_station_name: str
    nearest_station_minutes: int
    building_ratio: str
    floor_ratio: str
    area: str
    area_plan: str
    land_shape: str
    next_usage: str
    date: int
    road: int

class PredictionOutput(BaseModel):
    prediction: float

@app.get("/")
async def root():
    return {"message": "All good."}

@app.post("/predict", response_model=PredictionOutput)
async def predict(input_data: PredictionInput):
    print(input_data)
    features = pt.model_spec.get_model_matrix(input_data.dict())
    prediction = model.predict(features)[0]
    return {"prediction": float(prediction)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)