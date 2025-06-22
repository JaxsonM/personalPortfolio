// // src/components/SignInModal.tsx
// import React, { useEffect, useCallback } from "react";
// import { Authenticator } from "@aws-amplify/ui-react";
// import { Hub } from "@aws-amplify/core";
// import { getCurrentUser } from "@aws-amplify/auth";

// export interface SignInModalProps {
//   /** Whether the modal is visible */
//   isOpen: boolean;
//   /** Callback to hide the modal */
//   onClose: () => void;
//   /** Callback with the Cognito user once sign-in completes */
//   onSignedIn: (user: any) => void;
// }

// const SignInModal: React.FC<SignInModalProps> = ({
//   isOpen,
//   onClose,
//   onSignedIn,
// }) => {
//   // Fetch the currently signed-in Cognito user and hand it to parent
//   const fetchUser = useCallback(async () => {
//     try {
//       const userData = await getCurrentUser();
//       onSignedIn(userData);
//     } catch {
//       // no session, ignore
//     }
//   }, [onSignedIn]);

//   // Listen for Amplify Auth events
//   useEffect(() => {
//     const listener = (data: any) => {
//       const { event } = data.payload;
//       if (event === "signedIn") {
//         onClose();
//         fetchUser();
//       }
//       if (event === "signOut") {
//         // you could call onSignedIn(null) here if you want
//       }
//     };

//     Hub.listen("auth", listener);
//     return () => {
//       Hub.remove("auth", listener);
//     };
//   }, [fetchUser, onClose]);

//   // Nothing to render when closed
//   if (!isOpen) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
//       <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
//         {/* Amplify’s full sign-in / sign-up / forgot-password UI */}
//         <Authenticator />

//         {/* Fallback Close button */}
//         <button
//           onClick={onClose}
//           className="mt-4 w-full bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SignInModal;
