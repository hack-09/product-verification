// src/services/traceService.js
import { db } from "../services/firebase"; // adjust path if different
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "firebase/firestore";

export async function addTransferEvent(productId, { from, to, note, location, createdBy }) {
    const col = collection(db, "products", productId, "transfers");
    const docRef = await addDoc(col, {
        from: from || null,
        to: to || null,
        note: note || "",
        location: location || null, // {lat, lng, label}
        createdBy: createdBy || null,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function getTransfers(productId) {
    const col = collection(db, "products", productId, "transfers");
    const q = query(col, orderBy("createdAt", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}