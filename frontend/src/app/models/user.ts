import { AppRoutingModule } from '../app-routing.module';

export interface User {
  _id: string;
  active: boolean;
  userid: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  accessreason: string;
  access_requested: boolean;
  role: string;
  admin: boolean;
  modified_date: Date;
  create_date: Date;
}
