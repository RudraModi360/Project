import { useRouter } from "next/router";
import supabase from "../../supabase";
import { FcGoogle } from "react-icons/fc";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Alert,
  AlertIcon,
  Center,
  Icon,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { Heart } from "lucide-react";
import { NextSeo } from "next-seo";

export default function Login() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function SignIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/chatbot",
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
  }

  const Signin = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email and password fields are required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
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

      setTimeout(() => {
        router.reload();
      }, 1000);

      router.push("/chatbot");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <NextSeo
        title="Sign In to Ayunetra - Your Health Assistant"
        description="Access your personalized AI-powered health recommendations by signing in to Ayunetra"
      />
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"} spacing={6}>
            <Flex align="center" gap={3}>
              <Icon as={Heart} w={8} h={8} color="blue.500" />
              <Heading fontSize={"4xl"} textAlign={"center"}>
                Welcome to Ayunetra
              </Heading>
            </Flex>
            <Text fontSize={"lg"} color={"gray.600"} textAlign="center">
              Your personal AI-powered health assistant 
              <Text as="span" color="blue.500"> ready to help 24/7</Text> 🏥
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
            <Stack spacing={4}>
              {/* <Button
                w={"full"}
                variant={"outline"}
                leftIcon={<FcGoogle />}
                onClick={SignIn}
                colorScheme="blue"
                size="lg"
                _hover={{
                  bg: "blue.50",
                }}
              >
                <Center>
                  <Text>Sign in with Google</Text>
                </Center>
              </Button> */}

              <Flex align="center" gap={2}>
                {/* <Box flex={1} h="1px" bg="gray.200" />
                <Text color="gray.500">or</Text>
                <Box flex={1} h="1px" bg="gray.200" /> */}
              </Flex>

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
                    placeholder="Enter your password"
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

              <Stack spacing={6}>
                <Button
                  onClick={Signin}
                  loadingText="Signing in..."
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  fontSize="md"
                >
                  Sign In
                </Button>

                <Stack spacing={2}>
                  <Link
                    href="/magicLink"
                    color={"blue.400"}
                    textAlign="center"
                    fontSize="sm"
                    _hover={{
                      textDecoration: "underline",
                    }}
                  >
                    Forgot your password?
                  </Link>

                  <Text align={"center"} fontSize="sm">
                    Don't have an account?{" "}
                    <Link
                      href={"/signup"}
                      color={"blue.400"}
                      _hover={{
                        textDecoration: "underline",
                      }}
                    >
                      Sign up
                    </Link>
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          </Box>

          <Text fontSize="sm" color="gray.500" textAlign="center">
            By signing in, you agree to our{" "}
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
