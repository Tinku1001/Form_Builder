import React, { useState } from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Divider,
  Button,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { Add, Delete, Functions } from "@mui/icons-material";
import {
  FormField,
  ValidationRule,
  FieldOption,
  DerivedFieldLogic,
  FieldConfigProps,
} from "../../types";
import {
  createValidationRule,
  getDefaultMessage,
} from "../../utils/Validation";

const FieldConfiguration: React.FC<FieldConfigProps> = ({
  field,
  onUpdate,
  onDelete,
  availableFields,
}) => {
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [derivedDialogOpen, setDerivedDialogOpen] = useState(false);
  const [newValidationRule, setNewValidationRule] = useState<Partial<ValidationRule>>({
    type: "required",
  });

  const handleFieldUpdate = (updates: Partial<FormField>) => {
    onUpdate({ ...field, ...updates });
  };

  const handleAddValidationRule = () => {
    if (newValidationRule.type) {
      const rule = createValidationRule(
        newValidationRule.type,
        newValidationRule.value,
        newValidationRule.message
      );

      handleFieldUpdate({
        validationRules: [...field.validationRules, rule],
      });

      setNewValidationRule({ type: "required" });
      setValidationDialogOpen(false);
    }
  };

  const handleRemoveValidationRule = (index: number) => {
    const updatedRules = field.validationRules.filter((_, i) => i !== index);
    handleFieldUpdate({ validationRules: updatedRules });
  };

  const handleAddOption = () => {
    const newOption: FieldOption = {
      label: `Option ${(field.options?.length || 0) + 1}`,
      value: `option${(field.options?.length || 0) + 1}`,
    };

    handleFieldUpdate({
      options: [...(field.options || []), newOption],
    });
  };

  const handleUpdateOption = (index: number, updates: Partial<FieldOption>) => {
    const updatedOptions =
      field.options?.map((option, i) =>
        i === index ? { ...option, ...updates } : option
      ) || [];

    handleFieldUpdate({ options: updatedOptions });
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = field.options?.filter((_, i) => i !== index) || [];
    handleFieldUpdate({ options: updatedOptions });
  };

  const handleToggleDerived = (isDerived: boolean) => {
    if (isDerived) {
      handleFieldUpdate({
        isDerived: true,
        derivedLogic: {
          parentFields: [],
          formula: "",
          computeFunction: "",
        },
      });
    } else {
      handleFieldUpdate({
        isDerived: false,
        derivedLogic: undefined,
      });
    }
  };

  const handleDerivedLogicUpdate = (updates: Partial<DerivedFieldLogic>) => {
    handleFieldUpdate({
      derivedLogic: { ...field.derivedLogic!, ...updates },
    });
  };

  // Enhanced filtering with debugging
  const nonDerivedFields = availableFields.filter(
    (f) => f.id !== field.id && !f.isDerived
  );

  return (
    <Box>
      {/* Basic Configuration */}
      <TextField
        fullWidth
        label="Field Label"
        value={field.label}
        onChange={(e) => handleFieldUpdate({ label: e.target.value })}
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={field.required}
            onChange={(e) => handleFieldUpdate({ required: e.target.checked })}
          />
        }
        label="Required Field"
        sx={{ mb: 2 }}
      />

      {/* Default Value */}
      {!field.isDerived && (
        <TextField
          fullWidth
          label="Default Value"
          value={field.defaultValue || ""}
          onChange={(e) => handleFieldUpdate({ defaultValue: e.target.value })}
          sx={{ mb: 2 }}
          type={field.type === "number" ? "number" : "text"}
        />
      )}

      {/* Options for Select/Radio fields */}
      {(field.type === "select" || field.type === "radio") && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Options
          </Typography>
          {field.options?.map((option, index) => (
            <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                size="small"
                label="Label"
                value={option.label}
                onChange={(e) =>
                  handleUpdateOption(index, { label: e.target.value })
                }
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                label="Value"
                value={option.value}
                onChange={(e) =>
                  handleUpdateOption(index, { value: e.target.value })
                }
                sx={{ flex: 1 }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemoveOption(index)}
                color="error"
              >
                <Delete />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<Add />}
            onClick={handleAddOption}
            variant="outlined"
            size="small"
            fullWidth
          >
            Add Option
          </Button>
        </>
      )}

      {/* Derived Field Configuration */}
      <Divider sx={{ my: 2 }} />
      <FormControlLabel
        control={
          <Switch
            checked={field.isDerived}
            onChange={(e) => handleToggleDerived(e.target.checked)}
          />
        }
        label="Derived Field"
        sx={{ mb: 1 }}
      />

      {field.isDerived && (
        <Box sx={{ ml: 2 }}>
          <Alert severity="info" sx={{ mb: 2, fontSize: "0.875rem" }}>
            Derived fields compute their values automatically based on other
            fields.
          </Alert>

          <Button
            startIcon={<Functions />}
            onClick={() => setDerivedDialogOpen(true)}
            variant="outlined"
            size="small"
          >
            Configure Logic
          </Button>

          {field.derivedLogic?.parentFields &&
            field.derivedLogic.parentFields.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Depends on: {field.derivedLogic.parentFields.map(fieldId => {
                    const parentField = availableFields.find(f => f.id === fieldId);
                    return parentField ? parentField.label : fieldId;
                  }).join(", ")}
                </Typography>
              </Box>
            )}
        </Box>
      )}

      {/* Validation Rules */}
      {!field.isDerived && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="subtitle2">Validation Rules</Typography>
            <Button
              startIcon={<Add />}
              onClick={() => setValidationDialogOpen(true)}
              variant="outlined"
              size="small"
            >
              Add Rule
            </Button>
          </Box>

          {field.validationRules.map((rule, index) => (
            <Paper key={index} sx={{ p: 1, mb: 1, bgcolor: "grey.50" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="caption" fontWeight="medium">
                    {rule.type.toUpperCase()}
                    {rule.value && `: ${rule.value}`}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    {rule.message}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveValidationRule(index)}
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </>
      )}

      {/* Delete Field */}
      <Divider sx={{ my: 2 }} />
      <Button
        variant="outlined"
        color="error"
        fullWidth
        onClick={() => onDelete(field.id)}
      >
        Delete Field
      </Button>

      {/* Validation Rule Dialog */}
      <Dialog
        open={validationDialogOpen}
        onClose={() => setValidationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Validation Rule</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Rule Type</InputLabel>
            <Select
              value={newValidationRule.type || ""}
              onChange={(e) =>
                setNewValidationRule({
                  ...newValidationRule,
                  type: e.target.value as any,
                })
              }
              label="Rule Type"
            >
              <MenuItem value="required">Required</MenuItem>
              <MenuItem value="minLength">Minimum Length</MenuItem>
              <MenuItem value="maxLength">Maximum Length</MenuItem>
              <MenuItem value="email">Email Format</MenuItem>
              <MenuItem value="password">Password Rules</MenuItem>
            </Select>
          </FormControl>

          {(newValidationRule.type === "minLength" ||
            newValidationRule.type === "maxLength") && (
            <TextField
              fullWidth
              label="Length"
              type="number"
              value={newValidationRule.value || ""}
              onChange={(e) =>
                setNewValidationRule({
                  ...newValidationRule,
                  value: parseInt(e.target.value),
                })
              }
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            fullWidth
            label="Custom Error Message (Optional)"
            value={newValidationRule.message || ""}
            onChange={(e) =>
              setNewValidationRule({
                ...newValidationRule,
                message: e.target.value,
              })
            }
            placeholder={getDefaultMessage(
              newValidationRule.type!,
              newValidationRule.value
            )}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValidationDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddValidationRule} variant="contained">
            Add Rule
          </Button>
        </DialogActions>
      </Dialog>

      {/*  Enhanced Derived Field Logic Dialog */}
      <Dialog
        open={derivedDialogOpen}
        onClose={() => setDerivedDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Configure Derived Field Logic</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Parent Fields</InputLabel>
            <Select
              multiple
              value={field.derivedLogic?.parentFields || []}
              onChange={(e) =>
                handleDerivedLogicUpdate({
                  parentFields: e.target.value as string[],
                })
              }
              label="Parent Fields"
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as string[]).map((fieldId) => {
                    // ✅ Fixed: Find the actual field to show its label
                    const selectedField = availableFields.find(f => f.id === fieldId);
                    return (
                      <Chip 
                        key={fieldId} 
                        label={selectedField ? selectedField.label : fieldId} 
                        size="small" 
                      />
                    );
                  })}
                </Box>
              )}
            >
              {/* Enhanced: Show helpful message if no fields available */}
              {nonDerivedFields.length === 0 ? (
                <MenuItem disabled>
                  <Box sx={{ py: 2, textAlign: 'center', width: '100%' }}>
                    <Typography variant="body2" color="text.secondary">
                      No fields available for selection.
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Add some regular (non-derived) fields first.
                    </Typography>
                  </Box>
                </MenuItem>
              ) : (
                nonDerivedFields.map((availableField) => (
                  <MenuItem key={availableField.id} value={availableField.id}>
                    <Box>
                      <Typography variant="body2">
                        {availableField.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {availableField.type} field
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
            
            {/*Added helper text */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {nonDerivedFields.length === 0 
                ? "Create some regular fields first, then configure this derived field."
                : `${nonDerivedFields.length} field(s) available for selection.`
              }
            </Typography>
          </FormControl>

          <TextField
            fullWidth
            label="Formula Description"
            value={field.derivedLogic?.formula || ""}
            onChange={(e) =>
              handleDerivedLogicUpdate({ formula: e.target.value })
            }
            sx={{ mb: 2 }}
            placeholder="e.g., Calculate age from birth date"
            multiline
            rows={2}
          />

          <TextField
            fullWidth
            label="Compute Function"
            value={field.derivedLogic?.computeFunction || ""}
            onChange={(e) =>
              handleDerivedLogicUpdate({ computeFunction: e.target.value })
            }
            placeholder="e.g., new Date().getFullYear() - new Date(formData.birthDate).getFullYear()"
            multiline
            rows={3}
            helperText="JavaScript expression to compute the value. Parent field values are available by their IDs."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDerivedDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => setDerivedDialogOpen(false)}
            variant="contained"
            disabled={
              !field.derivedLogic?.parentFields?.length ||
              !field.derivedLogic?.computeFunction
            }
          >
            Save Logic
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FieldConfiguration;