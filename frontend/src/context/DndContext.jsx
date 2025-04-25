import React from 'react';
import { DndProvider } from 'react-dnd';
import { getDndBackend } from '../utils/device';

/**
 * DndContext provider component that wraps the application with react-dnd
 * Automatically selects the appropriate backend based on device type
 */
export const DndContext = ({ children }) => {
  const backend = getDndBackend();
  
  return (
    <DndProvider backend={backend}>
      {children}
    </DndProvider>
  );
};

export default DndContext; 