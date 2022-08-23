import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Checkbox,
  Tbody,
  Text,
  useBreakpointValue,
  Spinner,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { getUsers, MappedUser, useUsers } from "../../services/hooks/useUsers";
import { queryClient } from "../../services/queryClient";

interface IUserListProps {
  users: MappedUser[];
}

export default function UserList({ users }: IUserListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching } = useUsers(page, {
    // Iniciando o valor do react-query
    // initialData: users,
  });

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  // Prefetch de dados com react-query
  const handlePrefectUser = async (userId: string) => {
    await queryClient.prefetchQuery(
      ["user", userId],
      async () => {
        const { data } = await api.get(`users/${userId}`);

        return data;
      },
      {
        staleTime: 1000 * 60 * 10, // 10 minutos sem recarregar dados
      }
    );
  };

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1400} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>

            <Link href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} />}
              >
                Criar novo
              </Button>
            </Link>
          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : isError ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos usuários.</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th px={["4", "4", "6"]} color="gray.300" w="8">
                      <Checkbox colorScheme="pink" />
                    </Th>
                    <Th>Usuário</Th>
                    {isWideVersion && <Th>Data de cadastro</Th>}
                    <Th w="8"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {/* @ts-ignore */}
                  {data.users.map((user) => (
                    <Tr key={user.id}>
                      <Td px={["4", "4", "6"]}>
                        <Checkbox colorScheme="pink" />
                      </Td>
                      <Td>
                        <Box>
                          <ChakraLink
                            color="puprle.400"
                            onMouseEnter={() => handlePrefectUser(user.id)}
                          >
                            <Text fontWeight="bold">{user.name}</Text>
                          </ChakraLink>
                          <Text fontSize="small">{user.email}</Text>
                        </Box>
                      </Td>
                      {isWideVersion && <Td>{user.createdAt}</Td>}
                      <Td>
                        <Button
                          as="a"
                          size="sm"
                          fontSize="sm"
                          colorScheme="purple"
                          leftIcon={<Icon as={RiPencilLine} fontSize={16} />}
                        >
                          {isWideVersion ? "Editar" : ""}
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Pagination
                // @ts-ignore
                totalCountOfRegisters={data.totalCount}
                currentPage={page}
                onPageChange={(selectedPage) => setPage(selectedPage)}
              />
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

// SSR com react-query
// export const getServerSideProps: GetServerSideProps = async () => {
//   const { users } = await getUsers(1);

//   return {
//     props: {
//       users,
//     },
//   };
// };
