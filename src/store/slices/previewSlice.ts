import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PreviewState, FormData, ValidationError, FormSchema } from '../../types';

const initialState: PreviewState = {
  formData: {},
  validationErrors: [],
  currentSchema: null,
};

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    setCurrentSchema: (state, action: PayloadAction<FormSchema | null>) => {
      state.currentSchema = action.payload;
      // Reset form data when schema changes
      state.formData = {};
      state.validationErrors = [];
    },

    updateFormData: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      const { fieldId, value } = action.payload;
      state.formData[fieldId] = value;
      
      // Clear validation error for this field if it exists
      state.validationErrors = state.validationErrors.filter(
        error => error.fieldId !== fieldId
      );
    },

    setFormData: (state, action: PayloadAction<FormData>) => {
      state.formData = action.payload;
    },

    setValidationErrors: (state, action: PayloadAction<ValidationError[]>) => {
      state.validationErrors = action.payload;
    },

    addValidationError: (state, action: PayloadAction<ValidationError>) => {
      // Remove existing error for this field first
      state.validationErrors = state.validationErrors.filter(
        error => error.fieldId !== action.payload.fieldId
      );
      state.validationErrors.push(action.payload);
    },

    removeValidationError: (state, action: PayloadAction<string>) => {
      state.validationErrors = state.validationErrors.filter(
        error => error.fieldId !== action.payload
      );
    },

    clearFormData: (state) => {
      state.formData = {};
      state.validationErrors = [];
    },

    // For derived fields computation
    computeDerivedFields: (state) => {
      if (!state.currentSchema) return;

      const derivedFields = state.currentSchema.fields.filter(field => field.isDerived);
      
      derivedFields.forEach(field => {
        if (field.derivedLogic) {
          try {
            // Get parent field values
            const parentValues: { [key: string]: any } = {};
            field.derivedLogic.parentFields.forEach(parentFieldId => {
              parentValues[parentFieldId] = state.formData[parentFieldId];
            });

            // Execute the computation function
            // This is a simple implementation - in production, you'd want more sophisticated parsing
            const computedValue = computeDerivedValue(
              field.derivedLogic.computeFunction,
              parentValues,
              state.formData
            );

            if (computedValue !== undefined) {
              state.formData[field.id] = computedValue;
            }
          } catch (error) {
            console.error(`Error computing derived field ${field.id}:`, error);
          }
        }
      });
    },
  },
});

// Helper function to compute derived values
function computeDerivedValue(
  computeFunction: string,
  parentValues: { [key: string]: any },
  allFormData: FormData
): any {
  try {
    // Create a safe execution context
    const context = {
      ...parentValues,
      formData: allFormData,
      Math,
      Date,
      // Add more safe functions as needed
    };

    // Simple function execution (in production, consider using a safer eval alternative)
    const func = new Function(...Object.keys(context), `return ${computeFunction}`);
    return func(...Object.values(context));
  } catch (error) {
    console.error('Error in derived field computation:', error);
    return undefined;
  }
}

export const {
  setCurrentSchema,
  updateFormData,
  setFormData,
  setValidationErrors,
  addValidationError,
  removeValidationError,
  clearFormData,
  computeDerivedFields,
} = previewSlice.actions;

export default previewSlice.reducer;