# GoodToGo: Streamlining E-Commerce Returns with AI

GoodToGo is a comprehensive solution designed to simplify the e-commerce returns process. It leverages Artificial Intelligence (AI) to assess the condition of returned products, make return decisions, and automate the refund and resale processes, all while minimizing waste and optimizing business operations. This solution not only improves the efficiency of handling returns but also contributes to sustainability by redirecting returned items to secondary markets instead of landfills.

## The Problem
- **Increasing Returns Rates**: E-commerce businesses are facing high return rates, leading to increased costs and logistical challenges.
- **Environmental Impact**: Returned products often end up in landfills, contributing to environmental waste.
- **Inefficient Return Management**: Retailers struggle to effectively route returned items to secondary markets, such as resale platforms, liquidation channels, or donation programs.
- **Uninformed Customers**: Many customers are unaware of return policies or don't bother to check them before purchasing or requesting a return.

## Key Features
### 1. **AI-Driven Product Condition Grading**
   - Customers are asked to upload photos of the returned product from six angles.
   - AI analyzes the condition of the product using defect detection, condition grading, and counterfeit detection algorithms.
   - The AI assigns a percentage score indicating the authenticity and quality of the product (e.g., detecting counterfeit logos).

### 2. **Streamlined Return Decision Making**
   - Products are categorized based on their condition and authenticity.
   - Returns are either processed for a refund, sent to a landfill, or routed to secondary markets (resale platforms, liquidation channels, or donation programs).
   
### 3. **Simplified Return Policy Awareness**
   - The mobile app provides customers with an easy-to-understand return policy before they make a purchase or request a return.

### 4. **Barcode Generation for Returns**
   - Generate return tags to streamline returns processing and packages sorting.

### 4. **Automated Resale Process**
   - Once the condition and authenticity are assessed, the product is listed for resale.
   - The resale price is automatically determined based on market data and the product’s condition (e.g., 30% off the original price).
   - Integration with platforms like Amazon and eBay to automate listing and selling on secondary markets.

## Tech Stack
- **Frontend**: Expo (React-native)
- **Backend**: Flask (Python)
- **AI Models**: 
   - **Condition Grading**: Uses pretrained AI models for grading product conditions and defect detection.
   - **Counterfeit Detection**: YOLO (You Only Look Once) for detecting counterfeit products.
   - **Wardrobing Behavior Classification**: Traditional Machine Learning approach to predict customer return behavior (wardrobing).
   - **Product Authentication**: Gemini API for scanning and grading the authenticity of logos and products.
- **Third-Party Integrations**:
   - **Amazon Selling Partners API**: For automating resale listings.
   - **eBay Selling API**: For auction-style product resale.

## Potential Issues & Solutions
- **Scammers**: Scammers may take photos of photos or omit important product details.
  - **Solution**: The app requires multiple angles of the product to be submitted, making it harder for scammers to deceive the system.
- **Defect Detection**: AI might miss subtle defects in the product.
  - **Solution**: Incorporate multiple checks using different AI models to cross-validate the detected defects.
  
## Future Features (If Time Permits)
- **Automated Auctioning**: Integrate auction features to further automate the resale process.

## Demo
- The current demo showcases AI-powered product condition grading, authenticity verification, and automated resale decisions. 
- A simplified version of the return process is also available, providing users with clear return policies before making a purchase.

## Our Team: Sabai-Sabai (Chill-Chill in Thai 🇹🇭 )
1. **Lapatrada (Claire) Jaroonjetjumnong**: Resident Full-stack & Design Warrior ⚔️ 
2. **Napat (Boom) Smitakarnjana**: Current Boss & Future CEO of GoodToGo 👨 
3. **Passakorn (Dew) Aunyakamol**: The Real Customer Insights & User Advocate 👟 
4. **Prima (Prim) Limsuntrakul**: OG Excel & Business Strategy Sensei 👩‍🏫 
5. **Thitiwut (Mac) Pattanasuttinont**: Divine Detection & Classification Model Sorcerer 🧙

## Installation
To run this project locally, clone the repository and install the dependencies.

```bash
git clone https://github.com/ClaireLapatrada/GoodToGo.git
cd goodtogo

cd server
python -m venv your-env-name
source your-env-name/bin/activate
pip install -r requirements.txt

cd ..
npm install -g expo-cli
cd customer-frontend
npm install
npm run ios

