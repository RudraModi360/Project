import { NextSeo } from "next-seo";
import Head from "next/head";
import Footer from "../components/footer";
import GetStarted from "../components/getstarted";
import { useAuthContext } from "@/context";
import GridListWithCTA from "@/components/chatbotintro";
import Hi from "@/components/Hi";
import Link from "next/link";
import Faq from "../components/Faq";
import {
  Container,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Icon,
  IconProps,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import Layout from "./Layout";
import Image from "next/image";

// Beige theme colors
const colors = {
  mainBg: "rgba(245, 242, 236, 0.7)",
  primary: "rgb(168, 127, 86)",
  primaryHover: "rgb(145, 110, 74)",
  text: "rgb(79, 57, 39)",
  secondaryText: "rgb(128, 110, 93)",
  accent: "rgba(210, 205, 195, 0.5)",
  cardBg: "white",
  blobColor: "rgba(245, 242, 236, 0.4)"
};

export default function Home() {
  const { user } = useAuthContext();

  return (
    <>
      <Layout>
        <NextSeo
          title="Ayunetra - Your AI-Powered Health Assistant"
          description="Get personalized health recommendations for common ailments like fever, cough, sneezing, and acidity with Ayunetra's AI-powered healthcare assistant."
          openGraph={{
            url: "/ai2.png",
            title: "Ayunetra - Intelligent Healthcare Assistant",
            description: "Your 24/7 AI-powered health companion for personalized care recommendations",
            images: [
              {
                url: "/ai.png",
                alt: "Ayunetra Healthcare Assistant",
              },
            ],
            site_name: "ayunetra",
            type: "website",
          }}
        />
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta
            name="keywords"
            content="healthcare assistant, AI health, medical recommendations, symptom checker, health advice, personalized healthcare"
          />
        </Head>
        <Box bg={colors.mainBg}>
          <Container maxW={"7xl"}>
            <Stack
              align={"center"}
              spacing={{ base: 8, md: 10 }}
              py={{ base: 20, md: 28 }}
              direction={{ base: "column", md: "row" }}
            >
              <Stack flex={1} spacing={{ base: 5, md: 10 }}>
                <Heading
                  lineHeight={1.1}
                  fontWeight={600}
                  fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
                >
                  <Text
                    as={"span"}
                    position={"relative"}
                    color={colors.text}
                    _after={{
                      content: "''",
                      width: "full",
                      height: "20%",
                      position: "absolute",
                      bottom: 1,
                      left: 0,
                      zIndex: -1,
                    }}
                  >
                    Ayunetra
                  </Text>
                  <br />
                  <Text as={"span"} color={colors.secondaryText}>
                    Your AI Health Assistant
                  </Text>
                </Heading>
                <Text color={colors.secondaryText} fontSize={"xl"}>
                  Get instant, personalized recommendations for common health concerns. Our AI-powered assistant helps you manage daily health issues like fever, cough, sneezing, and acidity - available 24/7, right at your fingertips.
                </Text>
                <Stack
                  spacing={{ base: 4, sm: 6 }}
                  direction={{ base: "column", sm: "row" }}
                >
                  {user && user.email ? (
                    <GetStarted />
                  ) : (
                    <Link href="/signup">
                      <Button
                        rounded={"full"}
                        size={"lg"}
                        fontWeight={"normal"}
                        px={6}
                        bg={colors.primary}
                        color={"white"}
                        _hover={{ bg: colors.primaryHover }}
                        _active={{ bg: colors.primaryHover }}
                      >
                        Start Your Health Journey
                      </Button>
                    </Link>
                  )}
                  <Link href="/chatbot">
                    <Button
                      rounded={"full"}
                      size={"lg"}
                      fontWeight={"normal"}
                      px={6}
                      leftIcon={<Icon name="chat" />}
                      bg={"transparent"}
                      border="2px"
                      borderColor={colors.primary}
                      color={colors.primary}
                      _hover={{
                        bg: "rgba(168, 127, 86, 0.1)"
                      }}
                    >
                      Chat with Ayunetra
                    </Button>
                  </Link>
                </Stack>
              </Stack>
              <Flex
                flex={1}
                justify={"center"}
                align={"center"}
                position={"relative"}
                w={"full"}
              >
                <Blob
                  w={"100%"}
                  h={"100%"}
                  position={"absolute"}
                  top={"-20%"}
                  left={0}
                  zIndex={-1}
                  color={colors.blobColor}
                />
                <Box
                  position={"relative"}
                  height={"300px"}
                  rounded={"2xl"}
                  boxShadow={"2xl"}
                  width={"full"}
                  overflow={"hidden"}
                  borderWidth="1px"
                  borderColor={colors.accent}
                >
                  <Image
                    alt={"Ayunetra Hero Image"}
                    objectFit={"cover"}
                    style={{ margin: "0 auto" }}
                    height={350}
                    src={"/image_ayur.jpg"}
                    width={550}
                  />
                </Box>
              </Flex>
            </Stack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={20}>
              <Feature
                icon={"/ai3.png"}
                title={"24/7 Availability"}
                text={"Access health recommendations anytime, anywhere"}
                colors={colors}
              />
              <Feature
                icon={"/ai4.png"}
                title={"AI-Powered"}
                text={"Get intelligent, personalized health guidance"}
                colors={colors}
              />
              <Feature
                icon={"/ai5.png"}
                title={"Safe & Reliable"}
                text={"Trusted recommendations for common health concerns"}
                colors={colors}
              />
            </SimpleGrid>
          </Container>

          <Faq />
          <Footer />
        </Box>
      </Layout>
    </>
  );
}

interface FeatureProps {
  title: string;
  text: string;
  icon: string;
  colors: typeof colors;
}

const Feature = ({ title, text, icon, colors }: FeatureProps) => {
  return (
    <Stack align={"center"} textAlign={"center"}>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={colors.primary}
        mb={1}
        transition="all 0.3s"
        _hover={{
          transform: "scale(1.05)",
          bg: colors.primaryHover
        }}
      >
        <Image src={icon} alt={title} width={24} height={24} />
      </Flex>
      <Text fontWeight={600} color={colors.text}>{title}</Text>
      <Text color={colors.secondaryText}>{text}</Text>
    </Stack>
  );
};

const Blob = (props: IconProps) => {
  return (
    <Icon
      width={"100%"}
      viewBox="0 0 578 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </Icon>
  );
};
