"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Id, toast, ToastContainer } from "react-toastify";
import { QueryClient, useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import supabase from "@/supabase";
const PropertiesToApprove = () => {
  const [properties, setProperties] = useState([]);

  async function getProperties() {
    let { data, error } = await supabase
      .from('submission')
      .select('*')
      // .eq('status', 'pending'); // Filter properties with 'Pending' status

    if (error) throw new Error('Error fetching properties');
    return data;
  }

  const { data, isLoading: isPending, error } = useQuery({
    queryFn: getProperties,
    queryKey: ["properties"],
  });

  console.log(data)

  const queryClient = new QueryClient();

  async function handleApprove(id:bigint) {
    try {
      let { data:property, error: fetchError } = await supabase
        .from('submission')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw new Error('Error fetching property details');

      const { data: personalBuildingData, error: insertError } = await supabase
        .from('PersonalHouses')
        .insert({
          title: property.title,
          description: property.description,
          address: property.address,
          price: property.price,
          bedRoomNumber: property.bedRoomNumber,
          bathRoomNumber: property.bathRoomNumber,
          squareFeet: property.squareFeet,
          image: property.image,
          leaseTerms: property.leaseTerms,
          isPetAllowed: property.isPetAllowed,
          phoneNumber: property.phoneNumber,
          additionalFeatures: property.additionalFeatures
        })
        .single();

      if (insertError) throw new Error('Error adding property to personal buildings');

      const { error: deleteError } = await supabase
        .from('submission')
        .delete()
        .eq('id', id);

      if (deleteError) throw new Error('Error deleting property from submissions');

      toast.success('Property approved successfully');
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    } catch (error) {
      toast.error((error instanceof Error) ? error.message : 'An error occurred');
    }
  }

  async function handleReject(id:bigint) {
    try {
      const { error } = await supabase
        .from('submission')
        .delete()
        .eq('id', id);

      if (error) throw new Error('Error rejecting property');

      toast.success('Property rejected successfully');
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    } catch (error) {
      toast.error((error instanceof Error) ? error.message : 'An error occurred');
    }
  }

  if (isPending) {
    return <Spinner loading={isPending} />;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Properties to Approve</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.map((property) => (
          <div key={property.id} className="bg-white shadow-lg rounded-lg p-6">
            <div className="h-[400px] relative rounded-lg overflow-hidden">
              <img
                src={property.image[0]}
                alt={`Image of ${property.name}`}
                layout="fill"
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-700">{property.title}</h2>
              <p className="text-gray-600">Location: {property.address.countryName}</p>
              <p className="text-gray-600">Location: {property.address.city}</p>
              <p className="text-red-600 font-bold">Status: {property.status}</p>
            </div>
            <div className="mt-4 flex items-center justify-around space-x-4 text-white">
              <div className="flex gap-2 items-center">
                <button
                  className="bg-green-600 px-2 py-1 hover:bg-green-700 rounded-lg transition-all duration-300"
                  onClick={() => handleApprove(property.id)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 px-2 py-1 hover:bg-red-700 transition-all rounded-lg duration-300"
                  onClick={() => handleReject(property.id)}
                >
                  Decline
                </button>
              </div>
              
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default PropertiesToApprove;
