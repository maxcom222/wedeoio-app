export interface Toast {
  id: number;
  title: string;
  description: string;
  type?: 'success' | 'warning' | 'error';
}
