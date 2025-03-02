import Link from "next/link";
import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube, FaLinkedin, FaGithub } from "react-icons/fa";
import { ReactNode } from "react";

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function SmallCentered() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        spacing={4}
        justify={"center"}
        align={"center"}
      >
        <Text fontSize="2xl" fontWeight="bold">Ayunetra</Text>
        <Text textAlign="center" fontSize="sm">Your AI-Powered Health Assistant</Text>
        <Stack direction={"row"} spacing={6}>
          <Box as={Link} href={"/about"}>
            About
          </Box>
          <Box as={Link} href={"/features"}>
            Features
          </Box>
          <Box as={Link} href={"/contact"}>
            Contact
          </Box>
          <Box as={Link} href={"/docs"}>
            Documentation
          </Box>
        </Stack>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
        >
          <Stack direction={"column"} spacing={1} align={{ base: "center", md: "start" }}>
            <Text>© {new Date().getFullYear()} Ayunetra. All rights reserved</Text>
            <Text fontSize="sm">Built with ❤️ for better health assistance</Text>
          </Stack>
          <Stack direction={"row"} spacing={6} align="center">
            <SocialButton label={"GitHub"} href={"https://github.com/yourusername/ayunetra"}>
              <FaGithub />
            </SocialButton>
            <SocialButton label={"Twitter"} href={"#"}>
              <FaTwitter />
            </SocialButton>
            <SocialButton label={"LinkedIn"} href={"#"}>
              <FaLinkedin />
            </SocialButton>
            <Stack direction="row" spacing={4} fontSize="xs">
              <Link href="/terms">Terms of Service</Link>
              <Text>|</Text>
              <Link href="/privacy">Privacy Policy</Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
