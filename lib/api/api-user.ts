export function userFetcher() {
  if (localStorage.getItem("flagpole_token")) {
    return {
      token: localStorage.getItem("flagpole_token"),
      wallet: localStorage.getItem("flagpole_wallet"),
      key: localStorage.getItem("flagpole_key"),
    };
  }

  const error: Error & { status?: number } = new Error("Not authorized!");
  error.status = 403;
  throw error;
}
