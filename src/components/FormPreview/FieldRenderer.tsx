import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Functions } from '@mui/icons-material';
import dayjs from 'dayjs';
import { FieldRendererProps } from '../../types';

const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  error,
  onChange,
}) => {
  const isRequired = field.required;
  const hasError = Boolean(error);

  // Common props for all field types
  const commonProps = {
    error: hasError,
    helperText: error,
    disabled: field.isDerived,
  };

  const renderFieldLabel = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Typography variant="subtitle1" component="label">
        {field.label}
        {isRequired && (
          <span style={{ color: 'red', marginLeft: 4 }}>*</span>
        )}
      </Typography>
      {field.isDerived && (
        <Chip
          icon={<Functions fontSize="small" />}
          label="Auto-computed"
          size="small"
          variant="outlined"
          color="secondary"
          sx={{ ml: 2 }}
        />
      )}
    </Box>
  );

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            value={value || field.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            {...commonProps}
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            value={value || field.defaultValue || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            {...commonProps}
          />
        );

      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            value={value || field.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            {...commonProps}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth error={hasError} disabled={field.isDerived}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || field.defaultValue || ''}
              onChange={(e) => onChange(e.target.value)}
              label={field.label}
            >
              <MenuItem value="">
                <em>Select an option</em>
              </MenuItem>
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset" error={hasError} disabled={field.isDerived}>
            <RadioGroup
              value={value || field.defaultValue || ''}
              onChange={(e) => onChange(e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl error={hasError} disabled={field.isDerived}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value || field.defaultValue || false}
                  onChange={(e) => onChange(e.target.checked)}
                />
              }
              label={field.label}
            />
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'date':
        const getDateValue = (val: any) => {
            if (!val || typeof val === 'boolean') return null;
            try {
            return dayjs(val);
            } catch {
            return null;
            }
        };

        return (
          <DatePicker
      label={field.label}
      value={getDateValue(value) || getDateValue(field.defaultValue)}
      onChange={(newValue) => onChange(newValue ? newValue.toDate() : null)}
      disabled={field.isDerived}
      slotProps={{
        textField: {
          fullWidth: true,
          error: hasError,
          helperText: error,
        },
      }}
    />
        );

      default:
        return (
          <TextField
            fullWidth
            value={value || field.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            {...commonProps}
          />
        );
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      {field.type !== 'checkbox' && renderFieldLabel()}
      {renderField()}
      
      {field.isDerived && field.derivedLogic?.formula && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Formula: {field.derivedLogic.formula}
        </Typography>
      )}
    </Box>
  );
};

export default FieldRenderer;