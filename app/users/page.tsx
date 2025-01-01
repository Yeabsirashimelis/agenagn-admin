"use client"

import { QueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const appUsers = [
  { id: "1", name: "Alice Brown", email: "alice.brown@example.com", status: "Active", createdAt: "2024-01-15" , isBanned:false},
  { id: "2", name: "Bob Green", email: "bob.green@example.com", status: "Inactive", createdAt: "2024-03-22", isBanned:false },
  { id: "3", name: "Charlie Davis", email: "charlie.davis@example.com", status: "Active", createdAt: "2024-05-10",isBanned:true },
];

const queryClient = new QueryClient();
export default function UsersPage() {

  async function getUsers(){
    const res = await fetch(`https://localhost:8080/user/getAll`)
    if(!res.ok) throw new Error("Error fetching users");
    const data = await res.json();
  }

  const { data, isLoading: isPending, error } = useQuery({
    queryFn: getUsers, 
    queryKey:["users"]
  })
  

  const handleBanUser = async (id:string) => {
     try {
          const res = await fetch(`https://localhost:8080/user/ban/${id}`, {method:"PUT"})
          if(!res.ok) throw new Error("Error banning user");
          toast.success("user banned successfully"); 
          queryClient.invalidateQueries({ queryKey: ["users"] });
        } catch (error) {
          toast.error((error instanceof Error) ? error.message : "An error occurred");
        }
  };

  const handleunBanUser = async (id:string) => {
    try {
         const res = await fetch(`https://localhost:8080/user/unban/${id}`, {method:"PUT"})
         if(!res.ok) throw new Error("Error unbanning user");
         toast.success("user banned successfully"); 
         queryClient.invalidateQueries({ queryKey: ["users"] });
       } catch (error) {
         toast.error((error instanceof Error) ? error.message : "An error occurred");
       }
 };

 if(isPending) return <Spinner loading={isPending}/>

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">App Users</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Joined Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 font-semibold ${
                    !user.isBanned ? "text-green-600" : "text-red-600"
                  }`}
                > 
                  {user.isBanned ? "Banned" : "Active"}
                </td>
                <td className="border border-gray-300 px-4 py-2">{user.createdAt}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {!user.isBanned ? <button
                    onClick={() => handleBanUser(user.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none w-[100px]"
                  >
                    Ban User
                  </button> : <button
                    onClick={() => handleunBanUser(user.id)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 focus:outline-none w-[120px]"
                  >
                    Unban User
                  </button> 
}                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
