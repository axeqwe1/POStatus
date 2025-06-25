export interface ServerTableParams {
  pageIndex: number;
  pageSize: number;
  sorting: Array<{
    id: string;
    desc: boolean;
  }>;
  columnFilters: Array<{
    id: string;
    value: any;
  }>;
  globalFilter?: string;
}

export interface ServerTableResponse<T> {
  data: T[];
  totalCount: number;
  totalPendding?: number;
  totalConfirm?: number;
}
