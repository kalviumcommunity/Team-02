import { db } from './firebaseClient';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';

export const firestoreSync = {
  // Save or update Request document in Cloud Firestore
  async saveRequest(req) {
    try {
      const docRef = doc(db, 'requests', req.id);
      await setDoc(docRef, req, { merge: true });
      console.log(`🔥 [Cloud Firestore] Request ${req.id} synchronized to collection /requests`);
      return true;
    } catch (err) {
      console.warn('Firestore sync note (offline/permission fallback):', err.message);
      return false;
    }
  },

  // Update Status in Cloud Firestore
  async updateRequestStatus(reqId, newStatus, reason, actor, role) {
    try {
      const docRef = doc(db, 'requests', reqId);
      await updateDoc(docRef, {
        status: newStatus,
        lastUpdatedTime: new Date().toISOString(),
        lastUpdatedSource: 'Cloud Firestore Sync'
      });
      console.log(`🔥 [Cloud Firestore] Request ${reqId} status updated to ${newStatus}`);
      return true;
    } catch (err) {
      console.warn('Firestore update note:', err.message);
      return false;
    }
  },

  // Save Exception Ticket in Cloud Firestore
  async saveException(exception) {
    try {
      const docRef = doc(db, 'exceptions', exception.id);
      await setDoc(docRef, exception, { merge: true });
      console.log(`🔥 [Cloud Firestore] Exception ${exception.id} logged to collection /exceptions`);
      return true;
    } catch (err) {
      console.warn('Firestore exception sync note:', err.message);
      return false;
    }
  },

  // Save Audit Log document in Cloud Firestore
  async saveAuditLog(auditEntry) {
    try {
      const docRef = doc(db, 'audit_logs', auditEntry.id);
      await setDoc(docRef, auditEntry, { merge: true });
      console.log(`🔥 [Cloud Firestore] Audit log ${auditEntry.id} recorded in collection /audit_logs`);
      return true;
    } catch (err) {
      return false;
    }
  },

  // Push all mock collections to live Cloud Firestore
  async seedAllCollectionsToFirestore({ requests = [], products = [], stores = [], exceptions = [], auditLogs = [] }) {
    try {
      console.log('🚀 Pushing collections to Cloud Firestore...');
      for (const r of requests) {
        await setDoc(doc(db, 'requests', r.id), r, { merge: true });
      }
      for (const p of products) {
        await setDoc(doc(db, 'products', p.id), p, { merge: true });
      }
      for (const s of stores) {
        await setDoc(doc(db, 'stores', s.id), s, { merge: true });
      }
      for (const e of exceptions) {
        await setDoc(doc(db, 'exceptions', e.id), e, { merge: true });
      }
      for (const a of auditLogs) {
        await setDoc(doc(db, 'audit_logs', a.id), a, { merge: true });
      }
      console.log('✅ All collections successfully seeded to Cloud Firestore!');
      return { success: true, message: 'All collections (requests, products, stores, exceptions, audit_logs) uploaded to live Cloud Firestore!' };
    } catch (err) {
      console.error('Firestore seed error:', err);
      return { success: false, message: err.message };
    }
  }
};
