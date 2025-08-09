import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField, FormSchema, FormBuilderState } from '../../types';
import { loadFormsFromStorage, saveFormToStorage } from '../../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

const initialState: FormBuilderState = {
  currentForm: {
    fields: [],
    name: '',
  },
  savedForms: loadFormsFromStorage(),
  isLoading: false,
  error: null,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    // Current form operations
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },

    addField: (state, action: PayloadAction<Omit<FormField, 'id' | 'order'>>)=> {
      const newField: FormField = {
        ...action.payload,
        id: uuidv4(),
        order: state.currentForm.fields.length,
      };
      state.currentForm.fields.push(newField);
    },

    updateField: (state, action: PayloadAction<FormField>) => {
      const index = state.currentForm.fields.findIndex(
        field => field.id === action.payload.id
      );
      if (index !== -1) {
        state.currentForm.fields[index] = action.payload;
      }
    },

    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields
        .filter(field => field.id !== action.payload)
        .map((field, index) => ({ ...field, order: index }));
    },

    reorderFields: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number }>) => {
      const { dragIndex, hoverIndex } = action.payload;
      const draggedField = state.currentForm.fields[dragIndex];
      const newFields = [...state.currentForm.fields];
      
      newFields.splice(dragIndex, 1);
      newFields.splice(hoverIndex, 0, draggedField);
      
      // Update order property
      state.currentForm.fields = newFields.map((field, index) => ({
        ...field,
        order: index,
      }));
    },

    // Form management
    saveCurrentForm: (state) => {
      if (!state.currentForm.name.trim()) {
        state.error = 'Form name is required';
        return;
      }

      const formSchema: FormSchema = {
        id: uuidv4(),
        name: state.currentForm.name,
        fields: state.currentForm.fields,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.savedForms.push(formSchema);
      saveFormToStorage(formSchema);
      state.error = null;
    },

    loadForm: (state, action: PayloadAction<FormSchema>) => {
      state.currentForm = {
        name: action.payload.name,
        fields: action.payload.fields,
      };
    },

    clearCurrentForm: (state) => {
      state.currentForm = {
        fields: [],
        name: '',
      };
      state.error = null;
    },

    deleteForm: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(form => form.id !== action.payload);
      // Update localStorage
      const updatedForms = state.savedForms;
      localStorage.setItem('formBuilder_savedForms', JSON.stringify(updatedForms));
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setFormName,
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveCurrentForm,
  loadForm,
  clearCurrentForm,
  deleteForm,
  setError,
  setLoading,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;