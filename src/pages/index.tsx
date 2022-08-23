import { Button, Flex, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Input } from "../components/form/input";

type ISigninForm = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object({
  email: yup.string().required("Email obrigatório").email("Email inválido"),
  password: yup.string().required("Senha obrigatória"),
});

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ISigninForm>({
    mode: "all",
    resolver: yupResolver(signInFormSchema),
  });

  const handleSignin = handleSubmit(async ({}) => {});

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        w="100%"
        maxWidth={368}
        bg="gray.800"
        flexDirection="column"
        p="8"
        borderRadius={8}
        onSubmit={handleSignin}
      >
        <Stack spacing={4}>
          <Input
            label="E-mail"
            name="email"
            type="email"
            error={errors.email}
            {...register("email")}
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            error={errors.password}
            {...register("password")}
          />
        </Stack>

        <Button
          type="submit"
          mt={6}
          colorScheme="pink"
          size="lg"
          isLoading={isSubmitting}
        >
          Entrar
        </Button>
      </Flex>
    </Flex>
  );
}
