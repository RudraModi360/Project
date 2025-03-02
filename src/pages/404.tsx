import {
  chakra,
  Stack,
  Box,
  useColorModeValue,
  Container,
  Button,
  Icon,
  Text,
  Flex,
} from "@chakra-ui/react";
import Link from "next/link";
import { Heart, Home, MessageCircle } from "lucide-react";
import Head from "next/head";
import { NextSeo } from "next-seo";

const NotFound = () => {
  return (
    <>
      <NextSeo
        title="Page Not Found - Ayunetra"
        description="The page you're looking for doesn't exist. Return to Ayunetra's homepage for AI-powered health assistance."
      />
      <Head>
        <meta httpEquiv="refresh" content="10;http://localhost:3000" />
      </Head>
      <Container maxW="5xl" p={{ base: 5, md: 10 }} h="100vh" display="flex" alignItems="center">
        <Box
          pos="relative"
          boxShadow={useColorModeValue(
            "0 4px 6px rgba(160, 174, 192, 0.6)",
            "0 4px 6px rgba(9, 17, 28, 0.9)"
          )}
          bg={useColorModeValue("white", "gray.800")}
          p={{ base: 6, sm: 10 }}
          overflow="hidden"
          rounded="xl"
          border="1px"
          borderColor={useColorModeValue("gray.100", "gray.700")}
          w="full"
        >
          <Stack
            pos="relative"
            zIndex={1}
            direction="column"
            spacing={6}
            textAlign="center"
          >
            <Flex justify="center" align="center" direction="column" gap={4}>
              <Icon as={Heart} w={16} h={16} color="blue.400" />
              <chakra.h1
                color={useColorModeValue("gray.900", "white")}
                fontSize="4xl"
                lineHeight={1.2}
                fontWeight="bold"
              >
                404 - Page Not Found
              </chakra.h1>
            </Flex>

            <Text
              color={useColorModeValue("gray.600", "gray.400")}
              fontSize="lg"
              maxW="lg"
              mx="auto"
            >
              We couldn't find the page you're looking for. But don't worry, our AI health assistant is still here to help you.
            </Text>

            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={4}
              justify="center"
              w="full"
            >
              <Button
                as={Link}
                href="/"
                size="lg"
                colorScheme="blue"
                leftIcon={<Icon as={Home} />}
                _hover={{ transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                Return Home
              </Button>
              <Button
                as={Link}
                href="/chatbot"
                size="lg"
                variant="outline"
                colorScheme="blue"
                leftIcon={<Icon as={MessageCircle} />}
                _hover={{
                  transform: "translateY(-2px)",
                  bg: "blue.50",
                }}
                transition="all 0.2s"
              >
                Chat with Ayunetra
              </Button>
            </Stack>

            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
              You'll be automatically redirected to the homepage in 10 seconds
            </Text>
          </Stack>

          {/* Background Pattern */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blue.50"
            opacity={0.1}
            zIndex={0}
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, blue 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />
        </Box>
      </Container>
    </>
  );
};

export default NotFound;
