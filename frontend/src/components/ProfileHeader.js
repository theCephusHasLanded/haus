import React from 'react';
import { Box, Avatar, Heading, Text, Stack, useColorModeValue } from '@chakra-ui/react';

const ProfileHeader = ({ user }) => {
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} p={5} rounded="md" shadow="md">
      <Stack direction="row" spacing={5} align="center">
        <Avatar size="2xl" name={user.username} src={user.avatarUrl} />
        <Box>
          <Heading as="h1" size="xl">{user.fullName}</Heading>
          <Text fontSize="lg" color="gray.500">@{user.username}</Text>
          <Text fontSize="md" mt={3}>{user.bio}</Text>
        </Box>
      </Stack>
    </Box>
  );
};

export default ProfileHeader;
