export class Todo {
    constructor(
        public id: number,
        public title: string,
        public time: number
    ) { }

    public static newTodo(
        id:number,
        title:string,
        time:number
    ): Todo {
        return new Todo(id, title,time);
      }
}