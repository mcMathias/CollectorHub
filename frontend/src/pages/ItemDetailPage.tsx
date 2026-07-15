import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Chip,
  Skeleton,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useItem } from '../api/items';
import ItemImageSection from '../components/images/ItemImageSection';

const conditionLabels: Record<string, string> = {
  MINT: 'Mint',
  NEAR_MINT: 'Near Mint',
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor',
};

const conditionColors: Record<string, string> = {
  MINT: '#4CAF50',
  NEAR_MINT: '#8BC34A',
  EXCELLENT: '#CDDC39',
  GOOD: '#FFC107',
  FAIR: '#FF9800',
  POOR: '#F44336',
};

function formatPrice(value: string | null, currency: { symbol: string } | undefined) {
  if (!value) return '—';
  const num = parseFloat(value);
  return `${currency?.symbol || ''}${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export default function ItemDetailPage() {
  const { id, itemId } = useParams<{ id: string; itemId: string }>();
  const navigate = useNavigate();
  const { data: item, isLoading } = useItem(itemId!);

  if (isLoading) {
    return (
      <Box>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={200} height={40} />
        </Stack>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rounded" height={300} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rounded" height={300} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!item) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6">Item not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate(`/collections/${id}`)}>
          Back to Collection
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate(`/collections/${id}`)}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={700}>
            {item.title}
          </Typography>
          {item.subtitle && (
            <Typography variant="body2" color="text.secondary">
              {item.subtitle}
            </Typography>
          )}
        </Box>
        <IconButton onClick={() => navigate(`/collections/${id}`)}>
          <EditIcon />
        </IconButton>
      </Stack>

      <Grid container spacing={3}>
        {/* Left — Images */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <ItemImageSection itemId={itemId!} />
            </CardContent>
          </Card>
        </Grid>

        {/* Right — Details */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Details
              </Typography>

              <Stack spacing={2}>
                {item.brand && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Brand</Typography>
                    <Typography variant="body2">{item.brand}</Typography>
                  </Box>
                )}

                {item.condition && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Condition</Typography>
                    <Box>
                      <Chip
                        size="small"
                        label={conditionLabels[item.condition] || item.condition}
                        sx={{
                          bgcolor: `${conditionColors[item.condition] || '#666'}20`,
                          color: conditionColors[item.condition] || '#666',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                )}

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary">Purchase Price</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatPrice(item.purchasePrice, item.purchaseCurrency)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">Estimated Value</Typography>
                  <Typography variant="body1" fontWeight={700} color="primary.main">
                    {formatPrice(item.estimatedValue, item.estimatedCurrency)}
                  </Typography>
                </Box>

                {item.purchaseDate && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Purchase Date</Typography>
                    <Typography variant="body2">
                      {new Date(item.purchaseDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}

                {item.quantity > 1 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Quantity</Typography>
                    <Typography variant="body2">{item.quantity}</Typography>
                  </Box>
                )}

                <Divider />

                {item.tags && item.tags.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Tags</Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {item.tags.map((t) => (
                        <Chip key={t.tag.id} label={t.tag.name} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                )}

                {item.notes && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Notes</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {item.notes}
                    </Typography>
                  </Box>
                )}

                {item.location && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Location</Typography>
                    <Typography variant="body2">{item.location.name}</Typography>
                  </Box>
                )}

                {item.customAttributes && item.customAttributes.length > 0 && (
                  <>
                    <Divider />
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                      Type-specific Fields
                    </Typography>
                    {item.customAttributes.map((attr) => (
                      <Box key={attr.id}>
                        <Typography variant="caption" color="text.secondary">{attr.fieldDefinition.name}</Typography>
                        <Typography variant="body2">
                          {attr.fieldDefinition.fieldType === 'BOOLEAN'
                            ? (attr.value === 'true' ? '✓ Yes' : '✗ No')
                            : attr.value}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
