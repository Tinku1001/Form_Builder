import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Chip,
  Paper,
} from '@mui/material';
import {
  Delete,
  Edit,
  DragIndicator,
  TextFields,
  Numbers,
  Subject,
  ExpandMore,
  RadioButtonChecked,
  CheckBox,
  DateRange,
  Functions,
} from '@mui/icons-material';
import { FormField } from '../../types';

interface FieldsListProps {
  fields: FormField[];
  selectedField: FormField | null;
  onSelectField: (field: FormField) => void;
  onUpdateField: (field: FormField) => void;
  onDeleteField: (fieldId: string) => void;
}

const getFieldIcon = (type: string) => {
  switch (type) {
    case 'text':
      return <TextFields fontSize="small" />;
    case 'number':
      return <Numbers fontSize="small" />;
    case 'textarea':
      return <Subject fontSize="small" />;
    case 'select':
      return <ExpandMore fontSize="small" />;
    case 'radio':
      return <RadioButtonChecked fontSize="small" />;
    case 'checkbox':
      return <CheckBox fontSize="small" />;
    case 'date':
      return <DateRange fontSize="small" />;
    default:
      return <TextFields fontSize="small" />;
  }
};

const FieldsList: React.FC<FieldsListProps> = ({
  fields,
  selectedField,
  onSelectField,
  onDeleteField,
}) => {
  if (fields.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
        <Typography variant="body1" color="text.secondary">
          No fields added yet. Start by selecting a field type above.
        </Typography>
      </Paper>
    );
  }

  return (
    <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
      {fields.map((field, index) => (
        <ListItem
          key={field.id}
          sx={{
            border: '1px solid',
            borderColor: selectedField?.id === field.id ? 'primary.main' : 'divider',
            borderRadius: 1,
            mb: 1,
            bgcolor: selectedField?.id === field.id ? 'primary.50' : 'background.paper',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: selectedField?.id === field.id ? 'primary.100' : 'action.hover',
            },
          }}
          onClick={() => onSelectField(field)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <DragIndicator sx={{ color: 'text.disabled', mr: 1 }} />
            <Box sx={{ color: 'primary.main' }}>
              {getFieldIcon(field.type)}
            </Box>
          </Box>

          {/* Fix: Use custom content instead of ListItemText to avoid <div> in <p> issue */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {/* Primary content */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography 
                variant="subtitle2"
                component="span"
                sx={{ fontWeight: 600 }}
              >
                {field.label}
              </Typography>
              {field.required && (
                <Chip label="Required" size="small" color="error" variant="outlined" />
              )}
              {field.isDerived && (
                <Chip 
                  label="Derived" 
                  size="small" 
                  color="secondary" 
                  variant="outlined"
                  icon={<Functions fontSize="small" />}
                />
              )}
            </Box>
            
            {/* Secondary content */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
              </Typography>
              {field.validationRules.length > 0 && (
                <Chip 
                  label={`${field.validationRules.length} validation${field.validationRules.length > 1 ? 's' : ''}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          <ListItemSecondaryAction>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                edge="end"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectField(field);
                }}
                sx={{ color: 'primary.main' }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                edge="end"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteField(field.id);
                }}
                sx={{ color: 'error.main' }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default FieldsList;