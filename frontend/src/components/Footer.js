import React from 'react';
import { Box, Text, Image, Flex, useColorModeValue } from '@chakra-ui/react';

const Footer = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  return (
    <Box as="footer" py={6} textAlign="center" bg={bgColor}>
      <Flex direction="column" justifyContent="center" alignItems="center">
        <Image
          src="/pursuit.png"
          alt="Pursuit Logo"
          width="120px"
          height="auto"
          mb={1}
        />
        <Text mt={1}>&copy; {new Date().getFullYear()} HAUS. <strong>LKHN Technologies</strong> All rights reserved.</Text>
      </Flex>
    </Box>
  );
};

export default Footer;
