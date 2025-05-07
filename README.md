# Tokyo House Price Prediction

This project provides a comprehensive analysis and prediction system for Tokyo house prices, combining data analysis, machine learning, and a web application for real-time predictions.

## Project Components

### 1. Data Analysis and Model Development
The analysis is conducted in `analysis.ipynb`, where we:
- Process and analyze Tokyo real estate data
- Develop and train machine learning models
- Evaluate model performance
- Generate insights about factors affecting house prices in Tokyo

### 2. Web Application
A user-friendly web application (`/app`) that allows users to:
- Input property characteristics
- Get real-time price predictions
- Visualize prediction results
- Compare different properties

### 3. API Service
A FastAPI-based service (`/api`) that:
- Serves the trained model
- Provides RESTful endpoints for predictions
- Handles data validation and processing

### 4. Documentation
An article explaining:
- The methodology used
- Key findings and insights
- Interpretation of the model results
- Recommendations for buyers and sellers

## Getting Started

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tokyohouseprice.git
cd tokyohouseprice
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the Application

1. Start the API server:
```bash
cd api
uvicorn api:app --reload
```

2. Launch the web application:
```bash
cd app
# Follow the instructions in the app directory
```

## Project Structure
```
tokyohouseprice/
├── analysis.ipynb      # Jupyter notebook for data analysis
├── api/               # FastAPI service
├── app/               # Web application
├── data/              # Dataset and processed data
├── requirements.txt   # Python dependencies
└── README.md         # This file
```

## Technologies Used
- Python
- FastAPI
- scikit-learn
- pandas
- numpy
- formulaic
- Angular
- Chart.js
- Leaflet

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
