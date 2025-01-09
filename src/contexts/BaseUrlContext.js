import React, { createContext, useContext } from 'react';

const BaseUrlContext = createContext();

export const BaseUrlProvider = ({ children }) => {
  const BASE_URL = 'http://192.168.0.15:5000'; 
  return (
    <BaseUrlContext.Provider value={BASE_URL}>
      {children}
    </BaseUrlContext.Provider>
  );
};

export const useBaseUrl = () => useContext(BaseUrlContext);
