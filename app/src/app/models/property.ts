export interface Property {
    ward: string;
    city: string;
    propertyType: 'Land' | 'House & Land';
    landArea: number; // in square meters
    buildingArea: number; // in square meters
    yearBuilt: number;
    buildingType: string;
    nearest: number; // Distance to nearest station in meters
    houseRatio: number; // Building area to land area ratio
    landRatio: number; // Land area to total area ratio
    road: number; // Road width in meters
    orientation: '接面道路無' | '南' | '東' | '西' | '北' | '南東' | '南西' | '北東' | '北西';
    shape: '正方形' | '長方形' | '不整形' | '台形' | 'その他';
} 