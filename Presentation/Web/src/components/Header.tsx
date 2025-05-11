// src/components/Header.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  alpha,
  ListItemIcon,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header: React.FC = () => {
  const theme = useTheme();

  // Notifications
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<string[]>([
    'New message from Alice',
    'Update available',
    'Task deadline approaching',
  ]);

  // Profile Menu
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationAnchor(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications([]);
    handleCloseNotifications();
  };

  const handleOpenProfile = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setProfileAnchor(null);
  };

  const handleLogout = () => {
    handleCloseProfile();
    console.log('Logging out...');
    // TODO: integrate logout logic here
  };

  return (
    <AppBar
      position="fixed"
      elevation={3}
      color="default"
      sx={{
        backdropFilter: 'blur(8px)',
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: 64,
        display: 'flex',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* App Title */}
        <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
          Edge Computing Simulator
        </Typography>

        {/* Right side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Notifications */}
          <IconButton
            onClick={handleOpenNotifications}
            sx={{
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.15)',
              },
            }}
          >
            <Badge
              badgeContent={notifications.length}
              color="error"
              invisible={notifications.length === 0}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Avatar */}
          <IconButton onClick={handleOpenProfile}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.palette.primary.main,
                fontSize: 14,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              U
            </Avatar>
          </IconButton>
        </Box>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleCloseNotifications}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 260,
              boxShadow: theme.shadows[4],
            },
          }}
        >
          {notifications.length > 0 ? (
            <>
              <MenuItem onClick={handleMarkAllAsRead} sx={{ fontWeight: 600 }}>
                Mark all as read
              </MenuItem>
              <Divider />
              {notifications.map((note, index) => (
                <MenuItem key={index}>{note}</MenuItem>
              ))}
            </>
          ) : (
            <MenuItem>You have no notifications</MenuItem>
          )}
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={handleCloseProfile}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 200,
              boxShadow: theme.shadows[4],
            },
          }}
        >
          <MenuItem onClick={() => console.log('Go to Profile')}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => console.log('Go to Settings')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
