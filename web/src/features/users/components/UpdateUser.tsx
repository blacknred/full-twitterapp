import type { FC } from "react";

export const UpdateUser: FC = () => <h1>Update user</h1>

// Form[img, username, name, bio; email[]; password[old, new]] + AuthConfirmationDialog
// img
// username
// name
// email(password confirm)
// bio
// SAVE

// !SENT_CODE ?
  // AUTH ? input.emailOrName : input.curpassword
  // button.continue 
// :
  // input.code
  // input.newpassword
  // button.save