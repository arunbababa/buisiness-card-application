export class Todo {
    constructor(
        public id: number,
        public title: string,
        public done: boolean,
        public created_at: Date
    ) { }

    public static newTodo(
        id:number,
        title:string,
        done:boolean,
        created_at:string
    ): Todo {
        // `created_at` を `Date` 型に変換
        const formattedDate = new Date(created_at);
        return new Todo(id, title, done, formattedDate);
      }
}