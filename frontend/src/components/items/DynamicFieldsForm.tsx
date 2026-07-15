import {
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  InputAdornment,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import type { FieldDefinition } from '../../api/collections';

interface DynamicFieldsFormProps {
  fieldDefinitions: FieldDefinition[];
  values: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
}

export default function DynamicFieldsForm({ fieldDefinitions, values, onChange }: DynamicFieldsFormProps) {
  if (!fieldDefinitions || fieldDefinitions.length === 0) return null;

  const renderField = (field: FieldDefinition) => {
    const value = values[field.id] || field.defaultValue || '';

    switch (field.fieldType) {
      case 'TEXT':
        return (
          <TextField
            key={field.id}
            label={field.name}
            fullWidth
            required={field.isRequired}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.description || undefined}
            size="small"
          />
        );

      case 'NUMBER':
        return (
          <TextField
            key={field.id}
            label={field.name}
            fullWidth
            type="number"
            required={field.isRequired}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.description || undefined}
            size="small"
            slotProps={{ htmlInput: { step: 1 } }}
          />
        );

      case 'DECIMAL':
        return (
          <TextField
            key={field.id}
            label={field.name}
            fullWidth
            type="number"
            required={field.isRequired}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.description || undefined}
            size="small"
            slotProps={{ htmlInput: { step: '0.01' } }}
          />
        );

      case 'DATE':
        return (
          <TextField
            key={field.id}
            label={field.name}
            fullWidth
            type="date"
            required={field.isRequired}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        );

      case 'BOOLEAN':
        return (
          <FormControlLabel
            key={field.id}
            control={
              <Switch
                checked={value === 'true'}
                onChange={(e) => onChange(field.id, e.target.checked ? 'true' : 'false')}
              />
            }
            label={field.name}
          />
        );

      case 'SELECT':
        return (
          <TextField
            key={field.id}
            label={field.name}
            fullWidth
            select
            required={field.isRequired}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            size="small"
          >
            <MenuItem value="">— Not set —</MenuItem>
            {field.options.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        );

      case 'MULTI_SELECT':
        return (
          <TextField
            key={field.id}
            label={field.name}
            fullWidth
            select
            required={field.isRequired}
            value={value ? value.split(',') : []}
            onChange={(e) => {
              const val = e.target.value;
              onChange(field.id, Array.isArray(val) ? val.join(',') : val);
            }}
            size="small"
            slotProps={{ select: { multiple: true } }}
          >
            {field.options.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        );

      case 'URL':
        return (
          <TextField
            key={field.id}
            label={field.name}
            fullWidth
            type="url"
            required={field.isRequired}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder="https://..."
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        );

      case 'COLOR':
        return (
          <TextField
            key={field.id}
            label={field.name}
            fullWidth
            type="color"
            required={field.isRequired}
            value={value || '#000000'}
            onChange={(e) => onChange(field.id, e.target.value)}
            size="small"
          />
        );

      default:
        return (
          <TextField
            key={field.id}
            label={field.name}
            fullWidth
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            size="small"
          />
        );
    }
  };

  return (
    <Grid container spacing={2}>
      {fieldDefinitions.map((field) => (
        <Grid size={{ xs: 12, sm: 6 }} key={field.id}>
          {renderField(field)}
        </Grid>
      ))}
    </Grid>
  );
}
