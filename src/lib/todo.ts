import { Todo } from "../domain/todo";
import { supabase } from "../utils/supabase";

export async function getTodosFromSupabase() : Promise<Todo[]> {
    
    const resFromSupabase = await supabase.from("study_records").select("*");

    if (!resFromSupabase.error) {
        const todos = resFromSupabase.data.map((todo) => {
            console.log(`It is todo: ${JSON.stringify(todo, null, 2)}`);
            return Todo.newTodo(todo.id, todo.title,todo.time);
        })
        return todos;
    }else{
        console.log(resFromSupabase.error.message);
        return [];
    }
}

export async function sendAndGetTodosFromSupabase(taskName:string,taskTime:number) : Promise<Todo[]> {
    
    await supabase.from("study_records").insert({title: taskName, time: taskTime});
    return await getTodosFromSupabase();
}