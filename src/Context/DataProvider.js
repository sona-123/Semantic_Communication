// DataProvider.js
import React, { createContext, useContext, useState } from "react";

// Define initial state for the context
const data = {
    index: -1,
    list: [],
    select: -1,
    SimilarityData: [],
    snr: 20
};

// Create the context
const DataContext = createContext();

// Create the provider component
const DataProvider = ({ children }) => {
    const [state, setState] = useState(data);

    return (
        <DataContext.Provider value={{ state, setState }}>
            {children}
        </DataContext.Provider>
    );
};

// Custom hook to use the DataContext
export const useData = () => {
    return useContext(DataContext);
};

export default DataProvider;
