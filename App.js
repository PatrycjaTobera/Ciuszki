import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import StackNav from './src/routes/StackNav';
import {BaseUrlProvider} from './src/contexts/BaseUrlContext';
import { UserProvider } from './src/contexts/UserContext';

function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <BaseUrlProvider>
            <UserProvider>
              <StackNav/>
            </UserProvider>
          </BaseUrlProvider>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default App;