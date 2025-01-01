"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import { QueryClient, useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";

const sampleProperties = [
  { id: "1", name: "Property 1", status: "Pending", location: "New York", imageUrl: "/house1.jpg" },
  { id: "2", name: "Property 2", status: "Pending", location: "Los Angeles", imageUrl: "/house2.jpg" },
  { id: "3", name: "Property 3", status: "Pending", location: "Chicago", imageUrl: "/house3.jpg" },
];


export default function PropertiesToApprove() {

  const [properties, setProperties] = useState([])


  async function getProperties(){
    const res = await fetch("https://localhost:8080/submissions/getAll")
    if(!res.ok) throw new Error("Error fetching properties");
    const data = await res.json();
  }

  const { data, isLoading: isPending, error } = useQuery({
    queryFn: getProperties, 
    queryKey:["properties"]
  })
  
  const queryClient = new QueryClient();
  
  async function handleApprove(id:string) {
    try {
      const res = await fetch(`https://localhost:8080/submissions/accept/${id}`, {method:"PUT"})
      if(!res.ok) throw new Error("Error approving property");
      toast.success("Property approved successfully"); 
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    } catch (error) {
      toast.error((error instanceof Error) ? error.message : "An error occurred");
    }
  }
  
  async function handleReject(id:string) {
    try {
      const res = await fetch(`https://localhost:8080/submissions/reject/${id}`, {method:"PUT"})
      if(!res.ok) throw new Error("Error rejecting property");
      toast.success("Property rejected successfully"); 
      queryClient.invalidateQueries({ queryKey: ["properties"] });

    } catch (error) {
      toast.error((error instanceof Error) ? error.message : "An error occurred");
    }
  }
  
  if(isPending){
    return <Spinner loading={isPending}/>
  }

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 ">
      
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Properties to Approve</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sampleProperties.map((property) => (
          <div key={property.id} className="bg-white shadow-lg rounded-lg p-6">
            <div className="h-[400px] relative rounded-lg overflow-hidden">
              <Image
                src={property.imageUrl}
                alt={`Image of ${property.name}`}
                layout="fill"
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-700">{property.name}</h2>
              <p className="text-gray-600">Location: {property.location}</p>
              <p className="text-red-600 font-bold">Status: {property.status}</p>
            </div>
            <div className="mt-4 flex items-center justify-around space-x-4 text-white">
                <div className="flex gap-2 items-center">
                <button className=" bg-green-600 px-2 py-1 hover:bg-green-700 rounded-lg transition-all duration-300" onClick={()=>handleApprove(property.id)}>Approve</button>
                <button className="bg-red-600 px-2 py-1 hover:bg-red-700 transition-all rounded-lg duration-300" onClick={()=>{handleReject(property.id)}}>Decline</button>
            </div>

            <div className="hover:underline text-blue-400">see details➡</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
