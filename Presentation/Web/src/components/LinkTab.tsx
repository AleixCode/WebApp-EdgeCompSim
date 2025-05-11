import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Tab, { TabProps } from '@mui/material/Tab';

interface LinkTabProps extends TabProps {
  label: string;
  to: string;
}

// Using React Router's Link means you no longer need to prevent default behavior manually.
const LinkTab: React.FC<LinkTabProps> = (props) => {
  return <Tab component={RouterLink} {...props} />;
};

export default LinkTab;
