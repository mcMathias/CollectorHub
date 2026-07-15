import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
            bgcolor: 'background.default',
          }}
        >
          <Card sx={{ maxWidth: 480, width: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
              <ErrorOutlinedIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Something went wrong
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                An unexpected error occurred. Please try again or return to the dashboard.
              </Typography>
              {this.state.error && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    mb: 3,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                    fontFamily: 'monospace',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.message}
                </Typography>
              )}
              <Button
                variant="contained"
                onClick={this.handleReset}
                size="large"
                sx={{ borderRadius: 2 }}
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}
