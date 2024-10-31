import {createContext, useContext, useState} from 'react';

const StoreContext = createContext();

export function StoreProvider({children}) {
  const storeValue = {};

  return (
    <StoreContext.Provider value={storeValue}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
