/**
 * Utility functions for device detection and touch support
 */

/**
 * Checks if the current device supports touch
 * @returns {boolean} True if the device supports touch, false otherwise
 */
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Gets the appropriate backend for react-dnd based on device type
 * @returns {object} The appropriate backend for the current device
 */
export const getDndBackend = () => {
  const HTML5Backend = require('react-dnd-html5-backend').HTML5Backend;
  const TouchBackend = require('react-dnd-touch-backend').TouchBackend;
  
  return isTouchDevice() ? TouchBackend : HTML5Backend;
};

/**
 * Creates touch-friendly drag preview options
 * @param {object} options - Additional options to merge
 * @returns {object} Preview options object
 */
export const getPreviewOptions = (options = {}) => {
  return {
    captureDraggingState: true,
    anchorX: 0.5,
    anchorY: 0.5,
    ...options
  };
}; 