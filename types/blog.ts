export interface TagFilterItem {
  id: string;
  name: string;
  count: number;
}

export interface Post {
  id: string;
  title: string;
  description?: string;
  type?: string;
  tags?: string[];
  createdAt?: string;
  modifiedAt?: string;
  status?: string;
  thumbnail?: string;
  slug?: string;
}
