import React from 'react';
import { Box } from '@chakra-ui/react';
import UserNavbar from './Navbars/UserNavbar';
import AdminNavbar from './Navbars/AdminNavbar';

const Layout = ({ children }) => {
  const role = localStorage.getItem('role'); // Assume the role is stored in localStorage

  return (
    <Box>
      {role === 'admin' ? <AdminNavbar /> : <UserNavbar />}
      <Box as="main" mt={4}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
