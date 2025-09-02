// hooks/useProduct.js
import { useQuery } from "@tanstack/react-query";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";  // your firebase setup

const fetchProduct = async (productId) => {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Product not found");
  }
  return { id: docSnap.id, ...docSnap.data() };
};

export const useProduct = (productId) => {
  return useQuery({
    queryKey: ["product", productId],  // cache key
    queryFn: () => fetchProduct(productId),
    staleTime: 5 * 60 * 1000,          // 5 minutes (prevents refetching often)
    cacheTime: 30 * 60 * 1000,         // cache data for 30 mins
    retry: 1                           // retry once if fails
  });
};
