import { FormSchema, STORAGE_KEYS } from '../types';

/**
 * Load all saved forms from localStorage
 */
export const loadFormsFromStorage = (): FormSchema[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FORMS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading forms from localStorage:', error);
    return [];
  }
};

/**
 * Save a form to localStorage
 */
export const saveFormToStorage = (form: FormSchema): void => {
  try {
    const existingForms = loadFormsFromStorage();
    const updatedForms = [...existingForms, form];
    localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Error saving form to localStorage:', error);
    throw new Error('Failed to save form');
  }
};

/**
 * Update an existing form in localStorage
 */
export const updateFormInStorage = (updatedForm: FormSchema): void => {
  try {
    const existingForms = loadFormsFromStorage();
    const formIndex = existingForms.findIndex(form => form.id === updatedForm.id);
    
    if (formIndex !== -1) {
      existingForms[formIndex] = {
        ...updatedForm,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(existingForms));
    }
  } catch (error) {
    console.error('Error updating form in localStorage:', error);
    throw new Error('Failed to update form');
  }
};

/**
 * Delete a form from localStorage
 */
export const deleteFormFromStorage = (formId: string): void => {
  try {
    const existingForms = loadFormsFromStorage();
    const filteredForms = existingForms.filter(form => form.id !== formId);
    localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(filteredForms));
  } catch (error) {
    console.error('Error deleting form from localStorage:', error);
    throw new Error('Failed to delete form');
  }
};

/**
 * Get a specific form by ID
 */
export const getFormById = (formId: string): FormSchema | null => {
  try {
    const forms = loadFormsFromStorage();
    return forms.find(form => form.id === formId) || null;
  } catch (error) {
    console.error('Error getting form by ID:', error);
    return null;
  }
};

/**
 * Save current form draft to localStorage
 */
export const saveCurrentFormDraft = (formData: any): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_FORM, JSON.stringify(formData));
  } catch (error) {
    console.error('Error saving current form draft:', error);
  }
};

/**
 * Load current form draft from localStorage
 */
export const loadCurrentFormDraft = (): any => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_FORM);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading current form draft:', error);
    return null;
  }
};

/**
 * Clear current form draft
 */
export const clearCurrentFormDraft = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_FORM);
  } catch (error) {
    console.error('Error clearing current form draft:', error);
  }
};