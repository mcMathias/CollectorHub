import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Grid,
  InputAdornment,
} from '@mui/material';
import type { Item, CreateItemInput, UpdateItemInput } from '../../api/items';

const CONDITIONS = [
  { value: 'MINT', label: 'Mint' },
  { value: 'NEAR_MINT', label: 'Near Mint' },
  { value: 'EXCELLENT', label: 'Excellent' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
];

const OWNERSHIP_STATUSES = [
  { value: 'OWNED', label: 'Owned' },
  { value: 'WISHLIST', label: 'Wishlist' },
  { value: 'SOLD', label: 'Sold' },
  { value: 'TRADED', label: 'Traded' },
  { value: 'LOANED', label: 'Loaned' },
  { value: 'RESERVED', label: 'Reserved' },
];

const CURRENCIES = [
  { code: 'DKK', symbol: 'kr' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'SEK', symbol: 'kr' },
  { code: 'NOK', symbol: 'kr' },
  { code: 'JPY', symbol: '¥' },
  { code: 'CHF', symbol: 'Fr' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'AUD', symbol: 'A$' },
];

interface ItemFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateItemInput | UpdateItemInput) => void;
  isLoading: boolean;
  item?: Item | null;
  collectionId: string;
}

const emptyForm = {
  title: '',
  subtitle: '',
  brand: '',
  purchasePrice: '',
  purchaseCurrencyCode: 'DKK',
  estimatedValue: '',
  estimatedCurrencyCode: 'DKK',
  purchaseDate: '',
  condition: '',
  quantity: '1',
  ownership: 'OWNED',
  notes: '',
};

export default function ItemFormDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
  item,
  collectionId,
}: ItemFormDialogProps) {
  const isEdit = !!item;
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title || '',
        subtitle: item.subtitle || '',
        brand: item.brand || '',
        purchasePrice: item.purchasePrice ? String(item.purchasePrice) : '',
        purchaseCurrencyCode: item.purchaseCurrencyCode || 'DKK',
        estimatedValue: item.estimatedValue ? String(item.estimatedValue) : '',
        estimatedCurrencyCode: item.estimatedCurrencyCode || 'DKK',
        purchaseDate: item.purchaseDate ? item.purchaseDate.split('T')[0] : '',
        condition: item.condition || '',
        quantity: String(item.quantity || 1),
        ownership: item.ownership || 'OWNED',
        notes: item.notes || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [item, open]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    const data: Record<string, unknown> = {};

    if (!isEdit) {
      data.collectionId = collectionId;
    }

    data.title = form.title;
    if (form.subtitle) data.subtitle = form.subtitle;
    if (form.brand) data.brand = form.brand;
    if (form.purchasePrice) data.purchasePrice = parseFloat(form.purchasePrice);
    data.purchaseCurrencyCode = form.purchaseCurrencyCode;
    if (form.estimatedValue) data.estimatedValue = parseFloat(form.estimatedValue);
    data.estimatedCurrencyCode = form.estimatedCurrencyCode;
    if (form.purchaseDate) data.purchaseDate = form.purchaseDate;
    if (form.condition) data.condition = form.condition;
    if (form.quantity) data.quantity = parseInt(form.quantity, 10);
    data.ownership = form.ownership;
    if (form.notes) data.notes = form.notes;

    onSubmit(data as CreateItemInput | UpdateItemInput);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Item' : 'Add New Item'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            fullWidth
            required
            value={form.title}
            onChange={handleChange('title')}
            placeholder="e.g., Millennium Falcon 75192"
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Subtitle"
                fullWidth
                value={form.subtitle}
                onChange={handleChange('subtitle')}
                placeholder="e.g., Ultimate Collector Series"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Brand"
                fullWidth
                value={form.brand}
                onChange={handleChange('brand')}
                placeholder="e.g., LEGO"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 8, sm: 5 }}>
              <TextField
                label="Purchase Price"
                fullWidth
                type="number"
                value={form.purchasePrice}
                onChange={handleChange('purchasePrice')}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        {CURRENCIES.find((c) => c.code === form.purchaseCurrencyCode)?.symbol || 'kr'}
                      </InputAdornment>
                    ),
                  },
                  htmlInput: { min: 0, step: '0.01' },
                }}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 2 }}>
              <TextField
                label="Currency"
                fullWidth
                select
                value={form.purchaseCurrencyCode}
                onChange={handleChange('purchaseCurrencyCode')}
              >
                {CURRENCIES.map((c) => (
                  <MenuItem key={c.code} value={c.code}>{c.code}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 8, sm: 3 }}>
              <TextField
                label="Estimated Value"
                fullWidth
                type="number"
                value={form.estimatedValue}
                onChange={handleChange('estimatedValue')}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        {CURRENCIES.find((c) => c.code === form.estimatedCurrencyCode)?.symbol || 'kr'}
                      </InputAdornment>
                    ),
                  },
                  htmlInput: { min: 0, step: '0.01' },
                }}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 2 }}>
              <TextField
                label="Currency"
                fullWidth
                select
                value={form.estimatedCurrencyCode}
                onChange={handleChange('estimatedCurrencyCode')}
              >
                {CURRENCIES.map((c) => (
                  <MenuItem key={c.code} value={c.code}>{c.code}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Purchase Date"
                fullWidth
                type="date"
                value={form.purchaseDate}
                onChange={handleChange('purchaseDate')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Condition"
                fullWidth
                select
                value={form.condition}
                onChange={handleChange('condition')}
              >
                <MenuItem value="">Not specified</MenuItem>
                {CONDITIONS.map((c) => (
                  <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
              <TextField
                label="Quantity"
                fullWidth
                type="number"
                value={form.quantity}
                onChange={handleChange('quantity')}
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
              <TextField
                label="Status"
                fullWidth
                select
                value={form.ownership}
                onChange={handleChange('ownership')}
              >
                {OWNERSHIP_STATUSES.map((s) => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={3}
            value={form.notes}
            onChange={handleChange('notes')}
            placeholder="Any additional notes..."
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!form.title || isLoading}
        >
          {isLoading ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : 'Add Item')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
