import { user } from "@/db/schema";
import { db } from "../db";
import { revalidatePath } from "next/cache";

export default async function Home() {
  const users = await db.query.user.findMany();

  return (
    <main className="flex min-h-screen flex-col gap-4 p-24">
      <div>
        <h1 className="text-2xl">Current Users:</h1>
        {users.map((user) => {
          return <p key={user.id}>{user.name}</p>;
        })}

        {users.length === 0 && <p>No users</p>}
      </div>

      <div>
        <h1 className="text-2xl mb-2">Add User</h1>
        <form
          className="flex gap-2"
          action={async (formData: FormData) => {
            "use server";
            const name = formData.get("name") as string;

            await db.insert(user).values({ name }).execute();

            revalidatePath("/");
          }}
        >
          <input
            className="p-1 px-2 rounded"
            type="text"
            name="name"
            placeholder="Name"
          />
          <button
            className="bg-blue-500 text-white p-1 px-2 rounded"
            type="submit"
          >
            Add User
          </button>
        </form>
      </div>
    </main>
  );
}
