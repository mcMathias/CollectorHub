import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Skeleton,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import {
  useCollections,
  useCollectionTypes,
  useCreateCollection,
  useDeleteCollection,
} from '../api';

export default function CollectionsPage() {
  const navigate = useNavigate();
  const { data: collections, isLoading } = useCollections();
  const { data: collectionTypes } = useCollectionTypes();
  const createMutation = useCreateCollection();
  const deleteMutation = useDeleteCollection();

  const [createOpen, setCreateOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    collectionTypeId: '',
    description: '',
    visibility: 'PRIVATE' as 'PRIVATE' | 'PUBLIC',
  });

  const handleCreate = async () => {
    if (!form.name || !form.collectionTypeId) return;
    await createMutation.mutateAsync({
      name: form.name,
      collectionTypeId: form.collectionTypeId,
      description: form.description || undefined,
      visibility: form.visibility,
    });
    setCreateOpen(false);
    setForm({ name: '', collectionTypeId: '', description: '', visibility: 'PRIVATE' });
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    await deleteMutation.mutateAsync(selectedId);
    setMenuAnchor(null);
    setSelectedId(null);
  };

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={48} />
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[1, 2, 3].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton variant="rounded" height={180} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Collections
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {collections?.length || 0} collections
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          New Collection
        </Button>
      </Stack>

      {collections && collections.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <Typography fontSize="3rem" sx={{ mb: 2 }}>📦</Typography>
            <Typography variant="h6" gutterBottom>
              No collections yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first collection to start tracking your collectibles.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
              Create Collection
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {collections?.map((collection) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={collection.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(108, 99, 255, 0.15)',
                  },
                }}
                onClick={() => navigate(`/collections/${collection.id}`)}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Typography fontSize="2rem">
                        {collection.collectionType?.icon || '📦'}
                      </Typography>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {collection.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {collection.collectionType?.name}
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuAnchor(e.currentTarget);
                        setSelectedId(collection.id);
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  {collection.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                    >
                      {collection.description}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
                  <Chip
                    size="small"
                    label={`${collection._count.items} items`}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    icon={collection.visibility === 'PUBLIC' ? <PublicIcon /> : <LockIcon />}
                    label={collection.visibility === 'PUBLIC' ? 'Public' : 'Private'}
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Collection</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Collection Name"
              fullWidth
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g., My LEGO Star Wars"
            />
            <TextField
              label="Collection Type"
              fullWidth
              required
              select
              value={form.collectionTypeId}
              onChange={(e) => setForm((f) => ({ ...f, collectionTypeId: e.target.value }))}
            >
              {collectionTypes?.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span>{type.icon}</span>
                    <span>{type.name}</span>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <TextField
              label="Visibility"
              fullWidth
              select
              value={form.visibility}
              onChange={(e) => setForm((f) => ({ ...f, visibility: e.target.value as 'PRIVATE' | 'PUBLIC' }))}
            >
              <MenuItem value="PRIVATE">🔒 Private</MenuItem>
              <MenuItem value="PUBLIC">🌍 Public</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!form.name || !form.collectionTypeId || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
