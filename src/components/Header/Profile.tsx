import { Flex, Box, Text, Avatar } from "@chakra-ui/react";

interface IProfileProps {
  showProfileData: boolean;
}

export function Profile({ showProfileData }: IProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Diego Fernandes</Text>
          <Text color="gray.300" fontSize="small">
            diego.scholl.f@gmail.com
          </Text>
        </Box>
      )}

      <Avatar
        size="md"
        name="Diego Fernandes"
        src="https://github.com/diego3g.png"
      />
    </Flex>
  );
}
