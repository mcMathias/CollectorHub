import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Alert,
  Stack,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useRegister } from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const registerMutation = useRegister();

  const [form, setForm] = useState({
    email: '',
    username: '',
    displayName: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await registerMutation.mutateAsync(form);
      login(result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      navigate('/');
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(108, 99, 255, 0.12) 0%, transparent 60%)',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6C63FF 0%, #8B83FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RocketLaunchIcon sx={{ fontSize: 28, color: '#fff' }} />
            </Box>

            <Typography variant="h5" fontWeight={700}>
              Create your account
            </Typography>

            {registerMutation.isError && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {(registerMutation.error as any)?.response?.data?.message || 'Registration failed'}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Stack spacing={2.5}>
                <TextField
                  label="Display Name"
                  fullWidth
                  required
                  value={form.displayName}
                  onChange={handleChange('displayName')}
                  autoFocus
                />

                <TextField
                  label="Username"
                  fullWidth
                  required
                  value={form.username}
                  onChange={handleChange('username')}
                  helperText="Letters, numbers, hyphens and underscores only"
                />

                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={form.email}
                  onChange={handleChange('email')}
                  autoComplete="email"
                />

                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  value={form.password}
                  onChange={handleChange('password')}
                  helperText="Minimum 8 characters"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={registerMutation.isPending}
                  sx={{ mt: 1 }}
                >
                  {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" underline="hover">
                Sign in
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
