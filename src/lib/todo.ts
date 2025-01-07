import { Todo } from "../domain/todo";
import { supabase } from "../utils/supabase";

// awaitとasync要復習
export async function GetAllTodos() : Promise<Todo[]> {
    const response = await supabase.from("study_records").select("*");

    if (response.error) {
        throw new Error(response.error.message);
    }

    console.log(`It is data from Supabase: ${JSON.stringify(response.data, null, 2)}`);

    const todos = response.data.map((todo) => {
        console.log(`It is todo: ${JSON.stringify(todo, null, 2)}`);
        return Todo.newTodo(todo.id, todo.title,todo.time);
    })

    return todos;
}