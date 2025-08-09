import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Fade,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Schedule,
  ListAlt,
  Functions,
  Add,
  FolderOpen,
} from '@mui/icons-material';
import dayjs from 'dayjs';

import { RootState } from '../store';
import { deleteForm, loadForm } from '../store/slices/formBuilderSlice';
import { setCurrentSchema } from '../store/slices/previewSlice';
import { FormSchema } from '../types';
import { deleteFormFromStorage } from '../utils/localStorage';

const MyFormsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedForms } = useSelector((state: RootState) => state.formBuilder);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<FormSchema | null>(null);

  const handlePreviewForm = (form: FormSchema) => {
    dispatch(setCurrentSchema(form));
    navigate(`/preview/${form.id}`);
  };

  const handleEditForm = (form: FormSchema) => {
    dispatch(loadForm(form));
    navigate('/create');
  };

  const handleDeleteForm = (form: FormSchema) => {
    setFormToDelete(form);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteForm = () => {
    if (formToDelete) {
      dispatch(deleteForm(formToDelete.id));
      deleteFormFromStorage(formToDelete.id);
      setFormToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const getFormStats = (form: FormSchema) => {
    const totalFields = form.fields.length;
    const requiredFields = form.fields.filter(field => field.required).length;
    const derivedFields = form.fields.filter(field => field.isDerived).length;
    const fieldsWithValidation = form.fields.filter(field => field.validationRules.length > 0).length;

    return {
      totalFields,
      requiredFields,
      derivedFields,
      fieldsWithValidation,
    };
  };

  if (savedForms.length === 0) {
    return (
      <Fade in={true} timeout={600}>
        <Box>
          {/* Hero Section for Empty State */}
          <Box 
            sx={{ 
              textAlign: 'center', 
              mb: 6,
              py: 4,
            }}
          >
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{
                fontWeight: 800,
                mb: 2,
                color: 'white',
                textShadow: '0 2px 0px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FolderOpen sx={{ mr: 2, fontSize: '3rem' }} />
              My Forms
            </Typography>
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
            <Box sx={{ mb: 4 }}>
              <FolderOpen sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" color="text.primary" gutterBottom fontWeight={600}>
                No saved forms yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                Start building amazing forms with our intuitive drag-and-drop builder. 
                Create your first form and save it to see it here.
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate('/create')}
              size="large"
              startIcon={<Add />}
              sx={{ 
                py: 2, 
                px: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #065f46 100%)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Create Your First Form
            </Button>
          </Paper>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in={true} timeout={600}>
      <Box>
        {/* Enhanced Header */}
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
              <FolderOpen sx={{ mr: 2, fontSize: '2.5rem' }} />
              My Forms ({savedForms.length})
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 400,
              }}
            >
              Manage and organize all your created forms
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            onClick={() => navigate('/create')}
            startIcon={<Add />}
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
            Create New Form
          </Button>
        </Box>

        <Grid container spacing={3}>
          {savedForms.map((form, index) => {
            const stats = getFormStats(form);
            
            return (
              <Grid item xs={12} sm={6} lg={4} key={form.id}>
                <Fade in={true} timeout={400 + index * 100}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
                        background: 'rgba(255, 255, 255, 1)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        noWrap
                        sx={{ 
                          fontWeight: 700,
                          color: 'text.primary',
                          mb: 2,
                        }}
                      >
                        {form.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Schedule fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Created {dayjs(form.createdAt).format('MMM D, YYYY')}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip
                          icon={<ListAlt fontSize="small" />}
                          label={`${stats.totalFields} field${stats.totalFields !== 1 ? 's' : ''}`}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        />
                        
                        {stats.requiredFields > 0 && (
                          <Chip
                            label={`${stats.requiredFields} required`}
                            size="small"
                            sx={{ 
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                              color: 'white',
                              fontWeight: 500,
                            }}
                          />
                        )}
                        
                        {stats.derivedFields > 0 && (
                          <Chip
                            icon={<Functions fontSize="small" />}
                            label={`${stats.derivedFields} derived`}
                            size="small"
                            sx={{ 
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                              color: 'white',
                              fontWeight: 500,
                            }}
                          />
                        )}
                        
                        {stats.fieldsWithValidation > 0 && (
                          <Chip
                            label={`${stats.fieldsWithValidation} validated`}
                            size="small"
                            sx={{ 
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                              color: 'white',
                              fontWeight: 500,
                            }}
                          />
                        )}
                      </Box>

                      {form.updatedAt !== form.createdAt && (
                        <Typography variant="caption" color="text.secondary">
                          Updated {dayjs(form.updatedAt).format('MMM D, YYYY')}
                        </Typography>
                      )}
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handlePreviewForm(form)}
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': { 
                              background: 'primary.50',
                              transform: 'scale(1.1)',
                            }
                          }}
                          title="Preview Form"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditForm(form)}
                          sx={{ 
                            color: 'warning.main',
                            '&:hover': { 
                              background: 'warning.50',
                              transform: 'scale(1.1)',
                            }
                          }}
                          title="Edit Form"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteForm(form)}
                        sx={{ 
                          color: 'error.main',
                          '&:hover': { 
                            background: 'error.50',
                            transform: 'scale(1.1)',
                          }
                        }}
                        title="Delete Form"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
            );
          })}
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { 
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>🗑️ Delete Form</DialogTitle>
          <DialogContent>
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 2,
                borderRadius: 2,
                background: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid rgba(255, 193, 7, 0.2)',
              }}
            >
              This action cannot be undone.
            </Alert>
            <Typography>
              Are you sure you want to delete "<strong>{formToDelete?.name}</strong>"?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteForm}
              variant="contained"
              sx={{ 
                borderRadius: 2,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                }
              }}
            >
              Delete Form
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default MyFormsPage;