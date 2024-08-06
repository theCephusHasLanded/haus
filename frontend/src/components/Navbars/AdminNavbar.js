import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
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
  MenuItem,
  MenuDivider,
  Link
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import ProfileCard from '../ProfileCard';
import FeedbackForm from '../FeedbackForm';
import { keyframes } from '@emotion/react';

const glowAnimation = keyframes`
  0% { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de, 0 0 35px #ff00de, 0 0 40px #ff00de, 0 0 50px #ff00de, 0 0 75px #ff00de; }
  100% { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #ff00de, 0 0 70px #ff00de, 0 0 80px #ff00de, 0 0 100px #ff00de, 0 0 150px #ff00de; }
`;

const AdminNavbar = () => {
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);

  const openFeedbackForm = () => setIsFeedbackFormOpen(true);
  const closeFeedbackForm = () => setIsFeedbackFormOpen(false);

  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('black', 'white');
  const { isOpen, onToggle } = useDisclosure();
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUsername = localStorage.getItem('username');
        const response = await axiosInstance.get(`/current-user/${currentUsername}`);
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Failed to fetch current user', error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <Box bg={bgColor} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Image
            src="/haus.png"
            alt="HAUS Logo"
            boxSize="65px"
            mr={2}
            cursor="pointer"
            onClick={openFeedbackForm}
          />
          <Box display={{ base: 'none', md: 'block' }}>
          </Box>
        </Flex>
        <Flex alignItems="center">
          <Box display={{ base: 'none', md: 'flex' }}>
            <Button as={RouterLink} to="/" px={2} color={textColor} bg={bgColor}>
              Home
            </Button>
            <Button as={RouterLink} to="/dashboard" px={2} color={textColor} bg={bgColor}>
              Dashboard
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                px={2}
                color={textColor}
                bg={bgColor}
                css={{
                  animation: `${glowAnimation} 1.5s ease-in-out infinite alternate`,
                }}
              >
                Admin
              </MenuButton>
              <MenuList bg={bgColor}>
                <MenuItem as={RouterLink} to="/admin/sessions" bg={bgColor} color={textColor}>User Sessions</MenuItem>
                <MenuItem as={RouterLink} to="/admin/users" bg={bgColor} color={textColor}>Manage Users</MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} px={2} color={textColor} bg={bgColor}>
                {currentUser ? (
                  <Flex alignItems="center">
                    <Avatar
                      name={currentUser.Username}
                      src={`https://i.pravatar.cc/150?u=${currentUser.Username}`}
                      size="sm"
                      mr={2}
                    />
                    <Text>{currentUser.Username} ({currentUser.Role})</Text>
                    <ChevronDownIcon ml={2} />
                  </Flex>
                ) : (
                  "Profile"
                )}
              </MenuButton>
              <MenuList bg={bgColor}>
                {currentUser && (
                  <Box p={4} textAlign="center">
                    <ProfileCard user={currentUser} />
                  </Box>
                )}
                <MenuDivider />
                <MenuItem as={RouterLink} to={`/profile/${currentUser?.ID}`}>View Profile</MenuItem>
                <MenuItem>Log Out</MenuItem>
              </MenuList>
            </Menu>
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
          <Link as={RouterLink} to="/" px={2} color={textColor}>Home</Link>
          <Link as={RouterLink} to="/dashboard" px={2} color={textColor}>Dashboard</Link>
          <Link as={RouterLink} to="/rooms" px={2} color={textColor}>Rooms</Link>
          <Link as={RouterLink} to="/bookings" px={2} color={textColor}>Bookings</Link>
          <Link as={RouterLink} to="/payments" px={2} color={textColor}>Payments</Link>
          <Link as={RouterLink} to="/community/groups" px={2} color={textColor}>Community Groups</Link>
          <Link as={RouterLink} to="/coliving/spaces" px={2} color={textColor}>Coliving Spaces</Link>
        </VStack>
      </Collapse>
      <FeedbackForm isOpen={isFeedbackFormOpen} onClose={closeFeedbackForm} />
    </Box>
  );
};

export default AdminNavbar;
