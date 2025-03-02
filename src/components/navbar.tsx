import Link from "next/link";
import {
  FaHeartbeat,
  FaUserMd,
  FaInfoCircle,
  FaQuestionCircle,
  FaComments,
} from "react-icons/fa";
import ThemeButton from "@/components/ThemButton";
import { Show } from "@chakra-ui/react";
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useStore } from "@/store";
import { useAuthContext } from "@/context";

export default function Navbar() {
  const isMobileNav = useBreakpointValue({ base: true, md: false });
  const { user } = useAuthContext();

  return (
    <Box>
      {" "}
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <Show breakpoint="(max-width: 400px)">
            <ThemeButton />
          </Show>
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.900", "white")}
            fontSize="inherit"
          >
            <Link
              href={"/"}
              style={{ textDecoration: "none", display: "inline-block" }}
            >
              Ayunetra
            </Link>
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          {user && user.email ? (
            <>
          

              <Show above="sm">
                <Show breakpoint="(min-width: 400px)">
                  <ThemeButton />
                </Show>
              </Show>
            </>
          ) : (
            <>
              <Button
                as={Link}
                href={"/login"}
                passHref
                fontSize={"sm"}
                fontWeight={400}
                variant={"link"}
              >
                Sign In
              </Button>
              <Button
                as={Link}
                href={"/signup"}
                passHref
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"blue.500"}
                _hover={{
                  bg: "blue.600",
                }}
                px={6}
                py={2}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Flex>
      <Box>{isMobileNav ? <MobileNav /> : null}</Box>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={6}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"} isLazy>
            <PopoverTrigger>
              <Box
                as={Link}
                href={navItem.href ?? "#"}
                p={2}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
                cursor="pointer"
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Box
      as={Link}
      href={href}
      passHref
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("blue.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "blue.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"blue.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = () => {
  const handleClick = (iconName: string) => {
    useStore.getState().setSelectedIcon(iconName);
  };
  const boxColor = useColorModeValue("gray.100", "gray.800");
  return (
    <>
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        p={4}
        bg={boxColor}
        zIndex={10}
        borderTopWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.900")}
      >
        <Stack direction={"row"} justify="space-around" align="center">
          <Link
            href={"/ailments"}
            style={{ textAlign: "center", textDecoration: "none" }}
          >
            <Flex direction="column" align="center">
              <FaHeartbeat
                size={19}
                color={
                  useStore.getState().selectedIcon === "ailments"
                    ? "blue"
                    : "currentColor"
                }
                onClick={() => handleClick("ailments")}
              />
              <Text fontSize={"sm"} mt={1}>
                Ailments
              </Text>
            </Flex>
          </Link>
          <Link
            href={"/recommendations"}
            style={{ textAlign: "center", textDecoration: "none" }}
          >
            <Flex direction="column" align="center">
              <FaUserMd
                size={19}
                color={
                  useStore.getState().selectedIcon === "recommendations"
                    ? "blue"
                    : "currentColor"
                }
                onClick={() => handleClick("recommendations")}
              />
              <Text fontSize={"sm"} mt={1}>
                Advice
              </Text>
            </Flex>
          </Link>
          <Link
            href={"/chatbot"}
            style={{ textAlign: "center", textDecoration: "none" }}
          >
            <Flex direction="column" align="center">
              <FaComments
                size={19}
                color={
                  useStore.getState().selectedIcon === "assistant"
                    ? "blue"
                    : "currentColor"
                }
                onClick={() => handleClick("assistant")}
              />
              <Text fontSize={"sm"} mt={1}>
                Assistant
              </Text>
            </Flex>
          </Link>
          <Link
            href={"/how-it-works"}
            style={{ textAlign: "center", textDecoration: "none" }}
          >
            <Flex direction="column" align="center">
              <FaQuestionCircle
                size={19}
                color={
                  useStore.getState().selectedIcon === "how-it-works"
                    ? "blue"
                    : "currentColor"
                }
                onClick={() => handleClick("how-it-works")}
              />
              <Text fontSize={"sm"} mt={1}>
                Help
              </Text>
            </Flex>
          </Link>
          <Link
            href={"/about"}
            style={{ textAlign: "center", textDecoration: "none" }}
          >
            <Flex direction="column" align="center">
              <FaInfoCircle
                size={19}
                color={
                  useStore.getState().selectedIcon === "about"
                    ? "blue"
                    : "currentColor"
                }
                onClick={() => handleClick("about")}
              />
              <Text fontSize={"sm"} mt={1}>
                About
              </Text>
            </Flex>
          </Link>
        </Stack>
      </Box>
    </>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Health Services",
    children: [
      {
        label: "Common Ailments",
        subLabel: "Get help with daily health concerns",
        href: "/ailments",
      },
      {
        label: "Health Recommendations",
        subLabel: "Personalized health advice",
        href: "/recommendations",
      },
    ],
  },
  {
    label: "Features",
    children: [
      {
        label: "AI Assistant",
        subLabel: "24/7 health guidance",
        href: "/assistant",
      },
      {
        label: "healthcare-registration",
        subLabel: "/healthcare-registration",
        href: "/chatbot",
      },
    ],
  },
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "How It Works",
    href: "https://github.com/RudraModi360/Project"
  },
  {
    label: "Contact", 
    href: "/contact",
  },
];
