// App.tsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '@/app/index';
import SelectProduct from '@/app/select-product';
import ShowProduct from '@/app/show-product';
import Assessment from '@/app/assessment';
import Barcode from '@/app/barcode';
import { ProductContext } from '@/app/productContext';
import PaymentBillingPage from '@/app/payment-billing';
import RefundStatus from '@/app/refund-status';

interface Product {
    name: string;
    id: string;
    price: number;
    ordered: string;
    received: string;
    condition?: string;
    estimatedRefundValue?: number;
    eligibleForResale?: boolean;
    repairsNeeded?: boolean;
    recommendedAction?: string;
  }

const Stack = createStackNavigator();

const App = () => {
  const [product, setProduct] = useState<Product | null>(null);

  // Add useEffect to log product changes
  useEffect(() => {
    console.log('Product updated in App component:', product);
  }, [product]);

  console.log('App component - setProduct:', setProduct);

  return (
    <ProductContext.Provider value={{ product, setProduct }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="SelectProduct" component={SelectProduct} />
          <Stack.Screen 
            name="ShowProduct" 
            component={ShowProduct} 
            options={{ title: 'Show Product' }}
          />
          <Stack.Screen name="Assessment" component={Assessment} />
          <Stack.Screen name="Barcode" component={Barcode} />
          <Stack.Screen name="PaymentBillingPage" component={PaymentBillingPage} />
          <Stack.Screen name="RefundStatus" component={RefundStatus} />   
        </Stack.Navigator>
      </NavigationContainer>
    </ProductContext.Provider>  
  );
};

export default App;