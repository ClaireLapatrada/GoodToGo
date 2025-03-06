// assetContext.js
import React, { createContext, ReactNode, useContext, useState } from 'react';

// create interface
interface AssessmentContextType {
    images: string[]; // List of Base64-encoded strings
    addImage: (base64String: string) => void;
    removeImages: () => void;
  }
// Create the context
export const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);


interface AssessmentProviderProps {
    children: ReactNode
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ children }) => {
    const [images, setImages] = useState<string[]>([]);

    // Function to add a new Base64 string to the list
    const addImage = (base64String: string) => {
      setImages((prev) => [...prev, base64String]);
    };

    // Function to remove an image by index
    const removeImages = () => {
    setImages([]);
    };

    return (
      <AssessmentContext.Provider value={{ images, addImage, removeImages }}>
        {children}
      </AssessmentContext.Provider>
    );
  };
// Custom hook to use the context with type safety
export const useAssessmentContext = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessmntContext must be used within a AssessmentContextProvider");
  }
  return context;
};
  
// Add a default export - this can be the Provider
export default AssessmentProvider;
