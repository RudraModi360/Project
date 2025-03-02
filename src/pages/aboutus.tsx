import { Box, Container, Heading, Text, VStack, List, ListItem, ListIcon, Button, useColorModeValue, Icon } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { FaHeart, FaLaptopMedical, FaUserMd, FaClock } from 'react-icons/fa';
import Head from 'next/head';

const AboutUs = () => {
  const bgColor = useColorModeValue('beige.50', 'beige.900');
  const cardBg = useColorModeValue('white', 'beige.800');
  const textColor = useColorModeValue('gray.600', 'beige.200');
  const headingColor = useColorModeValue('gray.800', 'beige.100');

  return (
    <>
      <Head>
        <title>About Us - Ayunetra</title>
        <meta name="description" content="Learn more about Ayunetra - Your AI-Powered Health Assistant" />
      </Head>

      <Box bg={bgColor} minH="100vh" py={10}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            {/* Hero Section */}
            <Box textAlign="center" py={10}>
              <Heading
                as="h1"
                size="2xl"
                mb={4}
                color={headingColor}
              >
                Ayunetra
              </Heading>
              <Text fontSize="xl" color={textColor}>
                Your AI-Powered Health Assistant 🏥
              </Text>
            </Box>

            {/* Overview Section */}
            <Box bg={cardBg} p={8} borderRadius="lg" shadow="md">
              <Heading as="h2" size="lg" mb={4} color={headingColor}>
                Overview
              </Heading>
              <Text color={textColor}>
                Ayunetra is an intelligent healthcare assistant that provides personalized recommendations 
                for common day-to-day health concerns. Powered by advanced AI technology, it helps users 
                manage and find relief from various common ailments such as cough, fever, sneezing, 
                acidity, and more.
              </Text>
            </Box>

            {/* Features Section */}
            <Box bg={cardBg} p={8} borderRadius="lg" shadow="md">
              <Heading as="h2" size="lg" mb={6} color={headingColor}>
                Key Features
              </Heading>
              <List spacing={4}>
                <ListItem display="flex" alignItems="center">
                  <ListIcon as={FaUserMd} color="green.500" />
                  <Text color={textColor}>Personalized Health Recommendations</Text>
                </ListItem>
                <ListItem display="flex" alignItems="center">
                  <ListIcon as={FaLaptopMedical} color="green.500" />
                  <Text color={textColor}>Common Ailment Support</Text>
                </ListItem>
                <ListItem display="flex" alignItems="center">
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  <Text color={textColor}>User-Friendly Interface</Text>
                </ListItem>
                <ListItem display="flex" alignItems="center">
                  <ListIcon as={FaClock} color="green.500" />
                  <Text color={textColor}>24/7 Availability</Text>
                </ListItem>
              </List>
            </Box>

            {/* Important Note Section */}
            <Box bg="orange.100" p={8} borderRadius="lg" shadow="md">
              <VStack align="start" spacing={4}>
                <Icon as={WarningIcon} w={8} h={8} color="orange.500" />
                <Heading as="h3" size="md" color="orange.700">
                  Important Note
                </Heading>
                <Text color="orange.700">
                  Ayunetra is designed to provide general guidance for common, non-severe health conditions. 
                  It is not a replacement for professional medical advice. Always consult a healthcare 
                  provider for serious medical conditions.
                </Text>
              </VStack>
            </Box>

            {/* Technology Stack Section */}
            <Box bg={cardBg} p={8} borderRadius="lg" shadow="md">
              <Heading as="h2" size="lg" mb={6} color={headingColor}>
                Technology Stack
              </Heading>
              <List spacing={3}>
                <ListItem color={textColor}>• Next.js - Frontend Framework</ListItem>
                <ListItem color={textColor}>• AI/ML Backend for Intelligent Recommendations</ListItem>
                <ListItem color={textColor}>• Modern UI/UX Design</ListItem>
                <ListItem color={textColor}>• Real-time Chat Interface</ListItem>
              </List>
            </Box>

            {/* Footer Section */}
            <Box textAlign="center" py={8}>
              <Text fontSize="md" color={textColor}>
                Built with <Icon as={FaHeart} color="red.500" /> for better health assistance
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default AboutUs;
