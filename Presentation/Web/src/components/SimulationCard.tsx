import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from '@mui/joy';

type Status = 'pending' | 'running' | 'finished';

interface SimulationsCardProps {
  title: string;
  description: string;
  status: Status;
}

const statusColorMap: Record<Status, string> = {
  pending: '#ef5350',   // red
  running: '#ffb300',   // amber
  finished: '#66bb6a',  // green
};

export default function SimulationsCard({
  title,
  description,
  status,
}: SimulationsCardProps) {
  return (
    <Card
      variant="soft"
      sx={{
        width: 300,
        backgroundColor: '#f9f9fb',
        borderRadius: '12px',
        boxShadow: 'sm',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 'md',
          transform: 'translateY(-2px)',
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid #e0e0e0',
        p: 1.5,
      }}
    >
      <CardContent sx={{ flex: 1, p: 0 }}>
        <Typography level="title-sm" fontWeight="lg" mb={0.75}>
          {title}
        </Typography>

        <Box sx={{ mb: 0.5 }}>
          <Typography fontWeight="md" level="body-xs">
            Status:{' '}
            <Box
              component="span"
              sx={{
                fontWeight: 600,
                color: statusColorMap[status],
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Box>
          </Typography>
        </Box>

        <Typography fontWeight="sm" level="body-sm" color="neutral">
          {description}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          justifyContent: 'flex-end',
          gap: 0.75,
          mt: 1.5,
          p: 0,
        }}
      >
        <Button size="sm" variant="plain" color="neutral">
          View
        </Button>
        <Button size="sm" variant="solid" color="primary">
          Edit
        </Button>
      </CardActions>
    </Card>
  );
}
