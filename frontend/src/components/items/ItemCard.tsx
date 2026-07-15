import {
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import type { Item } from '../../api/items';

const conditionColors: Record<string, string> = {
  MINT: '#4CAF50',
  NEAR_MINT: '#8BC34A',
  EXCELLENT: '#CDDC39',
  GOOD: '#FFC107',
  FAIR: '#FF9800',
  POOR: '#F44336',
};

const conditionLabels: Record<string, string> = {
  MINT: 'Mint',
  NEAR_MINT: 'Near Mint',
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor',
};

function formatPrice(value: string | null, currency: { symbol: string; code: string }) {
  if (!value) return null;
  const num = parseFloat(value);
  return `${currency.symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export default function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  return (
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
      onClick={() => onEdit(item)}
    >
      <CardContent sx={{ flex: 1, p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {item.title}
            </Typography>
            {item.subtitle && (
              <Typography variant="caption" color="text.secondary" noWrap display="block">
                {item.subtitle}
              </Typography>
            )}
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(e.currentTarget);
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Stack>

        {item.brand && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {item.brand}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
          {item.condition && (
            <Chip
              size="small"
              label={conditionLabels[item.condition] || item.condition}
              sx={{
                bgcolor: `${conditionColors[item.condition] || '#666'}20`,
                color: conditionColors[item.condition] || '#666',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
          {item.quantity > 1 && (
            <Chip size="small" label={`×${item.quantity}`} variant="outlined" />
          )}
          {item.tags?.slice(0, 3).map((t) => (
            <Chip
              key={t.tag.id}
              size="small"
              label={t.tag.name}
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          ))}
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mt: 2 }}>
          <Box>
            {item.purchasePrice && (
              <Typography variant="caption" color="text.secondary" display="block">
                Paid: {formatPrice(item.purchasePrice, item.purchaseCurrency)}
              </Typography>
            )}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            {item.estimatedValue && (
              <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                {formatPrice(item.estimatedValue, item.estimatedCurrency)}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={(e: React.SyntheticEvent) => {
          e.stopPropagation?.();
          setMenuAnchor(null);
        }}
      >
        <MenuItem onClick={(e) => { e.stopPropagation(); setMenuAnchor(null); onEdit(item); }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => { e.stopPropagation(); setMenuAnchor(null); onDelete(item); }} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}
