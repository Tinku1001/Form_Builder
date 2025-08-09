// Field Types
export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

// Validation Rules
export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password';
  value?: number | string;
  message: string;
}

// Select and Radio Options
export interface FieldOption {
  label: string;
  value: string;
}

// Derived Field Logic
export interface DerivedFieldLogic {
  parentFields: string[]; // Field IDs that this field depends on
  formula: string; // Formula or logic description
  computeFunction: string; // Actual JavaScript function as string
}

// Form Field Definition
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean | Date;
  validationRules: ValidationRule[];
  options?: FieldOption[]; // For select, radio fields
  isDerived: boolean;
  derivedLogic?: DerivedFieldLogic;
  order: number;
}

// Form Schema
export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

// Form Data (for preview/submission)
export interface FormData {
  [fieldId: string]: any;
}

// Validation Error
export interface ValidationError {
  fieldId: string;
  message: string;
}

// Redux State Types
export interface FormBuilderState {
  currentForm: {
    fields: FormField[];
    name: string;
  };
  savedForms: FormSchema[];
  isLoading: boolean;
  error: string | null;
}

export interface PreviewState {
  formData: FormData;
  validationErrors: ValidationError[];
  currentSchema: FormSchema | null;
}

export interface RootState {
  formBuilder: FormBuilderState;
  preview: PreviewState;
}

// Component Props Types
export interface FieldConfigProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  availableFields: FormField[];
}

export interface FieldRendererProps {
  field: FormField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  formData: FormData;
}

// Local Storage Keys
export const STORAGE_KEYS = {
  FORMS: 'formBuilder_savedForms',
  CURRENT_FORM: 'formBuilder_currentForm'
} as const;