/*
Add Address
POST: {{server}}/address/add-address
*/
export interface AddAddress { 
  houseNumber: string; 
  area: string; 
  landmark: string; 
  city: string; 
  pincode: string; 
  state: string; 
  mobileNumber: string; 
}