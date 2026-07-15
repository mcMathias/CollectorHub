import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  Grid,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LabelIcon from '@mui/icons-material/Label';
import type { ItemImage, UpdateImageInput } from '../../api/images';

const LABELS = [
  { value: 'FRONT', label: 'Front' },
  { value: 'BACK', label: 'Back' },
  { value: 'BOX', label: 'Box' },
  { value: 'RECEIPT', label: 'Receipt' },
  { value: 'CLOSEUP', label: 'Close-up' },
  { value: 'CERTIFICATE', label: 'Certificate' },
  { value: 'OTHER', label: 'Other' },
];

interface ImageGalleryProps {
  images: ItemImage[];
  isLoading: boolean;
  onUpdate: (imageId: string, data: UpdateImageInput) => void;
  onDelete: (imageId: string) => void;
}

export default function ImageGallery({ images, isLoading, onUpdate, onDelete }: ImageGalleryProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedImage, setSelectedImage] = useState<ItemImage | null>(null);
  const [labelMenuAnchor, setLabelMenuAnchor] = useState<null | HTMLElement>(null);

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((i) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
            <Skeleton variant="rounded" sx={{ width: '100%', paddingTop: '100%', borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (images.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No images uploaded yet
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {images.map((image) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={image.id}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: image.isPrimary ? 'primary.main' : 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(108, 99, 255, 0.2)',
                  '& .image-overlay': { opacity: 1 },
                },
              }}
            >
              <Box
                component="img"
                src={image.url}
                alt={image.label || 'Item image'}
                sx={{
                  width: '100%',
                  aspectRatio: '1',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Primary badge */}
              {image.isPrimary && (
                <Chip
                  icon={<StarIcon sx={{ fontSize: 14 }} />}
                  label="Primary"
                  size="small"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    fontSize: '0.65rem',
                    height: 22,
                  }}
                />
              )}

              {/* Label badge */}
              {image.label && !image.isPrimary && (
                <Chip
                  label={LABELS.find((l) => l.value === image.label)?.label || image.label}
                  size="small"
                  variant="outlined"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    fontSize: '0.65rem',
                    height: 22,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                  }}
                />
              )}

              {/* Hover overlay */}
              <Box
                className="image-overlay"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                }}
              >
                <Stack direction="row" spacing={1}>
                  {!image.isPrimary && (
                    <IconButton
                      size="small"
                      onClick={() => onUpdate(image.id, { isPrimary: true })}
                      sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                    >
                      <StarBorderIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setSelectedImage(image);
                      setMenuAnchor(e.currentTarget);
                    }}
                    sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(image.id)}
                    sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#F44336', '&:hover': { bgcolor: 'rgba(244,67,54,0.2)' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => { setMenuAnchor(null); setSelectedImage(null); }}
      >
        <MenuItem
          onClick={(e) => {
            setMenuAnchor(null);
            setLabelMenuAnchor(e.currentTarget);
          }}
        >
          <ListItemIcon><LabelIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Set Label</ListItemText>
        </MenuItem>
        {selectedImage && !selectedImage.isPrimary && (
          <MenuItem onClick={() => { onUpdate(selectedImage.id, { isPrimary: true }); setMenuAnchor(null); setSelectedImage(null); }}>
            <ListItemIcon><StarBorderIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Set as Primary</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => { if (selectedImage) onDelete(selectedImage.id); setMenuAnchor(null); setSelectedImage(null); }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Label Submenu */}
      <Menu
        anchorEl={labelMenuAnchor}
        open={Boolean(labelMenuAnchor)}
        onClose={() => { setLabelMenuAnchor(null); setSelectedImage(null); }}
      >
        {LABELS.map((l) => (
          <MenuItem
            key={l.value}
            selected={selectedImage?.label === l.value}
            onClick={() => {
              if (selectedImage) onUpdate(selectedImage.id, { label: l.value });
              setLabelMenuAnchor(null);
              setSelectedImage(null);
            }}
          >
            {l.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
