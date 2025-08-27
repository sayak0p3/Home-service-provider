"use client";

import GlobalApi from '@/app/_services/GlobalApi';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import BusinessInfo from '../_components/BusinessInfo';
import SuggestedBusinessList from '../_components/SuggestedBusinessList';
import BusinessDescription from '../_components/BusinessDescription';
import { useParams } from 'next/navigation'; // ✅ Correct hook for dynamic route

function BusinessDetail() {
  const { data, status } = useSession();
  const [business, setBusiness] = useState(null);

  const params = useParams(); // ✅ Use useParams instead of props
  const businessId = params?.businessId;

  useEffect(() => {
    if (businessId) {
      getBusinessById();
    }
  }, [businessId]);

  useEffect(() => {
    checkUserAuth();
  }, [status]);

  const getBusinessById = () => {
    GlobalApi.getBusinessById(businessId).then((resp) => {
      setBusiness(resp.businessList);
    });
  };

  const checkUserAuth = () => {
    if (status === 'unauthenticated') {
      signIn('descope');
    }
  };

  if (status === 'loading' || !business) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="py-8 md:py-20 px-10 md:px-36">
      <BusinessInfo business={business} />

      <div className="grid grid-cols-3 mt-16">
        <div className="col-span-3 md:col-span-2 order-last md:order-first">
          <BusinessDescription business={business} />
        </div>
        <div>
          <SuggestedBusinessList business={business} />
        </div>
      </div>
    </div>
  );
}

export default BusinessDetail;
