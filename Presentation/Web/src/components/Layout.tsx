// src/components/Layout.tsx
import React from 'react';
import { Box } from '@mui/material';
import { drawerWidth, collapsedWidth, contentTransition, headerHeight } from '../config/layout';

interface LayoutProps {
  collapsed: boolean;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ collapsed, children }) => {
  return (
    <Box
      component="main"
      sx={{
        marginLeft: collapsed ? `${collapsedWidth}px` : `${drawerWidth}px`,
        marginTop: headerHeight, // leave room for fixed header
        paddingLeft: 4,
        transition: contentTransition,
        display: 'block', // ❗ make sure it's not flex-centered
        height: `calc(100vh - ${headerHeight})`,
        overflow: 'auto',
      }}
    >
      {children}
    </Box>
  );
};

export default Layout;
