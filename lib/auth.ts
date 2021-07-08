export async function login(wallet: string, passphrase: string) {
  const res = await fetch("https://wallet.testnet.vega.xyz/api/v1/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      wallet,
      passphrase,
    }),
  });

  const json = await res.json();

  localStorage.setItem("flagpole_token", json.token);
  localStorage.setItem("flagpole_wallet", wallet);

  const keys = await getKeys(json.token);

  localStorage.setItem("flagpole_key", keys[0].pub);

  return;
}

export function logout() {
  localStorage.removeItem("flagpole_token");
  localStorage.removeItem("flagpole_wallet");
  localStorage.removeItem("flagpole_key");
}

export async function getKeys(token: string) {
  const res = await fetch("https://wallet.testnet.vega.xyz/api/v1/keys", {
    headers: { authorization: `Bearer ${token}` },
  });

  const json = await res.json();

  return json.keys;
}
