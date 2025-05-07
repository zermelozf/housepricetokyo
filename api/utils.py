import pandas as pd
from formulaic import model_matrix

from sklearn.base import BaseEstimator, TransformerMixin


def load_data(wards='all'):
    data = {
        'kita': 'data/kita2.csv', 'itabashi': 'data/ita2.csv', 'hachioiji': 'data/hachi2.csv',
        'meguro': 'data/meguro2.csv', 'arakawa': 'data/ara2.csv', 'minato': 'data/minato2.csv',
        'shibuya': 'data/shibu2.csv', 'shinjuku': 'data/shin2.csv', 'bunkyo': 'data/bun2.csv',
        'shinagawa': 'data/shina2.csv', 'nakano': 'data/naka2.csv', 'nerima': 'data/neri2.csv',
        'suginami': 'data/sugi2.csv', 'setagaya': 'data/seta2.csv', 'mitaka': 'data/mitaka2.csv',
        'toshima': 'data/toshima2.csv', 'chiyoda': 'data/chiyoda2.csv', 'koto': 'data/koto2.csv',
        'sumida': 'data/sumida2.csv', 'adachi': 'data/adachi2.csv', 'taito': 'data/taito2.csv',
        'chuo': 'data/chuo2.csv', 'edogawa': 'data/edogawa2.csv', 'katsushika': 'data/katsushika2.csv',
        'ota': 'data/ota2.csv'
    }
    if wards == 'all':
        wards = data
    elif isinstance(wards, list):
        wards = {ward: data[ward] for ward in wards}
    elif isinstance(wards, str):
        wards = {wards: data[wards]}

    df = [pd.read_csv(path) for path in wards.values()]
    df = pd.concat(df)

    df['is_house'] = True
    df.loc[df['延床面積（㎡）'].isnull(), 'is_house'] = False
    df.loc[~df['is_house'], '延床面積（㎡）'] = 0
    df.loc[~df['is_house'], '建物の構造'] = 'NA'
    df.loc[~df['is_house'], '建築年'] = '2020'

    data = df[[
        '最寄駅：距離（分）', '取引価格（総額）',
        '建築年', '建ぺい率（％）', '取引時期',
        '容積率（％）', '建物の構造', '都市計画',
        '延床面積（㎡）', '面積（㎡）', '地区名',
        '前面道路：方位', '最寄駅：名称', '土地の形状',
        '今後の利用目的', '間口', 'is_house'
    ]].dropna()

    data = data[~data['建築年'].str.contains('戦')]
    data = data[data['延床面積（㎡）'] != '2,000㎡以上']
    data = data[data['面積（㎡）'] != '2,000㎡以上']
    data = data[~data['最寄駅：距離（分）'].isin(
        ['30分～60分', '1H～1H30', '1H30～2H', '2H～'])]
    data = data[~data['間口'].isin(['50.0m以上'])]
    data = data[data['延床面積（㎡）'].astype(int) < 200]
    data = data[data['面積（㎡）'].astype(int) < 200]
    data = data[data['建ぺい率（％）'].isin([60.0, 70.0, 80.0])]
    data = data[data['容積率（％）'].isin([150.0, 200.0, 300.0])]
    data = data[data['建物の構造'].isin(['木造', '軽量鉄骨造', '鉄骨造', 'ＲＣ', 'ＳＲＣ', 'NA'])]
    data = data[data['取引価格（総額）'] < 200000000]
    data = data[data['今後の利用目的'] == '住宅']

    data['date'] = data['取引時期'].map(lambda x: int(x[:4]))
    data['age'] = data['建築年'].map(lambda x: int(x[:-1]))
    data['age'] = data['date'] - data['age']
    data['is_new'] = (data['age'] == 1).astype(int)
    data['date'] = data['date'].astype(int) - 2020
    data['price'] = data['取引価格（総額）']
    data['building_ratio'] = data['建ぺい率（％）'].astype(int)
    data['floor_ratio'] = data['容積率（％）'].astype(int)
    data['area_plan'] = data['都市計画']
    data['area_name'] = data['地区名']
    data['land_m2'] = data['面積（㎡）'].astype(int)
    data['house_m2'] = data['延床面積（㎡）'].astype(int)
    data['building_type'] = data['建物の構造']
    data['orientation'] = data['前面道路：方位']
    data['nearest_station_name'] = data['最寄駅：名称']
    data['nearest_station_minutes'] = data['最寄駅：距離（分）'].astype(int)
    data['land_shape'] = data['土地の形状']
    data['next_usage'] = data['今後の利用目的']
    data['road'] = data['間口'].astype(float)
    data['is_house'] = data['is_house'].astype(int)
    return data, data['price'].values


class PropertyDataTransformer(BaseEstimator, TransformerMixin):

    def __init__(self, formula=None):
        self.formula = formula
        self.design_info = None

    def fit(self, X, y=None):
        if not isinstance(X, pd.DataFrame):
            X = pd.DataFrame(X)
        _, X = model_matrix(self.formula, X)
        self.model_spec = X.model_spec
        return self

    def transform(self, X):
        return self.model_spec.get_model_matrix(X)
