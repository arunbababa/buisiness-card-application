export class Todos {
    constructor(
        public id: number,
        public title: string,
        public time: number
    ) {}

    public static newTodo(
        id:number,
        title:string,
        time:number
    ): Todos {
        return new Todos(id, title,time);
      }
}