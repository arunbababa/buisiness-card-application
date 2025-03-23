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
    console.log(date);
    navigate(`/cards/${date.userID}`);
  }
  const goRegister = () => {
    navigate("/card/register");
  }

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
          <FormLabel>ユーザIDを検索してください</FormLabel>
          <Input
              {...register("userID", { 
                  required: "ユーザーIDは必須です", 
                  pattern: { value: /^[A-Za-z]+$/, message: "英字のみで入力してください" }
                  })}
              placeholder="coffee"
              aria-invalid={errors.userID ? "true" : "false"} 
              />
          {errors.userID && <Text color="red.500">{errors.userID.message}</Text>}
          <Button  type="submit" colorScheme="blue">送信</Button>
      </FormControl>
    </form>
    <Button type="submit" colorScheme="red" onClick={goRegister}>新規登録はこちら</Button>

    </>
  )
}

export default App