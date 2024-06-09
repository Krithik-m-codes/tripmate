import { SavedPlaces } from "../models/User.model";

//  defining the visual type of response from the server
// type safety is maintained here by defining the type of response from the server as ApiResponse 
export interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
  SavedPlaces?: Array<SavedPlaces>;
}
