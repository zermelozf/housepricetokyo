import pandas as pd
from formulaic import model_matrix

from sklearn.base import BaseEstimator, TransformerMixin


def load_data():
    kita = pd.read_csv('data/kita2.csv')
    ita = pd.read_csv('data/ita2.csv')
    hachi = pd.read_csv('data/hachi2.csv')
    meguro = pd.read_csv('data/meguro2.csv')
    arakawa = pd.read_csv('data/ara2.csv')
    minato = pd.read_csv('data/minato2.csv')
    shibuya = pd.read_csv('data/shibu2.csv')
    shinjuku = pd.read_csv('data/shin2.csv')
    bunkyo = pd.read_csv('data/bun2.csv')
    shinagawa = pd.read_csv('data/shina2.csv')
    nakano = pd.read_csv('data/naka2.csv')
    nerima = pd.read_csv('data/neri2.csv')
    suginami = pd.read_csv('data/sugi2.csv')
    setagaya = pd.read_csv('data/seta2.csv')
    mitaka = pd.read_csv('data/mitaka2.csv')
    toshima = pd.read_csv('data/toshima2.csv')
    chiyoda = pd.read_csv('data/chiyoda2.csv')
    koto = pd.read_csv('data/koto2.csv')
    sumida = pd.read_csv('data/sumida2.csv')
    adachi = pd.read_csv('data/adachi2.csv')
    taito = pd.read_csv('data/taito2.csv')
    chuo = pd.read_csv('data/chuo2.csv')
    edogawa = pd.read_csv('data/edogawa2.csv')
    katsushika = pd.read_csv('data/katsushika2.csv')
    ota = pd.read_csv('data/ota2.csv')
    df = pd.concat([
        nerima, kita, ita, meguro, shibuya,
        arakawa, minato, shinjuku, bunkyo, shinagawa,
        nakano, suginami, setagaya, mitaka, toshima,
        chiyoda, koto, sumida, adachi, taito, chuo,
        edogawa, katsushika, ota
    ]).reset_index()
    # df = pd.concat([nerima, ita]).reset_index()
    df['is_house'] = True
    df.loc[df['延床面積（㎡）'].isnull(), 'is_house'] = False
    df.loc[~df['is_house'], '延床面積（㎡）'] = 0
    df.loc[~df['is_house'], '建物の構造'] = 'NA'
    df.loc[~df['is_house'], '建築年'] = '2020'

    data = df[[
        '最寄駅：距離（分）', '取引価格（総額）',
        '建築年','建ぺい率（％）', '取引時期',
        '容積率（％）', '建物の構造', '都市計画',
        '延床面積（㎡）', '面積（㎡）', '地区名',
        '前面道路：方位', '最寄駅：名称', '土地の形状',
        '今後の利用目的', '間口', 'is_house'
    ]].dropna()

    data = data[~data['建築年'].str.contains('戦')]
    data = data[data['延床面積（㎡）'] != '2,000㎡以上']
    data = data[data['面積（㎡）'] != '2,000㎡以上']
    data = data[~data['最寄駅：距離（分）'].isin(['30分～60分', '1H～1H30', '1H30～2H', '2H～'])]
    data = data[~data['間口'].isin(['50.0m以上'])]
    data = data[data['延床面積（㎡）'].astype(int) < 200]
    data = data[data['面積（㎡）'].astype(int) < 200]
    data = data[data['建ぺい率（％）'].isin([60.0, 70.0, 80.0])]
    data = data[data['容積率（％）'].isin([150.0, 200.0, 300.0])]
    data = data[data['建物の構造'].isin(['木造', '軽量鉄骨造', '鉄骨造', 'NA'])]
    data = data[data['取引価格（総額）'] < 200000000]
    data = data[data['今後の利用目的'] == '住宅']

    data['date'] = data['取引時期'].map(lambda x: int(x[:4]))
    data['age'] = data['建築年'].map(lambda x: int(x[:-1]))
    data['age'] = data['date'] - data['age']
    data['is_new'] = (data['age'] == 1).astype(int)
    data['date'] = data['date'].astype(str)# - 2020
    data['price'] = data['取引価格（総額）']
    data['building_ratio'] = data['建ぺい率（％）'].astype(str)
    data['floor_ratio'] = data['容積率（％）'].astype(str)
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