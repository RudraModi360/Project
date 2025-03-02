import { useRouter } from "next/router";
import Image from "next/image";
import supabase from "../../supabase";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Center,
  Icon,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { Heart } from "lucide-react";
import { NextSeo } from "next-seo";

export default function SignupCard() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const signUpNewUser = async () => {
    if (!email || !password || !firstName) {
      toast({
        title: "Error",
        description: "Please fill all the required fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "https://ayunetra.com/",
          data: {
            firstName,
            lastName,
          },
        },
      });
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      router.push("/checkmail");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <NextSeo
        title="Sign Up for Ayunetra - Your Health Assistant"
        description="Create your account to get personalized AI-powered health recommendations with Ayunetra"
      />
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          bottom="-80"
          left="50%"
          transform="translateX(-50%)"
          opacity={0.7}
          zIndex={0}
          pointerEvents="none"
        >
          <Image
            src="/image.webp"
            alt="Decorative background"
            width={1000}
            height={700}
            priority
            style={{
              objectFit: 'cover',
            }}
          />
        </Box>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} position="relative" zIndex={1}>
          <Stack align={"center"} spacing={6}>
            <Flex align="center" gap={3}>
              <Icon as={Heart} w={8} h={8} color="blue.500" />
              <Heading fontSize={"4xl"} textAlign={"center"}>
                Join Ayunetra
              </Heading>
            </Flex>
            <Text fontSize={"lg"} color={"gray.600"} textAlign="center">
              Your journey to better health starts here 
              <Text as="span" color="blue.500"> with personalized care</Text> 🏥
            </Text>
          </Stack>

          <Box
            rounded={"xl"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"xl"}
            p={8}
            border="1px"
            borderColor="gray.100"
          >
            <VStack spacing={6}>
              <Button
                w={"full"}
                variant={"outline"}
                leftIcon={<FcGoogle />}
                colorScheme="blue"
                size="lg"
                onClick={() => {
                  window.location.href = "https://qgkjakomwapzuhvnrvgr.supabase.co/auth/v1/authorize?provider=google";
                }}
                _hover={{
                  bg: "blue.50",
                }}
              >
                <Center>
                  <Text>Sign up with Google</Text>
                </Center>
              </Button>

              <Flex align="center" gap={2} w="full">
                <Box flex={1} h="1px" bg="gray.200" />
                <Text color="gray.500">or</Text>
                <Box flex={1} h="1px" bg="gray.200" />
              </Flex>

              <Stack spacing={4} w="full">
                <HStack spacing={4}>
                  <Box flex={1}>
                    <FormControl id="firstName" isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        type="text"
                        name="firstName"
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        size="lg"
                      />
                    </FormControl>
                  </Box>
                  <Box flex={1}>
                    <FormControl id="lastName">
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        name="lastName"
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                        size="lg"
                      />
                    </FormControl>
                  </Box>
                </HStack>

                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    size="lg"
                  />
                </FormControl>

                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                    />
                    <InputRightElement width="3rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  onClick={signUpNewUser}
                  loadingText="Creating account..."
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  fontSize="md"
                  mt={2}
                >
                  Create Account
                </Button>

                <Text align={"center"} fontSize="sm">
                  Already have an account?{" "}
                  <Link
                    href={"/login"}
                    color={"blue.400"}
                    _hover={{
                      textDecoration: "underline",
                    }}
                  >
                    Sign in
                  </Link>
                </Text>
              </Stack>
            </VStack>
          </Box>

          <Text fontSize="sm" color="gray.500" textAlign="center">
            By signing up, you agree to our{" "}
            <Link href="/terms" color="blue.400">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" color="blue.400">
              Privacy Policy
            </Link>
          </Text>
        </Stack>
      </Flex>
    </>
  );
}
