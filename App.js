import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import StackNav from './src/routes/StackNav';
import {BaseUrlProvider} from './src/contexts/BaseUrlContext';

function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <BaseUrlProvider>
            <StackNav />
          </BaseUrlProvider>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default App;