import React from "react";
import Link from "next/link";
import {
  Button,
} from "@chakra-ui/react";


function Navnew() {
  return (
    <Link href="/chatbot">
      <Button
        rounded={"full"}
        size={"lg"}
        fontWeight={"normal"}
        px={6}
        bg="beige"
        color="gray.700"
        _hover={{ bg: "#E8DCC4" }}
        border="1px"
        borderColor="gray.200"
      >
        Let's explore
      </Button>
    </Link>
  );
}

export default Navnew;
