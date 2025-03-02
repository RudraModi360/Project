// "use client";
import { Fragment } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  VStack,
  Flex,
  Text,
  Icon,
  Divider,
  Box,
} from "@chakra-ui/react";
import supabase from "../../supabase";
import { useForm } from "react-hook-form";
import { useToast } from "@chakra-ui/react";
import { Heart, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { NextSeo } from "next-seo";

const contactOptions = [
  {
    label: "Visit Us",
    value: "123 Healthcare Avenue, Medical District, NY 10001",
    icon: MapPin,
  },
  {
    label: "Call Us",
    value: "+1 (888) AYUNETRA",
    icon: Phone,
  },
  {
    label: "Email Us",
    value: "care@ayunetra.com",
    icon: Mail,
  },
];

const Contact = () => {
  const form = useForm();
  const toast = useToast();
  const { register, handleSubmit, reset } = form;

  const onSubmit = async (data: any) => {
    const { error } = await supabase.from("contactus").insert([{ ...data }]);
    if (error) {
      toast({
        title: "Authentication Required",
        description: "Please sign in or create an account to send us a message.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      handleSubmitSuccess();
      reset();
    }
  };

  const handleSubmitSuccess = () => {
    toast({
      title: "Message Received",
      description: "Thank you for reaching out. Our healthcare team will respond to you shortly.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <>
      <NextSeo
        title="Contact Ayunetra - Healthcare Support"
        description="Get in touch with Ayunetra's healthcare support team for any questions about our AI-powered health assistance."
      />
      <Container maxW="7xl" py={10} px={{ base: 5, md: 8 }}>
        <Stack spacing={10}>
          <Flex align="center" justify="center" direction="column">
            <Flex align="center" gap={3} mb={4}>
              <Icon as={Heart} w={8} h={8} color="blue.500" />
              <Heading fontSize="4xl">Contact Us</Heading>
            </Flex>
            <Text fontSize="lg" color="gray.600" textAlign="center" maxW="2xl">
              Have questions about our AI health assistant? Our dedicated healthcare support team is here to help you 24/7.
            </Text>
          </Flex>

          <Box
            bg={useColorModeValue("white", "gray.800")}
            rounded="xl"
            shadow="lg"
            p={8}
          >
            <Stack
              spacing={{ base: 8, md: 0 }}
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              mb={8}
            >
              {contactOptions.map((option, index) => (
                <Fragment key={index}>
                  <Stack
                    spacing={4}
                    direction="column"
                    justify="center"
                    alignItems="center"
                    px={4}
                  >
                    <Icon as={option.icon} w={6} h={6} color="blue.500" />
                    <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                      {option.label}
                    </Text>
                    <Text fontSize="md" textAlign="center" color="gray.600">
                      {option.value}
                    </Text>
                  </Stack>
                  {contactOptions.length - 1 !== index && (
                    <Divider orientation="vertical" display={{ base: "none", md: "flex" }} />
                  )}
                </Fragment>
              ))}
            </Stack>

            <VStack
              as="form"
              spacing={6}
              w="100%"
              bg={useColorModeValue("gray.50", "gray.700")}
              rounded="lg"
              p={{ base: 5, sm: 8 }}
            >
              <VStack spacing={5} w="100%">
                <Stack
                  w="100%"
                  spacing={4}
                  direction={{ base: "column", md: "row" }}
                >
                  <FormControl id="name">
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      {...register("Name", {
                        required: true,
                      })}
                      name="Name"
                      type="text"
                      placeholder="John Doe"
                      bg="white"
                      size="lg"
                      _focus={{
                        borderColor: "blue.400",
                        boxShadow: "0 0 0 1px blue.400",
                      }}
                    />
                  </FormControl>
                  <FormControl id="email">
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      {...register("Email", {
                        required: true,
                      })}
                      name="Email"
                      type="email"
                      placeholder="you@example.com"
                      bg="white"
                      size="lg"
                      _focus={{
                        borderColor: "blue.400",
                        boxShadow: "0 0 0 1px blue.400",
                      }}
                    />
                  </FormControl>
                </Stack>
                <FormControl id="subject">
                  <FormLabel>Subject</FormLabel>
                  <Input
                    {...register("Subject", {
                      required: true,
                    })}
                    name="Subject"
                    type="text"
                    placeholder="How can we help you?"
                    bg="white"
                    size="lg"
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px blue.400",
                    }}
                  />
                </FormControl>
                <FormControl id="message">
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    {...register("Message", {
                      required: true,
                    })}
                    name="Message"
                    placeholder="Please describe your question or concern in detail..."
                    bg="white"
                    size="lg"
                    minH="150px"
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px blue.400",
                    }}
                  />
                </FormControl>
              </VStack>

              <Button
                onClick={handleSubmit(onSubmit)}
                bg="blue.400"
                color="white"
                size="lg"
                fontSize="md"
                leftIcon={<Icon as={MessageCircle} />}
                _hover={{
                  bg: "blue.500",
                }}
                w={{ base: "100%", md: "auto" }}
                px={8}
              >
                Send Message
              </Button>
            </VStack>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default Contact;
