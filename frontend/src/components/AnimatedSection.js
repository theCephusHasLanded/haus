import React from 'react';
import { motion } from 'framer-motion';
import { Box, Image, Heading, Text, useColorModeValue } from '@chakra-ui/react';

const AnimatedSection = ({ imageSrc, altText, heading, text, isImageFirst }) => {
  const textColor = useColorModeValue('black', 'white');

  return (
    <motion.div
      initial={{ opacity: 0, x: isImageFirst ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <Box display="flex" flexDirection={isImageFirst ? 'row' : 'row-reverse'} alignItems="center" my={10}>
        <Image boxSize="300px" src={imageSrc} alt={altText} />
        <Box ml={isImageFirst ? 10 : 0} mr={isImageFirst ? 0 : 10}>
          <Heading as="h2" size="lg" mb={4} color={textColor}>{heading}</Heading>
          <Text fontSize="md" color={textColor}>{text}</Text>
        </Box>
      </Box>
    </motion.div>
  );
};

export default AnimatedSection;
