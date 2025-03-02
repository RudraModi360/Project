import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Divider,
  Image,
  useColorModeValue,
  Link,
  UnorderedList,
  ListItem,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { FaRobot, FaHeartbeat, FaClock, FaShieldAlt } from 'react-icons/fa';

interface BlogPost {
  id: number;
  title: string;
  icon: any;
  content: string;
  imageUrl: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Your AI-Powered Health Assistant',
    icon: FaRobot,
    content: `Ayunetra is an intelligent healthcare assistant that provides personalized recommendations 
    for common day-to-day health concerns. Powered by advanced AI technology, it helps users manage 
    and find relief from various common ailments such as cough, fever, sneezing, acidity, and more.

    Key Features:
    • Personalized Health Recommendations based on your specific symptoms
    • Support for Multiple Common Ailments including fever, cough, sneezing, and acidity
    • User-Friendly Chat Interface for seamless interaction
    • 24/7 Availability for health recommendations
    • Safe and Reliable guidance for common health issues`,
    imageUrl: '/ai.png'
  },
  {
    id: 2,
    title: 'How Ayunetra Works',
    icon: FaHeartbeat,
    content: `Our platform leverages cutting-edge technology to provide you with reliable health assistance:

    Technology Stack:
    • Next.js Frontend for smooth user experience
    • Advanced AI/ML Backend for intelligent recommendations
    • Modern UI/UX Design for easy navigation
    • Real-time Chat Interface for immediate assistance

    Important Note:
    Ayunetra is designed for general guidance on common, non-severe health conditions. 
    While we provide valuable health insights, we always recommend consulting healthcare 
    providers for serious medical conditions.`,
    imageUrl: '/ai4.png'
  },
  {
    id: 3,
    title: 'Available 24/7 For Your Health Needs',
    icon: FaClock,
    content: `Access health recommendations anytime, anywhere. Our platform is designed to be 
    your constant health companion, providing:

    • Instant access to health guidance
    • Round-the-clock availability
    • Quick response to health queries
    • Continuous learning and updates
    • Regular feature enhancements

    We're committed to making healthcare guidance more accessible and convenient for everyone.`,
    imageUrl: '/ai2.png'
  }
];

const BlogPost = ({ post }: { post: BlogPost }) => {
  return (
    <Box mb={12} bg={useColorModeValue('white', 'gray.700')} p={8} borderRadius="xl" boxShadow="md">
      <VStack align="start" spacing={6}>
        <Image
          src={post.imageUrl}
          alt={post.title}
          height="400px"
          width="100%"
          objectFit="cover"
          borderRadius="lg"
        />
        <HStack spacing={4} width="100%">
          <Icon as={post.icon} w={8} h={8} color="blue.500" />
          <Heading 
            size="xl" 
            color={useColorModeValue('gray.700', 'white')}
          >
            {post.title}
          </Heading>
        </HStack>
        <Text
          color={useColorModeValue('gray.600', 'gray.300')}
          fontSize="lg"
          whiteSpace="pre-line"
          lineHeight="tall"
        >
          {post.content}
        </Text>
      </VStack>
    </Box>
  );
};

export default function Ailments() {
  const bgColor = useColorModeValue('beige', 'gray.800');
  
  return (
    <>
      <NextSeo
        title="About Ayunetra - Your AI Health Assistant"
        description="Learn about Ayunetra, your AI-powered health assistant providing personalized recommendations for common health concerns."
      />
      <Box bg={bgColor} minH="100vh" py={16}>
        <Container maxW="4xl">
          <VStack spacing={12} align="stretch">
            <VStack spacing={4} textAlign="center">
              <Icon as={FaShieldAlt} w={16} h={16} color="blue.500" />
              <Heading
                size="2xl"
                color={useColorModeValue('gray.700', 'white')}
                fontWeight="bold"
              >
                Welcome to Ayunetra
              </Heading>
              <Text
                fontSize="xl"
                color={useColorModeValue('gray.600', 'gray.300')}
                maxW="2xl"
              >
                Your intelligent healthcare companion, providing personalized recommendations
                for your day-to-day health concerns.
              </Text>
            </VStack>
            
            {blogPosts.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))}
          </VStack>
        </Container>
      </Box>
    </>
  );
}