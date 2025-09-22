// hooks/useKeyboardShortcuts.ts
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

interface KeyboardShortcutsConfig {
  // Option selection
  onSelectA: () => void;
  onSelectB: () => void;
  onSelectC: () => void;
  onSelectD: () => void;
  
  // Navigation
  onNext: () => void;
  onPrevious: () => void;
  
  // Exam control
  onSubmit: () => void;
  onConfirm?: () => void;
  
  // State checks
  canGoNext: boolean;
  canGoPrevious: boolean;
  hasOptionsA: boolean;
  hasOptionsB: boolean;
  hasOptionsC: boolean;
  hasOptionsD: boolean;
}

export const useKeyboardShortcuts = (config: KeyboardShortcutsConfig) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    
    // Prevent default browser behavior for our shortcuts
    const shortcuts = ['a', 'b', 'c', 'd', 'n', 'p', 's', 'y'];
    if (shortcuts.includes(key)) {
      event.preventDefault();
    }

    switch (key) {
      case 'a':
        if (config.hasOptionsA) {
          config.onSelectA();
        }
        break;
      case 'b':
        if (config.hasOptionsB) {
          config.onSelectB();
        }
        break;
      case 'c':
        if (config.hasOptionsC) {
          config.onSelectC();
        }
        break;
      case 'd':
        if (config.hasOptionsD) {
          config.onSelectD();
        }
        break;
      case 'n':
        if (config.canGoNext) {
          config.onNext();
        }
        break;
      case 'p':
        if (config.canGoPrevious) {
          config.onPrevious();
        }
        break;
      case 's':
        // Show confirmation before submitting
        Alert.alert(
          'Submit Exam',
          'Are you sure you want to submit your exam? Press Y to confirm.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Submit', style: 'destructive', onPress: config.onSubmit }
          ]
        );
        break;
      case 'y':
        // Direct submit if onConfirm is provided, otherwise regular submit
        if (config.onConfirm) {
          config.onConfirm();
        } else {
          config.onSubmit();
        }
        break;
      default:
        break;
    }
  }, [config]);

  useEffect(() => {
    // Add event listener for keyboard events
    const handleKeyDown = (event: Event) => {
      handleKeyPress(event as KeyboardEvent);
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress]);

  // Return utility functions if needed
  return {
    // Could add functions to show keyboard hint overlay, etc.
  };
};