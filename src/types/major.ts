export interface MajorInput {
  code: string;
  name: string;
  description?: string;
}

export interface MajorUpdate {
  code?: string;
  name?: string;
  description?: string;
}

export interface MajorResponse {
  id: string;
  code: string;
  name: string;
  description: string | null;
  createAt: Date;
  updateAt: Date;
}
