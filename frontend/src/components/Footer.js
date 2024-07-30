import { Box, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" py={4} textAlign="center" bg="gray.100">
      <Text>&copy; {new Date().getFullYear()} HAUS. LKHN Technologies. All rights reserved.</Text>
    </Box>
  );
};

export default Footer;
