import React from 'react';
import { Grid, Button, Paper, Typography, Box, Grow } from '@mui/material';
import {
  TextFields,
  Numbers,
  Subject,
  ExpandMore,
  RadioButtonChecked,
  CheckBox,
  DateRange,
} from '@mui/icons-material';
import { FieldType } from '../../types';

interface FieldTypeSelectorProps {
  onAddField: (type: FieldType) => void;
}

const fieldTypes = [
  {
    type: 'text' as FieldType,
    label: 'Text Field',
    icon: <TextFields />,
    description: 'Single line text input',
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  },
  {
    type: 'number' as FieldType,
    label: 'Number',
    icon: <Numbers />,
    description: 'Numeric input field',
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
  },
  {
    type: 'textarea' as FieldType,
    label: 'Text Area',
    icon: <Subject />,
    description: 'Multi-line text input',
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
  {
    type: 'select' as FieldType,
    label: 'Dropdown',
    icon: <ExpandMore />,
    description: 'Dropdown selection',
    color: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  },
  {
    type: 'radio' as FieldType,
    label: 'Radio Button',
    icon: <RadioButtonChecked />,
    description: 'Single choice selection',
    color: '#ec4899',
    bgGradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  },
  {
    type: 'checkbox' as FieldType,
    label: 'Checkbox',
    icon: <CheckBox />,
    description: 'Boolean true/false',
    color: '#6366f1',
    bgGradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  },
  {
    type: 'date' as FieldType,
    label: 'Date Picker',
    icon: <DateRange />,
    description: 'Date selection',
    color: '#ef4444',
    bgGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  },
];

const FieldTypeSelector: React.FC<FieldTypeSelectorProps> = ({ onAddField }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          mb: 3,
          fontWeight: 600,
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
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
        Choose Field Type
      </Typography>
      
      <Grid container spacing={3}>
        {fieldTypes.map((fieldType, index) => (
          <Grid item xs={12} sm={6} md={4} key={fieldType.type}>
            <Grow in={true} timeout={300 + index * 100}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: 4,
                    background: fieldType.bgGradient,
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
                    background: 'rgba(255, 255, 255, 1)',
                    '& .field-icon': {
                      transform: 'scale(1.2) rotate(5deg)',
                      color: fieldType.color,
                    },
                    '& .add-indicator': {
                      opacity: 1,
                      transform: 'translateX(0)',
                    }
                  },
                }}
                onClick={() => onAddField(fieldType.type)}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Box 
                    className="field-icon"
                    sx={{ 
                      color: fieldType.color,
                      mr: 2,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: `${fieldType.color}15`,
                    }}
                  >
                    {fieldType.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="bold"
                      sx={{ 
                        color: 'text.primary',
                        mb: 0.5,
                      }}
                    >
                      {fieldType.label}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ fontSize: '0.875rem' }}
                    >
                      {fieldType.description}
                    </Typography>
                  </Box>
                  <Typography
                    className="add-indicator"
                    sx={{
                      opacity: 0,
                      transform: 'translateX(10px)',
                      transition: 'all 0.3s ease',
                      color: fieldType.color,
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    +
                  </Typography>
                </Box>
              </Paper>
            </Grow>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FieldTypeSelector;