import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Divider,
  Grid,
  Fade,
  Container,
} from '@mui/material';
import { 
  CheckCircle, 
  Error, 
  Refresh, 
  PlayArrow,
  Visibility,
  Send,
  Edit,
} from '@mui/icons-material';

import { RootState } from '../store';
import {
  setCurrentSchema,
  updateFormData,
  clearFormData,
  setValidationErrors,
  computeDerivedFields,
} from '../store/slices/previewSlice';
import { getFormById } from '../utils/localStorage';
import { validateForm } from '../utils/Validation';
import FieldRenderer from '../components/FormPreview/FieldRenderer';

const PreviewPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formId } = useParams();
  const { currentSchema, formData, validationErrors } = useSelector((state: RootState) => state.preview);
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (formId) {
      // Load specific saved form
      const savedForm = getFormById(formId);
      if (savedForm) {
        dispatch(setCurrentSchema(savedForm));
      }
    } else if (currentForm.fields.length > 0) {
      // Use current form being built
      const tempSchema = {
        id: 'temp',
        name: currentForm.name || 'Untitled Form',
        fields: currentForm.fields,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(setCurrentSchema(tempSchema));
    }
  }, [formId, currentForm, dispatch]);

  // Compute derived fields when form data changes
  useEffect(() => {
    if (currentSchema && currentSchema.fields.some(field => field.isDerived)) {
      dispatch(computeDerivedFields());
    }
  }, [formData, currentSchema, dispatch]);

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch(updateFormData({ fieldId, value }));
    setIsSubmitted(false); // Reset submission state when data changes
  };

  const handleSubmit = () => {
    if (!currentSchema) return;

    const errors = validateForm(currentSchema.fields, formData);
    dispatch(setValidationErrors(errors));

    if (errors.length === 0) {
      setIsSubmitted(true);
      console.log('Form submitted successfully:', formData);
    } else {
      setIsSubmitted(false);
    }
  };

  const handleReset = () => {
    dispatch(clearFormData());
    setIsSubmitted(false);
  };

  if (!currentSchema) {
    return (
      <Fade in={true} timeout={600}>
        <Box>
          {/* Enhanced Header - EXACT same as My Forms */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography 
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  textShadow: '0 2px 0px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Visibility sx={{ mr: 2, fontSize: '2.5rem' }} />
                Form Preview
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 400,
                }}
              >
                Test your form as users will experience it
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              onClick={() => navigate('/create')}
              startIcon={<Edit />}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontWeight: 600,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Back to Builder
            </Button>
          </Box>
          
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 4,
            }}
          >
            <PlayArrow sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.primary" gutterBottom fontWeight={600}>
              No form available for preview
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
              Please go to the Form Builder to create a form first, then come back here to see how it looks to your users.
            </Typography>
          </Paper>
        </Box>
      </Fade>
    );
  }

  const sortedFields = [...currentSchema.fields].sort((a, b) => a.order - b.order);

  return (
    <Fade in={true} timeout={600}>
      <Box>
        {/* Enhanced Header - EXACT same as My Forms */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography 
              variant="h4"
              sx={{
                fontWeight: 800,
                color: 'white',
                textShadow: '0 2px 0px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Visibility sx={{ mr: 2, fontSize: '2.5rem' }} />
              Form Preview
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 400,
              }}
            >
              {currentSchema ? `Previewing: "${currentSchema.name}"` : 'Test your form as users will experience it'}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            onClick={() => navigate('/create')}
            startIcon={<Edit />}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Back to Builder
          </Button>
        </Box>

        {/* Success Alert */}
        {isSubmitted && (
          <Fade in={true}>
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                background: 'rgba(16, 185, 129, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'white',
                '& .MuiAlert-icon': {
                  color: '#10b981',
                },
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
              }} 
              icon={<CheckCircle />}
            >
              <Typography variant="body1" fontWeight={600}>
                🎉 Form submitted successfully! All validations passed.
              </Typography>
            </Alert>
          </Fade>
        )}

        {/* Error Alert */}
        {validationErrors.length > 0 && !isSubmitted && (
          <Fade in={true}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                background: 'rgba(239, 68, 68, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'white',
                '& .MuiAlert-icon': {
                  color: '#ef4444',
                },
                boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)',
              }} 
              icon={<Error />}
            >
              <Typography variant="body1" fontWeight={600} gutterBottom>
                Please fix the following errors before submitting:
              </Typography>
              <Box component="ul" sx={{ margin: '8px 0', paddingLeft: '20px' }}>
                {validationErrors.map((error, index) => (
                  <Typography component="li" key={index} variant="body2">
                    {error.message}
                  </Typography>
                ))}
              </Box>
            </Alert>
          </Fade>
        )}

        {/* Form Container */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 4,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Form Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              {currentSchema.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please fill out all required fields marked with *
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {sortedFields.map((field, index) => {
              const error = validationErrors.find(err => err.fieldId === field.id);
              
              return (
                <Grid item xs={12} key={field.id}>
                  <Fade in={true} timeout={300 + index * 100}>
                    <Box>
                      <FieldRenderer
                        field={field}
                        value={formData[field.id]}
                        error={error?.message}
                        onChange={(value) => handleFieldChange(field.id, value)}
                        formData={formData}
                      />
                    </Box>
                  </Fade>
                </Grid>
              );
            })}

            {sortedFields.length === 0 && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <PlayArrow sx={{ fontSize: '3rem', color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    This form has no fields to display
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add some fields in the form builder to see them here
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Form Actions */}
          {sortedFields.length > 0 && (
            <>
              <Divider sx={{ my: 4 }} />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleReset}
                  disabled={Object.keys(formData).length === 0}
                  sx={{ 
                    borderRadius: 2,
                    py: 1.5,
                    px: 3,
                    fontWeight: 600,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      background: 'primary.50',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  Reset Form
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  sx={{ 
                    borderRadius: 2,
                    py: 1.5,
                    px: 3,
                    fontWeight: 600,
                    background: isSubmitted 
                      ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: isSubmitted 
                        ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
                        : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                      color: 'white',
                    }
                  }}
                >
                  {isSubmitted ? 'Submitted!' : 'Submit Form'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Fade>
  );
};

export default PreviewPage;