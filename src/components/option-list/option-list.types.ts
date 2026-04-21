export type OptionData = {
  id: number;
  title: string;
  weight: number;
};

export type ListData = {
  list: OptionData[];
  lastId: number;
};
