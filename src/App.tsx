import { Button, Input, VStack, FormControl, FormLabel, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getTodosFromSupabase,sendAndGetTodosFromSupabase } from "./lib/todo"; // タスクリスト取得関数
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
  const [taskName, setTaskName] = useState("");
  const [taskTime, setTaskTime] = useState("");

  useEffect(() => {
    const getAllTodos = async () => {
      try {
        setTodos(await getTodosFromSupabase()); // タスクリストをセット
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

  const handleSave = async () => {
    if (!taskName || isNaN(Number(taskTime))) {
      console.error("タスク名または時間が無効です");
      return;
    }
  
    try {
      const updatedTodos = await sendAndGetTodosFromSupabase(taskName, Number(taskTime));
      setTodos(updatedTodos); // タスクリストを更新
      onClose(); // モーダルを閉じる
    } catch (error) {
      console.error("タスクの保存中にエラー:", error);
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
              <Input ref={initialRef} placeholder='First name' value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>タスクにかかる時間</FormLabel>
              <Input placeholder='Last name' value={taskTime} onChange={(e) => setTaskTime(e.target.value)}/>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button 
              colorScheme='blue' 
              mr={3}
              // 以下のonClick関数を実装する、supaに投げる用の関数を渡す
              onClick={handleSave}
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
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}

export default App;
