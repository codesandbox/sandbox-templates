import { useState } from "react";
import reactLogo from "./assets/react.svg";
import chakraLogo from "./assets/chakra.svg";
import { Box, Button, Code, Image, Link, Text } from "@chakra-ui/react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Box
      as="main"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={12}
      py={12}
      height="100vh"
    >
      <Box display="flex" alignItems="center" gap={12}>
        <Link
          href="https://react.dev"
          isExternal
          boxSize="100px"
          transform="scale(1)"
          _hover={{
            transform: "scale(1.2)",
          }}
        >
          <Image src={reactLogo} boxSize="100%" alt="React logo" />
        </Link>
        <Link
          href="https://v2.chakra-ui.com/"
          target="_blank"
          boxSize="100px"
          transform="scale(1)"
          _hover={{
            transform: "scale(1.2)",
          }}
        >
          <Image src={chakraLogo} boxSize="100%" alt="Chakra UI logo" />
        </Link>
      </Box>
      <Text as="h1" fontSize="xxx-large" fontWeight="bold">
        React + Chakra
      </Text>
      <Button colorScheme="teal" onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </Button>
      <Text>
        You can play with the components in <Code>src/App.tsx</Code>
      </Text>
    </Box>
  );
}

export default App;
