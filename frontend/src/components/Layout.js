import React from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box>
      <Box as="main" mt={4}>
      <Navbar />
        {children}
      <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
