import { Box, Flex, Link, Button, useColorMode, useColorModeValue, Avatar, Text } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const AdminNavbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  return (
    <Box bg={bgColor} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>HAUS (Admin)</Box>
        <Flex alignItems="center">
          <Link href="/" px={2}>Home</Link>
          <Link href="/dashboard" px={2}>Dashboard</Link>
          <Link href="/rooms" px={2}>Rooms</Link>
          <Link href="/bookings" px={2}>Bookings</Link>
          <Link href="/payments" px={2}>Payments</Link>
          <Link href="/admin" px={2}>User Sessions</Link>
          <Flex alignItems="center" ml={4}>
            <Avatar name={username} src={`https://i.pravatar.cc/150?u=${username}`} size="sm" />
            <Text ml={2}>{username} ({role})</Text>
          </Flex>
          <Button onClick={toggleColorMode} ml={4}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default AdminNavbar;
