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
      console.log(`It is todosDate: ${JSON.stringify(todosDate, null, 2)}`);
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
      <Button colorScheme='teal'>ボタン</Button>
      <Button colorScheme='blue'>Button</Button>
      <h1 data-testid="title">this title for test jest</h1>
      <TableContainer>
          <Table variant='simple' data-testid="table">
            <TableCaption>Imperial to metric conversion factors</TableCaption>
            <Thead>
              <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
              </Tr>
            </Thead>
            <Tbody>
              {todos.map((todo) => {
                return (
                  <Tr key={todo.id}>
                    <Td>{todo.title}</Td>
                    <Td>{todo.done ? 'Done' : 'Not yet'}</Td>
                    <Td>{todo.created_at.toLocaleString()}</Td>
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
