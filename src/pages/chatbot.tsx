import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuthContext } from "@/context";
import { useRouter } from "next/router";
import HospitalFinder from "@/components/hospital-finder";
import Nouser from "@/components/Nouser";
import {
  Box,
  Button,
  Center,
  CircularProgress,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Input,
  List,
  ListItem,
  Text,
  useDisclosure,
  VStack,
  Spinner,
  Image,
  Select,
  Badge,
  Tooltip,
  Link,
} from "@chakra-ui/react";
import {
  AlertCircle,
  Menu,
  Send,
  Sparkles,
  Plus,
  Router,
  Image as ImageIcon,
  X,
  Clock,
  Heart,
  Thermometer,
  Stethoscope,
  ExternalLink,
  Youtube,
} from "lucide-react";
import supabase from "../../supabase";
import { NextSeo } from "next-seo";

const markdownComponents = {
  h1: (props: any) => (
    <Heading as="h1" size="xl" mt={4} mb={2} color="black" {...props} />
  ),
  h2: (props: any) => (
    <Heading as="h2" size="lg" mt={3} mb={2} color="black" {...props} />
  ),
  p: (props: any) => <Text mt={2} color="black" {...props} />,
  strong: (props: any) => (
    <Text as="strong" fontWeight="bold" color="black" {...props} />
  ),
  ul: ({ children }: any) => (
    <List styleType="disc" pl={6} mt={2} spacing={2} color="black">
      {children}
    </List>
  ),
  ol: ({ children }: any) => (
    <List as="ol" styleType="decimal" pl={6} mt={2} spacing={2} color="black">
      {children}
    </List>
  ),
  li: (props: any) => <ListItem color="black" {...props} />,
};

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  created_at: string;
  title: string;
  user_id: string;
  symptom_category?: string;
}

interface ApiResponse {
  answer: string;
  user_id: string;
  google_links: string[];
  youtube_videos: string[];
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  links?: {
    google?: string[];
    youtube?: string[];
  };
}

const Chatbot = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentConversation, setCurrentConversation] = useState<
    ConversationMessage[]
  >([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuthContext();
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [showHospitalFinder, setShowHospitalFinder] = useState(false);

  const symptomCategories = [
    { value: "fever", label: "Fever", icon: Thermometer },
    { value: "cough", label: "Cough & Cold", icon: AlertCircle },
    { value: "digestive", label: "Digestive Issues", icon: Stethoscope },
    { value: "headache", label: "Headache", icon: AlertCircle },
    { value: "general", label: "General Health", icon: Heart },
  ];

  if (!user) {
    return <Nouser />;
  }

  // Add state for client-side rendering
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const Router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl("");
  };

  async function saveResponse(messageText: string, responseText: string) {
    try {
      if (!user?.id) {
        console.log("No user ID found when saving");
        return;
      }

      const { data, error } = await supabase
        .from("chatbot")
        .insert([
          {
            message: messageText,
            response: responseText,
            user_id: user.id,
          },
        ])
        .select();

      if (error) {
        console.error("Error saving to Supabase:", error);
        throw error;
      }

      await getHistory();
    } catch (error) {
      console.error("Error saving response:", error);
    }
  }

  async function getHistory() {
    setIsLoading(true);
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("chatbot")
        .select("*")
        .eq("user_id", user.id)

      if (error) throw error;

      setChatHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Update useEffect to handle client-side mounting
  useEffect(() => {
    setIsClient(true);
    if (user?.id) {
      getHistory();
    }
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    setLoading(true);
    setIsStreaming(true);
    setStreamingMessage("");

    try {
      let imageUrl = "";

      if (selectedImage) {
        setUploadingImage(true);
        const reader = new FileReader();
        imageUrl = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedImage);
        });
        setUploadingImage(false);
      }

      const userMessage: ConversationMessage = {
        role: "user",
        content: inputText,
        timestamp: new Date().toISOString(),
      };
      setCurrentConversation((prev) => [...prev, userMessage]);

      const response = await fetch("https://projectuvicorn-localhost-server-main-app.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          message: inputText,
          user_id: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error("Failed to get response");
      } 

      // Get the response as JSON directly
      const responseData = await response.json() as ApiResponse;
      console.log('Response Data:', responseData);

      // Clean YouTube URLs before creating the message
      const cleanYoutubeUrls = responseData.youtube_videos.map(url => 
        url.replace(/\\u0026/g, '&').split('\\u0026')[0] // Take only the main part of the URL
      );

      // Create assistant message with the response
      const assistantMessage: ConversationMessage = {
        role: "assistant",
        content: responseData.answer,
        timestamp: new Date().toISOString(),
        links: {
          google: responseData.google_links,
          youtube: cleanYoutubeUrls
        }
      };

      // Update conversation and clear input
      setCurrentConversation(prev => [...prev, assistantMessage]);
      await saveResponse(inputText, responseData.answer);
      setStreamingMessage("");
      removeSelectedImage();
      setInputText("");

    } catch (error) {
      console.error("Error during request:", error);
      setStreamingMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
      setIsStreaming(false);
      setUploadingImage(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleNewChat = () => {
    setInputText("");
    setSummary("");
    setCurrentConversation([]);
    onClose();
  };

  // Move ChatSidebar outside of main component to prevent re-renders
  const ChatSidebarContent = () => (
    <VStack align="stretch" h="100%" spacing={0} bg="white">
      {/* Header Section */}
      <Box p={4} borderBottom="1px" borderColor="gray.800">
        <Heading size="md" color="gray.700">
          Chat History
        </Heading>
      </Box>

      {/* Content Section */}
      <VStack
        align="stretch"
        spacing={3}
        overflowY="auto"
        maxH="calc(100vh - 100px)"
        p={4}
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.800",
            borderRadius: "24px",
          },
        }}
      >
        {!isClient ? null : isLoading ? (
          <Center py={8}>
            <VStack spacing={4}>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.800"
                color="blue.500"
                size="lg"
              />
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                Loading your conversations...
              </Text>
            </VStack>
          </Center>
        ) : chatHistory.length === 0 ? (
          <Center py={12}>
            <VStack spacing={3}>
              <Icon as={AlertCircle} boxSize={8} color="gray.400" />
              <Text color="gray.500" fontSize="md" textAlign="center">
                No chat history yet
              </Text>
              <Text color="gray.400" fontSize="sm" textAlign="center">
                Start a new conversation to see it here
              </Text>
            </VStack>
          </Center>
        ) : (
          chatHistory.map((chat) => (
            <Box
              key={chat.id}
              p={4}
              bg="white"
              rounded="lg"
              cursor="pointer"
              borderWidth="1px"
              borderColor="gray.800"
              transition="all 0.2s"
              _hover={{
                bg: "blue.50",
                borderColor: "blue.800",
                transform: "translateY(-1px)",
                shadow: "md",
              }}
              onClick={() => {
                setCurrentConversation([
                  {
                    role: "user",
                    content: chat.message,
                    timestamp: chat.created_at,
                  },
                  {
                    role: "assistant",
                    content: chat.response,
                    timestamp: chat.created_at,
                  },
                ]);
                setSelectedSymptom(chat.symptom_category || "");
                setInputText("");
                setStreamingMessage("");
                setIsStreaming(false);
                onClose();
              }}
            >
              <VStack align="stretch" spacing={3}>
                {/* Question Section */}
                <Box>
                  <Flex align="center" gap={2} mb={2}>
                    <Icon as={Send} boxSize={3} color="green.500" />
                    <Text fontSize="xs" fontWeight="medium" color="gray.600">
                      Question
                    </Text>
                  </Flex>
                  <Text fontSize="sm" color="gray.700" noOfLines={2}>
                    {chat.message}
                  </Text>
                </Box>

                {/* Response Preview */}
                <Box borderTopWidth="1px" borderColor="gray.100" pt={2}>
                  <Flex align="center" gap={2} mb={2}>
                    <Icon as={Sparkles} boxSize={3} color="blue.500" />
                    <Text fontSize="xs" fontWeight="medium" color="gray.600">
                      Response
                    </Text>
                  </Flex>
                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    {chat.response}
                  </Text>
                </Box>

                {/* Timestamp */}
                <Flex align="center" gap={2} mt={1}>
                  <Icon as={Clock} boxSize={3} color="gray.400" />
                  <Text fontSize="xs" color="gray.500">
                    {isClient
                      ? new Date(chat.created_at).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : ""}
                  </Text>
                </Flex>
              </VStack>
            </Box>
          ))
        )}
      </VStack>
    </VStack>
  );

  if (isLoading) {
    return (
      <Center minH="100vh">
        <VStack spacing={4}>
          <Nouser />
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.800"
            color="blue.500"
            size="xl"
          />
          <Text color="gray.600" fontSize="lg">
            Loading your chats,
          </Text>
        </VStack>
      </Center>
    );
  }

  if (!isClient) {
    return null; // Prevent initial flash during hydration
  }

  return (
    <>
      <NextSeo
        title="Chat with Ayunetra - Your AI Health Assistant"
        description="Get personalized health recommendations through an intelligent chat interface"
      />
      <Container maxW="full" h="100vh" p={0}>
        <Grid
          templateColumns={{ base: "1fr", md: "280px 1fr" }}
          h="full"
          gap={0}
        >
          <GridItem
            bg="gray.50"
            borderRight="1px"
            borderColor="gray.100"
            display={{ base: isOpen ? "block" : "none", md: "block" }}
          >
            <VStack spacing={4} p={6}>
              <Button
                leftIcon={<Plus size={16} />}
                colorScheme="blue"
                variant="outline"
                w="full"
                onClick={handleNewChat}
                size="sm"
                borderRadius="full"
              >
                New Consultation
              </Button>
              <Select
                placeholder="Select Symptom Category"
                value={selectedSymptom}
                onChange={(e) => setSelectedSymptom(e.target.value)}
                bg="white"
                size="sm"
                borderRadius="md"
                borderColor="gray.800"
              >
                {symptomCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Select>
              <Box w="full">
                <Text fontSize="xs" fontWeight="medium" mb={3} color="gray.600" textTransform="uppercase" letterSpacing="wide">
                  Recent Consultations
                </Text>
                <VStack spacing={2} align="stretch">
                  {chatHistory.map((chat) => (
                    <Tooltip key={chat.id} label={chat.message} placement="right">
                      <Box
                        p={3}
                        bg="white"
                        borderRadius="lg"
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{ bg: "blue.50" }}
                        onClick={() => {
                          setCurrentConversation([
                            {
                              role: "user",
                              content: chat.message,
                              timestamp: chat.created_at,
                            },
                            {
                              role: "assistant",
                              content: chat.response,
                              timestamp: chat.created_at,
                            },
                          ]);
                          setSelectedSymptom(chat.symptom_category || "");
                          setInputText("");
                          setStreamingMessage("");
                          setIsStreaming(false);
                          onClose();
                        }}
                      >
                        <Flex align="center" gap={2}>
                          {chat.symptom_category && (
                            <Icon
                              as={
                                symptomCategories.find(
                                  (c) => c.value === chat.symptom_category
                                )?.icon
                              }
                              color="blue.500"
                              fontSize="sm"
                            />
                          )}
                          <Text fontSize="sm" noOfLines={1} color="gray.700">
                            {chat.title || chat.message}
                          </Text>
                        </Flex>
                      </Box>
                    </Tooltip>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </GridItem>

          <GridItem bg="white" position="relative">
            <Flex direction="column" h="full">
              <Flex
                bg="white"
                px={6}
                py={4}
                borderBottom="1px"
                borderColor="gray.100"
                justify="space-between"
                align="center"
              >
                <IconButton
                  icon={<Menu size={18} />}
                  aria-label="Menu"
                  variant="ghost"
                  display={{ base: "flex", md: "none" }}
                  onClick={onOpen}
                  size="sm"
                />
                <Heading size="sm" mx={{ base: 4, md: 0 }} color="gray.700">
                  Ayunetra Health Assistant
                </Heading>
                <Flex gap={2} align="center">
                  {selectedSymptom && (
                    <Badge colorScheme="blue" fontSize="xs" borderRadius="full" px={3}>
                      {
                        symptomCategories.find((c) => c.value === selectedSymptom)
                          ?.label
                      }
                    </Badge>
                  )}
                  <Button
                    colorScheme="blue"
                    size="xs"
                    onClick={() => setShowHospitalFinder(!showHospitalFinder)}
                    variant="ghost"
                    borderRadius="full"
                  >
                    {showHospitalFinder ? 'Back to Chat' : 'Find Hospitals'}
                  </Button>
                </Flex>
              </Flex>

              <Box flex="1" overflowY="auto" px={6} py={4} bg="gray.50">
                {showHospitalFinder ? (
                  <HospitalFinder />
                ) : (
                  <VStack spacing={6} align="stretch">
                    {currentConversation.map((msg, index) => (
                      <Box
                        key={index}
                        display="flex"
                        flexDirection="column"
                        alignItems={
                          msg.role === "user" ? "flex-end" : "flex-start"
                        }
                      >
                        <Box
                          maxW="80%"
                          bg={msg.role === "user" ? "blue.500" : "white"}
                          color={msg.role === "user" ? "white" : "gray.700"}
                          p={4}
                          borderRadius="2xl"
                          boxShadow="sm"
                        >
                          <MarkdownBox content={msg.content} links={msg.links} />
                        </Box>
                        <Text fontSize="xs" color="gray.500" mt={2} px={2}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </Box>
                    ))}
                    {isStreaming && (
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                      >
                        <Box
                          maxW="80%"
                          bg="white"
                          p={4}
                          borderRadius="2xl"
                          boxShadow="sm"
                        >
                          <MarkdownBox content={streamingMessage} />
                        </Box>
                      </Box>
                    )}
                  </VStack>
                )}
              </Box>

              <Box bg="white" p={6} borderTop="1px" borderColor="gray.100">
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    {imagePreviewUrl && (
                      <Box position="relative" width="fit-content">
                        <Image
                          src={imagePreviewUrl}
                          alt="Selected image"
                          maxH="150px"
                          rounded="lg"
                        />
                        <IconButton
                          icon={<X size={14} />}
                          aria-label="Remove image"
                          position="absolute"
                          top={2}
                          right={2}
                          size="xs"
                          colorScheme="red"
                          variant="solid"
                          onClick={removeSelectedImage}
                          borderRadius="full"
                        />
                      </Box>
                    )}
                    <Flex gap={2}>
                      <Input
                        value={inputText}
                        onChange={handleInputChange}
                        placeholder="Describe your symptoms or health concern..."
                        size="md"
                        bg="gray.50"
                        color="gray.700"
                        border="none"
                        _focus={{ bg: "gray.100", boxShadow: "none" }}
                        borderRadius="full"
                      />
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          style={{ display: "none" }}
                        />
                        <IconButton
                          as="span"
                          aria-label="Upload image"
                          icon={<ImageIcon size={18} />}
                          variant="ghost"
                          cursor="pointer"
                          borderRadius="full"
                        />
                      </label>
                      <IconButton
                        icon={<Send size={18} />}
                        aria-label="Send message"
                        colorScheme="blue"
                        type="submit"
                        isLoading={loading || uploadingImage}
                        borderRadius="full"
                      />
                    </Flex>
                  </VStack>
                </form>
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
};

const MarkdownBox = ({ content, links }: { content: string; links?: { google?: string[]; youtube?: string[] } }) => {
  // Function to clean YouTube URL and get video ID
  const getYouTubeVideoId = (url: string) => {
    try {
      const cleanUrl = url.replace(/\\u0026/g, '&');
      const urlObj = new URL(cleanUrl);
      const searchParams = new URLSearchParams(urlObj.search);
      return urlObj.hostname === 'www.youtube.com' ? searchParams.get('v') : null;
    } catch (e) {
      console.error('Error parsing YouTube URL:', e);
      return null;
    }
  };

  return (
    <Box fontSize={{ base: "sm", md: "sm" }} color="inherit">
      <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
      
      {links && (
        <VStack align="stretch" mt={4} spacing={3}>
          {links.google && links.google.length > 0 && (
            <Box>
              <Text fontWeight="medium" mb={2} color="gray.700">
                Helpful Resources:
              </Text>
              <VStack align="stretch" spacing={2}>
                {links.google.map((link, index) => (
                  <Link
                    key={index}
                    href={link}
                    isExternal
                    color="blue.500"
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <ExternalLink size={14} />
                    {new URL(link).hostname.replace('www.', '')}
                  </Link>
                ))}
              </VStack>
            </Box>
          )}
          
          {links.youtube && links.youtube.length > 0 && (
            <Box>
              <Text fontWeight="medium" mb={2} color="gray.700">
                Related Videos:
              </Text>
              {/* Embed first video if available */}
              {links.youtube[0] && getYouTubeVideoId(links.youtube[0]) && (
                <Box mb={4} borderRadius="lg" overflow="hidden">
                  <iframe
                    width="100%"
                    height="215"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(links.youtube[0])}`}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
              )}
              <VStack align="stretch" spacing={2}>
                {links.youtube.map((link, index) => {
                  const videoId = getYouTubeVideoId(link);
                  return videoId ? (
                    <Link
                      key={index}
                      href={`https://www.youtube.com/watch?v=${videoId}`}
                      isExternal
                      color="red.500"
                      fontSize="sm"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Youtube size={14} />
                      YouTube Video {index + 1}
                    </Link>
                  ) : null;
                })}
              </VStack>
            </Box>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default Chatbot;