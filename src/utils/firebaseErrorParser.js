// firebaseErrorParser.js

export const getFriendlyFirebaseError = (code) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "Email is already in use."
    case "auth/invalid-email":
      return "Invalid email address."
    case "auth/weak-password":
      return "Password should be at least 6 characters."
    case "auth/missing-password":
      return "Please enter your password."
    case "auth/invalid-credential":
    case "auth/user-not-found":
      return "No account found with this email."
    case "auth/wrong-password":
      return "Incorrect password. Try again."
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later."
    default:
      return "Something went wrong. Please try again."
  }
}
