import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  HStack,
  useToast,
  Switch,
  Box,
  Text,
  VStack
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { sendFeedback } from '../utils/emailService';

const FeedbackForm = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [joinWaitlist, setJoinWaitlist] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      await sendFeedback({ rating, feedback, email, joinWaitlist });
      toast({
        title: "Feedback submitted successfully!",
        description: "Thank you for your valuable input.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Rate HAUS App</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Your Feedback</FormLabel>
              <Textarea
                placeholder="Share your thoughts about HAUS"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </FormControl>

            <Box p={4} bg="blue.50" borderRadius="md">
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="join-waitlist" mb="0">
                  Join Beta Waitlist?
                </FormLabel>
                <Switch
                  id="join-waitlist"
                  isChecked={joinWaitlist}
                  onChange={(e) => setJoinWaitlist(e.target.checked)}
                />
              </FormControl>
              {joinWaitlist && (
                <FormControl mt={4}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
              )}
              <Text fontSize="sm" mt={2} color="blue.600">
                Join our exclusive beta program and be the first to experience new features!
              </Text>
            </Box>

            <FormControl>
              <FormLabel>Rate Your Experience</FormLabel>
              <HStack spacing={2} justify="center">
                {[...Array(5)].map((star, i) => {
                  const ratingValue = i + 1;
                  return (
                    <FaStar
                      key={i}
                      size={32}
                      color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                      onClick={() => setRating(ratingValue)}
                      style={{ cursor: 'pointer' }}
                    />
                  );
                })}
              </HStack>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FeedbackForm;
