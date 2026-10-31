// Preview can only bypass sign-in on the local development server.
export const isLocalPreview =
  import.meta.env.DEV && import.meta.env.VITE_LOCAL_PREVIEW === "true";
