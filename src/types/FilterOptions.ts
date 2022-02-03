export default interface IFilterOptions {
  component: unknown;
  chip: {
    label: string;
    active: boolean;
  };
  filter: {
    label: string;
    items: (value: string) => Promise<string[]>;
    value: string;
  };
}
