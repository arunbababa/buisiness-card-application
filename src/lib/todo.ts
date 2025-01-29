import { Todo } from "../domain/todo";
import { supabase } from "../utils/supabase";

export async function getTodosFromSupabase() : Promise<Todo[]> {
    const resFromSupabase = await supabase.from("study_records").select("*");
    if (!resFromSupabase.error) {
        const todos = resFromSupabase.data.map((todo) => {
            return Todo.newTodo(todo.id, todo.title,todo.time);
        })
        return todos;
    }else{
        console.log(resFromSupabase.error.message);
        return [];
    }
}

export async function sendTodosToSupabase(taskName:string,taskTime:number) {
    await supabase.from("study_records").insert({title: taskName, time: taskTime});
    return console.log("supabaseに登録しました。");
}

export async function deleteTodosFromSupabase(id:number) {
    await supabase.from("study_records").delete().eq('id', id);
    return console.log("supabaseから削除しました。");
}

export async function updateTodosFromSupabase(id:number, taskName:string, taskTime:number) {
    await supabase.from("study_records").update({title: taskName, time: taskTime}).eq('id', id);
    return console.log("supabaseを更新しました。");
}