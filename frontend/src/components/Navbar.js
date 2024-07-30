import { Box, Flex, Link, Button, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const color = useColorModeValue('black', 'white');

  return (
    <Box bg={bgColor} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>HAUS</Box>
        <Flex alignItems="center">
          <Link href="/" px={2}>Home</Link>
          <Link href="/dashboard" px={2}>Dashboard</Link>
          <Link href="/rooms" px={2}>Rooms</Link>
          <Link href="/bookings" px={2}>Bookings</Link>
          <Link href="/payments" px={2}>Payments</Link>
          <Button onClick={toggleColorMode} ml={4}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
