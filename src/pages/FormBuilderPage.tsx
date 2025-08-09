import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
  Divider,
  Fade,
  Container,
} from '@mui/material';
import { 
  Add, 
  Save, 
  Preview, 
  Clear,
  AutoAwesome,
  Brush,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { RootState } from '../store';
import {
  setFormName,
  addField,
  updateField,
  deleteField,
  saveCurrentForm,
  clearCurrentForm,
  setError,
} from '../store/slices/formBuilderSlice';
import { setCurrentSchema } from '../store/slices/previewSlice';
import { FieldType, FormField } from '../types';
import FieldTypeSelector from '../components/FormBuilder/FieldTypeSelector';
import FieldsList from '../components/FormBuilder/FieldList';
import FieldConfiguration from '../components/FormBuilder/FieldConfiguration';

const FormBuilderPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm, error } = useSelector((state: RootState) => state.formBuilder);

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [formNameInput, setFormNameInput] = useState(currentForm.name);

  const handleAddField = (type: FieldType) => {
    const newField: Omit<FormField, 'id' | 'order'> = {
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      validationRules: [],
      isDerived: false,
    };

    if (type === 'select' || type === 'radio') {
      newField.options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ];
    }

    dispatch(addField(newField));
  };

  const handleUpdateField = (field: FormField) => {
    dispatch(updateField(field));
    setSelectedField(field);
  };

  const handleDeleteField = (fieldId: string) => {
    dispatch(deleteField(fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  const handleSaveForm = () => {
    if (!currentForm.name.trim()) {
      setSaveDialogOpen(true);
      return;
    }

    if (currentForm.fields.length === 0) {
      dispatch(setError('Please add at least one field to the form'));
      return;
    }

    dispatch(saveCurrentForm());
    setSaveDialogOpen(false);
    
    setTimeout(() => {
      dispatch(clearCurrentForm());
      setSelectedField(null);
      setFormNameInput('');
    }, 1000);
  };

  const handleSaveWithName = () => {
    if (!formNameInput.trim()) {
      dispatch(setError('Form name is required'));
      return;
    }

    dispatch(setFormName(formNameInput));
    setTimeout(() => {
      dispatch(saveCurrentForm());
      setSaveDialogOpen(false);
      
      setTimeout(() => {
        dispatch(clearCurrentForm());
        setSelectedField(null);
        setFormNameInput('');
      }, 1000);
    }, 100);
  };

  const handlePreview = () => {
    if (currentForm.fields.length === 0) {
      dispatch(setError('Please add at least one field to preview the form'));
      return;
    }

    const tempSchema = {
      id: 'temp',
      name: currentForm.name || 'Untitled Form',
      fields: currentForm.fields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(setCurrentSchema(tempSchema));
    navigate('/preview');
  };

  const handleClearForm = () => {
    dispatch(clearCurrentForm());
    setSelectedField(null);
    setFormNameInput('');
  };

  return (
    <Fade in={true} timeout={600}>
      <Box sx={{ position: 'relative' }}>
        {/* Hero Section */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            py: 1,
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <AutoAwesome sx={{ mr: 2, fontSize: '2.5rem', color: '#fbbf24' }} />
            Build Amazing Forms
          </Typography>
          <Typography 
            variant="h6" 
            color="rgba(255,255,255,0.8)"
            sx={{ fontWeight: 400, maxWidth: 600, mx: 'auto' }}
          >
            Create beautiful, functional forms with drag-and-drop simplicity
          </Typography>
        </Box>

        {error && (
          <Fade in={true}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }} 
              onClose={() => dispatch(setError(null))}
            >
              {error}
            </Alert>
          </Fade>
        )}

        <Grid container spacing={4}>
          {/* Left Panel - Form Configuration */}
          <Grid item xs={12} lg={8}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                mb: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography 
                  variant="h5"
                  sx={{ 
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Brush sx={{ mr: 2, color: 'primary.main' }} />
                  Form Designer
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Clear />}
                    onClick={handleClearForm}
                    disabled={currentForm.fields.length === 0}
                    sx={{ borderRadius: 2 }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Preview />}
                    onClick={handlePreview}
                    disabled={currentForm.fields.length === 0}
                    sx={{ borderRadius: 2 }}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveForm}
                    disabled={currentForm.fields.length === 0}
                    sx={{ 
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #065f46 100%)',
                      }
                    }}
                  >
                    Save Form
                  </Button>
                </Box>
              </Box>

              {/* Form Name */}
              <TextField
                fullWidth
                label="✨ Form Name"
                value={currentForm.name}
                onChange={(e) => {
                  dispatch(setFormName(e.target.value));
                  setFormNameInput(e.target.value);
                }}
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                  }
                }}
                placeholder="Enter a creative name for your form..."
              />

              <Divider sx={{ my: 4 }} />

              {/* Field Type Selector */}
              <FieldTypeSelector onAddField={handleAddField} />

              <Divider sx={{ my: 4 }} />

              {/* Fields List */}
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                  '&::before': {
                    content: '""',
                    width: 4,
                    height: 24,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                    mr: 2,
                  }
                }}
              >
                Form Fields ({currentForm.fields.length})
              </Typography>
              
              <FieldsList
                fields={currentForm.fields}
                selectedField={selectedField}
                onSelectField={setSelectedField}
                onUpdateField={handleUpdateField}
                onDeleteField={handleDeleteField}
              />
            </Paper>
          </Grid>

          {/* Right Panel - Field Configuration */}
          <Grid item xs={12} lg={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                position: 'sticky', 
                top: 100,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 3,
                }}
              >
                Field Configuration
              </Typography>
              
              {selectedField ? (
                <FieldConfiguration
                  field={selectedField}
                  onUpdate={handleUpdateField}
                  onDelete={handleDeleteField}
                  availableFields={currentForm.fields}
                />
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Select a field to configure
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click on any field from the list to customize its properties
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Save Dialog */}
        <Dialog 
          open={saveDialogOpen} 
          onClose={() => setSaveDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>💾 Save Your Form</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label="Form Name"
              value={formNameInput}
              onChange={(e) => setFormNameInput(e.target.value)}
              sx={{ 
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
              placeholder="Enter a memorable name..."
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setSaveDialogOpen(false)} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveWithName} 
              variant="contained" 
              sx={{ 
                borderRadius: 2,
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              }}
            >
              Save Form
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default FormBuilderPage;