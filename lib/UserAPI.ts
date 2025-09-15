export default class UserAPI {
  private TableName = process.env.NEXT_PUBLIC_API_GATEWAY_URL!;

  async getUsers() {
    const res = await fetch(`${this.TableName}/users`);
    const data = await res.json();
    if (res.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  }

  async createUser(name: string, email: string, password: string) {
    const data = await fetch(`${this.TableName}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return data;
  }

  async authLogin(email: string, password: string) {
    return fetch(`/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
  }

  async logOut() {
    const res = await fetch(`/api/logout`, {
      method: "POST",
      credentials: "include", // important so browser applies Set-Cookie
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to log out");
    }
    return res.json();
  }
}
