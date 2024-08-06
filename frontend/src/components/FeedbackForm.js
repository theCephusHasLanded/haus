import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Textarea, HStack, useToast } from '@chakra-ui/react';
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
        title: "Feedback submitted.",
        description: "Thank you for your feedback!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Unable to submit feedback. Please try again.",
        status: "error",
        duration: 5000,
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
          <FormControl>
            <FormLabel>Rating</FormLabel>
            <HStack spacing={1}>
              {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;
                return (
                  <FaStar
                    key={i}
                    size={24}
                    color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                    onClick={() => setRating(ratingValue)}
                    style={{ cursor: 'pointer' }}
                  />
                );
              })}
            </HStack>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Feedback</FormLabel>
            <Textarea
              placeholder="Your feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Join Beta Waitlist?</FormLabel>
            <Input
              type="checkbox"
              checked={joinWaitlist}
              onChange={(e) => setJoinWaitlist(e.target.checked)}
            />
          </FormControl>
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
