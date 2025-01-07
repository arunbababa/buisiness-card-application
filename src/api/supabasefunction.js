import { supabase } from "./supabase"

export const  getAllTodos = async () => {
    console.log("getAllTodos: データを取得します");

  try {
    const { data, error } = await supabase.from('study_record').select('*'); // テーブル全体を取得
    if (error) {
      console.error("Supabaseエラー:", error);
      return [];
    }
    // console.log("取得したデータ:", data);
    return data; // 全データを返す
  } catch (e) {
    console.error("エラーが発生しました:", e);
    return [];
  }
};

// 新しいタスクを Supabase に追加する関数
export const addTodo = async (title, time) => {
    console.log("addTodo: データ挿入を試みます");
  
  try {
    const { data, error } = await supabase
      .from('study_record') // テーブルを指定
      .insert([{ title, time }]) // データを挿入
      .select(); // 挿入されたデータを取得

    if (error) {
      console.error("Supabaseエラー:", error);
      return null;
    }
    console.log("Supabaseへの追加成功:", data);
    return data; // 挿入された行を返す
  } catch (e) {
    console.error("エラーが発生しました:", e);
    return null;
  }
};

// 特定のタスクを削除する関数
export const deleteTodo = async (id) => {
    console.log("deleteTodo: データ削除を試みます");
    const { data, error } = await supabase
        .from("study_record")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("削除エラー:", error.message);
        return null;
    }

    console.log("Supabaseから削除成功:", data);
    return data;
};