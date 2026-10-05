export interface TBlog {
  image: {
    url: string;
    altText: string;
  };
  _id: string;
  title: string;
  content: string;
  author: string;
  email: string;
  isPublished: boolean;
  postDate: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  admin: {
    name: string;
    email: string;
  };
}
