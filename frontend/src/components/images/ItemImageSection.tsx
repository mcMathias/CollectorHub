import { useState } from 'react';
import { Box, Typography, Snackbar, Alert, Divider } from '@mui/material';
import { useItemImages, useUploadImages, useUpdateImage, useDeleteImage } from '../../api/images';
import type { UpdateImageInput } from '../../api/images';
import ImageDropZone from './ImageDropZone';
import ImageGallery from './ImageGallery';

interface ItemImageSectionProps {
  itemId: string;
}

export default function ItemImageSection({ itemId }: ItemImageSectionProps) {
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { data: images, isLoading } = useItemImages(itemId);
  const uploadMutation = useUploadImages(itemId);
  const updateMutation = useUpdateImage(itemId);
  const deleteMutation = useDeleteImage(itemId);

  const handleUpload = async (files: File[]) => {
    try {
      await uploadMutation.mutateAsync(files);
      setSnackbar({ open: true, message: `${files.length} image(s) uploaded!`, severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to upload images', severity: 'error' });
    }
  };

  const handleUpdate = async (imageId: string, data: UpdateImageInput) => {
    try {
      await updateMutation.mutateAsync({ imageId, data });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update image', severity: 'error' });
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      await deleteMutation.mutateAsync(imageId);
      setSnackbar({ open: true, message: 'Image deleted', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete image', severity: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Images
      </Typography>

      <ImageDropZone
        onFilesSelected={handleUpload}
        isUploading={uploadMutation.isPending}
      />

      {(images && images.length > 0) && (
        <>
          <Divider sx={{ my: 3 }} />
          <ImageGallery
            images={images}
            isLoading={isLoading}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
