export interface Signature {
  path: string;
  public?: boolean;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  inputs?: string[];
  outputs?: string[];
  controlOutputs: string[];
}
