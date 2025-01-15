import { Button, Input, VStack, FormControl, FormLabel, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getTodosFromSupabase,sendAndGetTodosFromSupabase,deleteTodosFromSupabase } from "./lib/todo";
import { Todo } from "./domain/todo"; // タスク型定義
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form';

function App() {

  const [todos, setTodos] = useState<Todo[]>([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  // const [taskName, setTaskName] = useState("");
  // const [taskTime, setTaskTime] = useState("");
  // フォーム部分
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const getAllTodos = async () => {
      try {
        setTodos(await getTodosFromSupabase()); // タスクリストをセット
        reset(); // フォームのリセット
      } catch (error) {
        console.error("タスクリスト取得中にエラー:", error);
      } finally {
        setIsLoading(false); // ローディング解除
      }
    };
    getAllTodos();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const onSubmit = async (data) => {
    try {
      const updatedTodos = await sendAndGetTodosFromSupabase(data.taskName, Number(data.taskTime));
      setTodos(updatedTodos); // タスクリストを更新
      reset(); // フォームのリセット
      onClose(); // モーダルを閉じる
    } catch (error) {
      console.error("タスクの保存中にエラー:", error);
    }
  };

  const onDelete = async (id:number) => {
    try {
      const updatedTodos = await deleteTodosFromSupabase(id);
      setTodos(updatedTodos); // タスクリストを更新
    } catch (error) {
      console.error("タスクの削除中にエラー:", error);
    }
  };

  return (
    <VStack spacing={4} align="stretch" p={4}>

      <h1>タスク管理アプリ</h1>


      {/* タスク追加フォーム */}
      <Button onClick={onOpen}>タスクを登録する</Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>タスクを追加しましょう！</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>タスクの名前</FormLabel>
              <Input 
                  ref={initialRef} 
                  placeholder="タスクの名前" 
                  {...register("taskName", { 
                    required: "タスク名は必須です" ,
                    validate: {
                      isMaxLength:value => value.length <= 20 || "20文字以内で入力してください"
                    }
                  })} 
                />
                {errors.taskName && <span>{errors.taskName.message}</span>}
              </FormControl>

            <FormControl mt={4}>
              <FormLabel>タスクにかかる時間</FormLabel>
              <Input 
                placeholder="タスクにかかる時間" 
                {...register("taskTime", { 
                  required: "時間は必須です", 
                  validate: {
                    isNumber:value => !isNaN(Number(value)) || "数値を入力してください" ,
                    isPositiveNumber:value => Number(value) > 0 || "0より大きい数値を入力してください"
                  }
                })}
              />
              {errors.taskTime && <span>{errors.taskTime.message}</span>}
            </FormControl>
          </ModalBody>

          <ModalFooter>
          <Button 
              colorScheme="blue" 
              mr={3}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* タスクリスト表示 */}
      <TableContainer>
        <Table variant="simple" data-testid="table">
          <TableCaption>タスクリスト</TableCaption>
          <Thead>
            <Tr>
              <Th>タスク名</Th>
              <Th>かかる見込時間</Th>
            </Tr>
          </Thead>
          <Tbody>
            {todos.map((todo) => (
              <Tr key={todo.id}>
                <Td>{todo.title}</Td>
                <Td>{todo.time}</Td>
                {/* 削除ボタンの実装 */}
                <Td>
                  <Button
                    colorScheme="red"
                    onClick={() => onDelete(todo.id)}
                  >
                    削除
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}

export default App;
