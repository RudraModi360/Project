import React, { useState } from "react";
import {
  Box,
  Container,
  Text,
  Flex,
  useColorModeValue,
  Button,
  VStack,
  Collapse,
  HStack,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

const articles = [
  {
    id: 1,
    category: "GENERAL",
    title: "What is Ayunetra?",
    content: `Ayunetra is an intelligent healthcare assistant that provides personalized recommendations for common day-to-day health concerns. Powered by advanced AI technology, it helps users manage and find relief from various common ailments such as cough, fever, sneezing, acidity, and more.`,
  },
  {
    id: 2,
    category: "SERVICES",
    title: "What health conditions does Ayunetra help with?",
    content: `Ayunetra provides assistance for common daily health issues including fever, cough, sneezing, acidity, and many other common conditions. The system is available 24/7 and offers personalized health recommendations based on your specific symptoms.`,
  },
  {
    id: 3,
    category: "GENERAL",
    title: "Is Ayunetra a replacement for professional medical advice?",
    content: `No, Ayunetra is designed to provide general guidance for common, non-severe health conditions. It is not a replacement for professional medical advice. Always consult a healthcare provider for serious medical conditions.`,
  },
  {
    id: 4,
    category: "TECHNICAL",
    title: "What technologies does Ayunetra use?",
    content: `Ayunetra is built using Next.js as the frontend framework, with an AI/ML backend for intelligent recommendations. It features a modern UI/UX design and a real-time chat interface for seamless interaction.`,
  },
];

const categories = ["GENERAL", "SERVICES", "TECHNICAL"];

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("GENERAL");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Updated color scheme to beige tones
  const mainBg = "rgba(245, 242, 236, 0.7)"; // Light beige background
  const cardBg = "white";
  const borderColor = "rgba(210, 205, 195, 0.5)"; // Soft beige border
  const hoverBg = "rgba(245, 242, 236, 0.9)"; // Slightly darker beige for hover
  const activeColor = "rgb(168, 127, 86)"; // Warm brown for active elements
  const textColor = "rgb(79, 57, 39)"; // Dark brown for text
  const secondaryText = "rgb(128, 110, 93)"; // Medium brown for secondary text

  return (
    <Box bg={mainBg} py={20}>
      <Container maxWidth="4xl" px={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center" mb={10}>
            <Text 
              fontSize="3xl" 
              fontWeight="medium" 
              color={textColor}
              mb={4}
            >
              Have any questions?
            </Text>
            <Text 
              fontSize="lg" 
              color={secondaryText}
            >
              Everything you need to know about Ayunetra
            </Text>
          </Box>

          {/* Category Tabs */}
          <HStack 
            spacing={4} 
            justify="center" 
            pb={8}
            overflowX="auto"
            css={{
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                variant="ghost"
                size="lg"
                color={activeCategory === category ? activeColor : secondaryText}
                borderBottom={activeCategory === category ? `2px solid ${activeColor}` : "none"}
                borderRadius="none"
                _hover={{ 
                  bg: "transparent",
                  color: activeColor,
                }}
                fontWeight="medium"
              >
                {category}
              </Button>
            ))}
          </HStack>

          {/* FAQ Items */}
          <VStack spacing={4} align="stretch">
            {articles
              .filter(article => article.category === activeCategory)
              .map((article) => (
                <Box
                  key={article.id}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="xl"
                  overflow="hidden"
                  bg={cardBg}
                  transition="all 0.3s"
                  _hover={{ 
                    borderColor: activeColor,
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(168, 127, 86, 0.1)"
                  }}
                >
                  <Button
                    width="100%"
                    height="auto"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    padding={6}
                    onClick={() => toggleItem(article.id)}
                    variant="ghost"
                    bg={cardBg}
                    _hover={{ bg: hoverBg }}
                  >
                    <Text 
                      fontSize="lg" 
                      fontWeight="medium" 
                      textAlign="left"
                      color={textColor}
                    >
                      {article.title}
                    </Text>
                    {openItems.includes(article.id) ? (
                      <ChevronUpIcon boxSize={6} color={activeColor} />
                    ) : (
                      <ChevronDownIcon boxSize={6} color={secondaryText} />
                    )}
                  </Button>
                  <Collapse in={openItems.includes(article.id)} animateOpacity>
                    <Box 
                      p={6} 
                      pt={0}
                      color={secondaryText}
                      fontSize="md"
                      lineHeight="tall"
                    >
                      {article.content}
                    </Box>
                  </Collapse>
                </Box>
              ))}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default FAQ;
