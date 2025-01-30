import { Button, Input, VStack, FormControl, FormLabel, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getTodosFromSupabase,sendTodosToSupabase,deleteTodosFromSupabase,updateTodosFromSupabase } from "./lib/todo";
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
  const [currentTask, setCurrentTask] = useState<{ id: number; taskName: string; taskTime: number } | null>(null); // 編集対象のタスク
  // 既存のモーダル用ステート
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  // 新たに編集モーダル用のステートを追加
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();  
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{
    taskName: string;
    taskTime: number;
  }>();
  

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

  const openAddModal = () => {
    reset({ taskName: "", taskTime: 0 }); // フォームを空にリセット
    onAddOpen();
  };
  
  const closeAddModal = () => {
    reset({ taskName: "", taskTime: 0 }); // フォームをクリア
    onAddClose();
  };
  

  // 既存：タスク追加用の送信処理
  const onSubmitAdd = async (data: { taskName: string; taskTime: number }) => {
    try {
      await sendTodosToSupabase(data.taskName, Number(data.taskTime));
      const updatedTodos = await getTodosFromSupabase();
      setTodos(updatedTodos);
      reset();
      onAddClose();
    } catch (error) {
      console.error("タスクの保存中にエラー:", error);
    }
  };

  const onDelete = async (id:number) => {
    await deleteTodosFromSupabase(id);
    const updatedTodos = await getTodosFromSupabase();
    setTodos(updatedTodos);
  }

  // 新規：タスク編集用の送信処理
  const onSubmitEdit = async (data: { taskName: string; taskTime: number }) => {
    if (!currentTask) return;
    try {
      await updateTodosFromSupabase(currentTask.id, data.taskName, Number(data.taskTime));
      const updatedTodos = await getTodosFromSupabase();
      setTodos(updatedTodos);
      setCurrentTask(null); // 編集対象をリセット
      reset();
      onEditClose();
    } catch (error) {
      console.error("タスクの更新中にエラー:", error);
    }
  };

  // 新規：編集モーダルを開く関数
  const openEditModal = (todo: Todo) => {
    setCurrentTask({ id: todo.id, taskName: todo.title, taskTime: todo.time }); // 編集対象のタスクを設定
    reset({ taskName: todo.title, taskTime: todo.time }); // 初期値をフォームにセット
    onEditOpen(); // 編集モーダルを開く
  };

  return (
    <VStack spacing={4} align="stretch" p={4}>

      <h1 data-testid="title">タスク管理アプリ</h1>

      {/* タスク追加モーダル */}
      <Button onClick={openAddModal}>タスクを登録する</Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isAddOpen}
        onClose={closeAddModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>タスクを追加しましょう！</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>タスクの名前</FormLabel>
              <Input 
                  placeholder="タスクの名前" 
                  {...register("taskName", { 
                    required: "タスク名は必須です" ,
                    validate: {
                      isMaxLength:value => value.length <= 20 || "20文字以内で入力してください"
                    }
                  })} 
                />
                {errors.taskName && <span>{String(errors.taskName.message)}</span>}
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
              {errors.taskTime && <span>{String(errors.taskTime.message)}</span>}
            </FormControl>
          </ModalBody>

          <ModalFooter>
          <Button 
              colorScheme="blue" 
              mr={3}
              onClick={handleSubmit(onSubmitAdd)}
            >
              Save
            </Button>
            <Button onClick={onAddClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* タスク編集モーダル */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>タスクを編集しましょう！</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>タスクの名前</FormLabel>
              <Input
                placeholder="タスクの名前"
                {...register("taskName", { required: "タスク名は必須です" })}
              />
              {errors.taskName && <span>{errors.taskName.message}</span>}
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>タスクにかかる時間</FormLabel>
              <Input
                placeholder="タスクにかかる時間"
                {...register("taskTime", {
                  required: "時間は必須です",
                  validate: value => !isNaN(Number(value)) || "数値を入力してください",
                })}
              />
              {errors.taskTime && <span>{errors.taskTime.message}</span>}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit(onSubmitEdit)}>
              Save
            </Button>
            <Button onClick={onEditClose}>Cancel</Button>
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
                <Td>
                  <Button
                    colorScheme="red"
                    onClick={() => onDelete(todo.id)}
                  >
                    削除
                  </Button>
                </Td>
                <Td>
                  <Button
                    colorScheme="blue"
                    onClick={() => openEditModal(todo)}
                  >
                    編集
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
