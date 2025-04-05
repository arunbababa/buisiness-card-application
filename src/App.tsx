import { Button, FormControl, FormLabel, Input, Text } from "@chakra-ui/react"
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const App = () => {

  interface RegisterFormData {
  userID: string;
  }
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const onSubmit = (date: RegisterFormData) => {
    navigate(`/cards/${date.userID}`);
  }
  const goRegister = () => {
    navigate("/card/register");
  }

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <FormControl maxW="400px" mt="100px">
      <FormLabel textAlign="center">ユーザIDを検索してください</FormLabel>
      <Input
        {...register("userID", { 
        required: "ユーザーIDは必須です", 
        pattern: { value: /^[A-Za-z]+$/, message: "英字のみで入力してください" }
        })}
        placeholder="coffee"
        aria-invalid={errors.userID ? "true" : "false"} 
      />
      {errors.userID && <Text color="red.500" textAlign="center">{errors.userID.message}</Text>}
      </FormControl>
      <Button type="submit" colorScheme="blue" variant="solid" width="200px">検索</Button>
      <Button onClick={goRegister} colorScheme="teal" variant="outline" width="200px">新規登録はこちら</Button>
    </form>

    </>
  )
}

export default App