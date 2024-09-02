import { ObjectId } from "mongodb";
import { BaseEntity } from "../base/entity";
        
export interface HelloData extends BaseEntity {
    message: string;
}