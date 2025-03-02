import { useState } from "react";
import {
  Container,
  Flex,
  Box,
  Heading,
  Text,
  IconButton,
  Button,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdPhone, MdEmail, MdLocationOn, MdOutlineEmail } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import supabase from "../../supabase";
import { NextSeo } from "next-seo";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact").insert([
        {
          name,
          email,
          message,
          submitted_at: new Date(),
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your message has been sent. We'll get back to you soon!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Clear form
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NextSeo
        title="Contact Ayunetra - Get in Touch"
        description="Have questions or feedback? Contact our team at Ayunetra. We're here to help!"
      />
      <Container maxW="full" mt={0} centerContent overflow="hidden">
        <Flex
          minH="100vh"
          w="full"
          bg={useColorModeValue("beige", "gray.800")}
        >
          <Box
            bg={useColorModeValue("white", "gray.700")}
            borderRadius="lg"
            m={{ sm: 4, md: 16, lg: 10 }}
            p={{ sm: 5, md: 5, lg: 16 }}
            width="full"
            boxShadow="xl"
          >
            <Box p={4}>
              <Wrap spacing={{ base: 20, sm: 3, md: 5, lg: 20 }}>
                <WrapItem>
                  <Box>
                    <Heading
                      fontSize="4xl"
                      color={useColorModeValue("gray.700", "white")}
                      mb={4}
                    >
                      Contact Us
                    </Heading>
                    <Text
                      mt={{ sm: 3, md: 3, lg: 5 }}
                      color="gray.500"
                      fontSize="lg"
                    >
                      Fill up the form below to get in touch with us
                    </Text>
                    <Box py={{ base: 5, sm: 5, md: 8, lg: 10 }}>
                      <VStack pl={0} spacing={3} alignItems="flex-start">
                        <Button
                          size="md"
                          height="48px"
                          variant="ghost"
                          color="#DCE2FF"
                          _hover={{ border: "2px solid #1C6FEB" }}
                          leftIcon={<MdPhone color="#1970F1" size="20px" />}
                        >
                          +91-988888XXXX
                        </Button>
                        <Button
                          size="md"
                          height="48px"
                          variant="ghost"
                          color="#DCE2FF"
                          _hover={{ border: "2px solid #1C6FEB" }}
                          leftIcon={<MdEmail color="#1970F1" size="20px" />}
                        >
                          contact@ayunetra.com
                        </Button>
                        <Button
                          size="md"
                          height="48px"
                          variant="ghost"
                          color="#DCE2FF"
                          _hover={{ border: "2px solid #1C6FEB" }}
                          leftIcon={<MdLocationOn color="#1970F1" size="20px" />}
                        >
                          Mumbai, India
                        </Button>
                      </VStack>
                    </Box>
                  </Box>
                </WrapItem>
                <WrapItem>
                  <Box bg="white" borderRadius="lg" w="full" maxW="md">
                    <Box m={8} color="#0B0E3F">
                      <VStack spacing={5}>
                        <FormControl id="name" isRequired>
                          <FormLabel>Your Name</FormLabel>
                          <InputGroup borderColor="#E0E1E7">
                            <InputLeftElement pointerEvents="none">
                              <BsPerson color="gray.800" />
                            </InputLeftElement>
                            <Input
                              type="text"
                              size="md"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="John Doe"
                            />
                          </InputGroup>
                        </FormControl>
                        <FormControl id="email" isRequired>
                          <FormLabel>Email</FormLabel>
                          <InputGroup borderColor="#E0E1E7">
                            <InputLeftElement pointerEvents="none">
                              <MdOutlineEmail color="gray.800" />
                            </InputLeftElement>
                            <Input
                              type="email"
                              size="md"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="example@email.com"
                            />
                          </InputGroup>
                        </FormControl>
                        <FormControl id="message" isRequired>
                          <FormLabel>Message</FormLabel>
                          <Textarea
                            borderColor="#E0E1E7"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Your message"
                            rows={6}
                            resize="none"
                          />
                        </FormControl>
                        <FormControl float="right">
                          <Button
                            variant="solid"
                            bg="#0D74FF"
                            color="white"
                            _hover={{ bg: "#0D74FF" }}
                            isLoading={isSubmitting}
                            onClick={handleSubmit}
                          >
                            Send Message
                          </Button>
                        </FormControl>
                      </VStack>
                    </Box>
                  </Box>
                </WrapItem>
              </Wrap>
            </Box>
          </Box>
        </Flex>
      </Container>
    </>
  );
}
