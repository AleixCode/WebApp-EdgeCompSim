// src/components/Nav.tsx
import React, { useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Drawer,
  Tooltip,
  Paper,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import routes, { RouteItem } from '../config/routes';
import {
    drawerWidth,
    collapsedWidth,
    drawerTransition,
    marginTopNav,
    marginTopArrow,
  } from '../config/layout';

interface NavProps {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
  

const Nav: React.FC<NavProps> = ({ collapsed, setCollapsed }) => {  const location = useLocation();
  const navItems: RouteItem[] = routes.filter((route) => route.isNav);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {/* Side Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            transition: drawerTransition,
            overflowX: 'hidden',
          },
        }}
      >
        <Box
          sx={{
            marginTop: marginTopNav,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            alignItems: collapsed ? 'center' : 'flex-start',
            p: 1,
          }}
        >
          {/* Tabs */}
          <Tabs
            orientation="vertical"
            value={location.pathname}
            sx={{ width: '100%', mt: 4 }}
          >
            {navItems.map((item, index) => (
              <Tooltip
                key={index}
                title={collapsed ? item.name : ''}
                placement="right"
                arrow
              >
                <Tab
                  label={collapsed ? '' : item.name}
                  value={item.path}
                  component={RouterLink}
                  to={item.path}
                  iconPosition="start"
                  sx={{
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    minHeight: 48,
                    px: 2,
                  }}
                />
              </Tooltip>
            ))}
          </Tabs>
        </Box>
      </Drawer>

      {/* Floating collapse/expand toggle button */}
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          top: marginTopArrow,
          left: collapsed ? collapsedWidth - 20 : drawerWidth - 20,
          zIndex: 1301, // just above drawer
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          transition: 'left 0.3s ease',
        }}
      >
        <IconButton onClick={toggleCollapse} size="small">
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Paper>
    </>
  );
};

export default Nav;
