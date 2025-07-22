/*
Update Password
PATCH: {{server}}/users/update-password
*/
export interface UpdatePassword { 
  oldPassword: string; 
  newPassword: string; 
}