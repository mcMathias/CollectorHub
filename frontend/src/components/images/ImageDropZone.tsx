import { useState, useRef, useCallback } from 'react';
import { Box, Typography, CircularProgress, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface ImageDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
  maxFiles?: number;
}

export default function ImageDropZone({ onFilesSelected, isUploading, maxFiles = 10 }: ImageDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (files.length > 0) {
      onFilesSelected(files.slice(0, maxFiles));
    }
  }, [onFilesSelected, maxFiles]);

  const handleClick = () => {
    if (!isUploading) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files.slice(0, maxFiles));
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Box
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        border: '2px dashed',
        borderColor: isDragOver ? 'primary.main' : 'divider',
        borderRadius: 3,
        p: 4,
        textAlign: 'center',
        cursor: isUploading ? 'wait' : 'pointer',
        transition: 'all 0.2s ease',
        bgcolor: isDragOver ? 'rgba(108, 99, 255, 0.08)' : 'transparent',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'rgba(108, 99, 255, 0.04)',
        },
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {isUploading ? (
        <Stack alignItems="center" spacing={1}>
          <CircularProgress size={32} />
          <Typography variant="body2" color="text.secondary">
            Uploading...
          </Typography>
        </Stack>
      ) : (
        <Stack alignItems="center" spacing={1}>
          <CloudUploadIcon sx={{ fontSize: 40, color: isDragOver ? 'primary.main' : 'text.secondary' }} />
          <Typography variant="body1" fontWeight={500}>
            {isDragOver ? 'Drop images here' : 'Drag & drop images here'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            or click to browse • JPG, PNG, WebP, GIF • Max 10MB each
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
