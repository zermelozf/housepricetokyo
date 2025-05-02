from fastapi import FastAPI
import pandas as pd
from pydantic import BaseModel

from utils import PropertyDataTransformer
import joblib

app = FastAPI(title="Tokyo Housing Price Prediction API")

coef_ = pd.read_csv('coef_.csv')
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

class Land(BaseModel):
    total: int
    base: int
    orientation: int
    shape: int
    station: int
    road: int

class Building(BaseModel):
    total: int
    base: int
    type: int
    age: int

class PredictionOutput(BaseModel):
    total: int;
    land: Land;
    building: Building;

@app.get("/")
async def root():
    return {"message": "All good."}

@app.post("/predict")
async def predict(input_data: PredictionInput):
    x = pt.model_spec.get_model_matrix(input_data.dict()).T.reset_index()
    x.columns = ['coef', 'value']
    xx = x.merge(coef_, on='coef')
    xx['m'] = xx['value_x'] * xx['value_y']
    xx = xx[xx['m'] != 0]
    return xx.to_dict(orient='records')


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)