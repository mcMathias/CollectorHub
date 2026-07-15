import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Pagination,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import { useCollection } from '../api/collections';
import {
  useItems,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
} from '../api/items';
import type { Item, CreateItemInput, UpdateItemInput } from '../api/items';
import ItemCard from '../components/items/ItemCard';
import ItemFormDialog from '../components/items/ItemFormDialog';
import DeleteItemDialog from '../components/items/DeleteItemDialog';

const CONDITIONS = [
  { value: '', label: 'All Conditions' },
  { value: 'MINT', label: 'Mint' },
  { value: 'NEAR_MINT', label: 'Near Mint' },
  { value: 'EXCELLENT', label: 'Excellent' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
];

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'title:asc', label: 'Title A-Z' },
  { value: 'title:desc', label: 'Title Z-A' },
  { value: 'purchasePrice:desc', label: 'Price: High to Low' },
  { value: 'purchasePrice:asc', label: 'Price: Low to High' },
  { value: 'estimatedValue:desc', label: 'Value: High to Low' },
  { value: 'estimatedValue:asc', label: 'Value: Low to High' },
];

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [sort, setSort] = useState('createdAt:desc');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [sortBy, sortOrder] = sort.split(':') as [string, 'asc' | 'desc'];

  const { data: collection, isLoading: collectionLoading } = useCollection(id!);
  const { data: itemsResponse, isLoading: itemsLoading } = useItems(id!, {
    search: searchDebounced || undefined,
    condition: conditionFilter || undefined,
    sortBy,
    sortOrder,
    page,
    limit: 20,
  });

  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem(id!);
  const deleteMutation = useDeleteItem(id!);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    setTimeout(() => setSearchDebounced(value), 300);
  };

  const handleCreate = async (data: CreateItemInput | UpdateItemInput) => {
    try {
      await createMutation.mutateAsync(data as CreateItemInput);
      setFormOpen(false);
      setSnackbar({ open: true, message: 'Item added successfully!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to add item', severity: 'error' });
    }
  };

  const handleUpdate = async (data: CreateItemInput | UpdateItemInput) => {
    if (!editingItem) return;
    try {
      await updateMutation.mutateAsync({ id: editingItem.id, data: data as UpdateItemInput });
      setEditingItem(null);
      setSnackbar({ open: true, message: 'Item updated successfully!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update item', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteMutation.mutateAsync(deletingItem.id);
      setDeletingItem(null);
      setSnackbar({ open: true, message: 'Item deleted successfully!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete item', severity: 'error' });
    }
  };

  if (collectionLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={48} />
        <Skeleton variant="rounded" height={56} sx={{ mt: 2 }} />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton variant="rounded" height={200} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!collection) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6">Collection not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/collections')}>
          Back to Collections
        </Button>
      </Box>
    );
  }

  const items = itemsResponse?.data || [];
  const meta = itemsResponse?.meta;

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/collections')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography fontSize="2rem">
          {collection.collectionType?.icon || '📦'}
        </Typography>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={700}>
            {collection.name}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {meta?.total || 0} items
            </Typography>
            {collection.collectionType?.name && (
              <Chip
                size="small"
                label={collection.collectionType.name}
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Stack>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          Add Item
        </Button>
      </Stack>

      {/* Search and Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search items..."
          size="small"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          sx={{ flex: 1, maxWidth: { sm: 300 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select
          size="small"
          value={conditionFilter}
          onChange={(e) => { setConditionFilter(e.target.value); setPage(1); }}
          sx={{ minWidth: 160 }}
        >
          {CONDITIONS.map((c) => (
            <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          sx={{ minWidth: 200 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SortIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        >
          {SORT_OPTIONS.map((s) => (
            <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* Items Grid */}
      {itemsLoading ? (
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
              <Skeleton variant="rounded" height={200} />
            </Grid>
          ))}
        </Grid>
      ) : items.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <Typography fontSize="3rem" sx={{ mb: 2 }}>
              {searchDebounced || conditionFilter ? '🔍' : '📭'}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {searchDebounced || conditionFilter ? 'No items match your filters' : 'No items yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchDebounced || conditionFilter
                ? 'Try adjusting your search or filters.'
                : 'Add your first item to start building your collection.'}
            </Typography>
            {!searchDebounced && !conditionFilter && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
                Add First Item
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
                <ItemCard
                  item={item}
                  collectionId={id!}
                  onEdit={(i) => setEditingItem(i)}
                  onDelete={(i) => setDeletingItem(i)}
                />
              </Grid>
            ))}
          </Grid>

          {meta && meta.totalPages > 1 && (
            <Stack alignItems="center" sx={{ mt: 4 }}>
              <Pagination
                count={meta.totalPages}
                page={page}
                onChange={(_e, p) => setPage(p)}
                color="primary"
                shape="rounded"
              />
            </Stack>
          )}
        </>
      )}

      {/* Dialogs */}
      <ItemFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        collectionId={id!}
      />

      <ItemFormDialog
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isPending}
        item={editingItem}
        collectionId={id!}
      />

      <DeleteItemDialog
        open={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        itemTitle={deletingItem?.title || ''}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
