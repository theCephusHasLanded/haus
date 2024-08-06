import React from 'react';
import { Box, Avatar, Text, VStack, useColorModeValue } from '@chakra-ui/react';

const ProfileCard = ({ user }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('black', 'white');

  return (
    <Box bg={bgColor} p={5} rounded="md" shadow="md">
      <VStack spacing={4} align="center">
        <Avatar size="2xl" name={user.username} src={user.avatarUrl} />
        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="bold" color={textColor}>{user.fullName}</Text>
          <Text fontSize="md" color="gray.500">@{user.username}</Text>
          <Text fontSize="sm" color="gray.500">Member since {new Date(user.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</Text>
          <Text mt={3}>{user.bio}</Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default ProfileCard;
