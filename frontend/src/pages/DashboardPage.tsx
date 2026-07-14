import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Skeleton,
} from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import InventoryIcon from '@mui/icons-material/Inventory2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCurrentUser } from '../api';
import { useCollections } from '../api';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: collections, isLoading: collectionsLoading } = useCollections();

  const totalItems = collections?.reduce((sum, c) => sum + c._count.items, 0) || 0;

  if (userLoading || collectionsLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={48} />
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Welcome back, {user?.displayName?.split(' ')[0]} 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's an overview of your collections.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Collections"
            value={user?._count?.collections || 0}
            icon={<CollectionsIcon />}
            color="#6C63FF"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Items"
            value={totalItems}
            icon={<InventoryIcon />}
            color="#4CAF50"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Estimated Value"
            value="$0"
            icon={<TrendingUpIcon />}
            color="#FF9800"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Wishlist"
            value={user?._count?.wishlistItems || 0}
            icon={<FavoriteIcon />}
            color="#E91E63"
          />
        </Grid>
      </Grid>

      {/* Recent collections */}
      {collections && collections.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Your Collections
          </Typography>
          <Grid container spacing={2}>
            {collections.slice(0, 6).map((collection) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={collection.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Typography fontSize="1.5rem">
                        {collection.collectionType?.icon || '📦'}
                      </Typography>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {collection.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {collection._count.items} items • {collection.collectionType?.name}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {collections && collections.length === 0 && (
        <Card sx={{ mt: 5, textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No collections yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first collection to start tracking your collectibles!
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
