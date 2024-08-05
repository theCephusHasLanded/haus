import React from 'react';
import {
  Box,
  Flex,
  Link as ChakraLink,
  Button,
  useColorMode,
  useColorModeValue,
  Avatar,
  Text,
  Image,
  IconButton,
  Collapse,
  useDisclosure,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

const UserNavbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('black', 'white');
  const { isOpen, onToggle } = useDisclosure();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  return (
    <Box bg={bgColor} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Image src="/haus.png" alt="HAUS Logo" boxSize="40px" mr={2} />
          <Box display={{ base: 'none', md: 'block' }}>
            <Text fontSize="lg" color={textColor}>HAUS</Text>
          </Box>
        </Flex>
        <Flex alignItems="center">
          <Box display={{ base: 'none', md: 'flex' }}>
            <Button as={Link} to="/" px={2} color={textColor} bg={bgColor}>
              Home
            </Button>
            <Button as={Link} to="/dashboard" px={2} color={textColor} bg={bgColor}>
              Dashboard
            </Button>
            <Button as={Link} to="/user-bios" px={2} color={textColor} bg={bgColor}>
              User Bios
            </Button>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} px={2} color={textColor} bg={bgColor}>
                Manage
              </MenuButton>
              <MenuList bg={bgColor}>
                <MenuItem as={Link} to="/rooms" bg={bgColor} color={textColor}>Rooms</MenuItem>
                <MenuItem as={Link} to="/bookings" bg={bgColor} color={textColor}>Bookings</MenuItem>
                <MenuItem as={Link} to="/payments" bg={bgColor} color={textColor}>Payments</MenuItem>
                <MenuItem as={Link} to="/community/groups" bg={bgColor} color={textColor}>Community Groups</MenuItem>
                <MenuItem as={Link} to="/coliving/spaces" bg={bgColor} color={textColor}>Coliving Spaces</MenuItem>
              </MenuList>
            </Menu>
            <Flex alignItems="center" ml={4}>
              <Avatar name={username} src={`https://i.pravatar.cc/150?u=${username}`} size="sm" />
              <Text ml={2} color={textColor}>{username} ({role})</Text>
            </Flex>
          </Box>
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={onToggle}
            ml={4}
          />
          <Button onClick={toggleColorMode} ml={4}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Flex>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <VStack bg={bgColor} p={4} display={{ md: 'none' }}>
          <ChakraLink as={Link} to="/" px={2} color={textColor}>Home</ChakraLink>
          <ChakraLink as={Link} to="/dashboard" px={2} color={textColor}>Dashboard</ChakraLink>
          <ChakraLink as={Link} to="/user-bios" px={2} color={textColor}>User Bios</ChakraLink>
          <ChakraLink as={Link} to="/rooms" px={2} color={textColor}>Rooms</ChakraLink>
          <ChakraLink as={Link} to="/bookings" px={2} color={textColor}>Bookings</ChakraLink>
          <ChakraLink as={Link} to="/payments" px={2} color={textColor}>Payments</ChakraLink>
          <ChakraLink as={Link} to="/community/groups" px={2} color={textColor}>Community Groups</ChakraLink>
          <ChakraLink as={Link} to="/coliving/spaces" px={2} color={textColor}>Coliving Spaces</ChakraLink>
        </VStack>
      </Collapse>
    </Box>
  );
};

export default UserNavbar;
