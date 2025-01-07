import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GetAllTodos } from "./lib/todo";
import { Todo } from "./domain/todo";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'

function App() {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllTodos = async () => {
      const todosDate = await GetAllTodos(); // await用復習
      console.log(`It is mockDate: ${todosDate}`);
      setTodos(todosDate);
      setIsLoading(false);
    }
    getAllTodos();
  },
    [])

    if (isLoading) {
      return <p>Loading...</p>
    }

  return (
    <>
      <h1>タスク管理アプリ</h1>
      <Button colorScheme='blue'>Button</Button>
      <h1 data-testid="title">this title for test jest</h1>
      <TableContainer>
          <Table variant='simple' data-testid="table">
            <TableCaption>Imperial to metric conversion factors</TableCaption>
            <Thead>
              <Tr>
                <Th>task name</Th>
                <Th>taked time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {todos.map((todo) => {
                return (
                  <Tr key={todo.id}>
                    <Td>{todo.title}</Td>
                    <Td>{todo.time}</Td>
                  </Tr>
                )
              })}
            </Tbody>              
          </Table>
        </TableContainer>
    </>
  )
}

export default App
