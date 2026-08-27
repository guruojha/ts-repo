export type Task = {
  id: number;
  title: string;
  done: boolean;
};

export type NewTask = Pick<Task, "title">;