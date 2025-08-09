import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Box, Badge } from '@mui/material';
import { 
  Add,
  PlayArrow,
  Folder
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { savedForms } = useSelector((state: RootState) => state.formBuilder);

  const navItems = [
    {
      path: '/create',
      label: 'Create',
      icon: <Add />,
      color: '#10b981',
    },
    {
      path: '/preview',
      label: 'Preview',
      icon: <PlayArrow />,
      color: '#f59e0b',
    },
    {
      path: '/myforms',
      label: 'My Forms',
      icon: <Folder />,
      color: '#ef4444',
      badge: savedForms.length,
    },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {navItems.map((item) => (
        <Badge 
          key={item.path}
          badgeContent={item.badge || 0}
          color="secondary"
          invisible={!item.badge}
        >
          <Button
            color="inherit"
            startIcon={item.icon}
            onClick={() => navigate(item.path)}
            sx={{
              color: 'white',
              backgroundColor: location.pathname === item.path 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'transparent',
              backdropFilter: location.pathname === item.path 
                ? 'blur(10px)' 
                : 'none',
              border: location.pathname === item.path 
                ? '1px solid rgba(255, 255, 255, 0.3)' 
                : '1px solid transparent',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {item.label}
          </Button>
        </Badge>
      ))}
    </Box>
  );
};

export default Navigation;